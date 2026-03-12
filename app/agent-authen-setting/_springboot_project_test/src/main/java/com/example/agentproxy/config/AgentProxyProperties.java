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
 *   workflows:
 *     workflow1: http://127.0.0.1:9001
 *     workflow2: http://127.0.0.1:9002
 * </pre>
 *
 * Access pattern:
 *   http://localhost:8080/proxy/agent/{agentName}/dev-ui/
 *   http://localhost:8080/proxy/workflow/{workflowName}/dev-ui/
 *
 * Cookie fallback: root-relative requests (JS/CSS/API) are routed
 * via the X-Agent-Backend cookie set on first prefixed request.
 */
@ConfigurationProperties(prefix = "agent-proxy")
public class AgentProxyProperties {

    /**
     * Map of agent name to backend URL.
     * Key = name (e.g. "agent1"), Value = backend base URL (e.g. "http://127.0.0.1:8003")
     */
    private Map<String, String> agents = new HashMap<>();

    /**
     * Map of workflow name to backend URL.
     * Key = name (e.g. "workflow1"), Value = backend base URL (e.g. "http://127.0.0.1:9001")
     */
    private Map<String, String> workflows = new HashMap<>();

    public Map<String, String> getAgents() {
        return agents;
    }

    public void setAgents(Map<String, String> agents) {
        this.agents = agents;
    }

    public Map<String, String> getWorkflows() {
        return workflows;
    }

    public void setWorkflows(Map<String, String> workflows) {
        this.workflows = workflows;
    }
}
