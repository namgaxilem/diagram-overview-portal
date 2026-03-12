package com.example.agentproxy.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agentproxy.config.AgentProxyProperties;

import reactor.core.publisher.Mono;

/**
 * Example "normal" controller that coexists with the ProxyController.
 *
 * <p>This represents the other controllers in your real project.
 * They live at their own URL paths and are not affected by the proxy logic.</p>
 */
@RestController
@RequestMapping("/api")
public class AgentManagementController {

    private final AgentProxyProperties properties;

    public AgentManagementController(AgentProxyProperties properties) {
        this.properties = properties;
    }

    /**
     * GET /api/agents - List all registered agents and their backends.
     */
    @GetMapping("/agents")
    public Mono<List<Map<String, String>>> listAgents() {
        List<Map<String, String>> agents = properties.getAgents().entrySet().stream()
                .map(e -> Map.of(
                        "name", e.getKey(),
                        "backendUrl", e.getValue(),
                        "proxyUrl", "/proxy/" + e.getKey() + "/dev-ui/"
                ))
                .toList();
        return Mono.just(agents);
    }

    /**
     * GET /api/health - Simple health check endpoint.
     */
    @GetMapping("/health")
    public Mono<Map<String, String>> health() {
        return Mono.just(Map.of("status", "UP", "service", "agent-proxy"));
    }
}

