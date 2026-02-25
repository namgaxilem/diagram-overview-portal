from typing import Optional
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

security = HTTPBearer()


class ForgeRockAuth:
    def __init__(self, client_id: str):
        self.client_id = client_id

    async def verify_token(
        self, credentials: HTTPAuthorizationCredentials = Security(security)
    ) -> dict:
        token = credentials.credentials

        try:
            payload = jwt.decode(
                token,
                options={"verify_signature": False}
            )

            token_client_id = payload.get("client_id") or payload.get("azp")

            if token_client_id != self.client_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Invalid client_id. Expected: {self.client_id}, Got: {token_client_id}",
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


def create_forgerock_dependency(client_id: str):
    auth = ForgeRockAuth(client_id)
    return auth.verify_token
