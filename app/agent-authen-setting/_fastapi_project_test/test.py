from fastapi import Depends
from fastapi.routing import APIRoute
from fastapi.dependencies.utils import (
    get_dependant,
    get_flat_dependant,
    get_body_field,
    get_parameterless_sub_dependant,
)

exclude_paths = {"/docs", "/openapi.json", "/redoc", "/ui"}

for route in list(app.routes):
    if isinstance(route, APIRoute) and route.path not in exclude_paths:
        # add dependency
        route.dependencies.insert(0, Depends(verify_token))

        # rebuild dependant for endpoint
        dependant = get_dependant(
            path=route.path_format,
            call=route.endpoint,
        )

        # attach route-level dependencies correctly
        for dep in route.dependencies:
            dependant.dependencies.insert(
                0,
                get_parameterless_sub_dependant(depends=dep, path=route.path_format),
            )

        route.dependant = dependant

        # IMPORTANT: your FastAPI expects flat_dependant + embed_body_fields
        flat = get_flat_dependant(route.dependant, skip_repeats=True)

        embed = getattr(route, "embed_body_fields", getattr(route, "_embed_body_fields", False))

        route.body_field = get_body_field(
            flat_dependant=flat,
            name=route.unique_id,
            embed_body_fields=embed,
        )

### middleware/auth_middleware.py
from fastapi import Request
from fastapi.responses import JSONResponse

EXCLUDE_PREFIXES = ("/docs", "/openapi.json", "/redoc", "/ui", "/static")

@app.middleware("http")
async def require_bearer(request: Request, call_next):
    path = request.url.path
    if path == "/" or path.startswith(EXCLUDE_PREFIXES):
        return await call_next(request)

    auth = request.headers.get("authorization") or ""
    if not auth.lower().startswith("bearer "):
        return JSONResponse({"detail": "Missing Bearer token"}, status_code=401)

    token = auth.split(" ", 1)[1].strip()
    if token != "MY_SECRET_TOKEN":
        return JSONResponse({"detail": "Invalid token"}, status_code=401)

    return await call_next(request)        