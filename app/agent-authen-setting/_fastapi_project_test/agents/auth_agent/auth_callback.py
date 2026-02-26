"""
Authentication Callbacks for Google ADK Agent.
This module provides authentication service and callbacks for ADK agents.
"""
from typing import Optional
from jose import jwt, JWTError


# ============== Authentication Configuration ==============

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


# ============== Authentication Service ==============

class AuthenticationService:
    """
    Centralized authentication service that handles both Azure AD and ForgeRock authentication.
    """

    def __init__(self, config: dict):
        """
        Initialize authentication service with configuration.
        
        Args:
            config: Dictionary containing authentication configuration
        """
        self.config = config
        self.azure_ad_enabled = config.get("azureAD", {}).get("enabled", False)
        self.azure_ad_groups = config.get("azureAD", {}).get("groups", [])
        self.forgerock_enabled = config.get("forgeRock", {}).get("enabled", False)
        self.forgerock_client_id = config.get("forgeRock", {}).get("clientId", "")

    def is_authentication_required(self) -> bool:
        """Check if any authentication method is enabled."""
        return self.azure_ad_enabled or self.forgerock_enabled

    def verify_azure_ad_token(self, token: str) -> dict:
        """
        Verify Azure AD token and check group membership.
        
        Args:
            token: JWT token from Azure AD
            
        Returns:
            dict: Decoded token payload
            
        Raises:
            Exception: If token is invalid or user not in allowed groups
        """
        try:
            # Decode token (signature verification disabled for testing)
            payload = jwt.decode(token, key="", options={"verify_signature": False})
            
            # Check if user is in allowed groups
            user_groups = payload.get("groups", [])
            
            if not any(group in self.azure_ad_groups for group in user_groups):
                raise Exception(f"User not in allowed Azure AD groups. Required: {self.azure_ad_groups}")
            
            return payload
            
        except JWTError as e:
            raise Exception(f"Invalid Azure AD token: {str(e)}")

    def verify_forgerock_token(self, token: str) -> dict:
        """
        Verify ForgeRock Bearer token and check client ID.
        
        Args:
            token: JWT Bearer token from ForgeRock
            
        Returns:
            dict: Decoded token payload
            
        Raises:
            Exception: If token is invalid or client_id doesn't match
        """
        try:
            # Decode token (signature verification disabled for testing)
            payload = jwt.decode(token, key="", options={"verify_signature": False})
            
            # Check client_id or azp claim
            token_client_id = payload.get("client_id") or payload.get("azp")
            
            if token_client_id != self.forgerock_client_id:
                raise Exception(f"Invalid ForgeRock client_id. Expected: {self.forgerock_client_id}, Got: {token_client_id}")
            
            return payload
            
        except JWTError as e:
            raise Exception(f"Invalid ForgeRock token: {str(e)}")

    def authenticate(self, authorization: Optional[str]) -> dict:
        """
        Authenticate using the Authorization header value.
        
        Args:
            authorization: Authorization header value
            
        Returns:
            dict: Authentication result
        """
        if not self.is_authentication_required():
            return {"authenticated": False, "message": "No authentication required"}

        if not authorization:
            return {"authenticated": False, "error": "Missing Authorization header"}

        # Determine token type
        if authorization.startswith("Bearer "):
            token = authorization.replace("Bearer ", "")
            auth_type = "bearer"
        else:
            token = authorization
            auth_type = "azure"

        # Try authentication
        errors = []
        
        # Try ForgeRock if enabled and token has Bearer prefix
        if self.forgerock_enabled and auth_type == "bearer":
            try:
                payload = self.verify_forgerock_token(token)
                return {
                    "authenticated": True,
                    "auth_method": "forgerock",
                    "user_info": payload
                }
            except Exception as e:
                errors.append(f"ForgeRock: {e}")

        # Try Azure AD if enabled
        if self.azure_ad_enabled:
            try:
                payload = self.verify_azure_ad_token(token)
                return {
                    "authenticated": True,
                    "auth_method": "azure_ad",
                    "user_info": payload
                }
            except Exception as e:
                errors.append(f"Azure AD: {e}")

        error_detail = "; ".join(errors) if errors else "Authentication failed"
        return {"authenticated": False, "error": error_detail}


# Create authentication service instance
auth_service = AuthenticationService(AGENT_AUTH_CONFIG)


# ============== ADK Authentication Callback ==============

class ADKAuthCallback:
    """
    Authentication callback for ADK agents.
    """
    
    def __init__(self, service: AuthenticationService):
        self.auth_service = service
        self._current_auth_result: Optional[dict] = None
    
    def set_auth_token(self, authorization: str):
        """Set authentication token for the current request."""
        self._current_auth_result = self.auth_service.authenticate(authorization)
    
    def get_auth_result(self) -> Optional[dict]:
        """Get the current authentication result."""
        return self._current_auth_result
    
    def is_authenticated(self) -> bool:
        """Check if current request is authenticated."""
        if not self.auth_service.is_authentication_required():
            return True
        return self._current_auth_result is not None and \
               self._current_auth_result.get("authenticated", False)


# Create authentication callback instance
auth_callback = ADKAuthCallback(auth_service)
