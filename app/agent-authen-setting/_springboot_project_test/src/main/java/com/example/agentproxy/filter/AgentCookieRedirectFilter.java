package com.example.agentproxy.filter;

import java.net.URI;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.http.HttpCookie;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import com.example.agentproxy.config.AgentProxyProperties;

import reactor.core.publisher.Mono;

/**
 * WebFilter that catches requests OUTSIDE /proxy/** that were triggered by
 * the ADK dev-ui's root-relative asset/API paths (e.g. /dev-ui/static/..., /list-apps).
 *
 * <p>If the request has the X-Agent-Backend cookie, this filter <b>internally rewrites</b>
 * the request path to /proxy/{agentName}/... so the ProxyController handles it
 * transparently — no browser redirect needed.</p>
 *
 * <p>This is needed because the ADK dev-ui frontend uses absolute paths like
 * {@code /dev-ui/static/js/main.js} which the browser resolves relative to
 * the server root, not relative to /proxy/agent1/.</p>
 */
@Component
public class AgentCookieRedirectFilter implements WebFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(AgentCookieRedirectFilter.class);
    private static final String COOKIE_NAME = "X-Agent-Backend";

    private final AgentProxyProperties properties;

    public AgentCookieRedirectFilter(AgentProxyProperties properties) {
        this.properties = properties;
    }

    @Override
    public int getOrder() {
        // Run before any other filters
        return Ordered.HIGHEST_PRECEDENCE;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Only intercept requests that are NOT already under /proxy, /, /api
        if (path.startsWith("/proxy") || path.equals("/") || path.startsWith("/api")) {
            return chain.filter(exchange);
        }

        // Check if the cookie is present
        if (exchange.getRequest().getCookies().containsKey(COOKIE_NAME)) {
            HttpCookie cookie = exchange.getRequest().getCookies().getFirst(COOKIE_NAME);
            if (cookie != null) {
                String agentName = cookie.getValue();
                // Verify this agent exists in config
                if (properties.getAgents().containsKey(agentName)) {
                    // Internal rewrite: /dev-ui/static/foo.js → /proxy/agent1/dev-ui/static/foo.js
                    String newPath = "/proxy/" + agentName + path;
                    String query = exchange.getRequest().getURI().getRawQuery();
                    String newUriStr = newPath + (query != null ? "?" + query : "");

                    log.debug("[rewrite-filter] {} → {} (cookie agent={})", path, newPath, agentName);

                    ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                            .uri(URI.create(newUriStr))
                            .path(newPath)
                            .build();

                    ServerWebExchange mutatedExchange = exchange.mutate()
                            .request(mutatedRequest)
                            .build();

                    return chain.filter(mutatedExchange);
                }
            }
        }

        // No cookie or unknown agent → let it pass through normally
        return chain.filter(exchange);
    }
}

