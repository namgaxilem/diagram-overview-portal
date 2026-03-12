package com.example.agentproxy.service;

import com.example.agentproxy.enums.AgentGatewayType;

/**
 * Resolves a backend URL for a given type (agent / workflow) and ID.
 *
 * <p>In the real project, implement this interface to query from your database.
 * The test project ships with {@link InMemoryBackendResolverService} that reads
 * from application.yml for convenience.</p>
 */
public interface BackendResolverService {

    /**
     * Resolve a backend base URL.
     *
     * @param type backend type – AGENT or WORKFLOW
     * @param id   the unique numeric identifier
     * @return the backend base URL, or {@code null} if not found
     */
    String resolve(AgentGatewayType type, Long id);
}
