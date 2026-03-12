package com.example.agentproxy.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.agentproxy.config.AgentProxyProperties;
import com.example.agentproxy.enums.AgentGatewayType;

/**
 * In-memory implementation that reads agent/workflow mappings from application.yml.
 * Replace this in your real project with a DB-backed implementation.
 */
@Service
public class InMemoryBackendResolverService implements BackendResolverService {

    private final AgentProxyProperties properties;

    public InMemoryBackendResolverService(AgentProxyProperties properties) {
        this.properties = properties;
    }

    @Override
    public String resolve(AgentGatewayType type, Long id) {
        if (type == null || id == null) {
            return null;
        }

        Map<Long, String> registry;

        switch (type) {
            case AGENT:
                registry = properties.getAgents();
                break;
            case WORKFLOW:
                registry = properties.getWorkflows();
                break;
            default:
                return null;
        }

        return registry.get(id);
    }
}
