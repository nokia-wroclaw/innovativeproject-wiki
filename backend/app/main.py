"""
This is module docstring.
Main module that runs basic fast api app.
"""
from fastapi import FastAPI, HTTPException
from fastapi.responses import PlainTextResponse

from app.routers import authorization, files, workspaces, users

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
app.include_router(authorization.router)
app.include_router(files.router)
app.include_router(workspaces.router)
app.include_router(users.router)


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
