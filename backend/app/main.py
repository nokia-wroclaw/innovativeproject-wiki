"""
This is module docstring.
Main module that runs basic fast api app.
"""
from fastapi import FastAPI, HTTPException
from fastapi.responses import PlainTextResponse

from app.routers import auth, file_handler, workspace_manager

tags_metadata = [
    {
        "name": "auth",
        "description": "Operations with authentication. \
                        The **login** and **register** logic is here.",
    },
    {
        "name": "files",
        "description": "Manage files.",
    },
    {
        "name": "workspaces",
        "description": "Manage workspaces and their documents.",
    },
]

app = FastAPI(openapi_tags=tags_metadata)
app.include_router(auth.router)
app.include_router(file_handler.router)
app.include_router(workspace_manager.router)


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """
    TODO function docstring
    """
    _ = request  # Change this later
    return PlainTextResponse(exc.detail, status_code=exc.status_code)


@app.get("/connect", response_model=dict)
async def connect_test():
    """
    TODO function docstring
    """

    return {"Connected": "You are"}
