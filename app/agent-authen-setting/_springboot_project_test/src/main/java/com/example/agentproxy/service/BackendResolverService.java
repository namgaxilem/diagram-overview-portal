package com.example.agentproxy.service;

import reactor.core.publisher.Mono;

/**
 * Resolves a backend URL for a given type (agent / workflow) and name.
 *
 * <p>In the real project, implement this interface to query from your database.
 * The test project ships with {@link InMemoryBackendResolverService} that reads
 * from application.yml for convenience.</p>
 *
 * <h3>Usage example:</h3>
 * <pre>
 *   resolverService.resolve("agent", "agent1")
 *       // → Mono.just("http://127.0.0.1:8003")
 *
 *   resolverService.resolve("workflow", "workflow1")
 *       // → Mono.just("http://127.0.0.1:9001")
 *
 *   resolverService.resolve("agent", "unknown")
 *       // → Mono.empty()
 * </pre>
 */
public interface BackendResolverService {

    /**
     * Supported backend types.
     */
    String TYPE_AGENT = "agent";
    String TYPE_WORKFLOW = "workflow";

    /**
     * Resolve a backend base URL.
     *
     * @param type backend type – "agent" or "workflow"
     * @param name the unique name / identifier (e.g. "agent1", "workflow1")
     * @return Mono containing the backend base URL, or Mono.empty() if not found
     */
    Mono<String> resolve(String type, String name);
}

