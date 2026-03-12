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

import com.example.agentproxy.service.BackendResolverService;

import reactor.core.publisher.Mono;

/**
 * WebFilter that catches requests OUTSIDE /proxy/** that were triggered by
 * the ADK dev-ui's root-relative asset/API paths (e.g. /dev-ui/static/..., /list-apps).
 *
 * <p>If the request has the X-Agent-Backend-Type and X-Agent-Backend-Name cookies,
 * this filter <b>internally rewrites</b> the request path to
 * /proxy/{type}/{name}/... so the AgentProxyController handles it
 * transparently — no browser redirect needed.</p>
 */
@Component
public class AgentCookieRedirectFilter implements WebFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(AgentCookieRedirectFilter.class);
    private static final String COOKIE_TYPE = "X-Agent-Backend-Type";
    private static final String COOKIE_NAME = "X-Agent-Backend-Name";

    private final BackendResolverService resolverService;

    public AgentCookieRedirectFilter(BackendResolverService resolverService) {
        this.resolverService = resolverService;
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Only intercept requests that are NOT already under /proxy, /, /api
        if (path.startsWith("/proxy") || path.equals("/") || path.startsWith("/api")) {
            return chain.filter(exchange);
        }

        // Check if both cookies are present
        if (exchange.getRequest().getCookies().containsKey(COOKIE_TYPE) &&
                exchange.getRequest().getCookies().containsKey(COOKIE_NAME)) {
            HttpCookie typeCookie = exchange.getRequest().getCookies().getFirst(COOKIE_TYPE);
            HttpCookie nameCookie = exchange.getRequest().getCookies().getFirst(COOKIE_NAME);
            if (typeCookie != null && nameCookie != null) {
                String type = typeCookie.getValue();
                String name = nameCookie.getValue();

                // Validate type
                if (!BackendResolverService.TYPE_AGENT.equals(type) &&
                        !BackendResolverService.TYPE_WORKFLOW.equals(type)) {
                    return chain.filter(exchange);
                }

                // Internal rewrite: /dev-ui/static/foo.js → /proxy/agent/agent1/dev-ui/static/foo.js
                String newPath = "/proxy/" + type + "/" + name + path;
                String query = exchange.getRequest().getURI().getRawQuery();
                String newUriStr = newPath + (query != null ? "?" + query : "");

                log.debug("[rewrite-filter] {} → {} (type={}, name={})", path, newPath, type, name);

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

        // No cookies or invalid → let it pass through normally
        return chain.filter(exchange);
    }
}

