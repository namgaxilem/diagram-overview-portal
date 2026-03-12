package com.example.agentproxy.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agentproxy.config.AgentProxyProperties;

import reactor.core.publisher.Mono;

/**
 * Example "normal" controller that coexists with the AgentProxyController.
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
        List<Map<String, String>> result = new ArrayList<>();

        // Agents
        properties.getAgents().forEach((name, url) ->
                result.add(Map.of(
                        "type", "agent",
                        "name", name,
                        "backendUrl", url,
                        "proxyUrl", "/proxy/agent/" + name + "/dev-ui/"
                ))
        );

        // Workflows
        properties.getWorkflows().forEach((name, url) ->
                result.add(Map.of(
                        "type", "workflow",
                        "name", name,
                        "backendUrl", url,
                        "proxyUrl", "/proxy/workflow/" + name + "/dev-ui/"
                ))
        );

        return Mono.just(result);
    }

    /**
     * GET /api/health - Simple health check endpoint.
     */
    @GetMapping("/health")
    public Mono<Map<String, String>> health() {
        return Mono.just(Map.of("status", "UP", "service", "agent-proxy"));
    }
}
