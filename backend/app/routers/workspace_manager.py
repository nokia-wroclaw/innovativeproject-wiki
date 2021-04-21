"""
TODO module docstring
"""
import json
from pathlib import Path
from fastapi import APIRouter

from app.dependencies import random_filename

router = APIRouter()

DATA_DIR = "data"
WORKSPACES_DIR = "workspaces"
DOCS_DIR = "docs"
DOC_IMGS_DIR = "imgs"
DOC_ATCHS_DIR = "atchs"

INFO_FILE = "info.json"
CONFIG_FILE = "config.json"


def get_workspace_path(workspace_id: str = ""):
    """
    TODO function docstring
    """
    path = Path(".")/DATA_DIR/WORKSPACES_DIR/workspace_id
    return path if path.exists else None


def get_doc_path(workspace_id: str, doc_id: str = ""):
    """
    TODO function docstrings
    """
    workspace_path = get_workspace_path(workspace_id)
    if workspace_path is None:
        return None

    path = workspace_path/DOCS_DIR/doc_id
    return path if path.exists else None


def get_doc_img_path(workspace_id: str, doc_id: str, img_id: str = ""):
    """
    TODO function docstring
    """
    doc_path = get_doc_path(workspace_id, doc_id)
    if doc_path is None:
        return None

    path = doc_path/DOC_IMGS_DIR/img_id
    return path if path.exists else None


def get_doc_atch_path(workspace_id: str, doc_id: str, atch_id: str = ""):
    """
    TODO function docstring
    """
    doc_path = get_doc_path(workspace_id, doc_id)
    if doc_path is None:
        return None

    path = doc_path/DOC_ATCHS_DIR/atch_id
    return path if path.exists else None

@router.post("/workspace/new/{workspace_name}", tags=["workspaces"])
async def create_new_workspace(workspace_name: str, creator_username: str):
    """
    TODO function docstring
    """
    workspace_path = get_workspace_path() / random_filename()

    workspace_path.mkdir()
    (workspace_path / DOCS_DIR).mkdir()

    with open(workspace_path/INFO_FILE, 'w') as info:
        info.write("")

    with open(workspace_path/CONFIG_FILE, 'w') as config:
        config.write("")

    return 0
