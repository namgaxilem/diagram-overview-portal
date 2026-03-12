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
│  │              AgentCookieRedirectFilter             │   │
│  │  Intercepts root-relative paths (/static/*, /api/*)│   │
│  │  Reads cookie → rewrites to /proxy/{agent}/...     │   │
│  └──────────────────┬─────────────────────────────────┘   │
│                     │                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │              AgentProxyController                  │   │
│  │  /proxy/{agentName}/** → backend agent            │   │
│  │  Strips prefix → forwards to backend              │   │
│  └──────────────────┬─────────────────────────────────┘   │
│                     │                                     │
└─────────────────────┼─────────────────────────────────────┘
                      │
                      ▼
             ┌────────────┐  ┌────────────┐
             │ Agent 1    │  │ Agent 2    │
             │ :8003      │  │ :8004      │
             │ /dev-ui/   │  │ /dev-ui/   │
             └────────────┘  └────────────┘
```

### How cookie-based routing works

#### Step 1: Initial Access (Prefixed Request)
```
Browser: GET /proxy/agent1/dev-ui/
↓
AgentCookieRedirectFilter: Skips (already has /proxy prefix)
↓
AgentProxyController: Strips "/proxy/agent1" → GET /dev-ui/
↓
Proxy to: http://127.0.0.1:8003/dev-ui/
↓
Response: Sets cookie X-Agent-Backend=agent1
```

#### Step 2: Root-relative Asset Requests
```
Browser: GET /static/js/main.js (with cookie)
↓
AgentCookieRedirectFilter: Intercepts
├─ Reads cookie: X-Agent-Backend=agent1
└─ Rewrites to: /proxy/agent1/static/js/main.js
↓
AgentProxyController: Strips "/proxy/agent1" → GET /static/js/main.js
↓
Proxy to: http://127.0.0.1:8003/static/js/main.js
```

#### Step 3: API Calls & WebSocket
```
Browser: POST /api/chat (with cookie)
↓
AgentCookieRedirectFilter: Rewrites → /proxy/agent1/api/chat
↓
AgentProxyController: Strips prefix → POST /api/chat
↓
Proxy to: http://127.0.0.1:8003/api/chat
```

### URL Mapping

| Original Request | Filter Action | Controller Action | Backend Request |
|------------------|---------------|-------------------|-----------------|
| `/proxy/agent1/dev-ui/` | Skip (already prefixed) | Strip `/proxy/agent1` | `GET /dev-ui/` |
| `/static/js/main.js` | Rewrite → `/proxy/agent1/static/js/main.js` | Strip `/proxy/agent1` | `GET /static/js/main.js` |
| `/api/chat` | Rewrite → `/proxy/agent1/api/chat` | Strip `/proxy/agent1` | `POST /api/chat` |
| `/` | Skip (home) | HomeController | HTML page |
| `/api/agents` | Skip (API) | AgentManagementController | JSON list |

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
│   └── AgentProxyController.java           # /proxy/** – reverse proxy logic
├── filter/
│   └── AgentCookieRedirectFilter.java      # Rewrites root-relative paths
├── service/
│   └── BackendResolverService.java         # Agent URL resolution
└── enums/
    └── AgentGatewayType.java               # Gateway type constants
```

### Component Responsibilities

| Component | Role | Key Logic |
|-----------|------|-----------|
| **AgentCookieRedirectFilter** | Path rewriting | Intercepts `/static/*`, `/api/*` → rewrites to `/proxy/{agent}/...` |
| **AgentProxyController** | Actual proxying | Handles `/proxy/{agent}/**` → strips prefix → forwards to backend |
| **BackendResolverService** | Agent discovery | Maps agent names → backend URLs from configuration |
| **WebClientConfig** | HTTP client | Configures WebClient for proxy requests |

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
   - `AgentProxyController.java`
   - `AgentCookieRedirectFilter.java`
   - `BackendResolverService.java`
   - `AgentGatewayType.java`

2. **Add** the `agent-proxy.agents` section to your `application.yml`.

3. **Add** `@EnableConfigurationProperties(AgentProxyProperties.class)` to your main class.

4. Your existing controllers (`@RestController` at `/api/users`, etc.) will **not be affected** because:
   - Filter skips `/api/*` paths (your existing endpoints)
   - Proxy lives under `/proxy/**` path
   - Only root-relative paths from dev-UI get intercepted
