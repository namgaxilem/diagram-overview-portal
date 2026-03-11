# Agent Proxy — Controller Service PoC

Spring Cloud Gateway reverse proxy that routes all interactive traffic (dev-UI, evaluation API, WebSocket streams) through a single controller-service to backend ADK agents.

## Architecture

```
Browser                    Spring Boot (8080)              ADK Agent (8003)
  │                              │                              │
  │  GET /agent1/dev-ui/         │                              │
  ├─────────────────────────────►│  strip /agent1               │
  │  Set-Cookie: X-Agent-Backend │  GET /dev-ui/                │
  │◄─────────────────────────────│◄─────────────────────────────┤
  │                              │                              │
  │  GET /static/js/main.js     │  (cookie: agent1)            │
  │  Cookie: X-Agent-Backend    │  GET /static/js/main.js      │
  ├─────────────────────────────►├─────────────────────────────►│
  │◄─────────────────────────────│◄─────────────────────────────┤
  │                              │                              │
  │  WS /run_sse (cookie)       │  WS /run_sse                 │
  ├─────────────────────────────►├─────────────────────────────►│
  │◄════════════════════════════►│◄════════════════════════════►│
```

### How cookie-based routing works

1. **Prefixed request**: `GET /agent1/dev-ui/` → strips `/agent1`, proxies to `http://127.0.0.1:8003/dev-ui/`, sets cookie `X-Agent-Backend=agent1`
2. **Cookie fallback**: JS loads `/static/foo.js` (root-relative) → cookie is sent → proxy reads cookie → routes to `http://127.0.0.1:8003/static/foo.js`
3. **WebSocket/SSE**: browser sends cookie with upgrade request → proxy routes correctly

### Limitation

Only **one agent per browser session** (cookie gets overwritten when switching agents). For production, consider session-based or subdomain-based routing.

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

1. Open `http://localhost:8080/agent1/dev-ui/`
2. The ADK dev-UI should render correctly
3. Chat and WebSocket streaming should work
4. Check browser DevTools → Network tab to verify requests are proxied

## Supported Traffic

| Type       | Status                                      |
|------------|---------------------------------------------|
| HTTP       | ✅ Full support (HTML, JS, CSS, API calls)   |
| WebSocket  | ✅ Native Spring Cloud Gateway support       |
| SSE        | ✅ Works as regular long-lived HTTP          |
| File upload| ✅ Proxied transparently                     |
