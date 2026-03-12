package com.example.agentproxy.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agentproxy.config.AgentProxyProperties;

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
    public List<Map<String, String>> listAgents() {
        List<Map<String, String>> result = new ArrayList<>();

        // Agents
        properties.getAgents().forEach((id, url) ->
                result.add(Map.of(
                        "type", "agent",
                        "id", String.valueOf(id),
                        "backendUrl", url,
                        "proxyUrl", "/agent-proxy/agent/" + id + "/dev-ui/"
                ))
        );

        // Workflows
        properties.getWorkflows().forEach((id, url) ->
                result.add(Map.of(
                        "type", "workflow",
                        "id", String.valueOf(id),
                        "backendUrl", url,
                        "proxyUrl", "/agent-proxy/workflow/" + id + "/dev-ui/"
                ))
        );

        return result;
    }

    /**
     * GET /api/health - Simple health check endpoint.
     */
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "agent-proxy");
    }
}
