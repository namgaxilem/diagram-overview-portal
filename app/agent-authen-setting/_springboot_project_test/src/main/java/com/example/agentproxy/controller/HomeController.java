package com.example.agentproxy.controller;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.agentproxy.config.AgentProxyProperties;

/**
 * Home page controller – provides a simple HTML overview of available agents and workflows.
 */
@RestController
public class HomeController {

    private final AgentProxyProperties properties;

    public HomeController(AgentProxyProperties properties) {
        this.properties = properties;
    }

    /**
     * GET / - Renders a simple HTML page listing all available agents and workflows
     * with links to their proxied dev-ui.
     */
    @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    public String home() {
        String agentLinks = properties.getAgents().entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> String.format(
                        "<li><a href=\"/agent-proxy/agent/%d/dev-ui/\">🤖 Agent #%d</a> → %s</li>",
                        e.getKey(), e.getKey(), e.getValue()))
                .collect(Collectors.joining("\n          "));

        String workflowLinks = properties.getWorkflows().entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> String.format(
                        "<li><a href=\"/agent-proxy/workflow/%d/dev-ui/\">⚙️ Workflow #%d</a> → %s</li>",
                        e.getKey(), e.getKey(), e.getValue()))
                .collect(Collectors.joining("\n          "));

        return """
                <!DOCTYPE html>
                <html>
                <head><title>Agent Proxy Portal</title></head>
                <body>
                  <h1>🤖 Agent Proxy Portal</h1>
                  <h2>Agents</h2>
                  <ul>
                    %s
                  </ul>
                  <h2>Workflows</h2>
                  <ul>
                    %s
                  </ul>
                  <hr>
                  <h3>API Endpoints</h3>
                  <ul>
                    <li><a href="/api/agents">/api/agents</a> – list agents &amp; workflows (JSON)</li>
                    <li><a href="/api/health">/api/health</a> – health check</li>
                  </ul>
                </body>
                </html>
                """.formatted(agentLinks, workflowLinks);
    }
}
