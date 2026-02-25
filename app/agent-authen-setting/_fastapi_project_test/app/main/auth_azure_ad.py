from typing import List, Optional
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer()


class AzureADAuth:
    def __init__(self, allowed_groups: List[str]):
        self.allowed_groups = allowed_groups

    async def verify_token(
        self, credentials: HTTPAuthorizationCredentials = Security(security)
    ) -> dict:
        token = credentials.credentials

        try:
            payload = jwt.decode(
                token,
                options={"verify_signature": False}
            )

            user_groups = payload.get("groups", [])

            if not any(group in self.allowed_groups for group in user_groups):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"User not in allowed groups. Required groups: {self.allowed_groups}",
                )

            return payload

        except JWTError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid authentication token: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Authentication error: {str(e)}",
                headers={"WWW-Authenticate": "Bearer"},
            )


def create_azure_ad_dependency(allowed_groups: List[str]):
    auth = AzureADAuth(allowed_groups)
    return auth.verify_token
