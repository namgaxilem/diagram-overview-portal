# Agent Proxy — Controller-Based Reverse Proxy

Spring Boot WebFlux application that acts as a **reverse proxy** to backend ADK agents, using a **Controller-based** approach that coexists with other normal controllers in your project.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Spring Boot App (:8080)                │
│                                                         │
│  ┌──────────────────┐   ┌──────────────────────────┐   │
│  │  HomeController   │   │ AgentManagementController │   │
│  │  GET /            │   │ GET /api/agents           │   │
│  │                   │   │ GET /api/health           │   │
│  └──────────────────┘   └──────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              ProxyController                      │   │
│  │  /proxy/{agentName}/** → backend agent            │   │
│  │  Cookie fallback for root-relative paths          │   │
│  └──────────┬───────────────┬───────────────────────┘   │
│             │               │                           │
└─────────────┼───────────────┼───────────────────────────┘
              │               │
              ▼               ▼
     ┌────────────┐  ┌────────────┐
     │ Agent 1    │  │ Agent 2    │
     │ :8003      │  │ :8004      │
     │ /dev-ui/   │  │ /dev-ui/   │
     └────────────┘  └────────────┘
```

### How cookie-based routing works

1. **Prefixed request**: `GET /proxy/agent1/dev-ui/` → strips `/proxy/agent1`, proxies to `http://127.0.0.1:8003/dev-ui/`, sets cookie `X-Agent-Backend=agent1`
2. **Cookie fallback**: JS loads `/proxy/static/foo.js` (root-relative) → cookie is sent → proxy reads cookie → routes to `http://127.0.0.1:8003/static/foo.js`
3. **WebSocket/SSE**: browser sends cookie with upgrade request → proxy routes correctly

### URL Mapping

| You access                                   | Proxied to / Response              |
|----------------------------------------------|------------------------------------|
| `http://localhost:8080/`                     | Home page (list of agents)         |
| `http://localhost:8080/api/agents`           | JSON list of agents                |
| `http://localhost:8080/api/health`           | Health check endpoint              |
| `http://localhost:8080/proxy/agent1/dev-ui/` | `http://127.0.0.1:8003/dev-ui/`   |
| `http://localhost:8080/proxy/agent2/dev-ui/` | `http://127.0.0.1:8004/dev-ui/`   |

### Limitation

Only **one agent per browser session** (cookie gets overwritten when switching agents). For production, consider session-based or subdomain-based routing.

## Project Structure

```
src/main/java/com/example/agentproxy/
├── AgentProxyApplication.java              # Main entry point
├── config/
│   ├── AgentProxyProperties.java           # YAML → Java binding
│   └── WebClientConfig.java                # WebClient bean for proxy
├── controller/
│   ├── HomeController.java                 # GET / – HTML landing page
│   ├── AgentManagementController.java      # GET /api/agents, /api/health
│   └── ProxyController.java                # /proxy/** – reverse proxy
└── filter/
    └── AgentCookieRedirectFilter.java      # Rewrites root-relative paths → /proxy/{agent}/...
```

## Prerequisites

- Java 17+
- Gradle 8.7+ (or use included wrapper)

## Configuration

Edit `src/main/resources/application.yml`:

```yaml
agent-proxy:
  agents:
    agent1: http://127.0.0.1:8003
    agent2: http://127.0.0.1:8004
    # For K8s internal DNS:
    # my-agent: http://my-agent-service.namespace.svc.cluster.local:8000
```

## Run

```bash
# Start the ADK agent first
cd ../_fastapi_project_test
python adk_server.py

# Start the proxy (Windows)
cd ../_springboot_project_test
.\gradlew.bat bootRun

# Or on Linux/Mac
./gradlew bootRun
```

## Test

1. Open `http://localhost:8080/` – see agent list
2. Click on an agent link → opens `http://localhost:8080/proxy/agent1/dev-ui/`
3. The ADK dev-UI should render correctly
4. Chat and streaming should work
5. Try `http://localhost:8080/api/agents` for JSON API
6. Check browser DevTools → Network tab to verify requests are proxied

## Adding to Your Real Project

1. **Copy** these files:
   - `AgentProxyProperties.java`
   - `WebClientConfig.java`
   - `ProxyController.java`
   - `AgentCookieRedirectFilter.java`

2. **Add** the `agent-proxy.agents` section to your `application.yml`.

3. **Add** `@EnableConfigurationProperties(AgentProxyProperties.class)` to your main class.

4. Your existing controllers (`@RestController` at `/api/users`, etc.) will **not be affected** because the proxy lives under `/proxy/**`.
