package com.example.agentproxy.filter;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.agentproxy.enums.AgentGatewayType;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

/**
 * Servlet Filter that rewrites root-relative paths (e.g. /dev-ui/static/js/main.js)
 * to /agent-proxy/{type}/{id}/... using an HttpServletRequestWrapper.
 *
 * <p>This runs inside the Spring Security filter chain (before authorization).
 * By wrapping the request with a new URI, the authorization filter sees /agent-proxy/**
 * which is permitAll, and DispatcherServlet routes it to AgentProxyController.</p>
 */
public class AgentCookieRedirectFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(AgentCookieRedirectFilter.class);
    private static final String COOKIE_TYPE = "X-Agent-Backend-Type";
    private static final String COOKIE_ID   = "X-Agent-Backend-Id";

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                          FilterChain chain) throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String path = request.getRequestURI();

        // Only intercept requests that are NOT already under known paths
        if (path.startsWith("/agent-proxy") || path.equals("/") || path.startsWith("/api")
                || path.startsWith("/login") || path.startsWith("/logout")
                || path.startsWith("/error")) {
            chain.doFilter(servletRequest, servletResponse);
            return;
        }

        // Check if both cookies are present
        String typeCookie = getCookieValue(request, COOKIE_TYPE);
        String idCookie   = getCookieValue(request, COOKIE_ID);

        if (typeCookie != null && idCookie != null) {
            // Validate that the type is a valid enum value
            AgentGatewayType type;
            try {
                type = AgentGatewayType.valueOf(typeCookie);
            } catch (IllegalArgumentException e) {
                chain.doFilter(servletRequest, servletResponse);
                return;
            }

            String typeLower = type.name().toLowerCase();
            String newPath = "/agent-proxy/" + typeLower + "/" + idCookie + path;
            log.debug("[rewrite-filter] {} -> {} (type={}, id={})", path, newPath, typeLower, idCookie);

            // Wrap request with rewritten URI — continues through same filter chain
            HttpServletRequest wrappedRequest = new HttpServletRequestWrapper(request) {
                @Override
                public String getRequestURI() {
                    return newPath;
                }

                @Override
                public String getServletPath() {
                    return newPath;
                }

                @Override
                public StringBuffer getRequestURL() {
                    StringBuffer url = new StringBuffer();
                    url.append(request.getScheme()).append("://")
                       .append(request.getServerName());
                    int port = request.getServerPort();
                    if (port != 80 && port != 443) {
                        url.append(":").append(port);
                    }
                    url.append(newPath);
                    return url;
                }
            };

            chain.doFilter(wrappedRequest, servletResponse);
            return;
        }

        // No cookies or invalid type → pass through
        chain.doFilter(servletRequest, servletResponse);
    }

    private String getCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if (cookieName.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
