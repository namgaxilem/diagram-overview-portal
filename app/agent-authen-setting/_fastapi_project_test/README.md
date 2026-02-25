# FastAPI Agent Authentication Test Project

This is a test project to demonstrate Azure AD and ForgeRock authentication for FastAPI agents.

## Project Structure

```
_fastapi_project_test/
├── requirements.txt
├── README.md
└── app/
    ├── main/
    │   ├── __init__.py
    │   ├── main.py                      # Main FastAPI application
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

2. **Run the server:**
   ```bash
   uvicorn app.main.main:app --reload
   ```

3. **Access the API:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
   - Root endpoint: http://localhost:8000/

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
