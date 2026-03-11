package com.example.agentproxy.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties for agent proxy mappings.
 *
 * Example:
 * <pre>
 * agent-proxy:
 *   agents:
 *     agent1: http://127.0.0.1:8003
 *     agent2: http://127.0.0.1:8004
 * </pre>
 *
 * Access pattern: http://localhost:8080/{agentName}/dev-ui/
 * Cookie fallback: root-relative requests (JS/CSS/API) are routed
 * via the X-Agent-Backend cookie set on first prefixed request.
 */
@ConfigurationProperties(prefix = "agent-proxy")
public class AgentProxyProperties {

    /**
     * Map of agent name to backend URL.
     * Key = path prefix (e.g. "agent1"), Value = backend base URL (e.g. "http://127.0.0.1:8003")
     */
    private Map<String, String> agents = new HashMap<>();

    public Map<String, String> getAgents() {
        return agents;
    }

    public void setAgents(Map<String, String> agents) {
        this.agents = agents;
    }
}
