"""
Auth Agent - Google ADK Agent with Authentication Support.

This package defines an ADK agent with integrated authentication.
"""
from .agent import root_agent
from .auth_callback import auth_callback, AGENT_AUTH_CONFIG, auth_service

__all__ = ["root_agent", "auth_callback", "AGENT_AUTH_CONFIG", "auth_service"]
