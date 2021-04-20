"""
This is module docstring.
Main module that runs basic fast api app.
"""
from fastapi import FastAPI

from app.routers import auth, file_manager, workspace_manager
from app.dependencies import get_data_paths

tags_metadata = [
    {
        "name": "users",
        "description": "Operations with users. The **login** and **register** logic is also here.",
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
app.include_router(file_manager.router)
app.include_router(workspace_manager.router)


@app.get("/connect", response_model=dict)
async def connect_test():
    """
    TODO function docstring
    """
    return {"Connected": "You are", "Path": get_data_paths()}
