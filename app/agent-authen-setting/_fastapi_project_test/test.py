from fastapi import Depends
from fastapi.routing import APIRoute
from fastapi.dependencies.utils import (
    get_dependant,
    get_body_field,
    get_parameterless_sub_dependant,
)

exclude_paths = {"/docs", "/openapi.json", "/redoc", "/ui"}

for route in list(app.routes):
    if isinstance(route, APIRoute) and route.path not in exclude_paths:
        # 1) add your dependency the supported way
        route.dependencies.insert(0, Depends(verify_token))

        # 2) rebuild dependant (FastAPI doesn't take dependencies=... here)
        dependant = get_dependant(
            path=route.path_format,
            call=route.endpoint,
        )

        # 3) attach route-level dependencies properly (as Dependant objects)
        for dep in route.dependencies:
            dependant.dependencies.insert(
                0,
                get_parameterless_sub_dependant(
                    depends=dep,
                    path=route.path_format,
                ),
            )

        route.dependant = dependant

        # 4) rebuild body_field for docs/request parsing
        route.body_field = get_body_field(dependant=route.dependant, name=route.unique_id)