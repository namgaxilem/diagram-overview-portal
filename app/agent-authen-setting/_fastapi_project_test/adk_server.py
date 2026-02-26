"""
Custom ADK Server with Authentication Middleware.

This module creates a FastAPI application that wraps the ADK server
with authentication support for all endpoints.
"""
import os
import sys
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Request, status, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.openapi.utils import get_openapi

# Get the project root directory (where this file is located)
PROJECT_ROOT = Path(__file__).parent.absolute()

# Add project root to path
sys.path.insert(0, str(PROJECT_ROOT))

from agents.auth_agent.auth_callback import AuthenticationService, AGENT_AUTH_CONFIG


# ============== Authentication Configuration ==============

# Security scheme for Swagger UI
security_scheme = HTTPBearer(auto_error=False)

# Endpoints that don't require authentication
PUBLIC_ENDPOINTS = [
    "/",
    "/docs",
    "/redoc", 
    "/openapi.json",
    "/favicon.ico",
    "/static",
    "/dev-ui",
    "/auth/status",      # Allow checking auth status without auth
    "/auth/test-token",  # Allow getting test tokens without auth (dev only)
]

# Create auth service
auth_service = AuthenticationService(AGENT_AUTH_CONFIG)


# ============== Authentication Dependency ==============

async def verify_token(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)
) -> Optional[dict]:
    """
    Dependency to verify authentication token.
    Returns auth result or raises HTTPException.
    """
    path = request.url.path
    
    # Check if endpoint is public
    for endpoint in PUBLIC_ENDPOINTS:
        if path == endpoint or path.startswith(endpoint + "/") or path.startswith(endpoint + "?"):
            return None
    
    # Allow static files
    if path.startswith("/static") or path.endswith(".js") or path.endswith(".css"):
        return None
    
    # Check if authentication is required
    if not auth_service.is_authentication_required():
        return {"authenticated": False, "message": "No authentication required"}
    
    # Get token from header
    authorization = request.headers.get("Authorization")
    
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error": "Missing Authorization header",
                "auth_methods": _get_enabled_methods(),
                "hint": "Use 'Authorization: Bearer <token>' for ForgeRock or 'Authorization: <token>' for Azure AD"
            },
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Authenticate
    auth_result = auth_service.authenticate(authorization)
    
    if not auth_result.get("authenticated"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "error": auth_result.get("error", "Authentication failed"),
                "auth_methods": _get_enabled_methods()
            },
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return auth_result


def _get_enabled_methods() -> list:
    """Get list of enabled authentication methods."""
    methods = []
    if auth_service.azure_ad_enabled:
        methods.append("azureAD")
    if auth_service.forgerock_enabled:
        methods.append("forgeRock")
    return methods


# ============== Create ADK App with Auth ==============

def create_authenticated_adk_app():
    """Create ADK FastAPI app with authentication."""
    from google.adk.cli.fast_api import get_fast_api_app
    
    # Get the agents directory path
    agents_dir = str(PROJECT_ROOT / "agents")
    
    print(f"Loading agents from: {agents_dir}")
    
    # Create the ADK FastAPI app
    adk_app = get_fast_api_app(
        agents_dir=agents_dir,
        web=True,
    )
    
    # Add CORS middleware
    adk_app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # ============== Custom OpenAPI Schema with Security ==============
    
    def custom_openapi():
        if adk_app.openapi_schema:
            return adk_app.openapi_schema
        
        openapi_schema = get_openapi(
            title="ADK Agent API with Authentication",
            version="1.0.0",
            description="""
## Authentication

This API requires authentication for most endpoints.

### Supported Authentication Methods:

1. **Azure AD** (enabled by default)
   - Header: `Authorization: <jwt_token>`
   - Token must contain valid groups claim

2. **ForgeRock** (disabled by default)
   - Header: `Authorization: Bearer <jwt_token>`
   - Token must contain valid client_id

### Getting Test Tokens:
Visit `/auth/test-token` to get test tokens for development.

### Public Endpoints (no auth required):
- `/docs`, `/redoc` - API Documentation
- `/auth/status` - Check auth configuration
- `/auth/test-token` - Get test tokens
            """,
            routes=adk_app.routes,
        )
        
        # Add security schemes
        openapi_schema["components"] = openapi_schema.get("components", {})
        openapi_schema["components"]["securitySchemes"] = {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
                "description": "Enter your JWT token (without 'Bearer ' prefix for Azure AD, or with it for ForgeRock)"
            },
            "AzureADAuth": {
                "type": "apiKey",
                "in": "header",
                "name": "Authorization",
                "description": "Azure AD JWT token (without Bearer prefix)"
            }
        }
        
        # Apply security to all paths except public ones
        for path, methods in openapi_schema.get("paths", {}).items():
            is_public = any(path == ep or path.startswith(ep + "/") for ep in PUBLIC_ENDPOINTS)
            if not is_public:
                for method in methods.values():
                    if isinstance(method, dict):
                        method["security"] = [{"BearerAuth": []}, {"AzureADAuth": []}]
        
        adk_app.openapi_schema = openapi_schema
        return adk_app.openapi_schema
    
    adk_app.openapi = custom_openapi
    
    # ============== Authentication Middleware ==============
    
    @adk_app.middleware("http")
    async def auth_middleware(request: Request, call_next):
        """Middleware to check authentication for all requests."""
        path = request.url.path
        
        # Check if endpoint is public
        is_public = False
        for endpoint in PUBLIC_ENDPOINTS:
            if path == endpoint or path.startswith(endpoint + "/") or path.startswith(endpoint + "?"):
                is_public = True
                break
        
        # Allow static files
        if path.startswith("/static") or path.endswith(".js") or path.endswith(".css"):
            is_public = True
        
        if is_public:
            return await call_next(request)
        
        # Check if authentication is required
        if not auth_service.is_authentication_required():
            return await call_next(request)
        
        # Get Authorization header
        authorization = request.headers.get("Authorization")
        
        if not authorization:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={
                    "detail": "Missing Authorization header",
                    "auth_methods": _get_enabled_methods(),
                    "hint": "Click the 🔒 Authorize button in Swagger UI to add your token"
                },
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Authenticate
        auth_result = auth_service.authenticate(authorization)
        
        if not auth_result.get("authenticated"):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={
                    "detail": auth_result.get("error", "Authentication failed"),
                    "auth_methods": _get_enabled_methods()
                },
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Store auth result in request state
        request.state.auth_result = auth_result
        
        return await call_next(request)
    
    # ============== Custom Auth Endpoints ==============
    
    @adk_app.get("/auth/status", tags=["🔐 Authentication"])
    async def get_auth_status():
        """
        Get current authentication status and configuration.
        
        This endpoint is public and doesn't require authentication.
        """
        enabled_methods = []
        if AGENT_AUTH_CONFIG.get("azureAD", {}).get("enabled"):
            enabled_methods.append("azureAD")
        if AGENT_AUTH_CONFIG.get("forgeRock", {}).get("enabled"):
            enabled_methods.append("forgeRock")
        
        return {
            "authentication_required": auth_service.is_authentication_required(),
            "enabled_methods": enabled_methods,
            "config": {
                "azureAD": {
                    "enabled": AGENT_AUTH_CONFIG.get("azureAD", {}).get("enabled", False),
                    "groups": AGENT_AUTH_CONFIG.get("azureAD", {}).get("groups", [])
                },
                "forgeRock": {
                    "enabled": AGENT_AUTH_CONFIG.get("forgeRock", {}).get("enabled", False),
                    "clientId": AGENT_AUTH_CONFIG.get("forgeRock", {}).get("clientId", "")
                }
            },
            "public_endpoints": PUBLIC_ENDPOINTS,
            "usage": {
                "azure_ad": "Authorization: <jwt_token>",
                "forgerock": "Authorization: Bearer <jwt_token>",
                "swagger": "Click 🔒 Authorize button and enter: Bearer <your_token>"
            }
        }
    
    @adk_app.post("/auth/config", tags=["🔐 Authentication"])
    async def update_auth_config(config: dict, request: Request):
        """
        Update authentication configuration.
        
        **Requires authentication.**
        """
        global auth_service
        
        # Update config
        if "azureAD" in config:
            AGENT_AUTH_CONFIG["azureAD"] = config["azureAD"]
        if "forgeRock" in config:
            AGENT_AUTH_CONFIG["forgeRock"] = config["forgeRock"]
        
        # Recreate auth service
        auth_service = AuthenticationService(AGENT_AUTH_CONFIG)
        
        return {
            "message": "Configuration updated",
            "new_config": AGENT_AUTH_CONFIG
        }
    
    @adk_app.get("/auth/test-token", tags=["🔐 Authentication"])
    async def get_test_token():
        """
        Generate test tokens for development purposes.
        
        This endpoint is public and doesn't require authentication.
        
        **⚠️ For development only - do not use in production!**
        """
        from jose import jwt
        from datetime import datetime, timedelta
        
        # Generate Azure AD test token
        azure_ad_payload = {
            "sub": "test-user-123",
            "name": "Test User",
            "email": "test@example.com",
            "groups": ["Engineering-Team", "Admin-Group"],
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        azure_ad_token = jwt.encode(azure_ad_payload, "test-secret", algorithm="HS256")
        
        # Generate ForgeRock test token
        forgerock_payload = {
            "sub": "test-user-456",
            "name": "ForgeRock User",
            "client_id": "sample-client-id-12345",
            "azp": "sample-client-id-12345",
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=1)
        }
        forgerock_token = jwt.encode(forgerock_payload, "test-secret", algorithm="HS256")
        
        return {
            "message": "Use these tokens for testing. Click 🔒 Authorize in Swagger UI.",
            "azure_ad": {
                "token": azure_ad_token,
                "swagger_usage": f"Enter in Authorize dialog: {azure_ad_token}",
                "header": f"Authorization: {azure_ad_token}",
            },
            "forgerock": {
                "token": forgerock_token,
                "swagger_usage": f"Enter in Authorize dialog: Bearer {forgerock_token}",
                "header": f"Authorization: Bearer {forgerock_token}",
            }
        }
    
    @adk_app.get("/auth/me", tags=["🔐 Authentication"])
    async def get_current_user(request: Request):
        """
        Get information about the currently authenticated user.
        
        **Requires authentication.**
        """
        auth_result = getattr(request.state, 'auth_result', None)
        if auth_result:
            return {
                "authenticated": True,
                "auth_method": auth_result.get("auth_method"),
                "user_info": auth_result.get("user_info")
            }
        return {"authenticated": False, "message": "No authentication info available"}
    
    return adk_app


# Create the app
app = create_authenticated_adk_app()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "adk_server:app",
        host="127.0.0.1",
        port=8003,
        reload=True
    )
