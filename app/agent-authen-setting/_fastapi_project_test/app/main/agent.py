"""
Google ADK Agent with Authentication Support.
This module defines the main ADK agent with integrated authentication.
"""
from typing import Optional
from google.adk.agents import Agent
from google.adk.tools import FunctionTool

from .services.authen_service import AuthenticationService


# Authentication configuration
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
auth_service = AuthenticationService(AGENT_AUTH_CONFIG)


# ============== Tool Functions ==============

def get_weather(city: str) -> dict:
    """
    Get current weather information for a given city.
    
    Args:
        city: The name of the city to get weather for.
        
    Returns:
        Dictionary containing weather information.
    """
    # Mock weather data for demonstration
    weather_data = {
        "New York": {"temp": 22, "condition": "Sunny", "humidity": 45},
        "London": {"temp": 15, "condition": "Cloudy", "humidity": 70},
        "Tokyo": {"temp": 28, "condition": "Partly Cloudy", "humidity": 60},
        "Hanoi": {"temp": 32, "condition": "Hot", "humidity": 75},
        "Ho Chi Minh": {"temp": 35, "condition": "Sunny", "humidity": 80},
    }
    
    if city in weather_data:
        return {
            "city": city,
            "temperature_celsius": weather_data[city]["temp"],
            "condition": weather_data[city]["condition"],
            "humidity": weather_data[city]["humidity"],
            "status": "success"
        }
    else:
        return {
            "city": city,
            "message": f"Weather data not available for {city}",
            "available_cities": list(weather_data.keys()),
            "status": "not_found"
        }


def search_documents(query: str, max_results: int = 5) -> dict:
    """
    Search for documents based on a query.
    
    Args:
        query: The search query string.
        max_results: Maximum number of results to return.
        
    Returns:
        Dictionary containing search results.
    """
    # Mock search results for demonstration
    mock_documents = [
        {"id": 1, "title": "Company Policy Guide", "relevance": 0.95},
        {"id": 2, "title": "Employee Handbook 2024", "relevance": 0.89},
        {"id": 3, "title": "Security Guidelines", "relevance": 0.85},
        {"id": 4, "title": "Project Documentation", "relevance": 0.78},
        {"id": 5, "title": "API Reference Manual", "relevance": 0.72},
    ]
    
    return {
        "query": query,
        "results": mock_documents[:max_results],
        "total_found": len(mock_documents),
        "status": "success"
    }


def calculate_math(expression: str) -> dict:
    """
    Calculate a mathematical expression.
    
    Args:
        expression: A mathematical expression to evaluate (e.g., "2 + 2 * 3").
        
    Returns:
        Dictionary containing the result.
    """
    try:
        # Safe evaluation of mathematical expressions
        allowed_chars = set("0123456789+-*/.() ")
        if all(c in allowed_chars for c in expression):
            result = eval(expression)
            return {
                "expression": expression,
                "result": result,
                "status": "success"
            }
        else:
            return {
                "expression": expression,
                "error": "Invalid characters in expression",
                "status": "error"
            }
    except Exception as e:
        return {
            "expression": expression,
            "error": str(e),
            "status": "error"
        }


def get_auth_status() -> dict:
    """
    Get current authentication configuration status.
    
    Returns:
        Dictionary containing authentication status.
    """
    enabled_methods = []
    if AGENT_AUTH_CONFIG.get("azureAD", {}).get("enabled"):
        enabled_methods.append("azureAD")
    if AGENT_AUTH_CONFIG.get("forgeRock", {}).get("enabled"):
        enabled_methods.append("forgeRock")
    
    return {
        "authentication_required": auth_service.is_authentication_required(),
        "enabled_methods": enabled_methods,
        "azure_ad_groups": AGENT_AUTH_CONFIG.get("azureAD", {}).get("groups", []),
        "status": "success"
    }


# ============== Agent Definition ==============

# Create the ADK Agent
root_agent = Agent(
    name="authenticated_agent",
    model="gemini-3.1-pro-preview",
    description="An intelligent assistant with authentication support.",
    instruction="""You are a helpful AI assistant with access to various tools.
    
You can help users with:
1. Weather information - Use get_weather tool to check weather in cities
2. Document search - Use search_documents tool to find relevant documents
3. Mathematical calculations - Use calculate_math tool for math operations
4. Authentication status - Use get_auth_status tool to check auth configuration

Always be helpful and provide clear, concise responses.
When users ask about capabilities, explain what tools are available.
""",
    tools=[
        get_weather,
        search_documents,
        calculate_math,
        get_auth_status,
    ],
)
