package com.example.agentproxy.controller;

import java.net.URI;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.agentproxy.service.BackendResolverService;

import reactor.core.publisher.Mono;

/**
 * Reverse proxy controller that routes requests to backend agents or workflows.
 *
 * <h3>URL patterns:</h3>
 * <ul>
 *   <li>{@code /proxy/agent/{name}/**}    - proxy to an agent backend</li>
 *   <li>{@code /proxy/workflow/{name}/**}  - proxy to a workflow backend</li>
 * </ul>
 *
 * <h3>How it works:</h3>
 * <ol>
 *   <li>Prefixed request: /proxy/agent/agent1/dev-ui/ strips /proxy/agent/agent1,
 *       resolves backend URL via BackendResolverService, proxies the request,
 *       and sets cookies X-Agent-Backend-Type and X-Agent-Backend-Name.</li>
 *   <li>Cookie fallback: requests under /proxy/** without a type/name prefix
 *       but carrying cookies are proxied to the same backend.</li>
 *   <li>No match: returns 404.</li>
 * </ol>
 */
@RestController
@RequestMapping("/proxy")
public class AgentProxyController {

    private static final Logger log = LoggerFactory.getLogger(AgentProxyController.class);
    private static final String COOKIE_TYPE = "X-Agent-Backend-Type";
    private static final String COOKIE_NAME = "X-Agent-Backend-Name";

    private final BackendResolverService resolverService;
    private final WebClient webClient;

    public AgentProxyController(BackendResolverService resolverService, WebClient webClient) {
        this.resolverService = resolverService;
        this.webClient = webClient;
    }

    // ─── Agent routes ──────────────────────────────────────────────────

    @RequestMapping("/agent/{name}/**")
    public Mono<Void> proxyAgent(@PathVariable String name, ServerWebExchange exchange) {
        String fullPath = exchange.getRequest().getURI().getPath();
        String prefix = "/proxy/agent/" + name;
        String strippedPath = fullPath.substring(prefix.length());
        if (strippedPath.isEmpty()) strippedPath = "/";
        return proxyByTypeAndName(BackendResolverService.TYPE_AGENT, name, strippedPath, exchange);
    }

    // ─── Workflow routes ───────────────────────────────────────────────

    @RequestMapping("/workflow/{name}/**")
    public Mono<Void> proxyWorkflow(@PathVariable String name, ServerWebExchange exchange) {
        String fullPath = exchange.getRequest().getURI().getPath();
        String prefix = "/proxy/workflow/" + name;
        String strippedPath = fullPath.substring(prefix.length());
        if (strippedPath.isEmpty()) strippedPath = "/";
        return proxyByTypeAndName(BackendResolverService.TYPE_WORKFLOW, name, strippedPath, exchange);
    }

    // ─── Cookie fallback ───────────────────────────────────────────────

    /**
     * Fallback: /proxy/**
     * Uses cookies to determine backend when no /proxy/agent/{name} or /proxy/workflow/{name} matched.
     * Handles root-relative paths rewritten by AgentCookieRedirectFilter.
     */
    @RequestMapping("/**")
    public Mono<Void> proxyFallback(ServerWebExchange exchange) {
        ServerHttpRequest request = exchange.getRequest();
        String fullPath = request.getURI().getPath();

        if (request.getCookies().containsKey(COOKIE_TYPE) &&
                request.getCookies().containsKey(COOKIE_NAME)) {
            var typeCookie = request.getCookies().getFirst(COOKIE_TYPE);
            var nameCookie = request.getCookies().getFirst(COOKIE_NAME);
            if (typeCookie != null && nameCookie != null) {
                String type = typeCookie.getValue();
                String name = nameCookie.getValue();
                String relativePath = fullPath.substring("/proxy".length());
                if (relativePath.isEmpty()) relativePath = "/";

                log.debug("[proxy] {} {} -> cookie fallback (type={}, name={})",
                        request.getMethod(), fullPath, type, name);

                String finalRelativePath = relativePath;
                String query = request.getURI().getRawQuery();

                return resolverService.resolve(type, name)
                        .flatMap(backendUrl -> {
                            URI targetUri = buildUri(backendUrl, finalRelativePath, query);
                            String proxyPrefix = "/proxy/" + type + "/" + name;
                            return doProxy(exchange, targetUri, backendUrl, proxyPrefix);
                        })
                        .switchIfEmpty(Mono.defer(() -> {
                            exchange.getResponse().setStatusCode(HttpStatus.NOT_FOUND);
                            return exchange.getResponse().setComplete();
                        }));
            }
        }

        log.debug("[proxy] {} {} -> 404 (no match, no cookie)", request.getMethod(), fullPath);
        exchange.getResponse().setStatusCode(HttpStatus.NOT_FOUND);
        return exchange.getResponse().setComplete();
    }

    // ─── Core proxy logic ──────────────────────────────────────────────

    private Mono<Void> proxyByTypeAndName(String type, String name, String strippedPath,
                                           ServerWebExchange exchange) {
        ServerHttpRequest request = exchange.getRequest();
        String fullPath = request.getURI().getPath();
        String query = request.getURI().getRawQuery();

        return resolverService.resolve(type, name)
                .flatMap(backendUrl -> {
                    URI targetUri = buildUri(backendUrl, strippedPath, query);
                    log.info("[proxy] {} {} -> {} (type={}, name={})",
                            request.getMethod(), fullPath, targetUri, type, name);

                    exchange.getResponse().addCookie(
                            ResponseCookie.from(COOKIE_TYPE, type)
                                    .path("/").httpOnly(true).sameSite("Lax")
                                    .maxAge(Duration.ofHours(8)).build());
                    exchange.getResponse().addCookie(
                            ResponseCookie.from(COOKIE_NAME, name)
                                    .path("/").httpOnly(true).sameSite("Lax")
                                    .maxAge(Duration.ofHours(8)).build());

                    String proxyPrefix = "/proxy/" + type + "/" + name;
                    return doProxy(exchange, targetUri, backendUrl, proxyPrefix);
                })
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("[proxy] {} {} -> 404 ({}/{} not found)",
                            request.getMethod(), fullPath, type, name);
                    exchange.getResponse().setStatusCode(HttpStatus.NOT_FOUND);
                    return exchange.getResponse().setComplete();
                }));
    }

    private Mono<Void> doProxy(ServerWebExchange exchange, URI targetUri,
                                String backendUrl, String proxyPrefix) {
        ServerHttpRequest incomingRequest = exchange.getRequest();
        ServerHttpResponse outgoingResponse = exchange.getResponse();
        HttpMethod method = incomingRequest.getMethod();

        WebClient.RequestBodySpec requestSpec = webClient.method(method)
                .uri(targetUri)
                .headers(headers -> {
                    headers.putAll(incomingRequest.getHeaders());
                    headers.remove(HttpHeaders.HOST);
                    headers.set(HttpHeaders.HOST, targetUri.getHost() +
                            (targetUri.getPort() > 0 ? ":" + targetUri.getPort() : ""));
                });

        WebClient.RequestHeadersSpec<?> headersSpec;
        if (requiresBody(method)) {
            headersSpec = requestSpec.body(BodyInserters.fromDataBuffers(incomingRequest.getBody()));
        } else {
            headersSpec = requestSpec;
        }

        URI backendUri = URI.create(backendUrl);
        String backendOrigin = backendUri.getScheme() + "://" + backendUri.getHost()
                + (backendUri.getPort() > 0 ? ":" + backendUri.getPort() : "");

        return headersSpec.exchangeToMono(clientResponse -> {
            outgoingResponse.setStatusCode(clientResponse.statusCode());

            clientResponse.headers().asHttpHeaders().forEach((headerName, values) -> {
                if (!headerName.equalsIgnoreCase(HttpHeaders.TRANSFER_ENCODING)) {
                    outgoingResponse.getHeaders().put(headerName, values);
                }
            });

            if (outgoingResponse.getHeaders().containsKey(HttpHeaders.LOCATION)) {
                List<String> rewritten = new ArrayList<>();
                for (String loc : outgoingResponse.getHeaders().get(HttpHeaders.LOCATION)) {
                    rewritten.add(rewriteLocation(loc, backendOrigin, proxyPrefix));
                }
                outgoingResponse.getHeaders().put(HttpHeaders.LOCATION, rewritten);
            }

            return outgoingResponse.writeWith(clientResponse.bodyToFlux(
                    org.springframework.core.io.buffer.DataBuffer.class));
        });
    }

    private String rewriteLocation(String location, String backendOrigin, String proxyPrefix) {
        if (location == null || location.isEmpty()) return location;
        if (location.startsWith(backendOrigin)) {
            String path = location.substring(backendOrigin.length());
            String rewritten = proxyPrefix + path;
            log.debug("[proxy] rewrite Location: {} -> {}", location, rewritten);
            return rewritten;
        }
        if (location.startsWith("/")) {
            String rewritten = proxyPrefix + location;
            log.debug("[proxy] rewrite Location: {} -> {}", location, rewritten);
            return rewritten;
        }
        return location;
    }

    private boolean requiresBody(HttpMethod method) {
        return method == HttpMethod.POST || method == HttpMethod.PUT || method == HttpMethod.PATCH;
    }

    private URI buildUri(String baseUrl, String path, String query) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl).replacePath(path);
        if (query != null && !query.isEmpty()) builder.query(query);
        return builder.build(true).toUri();
    }
}

