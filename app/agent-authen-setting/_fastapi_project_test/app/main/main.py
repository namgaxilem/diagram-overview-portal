from fastapi import FastAPI, Depends, Request
from typing import Optional
from pydantic import BaseModel

from .services.authen_service import create_auth_service

app = FastAPI(title="Agent Authentication Test API")


class AuthConfig(BaseModel):
    azureAD: Optional[dict] = None
    forgeRock: Optional[dict] = None


class AgentRequest(BaseModel):
    """Request model for agent interactions."""
    message: str
    session_id: Optional[str] = None


AGENT_AUTH_CONFIG = {
    "azureAD": {
        "groups": ["Engineering-Team", "Admin-Group"],
        "enabled": True
    },
    "forgeRock": {
        "clientId": "sample-client-id-12345",
        "enabled": False
    }
}


# Create authentication service instance
auth_service = create_auth_service(AGENT_AUTH_CONFIG)


async def authenticate_request(request: Request):
    """Dependency for protected endpoints."""
    return await auth_service.authenticate(request)


@app.get("/")
async def root():
    return {
        "message": "Agent Authentication Test API",
        "auth_config": AGENT_AUTH_CONFIG,
        "endpoints": {
            "public": "/public",
            "protected": "/protected",
            "agent_run": "/agent/run"
        }
    }


@app.get("/public")
async def public_endpoint():
    return {
        "message": "This is a public endpoint - no authentication required",
        "status": "success"
    }


@app.get("/protected")
async def protected_endpoint(auth_result: dict = Depends(authenticate_request)):
    return {
        "message": "This is a protected endpoint - authentication required",
        "auth_result": auth_result,
        "status": "success"
    }


@app.post("/agent/run")
async def agent_run(
    request: AgentRequest,
    auth_result: dict = Depends(authenticate_request)
):
    """
    Run the ADK agent with the given message.
    Requires authentication.
    """
    try:
        from .agent import root_agent
        from google.adk.runners import Runner
        from google.adk.sessions import InMemorySessionService
        from google.genai import types
        
        # Create session service and runner
        session_service = InMemorySessionService()
        runner = Runner(
            agent=root_agent,
            app_name="auth_agent_app",
            session_service=session_service
        )
        
        # Get or create session
        session_id = request.session_id or "default_session"
        user_id = auth_result.get("user_info", {}).get("sub", "anonymous")
        
        session = session_service.get_session(
            app_name="auth_agent_app",
            user_id=user_id,
            session_id=session_id
        )
        
        if not session:
            session = session_service.create_session(
                app_name="auth_agent_app",
                user_id=user_id,
                session_id=session_id
            )
        
        # Create user message
        user_content = types.Content(
            role="user",
            parts=[types.Part(text=request.message)]
        )
        
        # Run the agent
        responses = []
        async for event in runner.run_async(
            user_id=user_id,
            session_id=session_id,
            new_message=user_content
        ):
            if hasattr(event, 'content') and event.content:
                for part in event.content.parts:
                    if hasattr(part, 'text') and part.text:
                        responses.append(part.text)
        
        return {
            "message": "Agent executed successfully",
            "auth_result": auth_result,
            "agent_response": "\n".join(responses) if responses else "No response generated",
            "session_id": session_id,
            "status": "success"
        }
    except ImportError as e:
        return {
            "message": "ADK not available - install google-adk to use this endpoint",
            "error": str(e),
            "auth_result": auth_result,
            "payload": {"user_message": request.message},
            "status": "adk_not_available"
        }
    except Exception as e:
        return {
            "message": "Agent execution failed",
            "error": str(e),
            "auth_result": auth_result,
            "status": "error"
        }


@app.get("/config")
async def get_config():
    enabled_methods = []
    if AGENT_AUTH_CONFIG.get("azureAD", {}).get("enabled"):
        enabled_methods.append("azureAD")
    if AGENT_AUTH_CONFIG.get("forgeRock", {}).get("enabled"):
        enabled_methods.append("forgeRock")
    
    return {
        "current_auth_config": AGENT_AUTH_CONFIG,
        "enabled_methods": enabled_methods,
        "authentication_required": auth_service.is_authentication_required()
    }


@app.post("/config/update")
async def update_config(config: AuthConfig):
    global AGENT_AUTH_CONFIG, auth_service
    
    # Update configuration - both methods can be enabled now
    AGENT_AUTH_CONFIG = {}
    
    if config.azureAD:
        AGENT_AUTH_CONFIG["azureAD"] = config.azureAD
    if config.forgeRock:
        AGENT_AUTH_CONFIG["forgeRock"] = config.forgeRock
    
    # Recreate auth service with new config
    auth_service = create_auth_service(AGENT_AUTH_CONFIG)
    
    enabled_methods = []
    if AGENT_AUTH_CONFIG.get("azureAD", {}).get("enabled"):
        enabled_methods.append("azureAD")
    if AGENT_AUTH_CONFIG.get("forgeRock", {}).get("enabled"):
        enabled_methods.append("forgeRock")
    
    return {
        "message": "Configuration updated successfully",
        "new_config": AGENT_AUTH_CONFIG,
        "enabled_methods": enabled_methods,
        "status": "success"
    }
