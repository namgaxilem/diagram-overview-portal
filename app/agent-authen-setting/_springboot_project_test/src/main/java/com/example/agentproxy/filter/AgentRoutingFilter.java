package com.example.agentproxy.filter;

import java.net.URI;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.Ordered;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.agentproxy.config.AgentProxyProperties;

import reactor.core.publisher.Mono;

/**
 * Global gateway filter that implements cookie-based reverse proxy routing.
 *
 * <h3>How it works:</h3>
 * <ol>
 *   <li><b>Prefixed request</b>: {@code /agent1/dev-ui/} →
 *       strips {@code /agent1}, proxies to the mapped backend,
 *       and sets cookie {@code X-Agent-Backend=agent1}.</li>
 *   <li><b>Cookie fallback</b>: any root-relative request (e.g. {@code /static/js/main.js})
 *       that carries the cookie is proxied to the same backend.
 *       This handles JS/CSS/API calls that use absolute paths from root.</li>
 *   <li><b>No match</b>: returns 404.</li>
 * </ol>
 *
 * <p>WebSocket and SSE work transparently because the browser sends cookies
 * with upgrade requests and long-lived HTTP connections.</p>
 */
@Component
public class AgentRoutingFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(AgentRoutingFilter.class);
    private static final String COOKIE_NAME = "X-Agent-Backend";

    private final AgentProxyProperties properties;

    public AgentRoutingFilter(AgentProxyProperties properties) {
        this.properties = properties;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        String query = exchange.getRequest().getURI().getRawQuery();

        // --- 1. Check if path starts with a known agent prefix ---
        for (Map.Entry<String, String> entry : properties.getAgents().entrySet()) {
            String agentName = entry.getKey();
            String backendUrl = entry.getValue();
            String prefix = "/" + agentName;

            if (path.equals(prefix) || path.startsWith(prefix + "/")) {
                String strippedPath = path.substring(prefix.length());
                if (strippedPath.isEmpty()) {
                    strippedPath = "/";
                }

                URI targetUri = buildUri(backendUrl, strippedPath, query);

                log.info("[proxy] {} {} → {} (prefix match)", exchange.getRequest().getMethod(), path, targetUri);

                // Set cookie so subsequent root-relative requests route correctly
                exchange.getResponse().addCookie(
                    ResponseCookie.from(COOKIE_NAME, agentName)
                        .path("/")
                        .httpOnly(true)
                        .sameSite("Lax")
                        .build()
                );

                // Override the gateway's resolved target URI
                exchange.getAttributes().put(
                    ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR, targetUri
                );

                // Rewrite the request path (strip agent prefix)
                ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .path(strippedPath)
                    .build();

                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            }
        }

        // --- 2. Fallback: use cookie to route root-relative requests ---
        HttpCookie cookie = exchange.getRequest().getCookies().getFirst(COOKIE_NAME);
        if (cookie != null) {
            String agentName = cookie.getValue();
            String backendUrl = properties.getAgents().get(agentName);

            if (backendUrl != null) {
                URI targetUri = buildUri(backendUrl, path, query);

                log.debug("[proxy] {} {} → {} (cookie fallback, agent={})",
                    exchange.getRequest().getMethod(), path, targetUri, agentName);

                exchange.getAttributes().put(
                    ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR, targetUri
                );

                return chain.filter(exchange);
            }
        }

        // --- 3. No match ---
        log.debug("[proxy] {} {} → 404 (no agent match, no cookie)", exchange.getRequest().getMethod(), path);
        exchange.getResponse().setStatusCode(HttpStatus.NOT_FOUND);
        return exchange.getResponse().setComplete();
    }

    private URI buildUri(String baseUrl, String path, String query) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
            .replacePath(path);
        if (query != null && !query.isEmpty()) {
            builder.query(query);
        }
        return builder.build(true).toUri();
    }

    @Override
    public int getOrder() {
        // Must run AFTER RouteToRequestUrlFilter (order 10000) which overwrites GATEWAY_REQUEST_URL_ATTR,
        // but BEFORE NettyRoutingFilter (order Integer.MAX_VALUE - 1) which does the actual proxying.
        return 10001;
    }
}
