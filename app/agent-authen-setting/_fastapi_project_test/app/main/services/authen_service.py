from typing import Optional, List
from fastapi import HTTPException, Request, status
from jose import jwt, JWTError


class AuthenticationService:
    """
    Centralized authentication service that handles both Azure AD and ForgeRock authentication.
    Supports enabling both methods simultaneously or independently.
    """

    def __init__(self, config: dict):
        """
        Initialize authentication service with configuration.
        
        Args:
            config: Dictionary containing authentication configuration
                {
                    "azureAD": {"groups": [...], "enabled": bool},
                    "forgeRock": {"clientId": "...", "enabled": bool}
                }
        """
        self.config = config
        self.azure_ad_enabled = config.get("azureAD", {}).get("enabled", False)
        self.azure_ad_groups = config.get("azureAD", {}).get("groups", [])
        self.forgerock_enabled = config.get("forgeRock", {}).get("enabled", False)
        self.forgerock_client_id = config.get("forgeRock", {}).get("clientId", "")

    def is_authentication_required(self) -> bool:
        """Check if any authentication method is enabled."""
        return self.azure_ad_enabled or self.forgerock_enabled

    def extract_token_from_header(self, authorization: Optional[str]) -> tuple[Optional[str], str]:
        """
        Extract token from Authorization header and determine auth type.
        
        Returns:
            tuple: (token, auth_type) where auth_type is 'bearer' or 'azure'
        """
        if not authorization:
            return None, ""

        # Check for Bearer token (ForgeRock)
        if authorization.startswith("Bearer "):
            token = authorization.replace("Bearer ", "")
            return token, "bearer"
        
        # Azure AD token (without Bearer prefix)
        return authorization, "azure"

    async def verify_azure_ad_token(self, token: str) -> dict:
        """
        Verify Azure AD token and check group membership.
        
        Args:
            token: JWT token from Azure AD
            
        Returns:
            dict: Decoded token payload
            
        Raises:
            HTTPException: If token is invalid or user not in allowed groups
        """
        try:
            # Decode token (signature verification disabled for testing)
            payload = jwt.decode(token, options={"verify_signature": False})
            
            # Check if user is in allowed groups
            user_groups = payload.get("groups", [])
            
            if not any(group in self.azure_ad_groups for group in user_groups):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"User not in allowed Azure AD groups. Required: {self.azure_ad_groups}",
                )
            
            return payload
            
        except JWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Azure AD token: {str(e)}",
                headers={"WWW-Authenticate": "Azure AD"},
            )

    async def verify_forgerock_token(self, token: str) -> dict:
        """
        Verify ForgeRock Bearer token and check client ID.
        
        Args:
            token: JWT Bearer token from ForgeRock
            
        Returns:
            dict: Decoded token payload
            
        Raises:
            HTTPException: If token is invalid or client_id doesn't match
        """
        try:
            # Decode token (signature verification disabled for testing)
            payload = jwt.decode(token, options={"verify_signature": False})
            
            # Check client_id or azp claim
            token_client_id = payload.get("client_id") or payload.get("azp")
            
            if token_client_id != self.forgerock_client_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Invalid ForgeRock client_id. Expected: {self.forgerock_client_id}, Got: {token_client_id}",
                )
            
            return payload
            
        except JWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid ForgeRock token: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )

    async def authenticate(self, request: Request) -> dict:
        """
        Main authentication method that handles both Azure AD and ForgeRock.
        
        Args:
            request: FastAPI Request object
            
        Returns:
            dict: User information from validated token
            
        Raises:
            HTTPException: If authentication fails
        """
        # Check if authentication is required
        if not self.is_authentication_required():
            return {"authenticated": False, "message": "No authentication required"}

        # Get Authorization header
        authorization = request.headers.get("Authorization")
        
        if not authorization:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing Authorization header",
                headers={"WWW-Authenticate": "Bearer or Azure AD"},
            )

        # Extract token and determine type
        token, auth_type = self.extract_token_from_header(authorization)
        
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Authorization header format",
                headers={"WWW-Authenticate": "Bearer or Azure AD"},
            )

        # Try authentication based on token type and enabled methods
        errors = []
        
        # Try ForgeRock if enabled and token has Bearer prefix
        if self.forgerock_enabled and auth_type == "bearer":
            try:
                payload = await self.verify_forgerock_token(token)
                return {
                    "authenticated": True,
                    "auth_method": "forgerock",
                    "user_info": payload
                }
            except HTTPException as e:
                errors.append(f"ForgeRock: {e.detail}")

        # Try Azure AD if enabled and token doesn't have Bearer prefix
        if self.azure_ad_enabled and auth_type == "azure":
            try:
                payload = await self.verify_azure_ad_token(token)
                return {
                    "authenticated": True,
                    "auth_method": "azure_ad",
                    "user_info": payload
                }
            except HTTPException as e:
                errors.append(f"Azure AD: {e.detail}")

        # If both are enabled, try the other method as fallback
        if self.azure_ad_enabled and self.forgerock_enabled:
            # Try Azure AD if ForgeRock failed
            if auth_type == "bearer" and self.azure_ad_enabled:
                try:
                    payload = await self.verify_azure_ad_token(token)
                    return {
                        "authenticated": True,
                        "auth_method": "azure_ad",
                        "user_info": payload
                    }
                except HTTPException as e:
                    errors.append(f"Azure AD (fallback): {e.detail}")
            
            # Try ForgeRock if Azure AD failed
            if auth_type == "azure" and self.forgerock_enabled:
                try:
                    payload = await self.verify_forgerock_token(token)
                    return {
                        "authenticated": True,
                        "auth_method": "forgerock",
                        "user_info": payload
                    }
                except HTTPException as e:
                    errors.append(f"ForgeRock (fallback): {e.detail}")

        # If we got here, authentication failed
        error_detail = "; ".join(errors) if errors else "Authentication failed"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error_detail,
            headers={"WWW-Authenticate": "Bearer or Azure AD"},
        )


def create_auth_service(config: dict) -> AuthenticationService:
    """
    Factory function to create authentication service.
    
    Args:
        config: Authentication configuration dictionary
        
    Returns:
        AuthenticationService instance
    """
    return AuthenticationService(config)
