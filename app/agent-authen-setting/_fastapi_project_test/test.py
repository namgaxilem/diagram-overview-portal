# auth_service.py
from fastapi import HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials

# keep your existing HTTP_BEARER + verify_token(...) as-is

def verify_token_string(token: str) -> dict:
    # put your real validation here
    if token != "MY_SECRET_TOKEN":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing token",
        )
    return {"token": token}

def verify_authorization_header(auth_header: str | None) -> dict:
    # Parse "Authorization: Bearer <token>"
    if not auth_header:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    parts = auth_header.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid Authorization scheme")

    token = parts[1].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    return verify_token_string(token)

# run.py
from fastapi import Request
from fastapi.responses import JSONResponse
from auth_service import verify_authorization_header

EXCLUDE_PREFIXES = ("/docs", "/openapi.json", "/redoc", "/ui", "/static")
EXCLUDE_EXACT = {"/"}  # optional

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    path = request.url.path

    if path in EXCLUDE_EXACT or path.startswith(EXCLUDE_PREFIXES):
        return await call_next(request)

    try:
        verify_authorization_header(request.headers.get("authorization"))
    except Exception as e:
        # if it's FastAPI HTTPException, it has status_code/detail
        status_code = getattr(e, "status_code", 401)
        detail = getattr(e, "detail", "Unauthorized")
        return JSONResponse({"detail": detail}, status_code=status_code)

    return await call_next(request)