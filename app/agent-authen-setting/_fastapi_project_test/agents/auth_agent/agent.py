"""
Google ADK Agent with Authentication Support.
This module defines the main ADK agent with integrated authentication.
"""
from google.adk.agents import Agent


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
        "Paris": {"temp": 18, "condition": "Rainy", "humidity": 85},
        "Sydney": {"temp": 25, "condition": "Sunny", "humidity": 50},
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
        {"id": 6, "title": "Technical Architecture Guide", "relevance": 0.68},
        {"id": 7, "title": "Onboarding Materials", "relevance": 0.62},
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
                "error": "Invalid characters in expression. Only numbers and +, -, *, /, (, ), . are allowed.",
                "status": "error"
            }
    except Exception as e:
        return {
            "expression": expression,
            "error": str(e),
            "status": "error"
        }


def get_current_time() -> dict:
    """
    Get the current date and time.
    
    Returns:
        Dictionary containing current date and time information.
    """
    from datetime import datetime
    now = datetime.now()
    return {
        "date": now.strftime("%Y-%m-%d"),
        "time": now.strftime("%H:%M:%S"),
        "day_of_week": now.strftime("%A"),
        "timezone": "Local",
        "status": "success"
    }


def get_auth_status() -> dict:
    """
    Get current authentication configuration status.
    
    Returns:
        Dictionary containing authentication status.
    """
    from .auth_callback import AGENT_AUTH_CONFIG, auth_service
    
    enabled_methods = []
    if AGENT_AUTH_CONFIG.get("azureAD", {}).get("enabled"):
        enabled_methods.append("azureAD")
    if AGENT_AUTH_CONFIG.get("forgeRock", {}).get("enabled"):
        enabled_methods.append("forgeRock")
    
    return {
        "authentication_required": auth_service.is_authentication_required(),
        "enabled_methods": enabled_methods,
        "azure_ad_groups": AGENT_AUTH_CONFIG.get("azureAD", {}).get("groups", []),
        "forgerock_client_id": AGENT_AUTH_CONFIG.get("forgeRock", {}).get("clientId", ""),
        "status": "success"
    }


# ============== Agent Definition ==============

# Create the ADK Agent
root_agent = Agent(
    name="authenticated_agent",
    model="gemini-2.0-flash",
    description="An intelligent assistant with authentication support for enterprise use.",
    instruction="""You are a helpful AI assistant with access to various tools.
    
You can help users with:
1. **Weather Information** - Use get_weather tool to check weather in cities around the world
2. **Document Search** - Use search_documents tool to find relevant documents in the system
3. **Mathematical Calculations** - Use calculate_math tool for math operations (supports +, -, *, /, parentheses)
4. **Current Time** - Use get_current_time tool to get the current date and time
5. **Authentication Status** - Use get_auth_status tool to check the authentication configuration

Guidelines:
- Always be helpful, professional, and provide clear, concise responses
- When users ask about your capabilities, explain what tools are available
- For weather queries, if the city is not found, suggest available cities
- For math calculations, validate the expression before computing
- Provide context and explanations when appropriate

Remember: This agent operates within an authenticated enterprise environment.
""",
    tools=[
        get_weather,
        search_documents,
        calculate_math,
        get_current_time,
        get_auth_status,
    ],
)
