package com.example.agentproxy.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Programmatic route configuration for Spring Cloud Gateway.
 * 
 * Creates a catch-all route that matches all requests. The actual routing
 * is handled by AgentRoutingFilter which overrides the target URI.
 */
@Configuration
public class RouteLocatorConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("catch-all", r -> r
                .path("/**")
                .uri("no://op")  // Dummy URI, will be overridden by AgentRoutingFilter
            )
            .build();
    }
}
