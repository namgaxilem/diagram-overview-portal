package com.example.agentproxy.controller;

import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.agentproxy.config.AgentProxyProperties;

import reactor.core.publisher.Mono;

/**
 * Controller-based reverse proxy that routes requests to backend agents.
 *
 * <h3>How it works:</h3>
 * <ol>
 *   <li><b>Prefixed request</b>: {@code /proxy/agent1/dev-ui/} →
 *       strips {@code /proxy/agent1}, proxies to the mapped backend,
 *       and sets cookie {@code X-Agent-Backend=agent1}.</li>
 *   <li><b>Cookie fallback</b>: requests to {@code /proxy/**} without a known agent prefix
 *       but carrying the cookie are proxied to the same backend.
 *       This handles JS/CSS/API calls that use absolute paths.</li>
 *   <li><b>No match</b>: returns 404.</li>
 * </ol>
 *
 * <p>All proxy routes live under {@code /proxy/} so they don't conflict
 * with other controllers in your application.</p>
 */
@RestController
@RequestMapping("/proxy")
public class ProxyController {

    private static final Logger log = LoggerFactory.getLogger(ProxyController.class);
    private static final String COOKIE_NAME = "X-Agent-Backend";

    private final AgentProxyProperties properties;
    private final WebClient webClient;

    public ProxyController(AgentProxyProperties properties, WebClient webClient) {
        this.properties = properties;
        this.webClient = webClient;
    }

    /**
     * Catch-all handler for all proxy requests.
     * <p>
     * Matches: /proxy/agent1/dev-ui/, /proxy/agent1/api/xxx, /proxy/static/js/main.js (cookie fallback), etc.
     */
    @RequestMapping("/**")
    public Mono<Void> proxyRequest(ServerWebExchange exchange) {
        ServerHttpRequest request = exchange.getRequest();
        String fullPath = request.getURI().getPath();         // e.g. /proxy/agent1/dev-ui/
        String query = request.getURI().getRawQuery();

        // Strip the "/proxy" prefix to get the relative path
        String relativePath = fullPath.substring("/proxy".length()); // e.g. /agent1/dev-ui/
        if (relativePath.isEmpty()) {
            relativePath = "/";
        }

        // --- 1. Check if path starts with a known agent prefix ---
        for (Map.Entry<String, String> entry : properties.getAgents().entrySet()) {
            String agentName = entry.getKey();
            String backendUrl = entry.getValue();
            String prefix = "/" + agentName;

            if (relativePath.equals(prefix) || relativePath.startsWith(prefix + "/")) {
                String strippedPath = relativePath.substring(prefix.length());
                if (strippedPath.isEmpty()) {
                    strippedPath = "/";
                }

                URI targetUri = buildUri(backendUrl, strippedPath, query);
                log.info("[proxy] {} {} → {} (prefix match)", request.getMethod(), fullPath, targetUri);

                // Set cookie with path=/ so browser sends it for ALL requests,
                // including root-relative paths like /dev-ui/static/... that the
                // AgentCookieRedirectFilter needs to intercept and rewrite.
                exchange.getResponse().addCookie(
                        ResponseCookie.from(COOKIE_NAME, agentName)
                                .path("/")
                                .httpOnly(true)
                                .sameSite("Lax")
                                .maxAge(Duration.ofHours(8))
                                .build()
                );

                return doProxy(exchange, targetUri, agentName, backendUrl);
            }
        }

        // --- 2. Fallback: use cookie to route root-relative requests ---
        if (request.getCookies().containsKey(COOKIE_NAME)) {
            var cookie = request.getCookies().getFirst(COOKIE_NAME);
            if (cookie != null) {
                String agentName = cookie.getValue();
                String backendUrl = properties.getAgents().get(agentName);

                if (backendUrl != null) {
                    URI targetUri = buildUri(backendUrl, relativePath, query);
                    log.debug("[proxy] {} {} → {} (cookie fallback, agent={})",
                            request.getMethod(), fullPath, targetUri, agentName);
                    return doProxy(exchange, targetUri, agentName, backendUrl);
                }
            }
        }

        // --- 3. No match ---
        log.debug("[proxy] {} {} → 404 (no agent match, no cookie)", request.getMethod(), fullPath);
        exchange.getResponse().setStatusCode(HttpStatus.NOT_FOUND);
        return exchange.getResponse().setComplete();
    }

    /**
     * Perform the actual proxy: forward request to target URI and stream the response back.
     * Rewrites Location headers in redirect responses to keep the /proxy/{agentName} prefix.
     */
    private Mono<Void> doProxy(ServerWebExchange exchange, URI targetUri,
                                String agentName, String backendUrl) {
        ServerHttpRequest incomingRequest = exchange.getRequest();
        ServerHttpResponse outgoingResponse = exchange.getResponse();
        HttpMethod method = incomingRequest.getMethod();

        // Build the proxied request
        WebClient.RequestBodySpec requestSpec = webClient.method(method)
                .uri(targetUri)
                .headers(headers -> {
                    // Copy all incoming headers except Host (we set a new Host based on target)
                    headers.putAll(incomingRequest.getHeaders());
                    headers.remove(HttpHeaders.HOST);
                    headers.set(HttpHeaders.HOST, targetUri.getHost() +
                            (targetUri.getPort() > 0 ? ":" + targetUri.getPort() : ""));
                });

        // Forward request body if present (POST, PUT, PATCH)
        WebClient.RequestHeadersSpec<?> headersSpec;
        if (requiresBody(method)) {
            headersSpec = requestSpec.body(BodyInserters.fromDataBuffers(incomingRequest.getBody()));
        } else {
            headersSpec = requestSpec;
        }

        // Compute the backend origin for Location header rewriting
        // e.g. "http://127.0.0.1:8003"
        URI backendUri = URI.create(backendUrl);
        String backendOrigin = backendUri.getScheme() + "://" + backendUri.getHost()
                + (backendUri.getPort() > 0 ? ":" + backendUri.getPort() : "");
        String proxyPrefix = "/proxy/" + agentName;

        return headersSpec.exchangeToMono(clientResponse -> {
            // Copy status code
            outgoingResponse.setStatusCode(clientResponse.statusCode());

            // Copy response headers (except Transfer-Encoding which Spring handles)
            clientResponse.headers().asHttpHeaders().forEach((name, values) -> {
                if (!name.equalsIgnoreCase(HttpHeaders.TRANSFER_ENCODING)) {
                    outgoingResponse.getHeaders().put(name, values);
                }
            });

            // --- Rewrite Location header for redirects ---
            // Backend may return: Location: /dev-ui/  or  Location: http://127.0.0.1:8003/dev-ui/
            // We need to rewrite to: /proxy/agent1/dev-ui/
            if (outgoingResponse.getHeaders().containsKey(HttpHeaders.LOCATION)) {
                List<String> rewritten = new ArrayList<>();
                for (String loc : outgoingResponse.getHeaders().get(HttpHeaders.LOCATION)) {
                    rewritten.add(rewriteLocation(loc, backendOrigin, proxyPrefix));
                }
                outgoingResponse.getHeaders().put(HttpHeaders.LOCATION, rewritten);
            }

            // Stream response body back to the client
            return outgoingResponse.writeWith(clientResponse.bodyToFlux(
                    org.springframework.core.io.buffer.DataBuffer.class));
        });
    }

    /**
     * Rewrite a Location header value so the browser stays within /proxy/{agentName}/.
     *
     * Examples:
     *   "/dev-ui/"                              → "/proxy/agent1/dev-ui/"
     *   "http://127.0.0.1:8003/dev-ui/"         → "/proxy/agent1/dev-ui/"
     *   "https://external.com/something"         → "https://external.com/something" (unchanged)
     */
    private String rewriteLocation(String location, String backendOrigin, String proxyPrefix) {
        if (location == null || location.isEmpty()) {
            return location;
        }

        // Case 1: Absolute URL pointing to the backend → strip origin, prepend proxy prefix
        if (location.startsWith(backendOrigin)) {
            String path = location.substring(backendOrigin.length());
            String rewritten = proxyPrefix + path;
            log.debug("[proxy] rewrite Location: {} → {}", location, rewritten);
            return rewritten;
        }

        // Case 2: Root-relative path (e.g. "/dev-ui/") → prepend proxy prefix
        if (location.startsWith("/")) {
            String rewritten = proxyPrefix + location;
            log.debug("[proxy] rewrite Location: {} → {}", location, rewritten);
            return rewritten;
        }

        // Case 3: External URL or relative path → leave as-is
        return location;
    }

    private boolean requiresBody(HttpMethod method) {
        return method == HttpMethod.POST || method == HttpMethod.PUT || method == HttpMethod.PATCH;
    }

    private URI buildUri(String baseUrl, String path, String query) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .replacePath(path);
        if (query != null && !query.isEmpty()) {
            builder.query(query);
        }
        return builder.build(true).toUri();
    }
}


