"""
Authentication Callbacks for Google ADK.
This module provides authentication middleware for ADK agents.
"""
from typing import Optional
from google.adk.agents.callback_context import CallbackContext
from google.adk.models import LlmRequest, LlmResponse
from google.genai import types

from .services.authen_service import AuthenticationService


class ADKAuthCallback:
    """
    Authentication callback for ADK agents.
    Implements before_model_callback to validate authentication before processing.
    """
    
    def __init__(self, auth_service: AuthenticationService):
        """
        Initialize the authentication callback.
        
        Args:
            auth_service: The authentication service instance.
        """
        self.auth_service = auth_service
        self._current_auth_result: Optional[dict] = None
    
    def set_auth_token(self, token: str, auth_type: str = "bearer"):
        """
        Set the authentication token for the current request.
        This should be called before making agent requests.
        
        Args:
            token: The authentication token.
            auth_type: Type of authentication ('bearer' or 'azure').
        """
        self._current_auth_result = None
        
        if not self.auth_service.is_authentication_required():
            self._current_auth_result = {
                "authenticated": False,
                "message": "No authentication required"
            }
            return
        
        # Verify the token
        import asyncio
        try:
            if auth_type == "bearer" and self.auth_service.forgerock_enabled:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    import concurrent.futures
                    with concurrent.futures.ThreadPoolExecutor() as executor:
                        future = executor.submit(
                            asyncio.run,
                            self.auth_service.verify_forgerock_token(token)
                        )
                        payload = future.result()
                else:
                    payload = asyncio.run(self.auth_service.verify_forgerock_token(token))
                self._current_auth_result = {
                    "authenticated": True,
                    "auth_method": "forgerock",
                    "user_info": payload
                }
            elif self.auth_service.azure_ad_enabled:
                loop = asyncio.get_event_loop()
                if loop.is_running():
                    import concurrent.futures
                    with concurrent.futures.ThreadPoolExecutor() as executor:
                        future = executor.submit(
                            asyncio.run,
                            self.auth_service.verify_azure_ad_token(token)
                        )
                        payload = future.result()
                else:
                    payload = asyncio.run(self.auth_service.verify_azure_ad_token(token))
                self._current_auth_result = {
                    "authenticated": True,
                    "auth_method": "azure_ad",
                    "user_info": payload
                }
        except Exception as e:
            self._current_auth_result = {
                "authenticated": False,
                "error": str(e)
            }
    
    def get_auth_result(self) -> Optional[dict]:
        """Get the current authentication result."""
        return self._current_auth_result
    
    def is_authenticated(self) -> bool:
        """Check if current request is authenticated."""
        if not self.auth_service.is_authentication_required():
            return True
        return self._current_auth_result is not None and \
               self._current_auth_result.get("authenticated", False)
    
    def before_model_callback(
        self,
        callback_context: CallbackContext,
        llm_request: LlmRequest
    ) -> Optional[LlmResponse]:
        """
        Callback executed before the model processes a request.
        Can be used to validate authentication and reject unauthenticated requests.
        
        Args:
            callback_context: The callback context.
            llm_request: The LLM request being processed.
            
        Returns:
            LlmResponse if authentication fails, None to continue processing.
        """
        if not self.auth_service.is_authentication_required():
            return None  # Continue processing
        
        if not self.is_authenticated():
            # Return an error response
            error_message = "Authentication required. Please provide a valid token."
            if self._current_auth_result and "error" in self._current_auth_result:
                error_message = f"Authentication failed: {self._current_auth_result['error']}"
            
            return LlmResponse(
                content=types.Content(
                    role="model",
                    parts=[types.Part(text=error_message)]
                )
            )
        
        return None  # Continue processing


def create_auth_callback(auth_service: AuthenticationService) -> ADKAuthCallback:
    """
    Factory function to create authentication callback.
    
    Args:
        auth_service: The authentication service instance.
        
    Returns:
        ADKAuthCallback instance.
    """
    return ADKAuthCallback(auth_service)
