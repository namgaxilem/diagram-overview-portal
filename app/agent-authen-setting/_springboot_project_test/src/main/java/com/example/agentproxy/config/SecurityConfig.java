package com.example.agentproxy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Security configuration for the Agent Proxy application.
 *
 * <h3>Access rules:</h3>
 * <ul>
 *   <li>{@code /proxy/**} — <b>permitAll</b> (no authentication required).
 *       The proxy controller must be accessible without login so that
 *       backend agents/workflows can be reached freely.</li>
 *   <li>{@code /api/health} — <b>permitAll</b> (health check for monitoring).</li>
 *   <li>Everything else ({@code /}, {@code /api/**}, etc.) — <b>authenticated</b>
 *       (requires login via HTTP Basic or form login).</li>
 * </ul>
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        // Proxy endpoints — open, no auth required
                        .pathMatchers("/proxy/**").permitAll()
                        // Health check — open
                        .pathMatchers("/api/health").permitAll()
                        // Everything else requires authentication
                        .anyExchange().authenticated()
                )
                // Enable HTTP Basic auth (good for API / Postman testing)
                .httpBasic(httpBasic -> {})
                // Enable form login (good for browser access)
                .formLogin(formLogin -> {})
                .build();
    }
}

