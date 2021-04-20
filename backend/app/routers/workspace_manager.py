"""
TODO module docstring
"""

from fastapi import APIRouter

from app.dependencies import random_filename

router = APIRouter()


@router.post("/workspace/new/{workspace_name}", tags=["workspaces"])
async def create_new_workspace(workspace_name: str, creator_username: str):
    """
    TODO function docstring
    """
    return 0