# FastAPI Agent Authentication Test Project with Google ADK

This project demonstrates Azure AD and ForgeRock authentication for AI agents, supporting both FastAPI REST API and Google ADK (Agent Development Kit) web interface.

## Project Structure

```
_fastapi_project_test/
├── requirements.txt
├── README.md
└── app/
    ├── main/
    │   ├── __init__.py
    │   ├── __agent__.py                 # ADK entry point
    │   ├── agent.py                     # ADK Agent definition
    │   ├── auth_callback.py             # ADK authentication callback
    │   ├── main.py                      # Main FastAPI application
    │   ├── run_adk.py                   # ADK web runner script
    │   └── services/
    │       ├── __init__.py
    │       └── authen_service.py        # Centralized authentication service
    └── test/
        ├── __init__.py
        └── test_tokens.py               # Token generation utilities
```

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up Google API Key (required for ADK):**
   ```bash
   # Windows PowerShell
   $env:GOOGLE_API_KEY = "your-google-api-key"
   
   # Or create a .env file in the project root
   # GOOGLE_API_KEY=your-google-api-key
   ```

## Running the Application

### Option 1: Run ADK with Authentication (Recommended)
```bash
uvicorn adk_server:app --host 127.0.0.1 --port 8003
```
This starts the ADK server with authentication middleware at http://localhost:8003

**Features:**
- All ADK endpoints are protected by authentication
- Swagger UI: http://localhost:8003/docs
- Auth Status: http://localhost:8003/auth/status
- Test Tokens: http://localhost:8003/auth/test-token

### Option 2: Run ADK Web Interface (No Auth)
```bash
adk web agents
```
This starts the standard ADK web interface at http://localhost:8000 (without authentication)

If port 8000 is in use, specify a different port:
```bash
adk web agents --port 8001
```

### Option 3: Run FastAPI Server Only
```bash
uvicorn app.main.main:app --reload
```
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Google ADK Features

### Available Agent Tools
The ADK agent comes with the following tools:

1. **get_weather(city)** - Get weather information for a city
2. **search_documents(query, max_results)** - Search documents by query
3. **calculate_math(expression)** - Calculate mathematical expressions
4. **get_current_time()** - Get current date and time
5. **get_auth_status()** - Get current authentication configuration

### Example Conversations with ADK Agent
- "What's the weather in Tokyo?"
- "Search for documents about security"
- "Calculate 15 * 24 + 100"
- "What authentication methods are enabled?"

## Using Authentication with ADK Server

### Public Endpoints (No Auth Required)
- `/docs` - Swagger UI
- `/auth/status` - Check authentication status
- `/auth/test-token` - Get test tokens for development
- `/list-apps` - List available agents

### Protected Endpoints (Auth Required)
All other endpoints require a valid JWT token in the Authorization header.

### Getting Test Tokens
```bash
# Get test tokens (for development)
curl http://localhost:8003/auth/test-token
```

### Using Tokens
**Azure AD Token:**
```bash
# Get token and use it
TOKEN=$(curl -s http://localhost:8003/auth/test-token | jq -r '.azure_ad.token')
curl -H "Authorization: $TOKEN" http://localhost:8003/apps/auth_agent/users/test/sessions
```

**ForgeRock Token (when enabled):**
```bash
TOKEN=$(curl -s http://localhost:8003/auth/test-token | jq -r '.forgerock.token')
curl -H "Authorization: Bearer $TOKEN" http://localhost:8003/apps/auth_agent/users/test/sessions
```

### Python Example
```python
import requests

# Get test token
token_resp = requests.get('http://localhost:8003/auth/test-token')
token = token_resp.json()['azure_ad']['token']

# Use token to access protected endpoint
headers = {'Authorization': token}
response = requests.get(
    'http://localhost:8003/apps/auth_agent/users/test/sessions',
    headers=headers
)
print(response.json())
```

## Authentication Methods

**Both methods can be enabled simultaneously or independently.**

### Azure AD Groups
- Validates JWT tokens containing Azure AD group memberships
- Token format: `Authorization: <token>` (without "Bearer" prefix)
- Only users in specified groups can access protected endpoints
- Default allowed groups: `Engineering-Team`, `Admin-Group`
- Default state: **Enabled**

### ForgeRock OAuth
- Validates JWT Bearer tokens with ForgeRock Client ID
- Token format: `Authorization: Bearer <token>` (with "Bearer" prefix)
- Checks `client_id` or `azp` claim in the token
- Default client ID: `sample-client-id-12345`
- Default state: **Disabled**

### Authentication Logic
- **Bearer token** (starts with "Bearer "): Tries ForgeRock first, falls back to Azure AD if both enabled
- **Direct token** (no "Bearer" prefix): Tries Azure AD first, falls back to ForgeRock if both enabled
- If only one method is enabled, only that method is checked
- If both are disabled, no authentication is required

## Endpoints

### Public Endpoints
- `GET /` - API information
- `GET /public` - Public endpoint (no auth required)
- `GET /config` - View current auth configuration

### Protected Endpoints (Require Authentication)
- `GET /protected` - Protected endpoint
- `POST /agent/run` - Agent execution endpoint

### Configuration Endpoints
- `POST /config/update` - Update authentication configuration

## Testing

### Generate Test Tokens

Run the token generator:
```bash
python -m app.test.test_tokens
```

This will output:
- Valid Azure AD token (with allowed groups)
- Invalid Azure AD token (without allowed groups)
- Valid ForgeRock token (with correct client_id)
- Invalid ForgeRock token (with wrong client_id)

### Test with Swagger UI

1. Go to http://localhost:8000/docs
2. Click the "Authorize" button (lock icon)
3. Paste a token from the test_tokens.py output (including "Bearer " prefix)
4. Try accessing protected endpoints

### Test with cURL

**Azure AD Authentication:**
```bash
# Generate token first
python -m app.test.test_tokens

# Use the token (replace TOKEN with actual token)
curl -X GET "http://localhost:8000/protected" \
  -H "Authorization: Bearer TOKEN"
```

**ForgeRock Authentication:**
```bash
# First update config to use ForgeRock
curl -X POST "http://localhost:8000/config/update" \
  -H "Content-Type: application/json" \
  -d '{
    "forgeRock": {
      "clientId": "sample-client-id-12345"
    }
  }'

# Then use ForgeRock token
curl -X GET "http://localhost:8000/protected" \
  -H "Authorization: Bearer TOKEN"
```

## Configuration

### Update Authentication Method

**Enable Azure AD Only:**
```bash
curl -X POST "http://localhost:8000/config/update" \
  -H "Content-Type: application/json" \
  -d '{
    "azureAD": {
      "groups": ["Engineering-Team", "Admin-Group"],
      "enabled": true
    }
  }'
```

**Enable ForgeRock Only:**
```bash
curl -X POST "http://localhost:8000/config/update" \
  -H "Content-Type: application/json" \
  -d '{
    "forgeRock": {
      "clientId": "your-client-id",
      "enabled": true
    }
  }'
```

**Enable Both Methods:**
```bash
curl -X POST "http://localhost:8000/config/update" \
  -H "Content-Type: application/json" \
  -d '{
    "azureAD": {
      "groups": ["Engineering-Team", "Admin-Group"],
      "enabled": true
    },
    "forgeRock": {
      "clientId": "your-client-id",
      "enabled": true
    }
  }'
```

**Disable All Authentication:**
```bash
curl -X POST "http://localhost:8000/config/update" \
  -H "Content-Type: application/json" \
  -d '{
    "azureAD": {
      "groups": [],
      "enabled": false
    },
    "forgeRock": {
      "clientId": "",
      "enabled": false
    }
  }'
```

## Error Responses

### 401 Unauthorized
- Missing or invalid token
- Token signature verification failed

### 403 Forbidden
- Valid token but user not in allowed groups (Azure AD)
- Valid token but wrong client_id (ForgeRock)

## Notes

- **Both authentication methods** can be enabled simultaneously
- The authentication service automatically detects token type based on "Bearer" prefix
- Tokens are validated but signatures are not verified (for testing purposes)
- In production, you should verify token signatures with proper keys
- The configuration is stored in memory and will reset when the server restarts
- The centralized `authen_service.py` handles all authentication logic for better scalability
