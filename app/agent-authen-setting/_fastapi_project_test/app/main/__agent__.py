"""
__agent__.py - ADK Entry Point

This is the main entry point for Google ADK.
It exports the root_agent that ADK will use.
"""
from .agent import root_agent, auth_service, AGENT_AUTH_CONFIG
from .auth_callback import create_auth_callback

# Create authentication callback
auth_callback = create_auth_callback(auth_service)

# Export the agent for ADK
__all__ = ["root_agent", "auth_service", "auth_callback", "AGENT_AUTH_CONFIG"]
