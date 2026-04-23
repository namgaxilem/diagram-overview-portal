package com.example.agentproxy.controller;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.agentproxy.enums.AgentGatewayType;
import com.example.agentproxy.service.BackendResolverService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet-based reverse proxy controller using WebClient for backend calls.
 *
 * <h3>URL patterns:</h3>
 * <ul>
 *   <li>{@code /agent-proxy/agent/{id}/**}    – proxy to an agent backend</li>
 *   <li>{@code /agent-proxy/workflow/{id}/**}  – proxy to a workflow backend</li>
 *   <li>{@code /agent-proxy/**}                – cookie-based fallback</li>
 * </ul>
 *
 * <p>The proxy prefix is used so internal agent / workflow services
 * are never directly exposed to the internet.</p>
 */
@RestController
@RequestMapping("/agent-proxy")
public class AgentProxyController {

    private static final Logger log = LoggerFactory.getLogger(AgentProxyController.class);

    private static final String COOKIE_TYPE = "X-Agent-Backend-Type";
    private static final String COOKIE_ID   = "X-Agent-Backend-Id";

    private final BackendResolverService resolverService;
    private final WebClient webClient;

    public AgentProxyController(BackendResolverService resolverService, WebClient webClient) {
        this.resolverService = resolverService;
        this.webClient = webClient;
    }

    // ─── Agent routes ──────────────────────────────────────────────────

    @RequestMapping("/agent/{id}/**")
    public void proxyAgent(@PathVariable Long id,
                           HttpServletRequest request, HttpServletResponse response) throws IOException {

        String fullPath = request.getRequestURI();
        String prefix = "/agent-proxy/agent/" + id;
        String strippedPath = fullPath.length() > prefix.length()
                ? fullPath.substring(prefix.length())
                : "/";
        if (strippedPath.isEmpty()) strippedPath = "/";

        proxyByTypeAndId(AgentGatewayType.AGENT, id, strippedPath, request, response);
    }

    // ─── Workflow routes ───────────────────────────────────────────────

    @RequestMapping("/workflow/{id}/**")
    public void proxyWorkflow(@PathVariable Long id,
                              HttpServletRequest request, HttpServletResponse response) throws IOException {

        String fullPath = request.getRequestURI();
        String prefix = "/agent-proxy/workflow/" + id;
        String strippedPath = fullPath.length() > prefix.length()
                ? fullPath.substring(prefix.length())
                : "/";
        if (strippedPath.isEmpty()) strippedPath = "/";

        proxyByTypeAndId(AgentGatewayType.WORKFLOW, id, strippedPath, request, response);
    }

    // ─── Cookie fallback ───────────────────────────────────────────────

    @RequestMapping("/**")
    public void proxyFallback(HttpServletRequest request, HttpServletResponse response) throws IOException {

        String fullPath = request.getRequestURI();
        String typeCookie = getCookieValue(request, COOKIE_TYPE);
        String idCookie   = getCookieValue(request, COOKIE_ID);

        if (typeCookie != null && idCookie != null) {
            AgentGatewayType type;
            try {
                type = AgentGatewayType.valueOf(typeCookie);
            } catch (IllegalArgumentException e) {
                log.warn("[proxy] Invalid cookie type: {}", typeCookie);
                send404(response, "Invalid cookie type");
                return;
            }

            Long id;
            try {
                id = Long.valueOf(idCookie);
            } catch (NumberFormatException e) {
                log.warn("[proxy] Invalid cookie id: {}", idCookie);
                send404(response, "Invalid cookie id");
                return;
            }

            String backendUrl = resolverService.resolve(type, id);
            if (backendUrl != null) {
                // strip the /agent-proxy prefix to get the relative path
                String relativePath = fullPath.substring("/agent-proxy".length());
                if (relativePath.isEmpty()) relativePath = "/";

                String typeLower = type.name().toLowerCase();
                String proxyPrefix = "/agent-proxy/" + typeLower + "/" + id;

                log.debug("[proxy] {} {} -> cookie fallback (type={}, id={})",
                        request.getMethod(), fullPath, type, id);

                String query = request.getQueryString();
                URI targetUri = buildUri(backendUrl, relativePath, query);
                doProxy(request, response, targetUri, backendUrl, proxyPrefix);
                return;
            }
        }

        log.debug("[proxy] {} {} -> 404 (no match, no cookie)", request.getMethod(), fullPath);
        send404(response, "Proxy: no backend found (no cookie or unknown agent)");
    }

    // ─── Core proxy logic ──────────────────────────────────────────────

    private void proxyByTypeAndId(AgentGatewayType type, Long id, String strippedPath,
                                  HttpServletRequest request, HttpServletResponse response) throws IOException {

        String fullPath  = request.getRequestURI();
        String query     = request.getQueryString();
        String typeLower = type.name().toLowerCase();

        String backendUrl = resolverService.resolve(type, id);
        if (backendUrl == null) {
            log.warn("[proxy] {} {} -> 404 ({}/{} not found)", request.getMethod(), fullPath, typeLower, id);
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("Proxy: " + typeLower + "/" + id + " not found");
            return;
        }

        URI targetUri = buildUri(backendUrl, strippedPath, query);
        log.info("[proxy] {} {} -> {} (type={}, id={})",
                request.getMethod(), fullPath, targetUri, typeLower, id);

        // Set cookies so subsequent root-relative requests (JS/CSS/API) can be routed
        setCookie(response, COOKIE_TYPE, type.name());
        setCookie(response, COOKIE_ID, String.valueOf(id));

        String proxyPrefix = "/agent-proxy/" + typeLower + "/" + id;
        doProxy(request, response, targetUri, backendUrl, proxyPrefix);
    }

    /**
     * Execute the proxy call via WebClient and stream the response back.
     *
     * <p>Key behaviour for Swagger UI / ADK dev-ui rendering:</p>
     * <ul>
     *   <li>Rewrites {@code Location} headers so redirects stay inside the proxy</li>
     *   <li>For HTML responses, rewrites absolute paths ({@code href="/..."},
     *       {@code src="/..."}) so the browser fetches them through the proxy prefix</li>
     *   <li>Forwards cookies from the backend (except our own proxy cookies)</li>
     * </ul>
     */
    private void doProxy(HttpServletRequest request, HttpServletResponse response,
                         URI targetUri, String backendUrl, String proxyPrefix) throws IOException {

        HttpMethod method = HttpMethod.valueOf(request.getMethod());

        // --- build the outgoing request, copying incoming headers ----
        WebClient.RequestBodySpec requestSpec = webClient.method(method)
                .uri(targetUri)
                .headers(headers -> copyRequestHeaders(request, headers, targetUri));

        // forward body for POST / PUT / PATCH
        WebClient.RequestHeadersSpec<?> headersSpec;
        if (requiresBody(method)) {
            byte[] body = request.getInputStream().readAllBytes();
            headersSpec = requestSpec.bodyValue(body);
        } else {
            headersSpec = requestSpec;
        }

        // backend origin for Location rewriting
        URI backendUri = URI.create(backendUrl);
        String backendOrigin = backendUri.getScheme() + "://" + backendUri.getHost()
                + (backendUri.getPort() > 0 ? ":" + backendUri.getPort() : "");

        // --- execute & read body inside exchangeToMono to avoid consumption issues ---
        try {
            headersSpec.exchangeToMono(clientResponse -> {
                int status = clientResponse.statusCode().value();

                // Read full body inside the exchange function — this is the correct way
                // to consume the body without leaking or losing data.
                return clientResponse.bodyToMono(byte[].class)
                        .defaultIfEmpty(new byte[0])
                        .map(bodyBytes -> new ProxyResponse(
                                status,
                                clientResponse.headers().asHttpHeaders(),
                                bodyBytes
                        ));
            }).doOnNext(proxyResp -> {
                try {
                    writeProxyResponse(proxyResp, response, backendOrigin, proxyPrefix, targetUri);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to write proxy response", e);
                }
            }).block();
        } catch (WebClientRequestException ex) {
            log.error("[proxy] Backend unreachable: {} -> {}", targetUri, ex.getMessage());
            if (!response.isCommitted()) {
                response.setStatus(HttpServletResponse.SC_BAD_GATEWAY);
                response.setContentType("text/plain");
                response.getWriter().write("502 Bad Gateway: backend unreachable at " + backendUrl);
            }
        } catch (Exception ex) {
            log.error("[proxy] Unexpected error proxying to {}: {}", targetUri, ex.getMessage(), ex);
            if (!response.isCommitted()) {
                response.setStatus(HttpServletResponse.SC_BAD_GATEWAY);
                response.setContentType("text/plain");
                response.getWriter().write("502 Bad Gateway: " + ex.getMessage());
            }
        }
    }

    /**
     * Simple record to carry the backend response across the reactive boundary.
     */
    private record ProxyResponse(int status, HttpHeaders headers, byte[] body) {}

    /**
     * Write the backend response to the servlet response on the calling thread.
     */
    private void writeProxyResponse(ProxyResponse proxyResp, HttpServletResponse response,
                                    String backendOrigin, String proxyPrefix, URI targetUri) throws IOException {

        response.setStatus(proxyResp.status());

        // --- copy response headers -----------------------------------
        String contentType = copyResponseHeaders(proxyResp.headers(), response, backendOrigin, proxyPrefix);

        byte[] body = proxyResp.body();

        log.info("[proxy] Backend {} body size={} for {}",
                proxyResp.status(), body.length, targetUri);

        if (body.length > 0) {
            // Rewrite HTML content so root-relative URLs go through the proxy
            if (isHtml(contentType)) {
                String html = new String(body, StandardCharsets.UTF_8);
                html = rewriteHtml(html, proxyPrefix);
                body = html.getBytes(StandardCharsets.UTF_8);
            }

            response.setContentLength(body.length);
            response.getOutputStream().write(body);
            response.getOutputStream().flush();
        }
    }

    // ─── Header helpers ────────────────────────────────────────────────

    private void copyRequestHeaders(HttpServletRequest request, HttpHeaders headers, URI targetUri) {
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            // skip hop-by-hop / problematic headers
            if (headerName.equalsIgnoreCase(HttpHeaders.HOST)
                    || headerName.equalsIgnoreCase("connection")
                    || headerName.equalsIgnoreCase("transfer-encoding")
                    || headerName.equalsIgnoreCase(HttpHeaders.COOKIE)
                    || headerName.equalsIgnoreCase(HttpHeaders.ACCEPT_ENCODING)
                    || headerName.equalsIgnoreCase(HttpHeaders.REFERER)) {
                continue;
            }
            Enumeration<String> values = request.getHeaders(headerName);
            while (values.hasMoreElements()) {
                headers.add(headerName, values.nextElement());
            }
        }

        // Forward cookies, stripping our own proxy cookies
        String cleanedCookies = getCleanedCookieHeader(request);
        if (cleanedCookies != null && !cleanedCookies.isEmpty()) {
            headers.set(HttpHeaders.COOKIE, cleanedCookies);
        }

        // Set correct Host header for the backend
        headers.set(HttpHeaders.HOST, targetUri.getHost()
                + (targetUri.getPort() > 0 ? ":" + targetUri.getPort() : ""));
    }

    /**
     * Copy response headers from backend to the servlet response.
     *
     * @return the Content-Type value (for HTML detection), or null
     */
    private String copyResponseHeaders(HttpHeaders respHeaders, HttpServletResponse response,
                                       String backendOrigin, String proxyPrefix) {
        String contentType = null;

        for (var entry : respHeaders.entrySet()) {
            String headerName = entry.getKey();
            // Skip hop-by-hop and content-length (servlet recalculates after HTML rewrite)
            if (headerName.equalsIgnoreCase(HttpHeaders.TRANSFER_ENCODING)) continue;
            if (headerName.equalsIgnoreCase(HttpHeaders.CONTENT_LENGTH)) continue;

            for (String value : entry.getValue()) {
                if (headerName.equalsIgnoreCase(HttpHeaders.LOCATION)) {
                    String rewritten = rewriteLocation(value, backendOrigin, proxyPrefix);
                    log.info("[proxy] Location: {} -> {}", value, rewritten);
                    response.setHeader(headerName, rewritten);
                } else if (headerName.equalsIgnoreCase(HttpHeaders.CONTENT_TYPE)) {
                    contentType = value;
                    response.setHeader(headerName, value);
                } else if (headerName.equalsIgnoreCase(HttpHeaders.SET_COOKIE)) {
                    // Forward backend cookies – rewrite path so they stay within proxy prefix
                    String rewritten = rewriteSetCookiePath(value, proxyPrefix);
                    response.addHeader(headerName, rewritten);
                } else {
                    response.addHeader(headerName, value);
                }
            }
        }
        return contentType;
    }

    // ─── Rewrite helpers ───────────────────────────────────────────────

    private String rewriteLocation(String location, String backendOrigin, String proxyPrefix) {
        if (location == null || location.isEmpty()) return location;
        // absolute URL pointing to the backend → rewrite to proxy prefix
        if (location.startsWith(backendOrigin)) {
            String path = location.substring(backendOrigin.length());
            return proxyPrefix + path;
        }
        // root-relative path → prepend proxy prefix
        if (location.startsWith("/")) {
            return proxyPrefix + location;
        }
        return location;
    }

    /**
     * Rewrite the {@code Path=} directive in a {@code Set-Cookie} header so
     * the cookie is scoped to the proxy prefix instead of the backend root.
     */
    private String rewriteSetCookiePath(String setCookieValue, String proxyPrefix) {
        return setCookieValue.replaceAll("(?i)Path\\s*=\\s*/([^;]*)", "Path=" + proxyPrefix + "/$1");
    }

    /**
     * Rewrite root-relative paths inside HTML so the browser fetches resources
     * through the proxy prefix rather than the bare host root.
     *
     * <p>This handles common patterns emitted by Swagger UI and Google ADK dev-ui:
     * {@code href="/..."}, {@code src="/..."}, {@code url(/...)} and
     * {@code fetch("/...")}.</p>
     */
    private String rewriteHtml(String html, String proxyPrefix) {
        // href="/..." → href="/agent-proxy/agent/1/..."
        html = html.replaceAll("(href\\s*=\\s*[\"'])/(?!/)", "$1" + proxyPrefix + "/");
        // src="/..." → src="/agent-proxy/agent/1/..."
        html = html.replaceAll("(src\\s*=\\s*[\"'])/(?!/)", "$1" + proxyPrefix + "/");
        // action="/..." → action="/agent-proxy/agent/1/..."
        html = html.replaceAll("(action\\s*=\\s*[\"'])/(?!/)", "$1" + proxyPrefix + "/");
        // url: "/..." in JS/JSON (Swagger's configUrl, url, etc.)
        html = html.replaceAll("(url\\s*[:=]\\s*[\"'])/(?!/)", "$1" + proxyPrefix + "/");
        return html;
    }

    private boolean isHtml(String contentType) {
        return contentType != null && contentType.toLowerCase().contains("text/html");
    }

    // ─── Other helpers ─────────────────────────────────────────────────

    private boolean requiresBody(HttpMethod method) {
        return method == HttpMethod.POST || method == HttpMethod.PUT || method == HttpMethod.PATCH;
    }

    private URI buildUri(String baseUrl, String path, String query) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl).replacePath(path);
        if (query != null && !query.isEmpty()) builder.query(query);
        return builder.build(true).toUri();
    }

    private void setCookie(HttpServletResponse response, String name, String value) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(8 * 60 * 60);
        response.addCookie(cookie);
    }

    private String getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }

    private String getCleanedCookieHeader(HttpServletRequest request) {
        String rawCookie = request.getHeader(HttpHeaders.COOKIE);
        if (rawCookie == null || rawCookie.isEmpty()) return null;

        StringBuilder sb = new StringBuilder();
        for (String part : rawCookie.split(";")) {
            String trimmed = part.trim();
            if (trimmed.startsWith(COOKIE_TYPE + "=") || trimmed.startsWith(COOKIE_ID + "=")) {
                continue;
            }
            if (!sb.isEmpty()) sb.append("; ");
            sb.append(trimmed);
        }
        return sb.toString();
    }

    private void send404(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        response.setContentType("text/plain");
        response.getWriter().write(message);
    }
}
