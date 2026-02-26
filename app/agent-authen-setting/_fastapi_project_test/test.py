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