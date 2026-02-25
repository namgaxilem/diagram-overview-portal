from fastapi import FastAPI, Depends
from typing import Optional, List
from pydantic import BaseModel

from .auth_azure_ad import create_azure_ad_dependency
from .auth_forgerock import create_forgerock_dependency

app = FastAPI(title="Agent Authentication Test API")


class AuthConfig(BaseModel):
    azureAD: Optional[dict] = None
    forgeRock: Optional[dict] = None


AGENT_AUTH_CONFIG = {
    "azureAD": {
        "groups": ["Engineering-Team", "Admin-Group"]
    }
}


def get_auth_dependency():
    if AGENT_AUTH_CONFIG.get("azureAD"):
        groups = AGENT_AUTH_CONFIG["azureAD"].get("groups", [])
        return create_azure_ad_dependency(groups)
    elif AGENT_AUTH_CONFIG.get("forgeRock"):
        client_id = AGENT_AUTH_CONFIG["forgeRock"].get("clientId", "")
        return create_forgerock_dependency(client_id)
    return None


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
async def protected_endpoint(user: dict = Depends(get_auth_dependency())):
    return {
        "message": "This is a protected endpoint - authentication required",
        "user_info": user,
        "status": "success"
    }


@app.post("/agent/run")
async def agent_run(
    payload: dict,
    user: dict = Depends(get_auth_dependency())
):
    return {
        "message": "Agent executed successfully",
        "user_info": user,
        "payload": payload,
        "status": "success"
    }


@app.get("/config")
async def get_config():
    return {
        "current_auth_config": AGENT_AUTH_CONFIG,
        "auth_method": "azureAD" if AGENT_AUTH_CONFIG.get("azureAD") else "forgeRock" if AGENT_AUTH_CONFIG.get("forgeRock") else "none"
    }


@app.post("/config/update")
async def update_config(config: AuthConfig):
    global AGENT_AUTH_CONFIG
    
    if config.azureAD and config.forgeRock:
        return {
            "error": "Only one authentication method can be active at a time",
            "status": "error"
        }
    
    AGENT_AUTH_CONFIG = {}
    
    if config.azureAD:
        AGENT_AUTH_CONFIG["azureAD"] = config.azureAD
    elif config.forgeRock:
        AGENT_AUTH_CONFIG["forgeRock"] = config.forgeRock
    
    return {
        "message": "Configuration updated successfully",
        "new_config": AGENT_AUTH_CONFIG,
        "status": "success"
    }
