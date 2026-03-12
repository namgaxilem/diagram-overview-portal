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
 *     1: http://127.0.0.1:8003
 *     2: http://127.0.0.1:8004
 *   workflows:
 *     1: http://127.0.0.1:9001
 *     2: http://127.0.0.1:9002
 * </pre>
 *
 * Access pattern:
 *   http://localhost:8080/agent-proxy/agent/{id}/dev-ui/
 *   http://localhost:8080/agent-proxy/workflow/{id}/dev-ui/
 *
 * Cookie fallback: root-relative requests (JS/CSS/API) are routed
 * via the X-Agent-Backend cookie set on first prefixed request.
 */
@ConfigurationProperties(prefix = "agent-proxy")
public class AgentProxyProperties {

    /**
     * Map of agent ID to backend URL.
     * Key = id (e.g. 1), Value = backend base URL (e.g. "http://127.0.0.1:8003")
     */
    private Map<Long, String> agents = new HashMap<>();

    /**
     * Map of workflow ID to backend URL.
     * Key = id (e.g. 1), Value = backend base URL (e.g. "http://127.0.0.1:9001")
     */
    private Map<Long, String> workflows = new HashMap<>();

    public Map<Long, String> getAgents() {
        return agents;
    }

    public void setAgents(Map<Long, String> agents) {
        this.agents = agents;
    }

    public Map<Long, String> getWorkflows() {
        return workflows;
    }

    public void setWorkflows(Map<Long, String> workflows) {
        this.workflows = workflows;
    }
}
