package com.example.agentproxy.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.agentproxy.config.AgentProxyProperties;

import reactor.core.publisher.Mono;

/**
 * In-memory implementation of {@link BackendResolverService} that reads
 * agent/workflow mappings from {@link AgentProxyProperties} (application.yml).
 *
 * <p><b>Replace this class</b> in your real project with a DB-backed implementation
 * that queries agent/workflow URLs from your database.</p>
 *
 * <h3>application.yml example:</h3>
 * <pre>
 * agent-proxy:
 *   agents:
 *     agent1: http://127.0.0.1:8003
 *     agent2: http://127.0.0.1:8004
 *   workflows:
 *     workflow1: http://127.0.0.1:9001
 *     workflow2: http://127.0.0.1:9002
 * </pre>
 */
@Service
public class InMemoryBackendResolverService implements BackendResolverService {

    private final AgentProxyProperties properties;

    public InMemoryBackendResolverService(AgentProxyProperties properties) {
        this.properties = properties;
    }

    @Override
    public Mono<String> resolve(String type, String name) {
        Map<String, String> registry;

        switch (type) {
            case TYPE_AGENT:
                registry = properties.getAgents();
                break;
            case TYPE_WORKFLOW:
                registry = properties.getWorkflows();
                break;
            default:
                return Mono.empty();
        }

        String url = registry.get(name);
        return url != null ? Mono.just(url) : Mono.empty();
    }
}

