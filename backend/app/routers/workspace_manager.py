"""
TODO module docstring
"""
import csv
from pathlib import Path
from fastapi import APIRouter, HTTPException

from app.dependencies import random_filename
from app.utils.message import Message, MsgStatus

router = APIRouter(prefix="/workspace", tags=["workspaces"])

DATA_DIR = "data"
WORKSPACES_DIR = "workspaces"
DOCS_DIR = "docs"
DOC_IMGS_DIR = "imgs"
DOC_ATCHS_DIR = "atchs"

INFO_FILE = "info.csv"
CONFIG_FILE = "config.json"


def get_workspace_path(workspace_id: str = ""):
    """
    TODO function docstring
    """
    path = Path(".") / DATA_DIR / WORKSPACES_DIR / workspace_id
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Workspace with id <<{workspace_id}>> doesn't exists"
        )

    return path


def get_doc_path(workspace_id: str, doc_id: str = ""):
    """
    TODO function docstrings
    """
    workspace_path = get_workspace_path(workspace_id)

    path = workspace_path / DOCS_DIR / doc_id
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Document with id <<{doc_id}>> doesn't exists in workspace <<{workspace_id}>>"
        )

    return path


def get_doc_img_path(workspace_id: str, doc_id: str, img_id: str = ""):
    """
    TODO function docstring
    """
    doc_path = get_doc_path(workspace_id, doc_id)

    path = doc_path / DOC_IMGS_DIR / img_id
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Image with id <<{img_id}>> doesn't exists in document <<{doc_id}>>"
        )

    return path


def get_doc_atch_path(workspace_id: str, doc_id: str, atch_id: str = ""):
    """
    TODO function docstring
    """
    doc_path = get_doc_path(workspace_id, doc_id)

    path = doc_path / DOC_ATCHS_DIR / atch_id
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"There is no attachment with id \"{atch_id}\" in document \"{doc_id}\""
        )

    return path


def update_main_info_file(workspace_id: str, workspace_name: str, creator: str):
    """
    TODO function docstring
    """

    path = get_workspace_path() / INFO_FILE
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Can't find info file at {path.absolute()}"
        )

    with open(path.absolute(), "a") as file:
        writer = csv.writer(file)
        writer.writerow([workspace_id, workspace_name, creator])

    return Message(
        status=MsgStatus.INFO,
        detail="Info file updated successfuly"
    )


def update_workspace_info_file(workspace_id: str, doc_id: str, doc_name: str, creator: str):
    """
    TODO function docstring
    """

    path = get_workspace_path(workspace_id) / INFO_FILE
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Can't find info file at {path.absolute()}"
        )

    with open(path.absolute(), "a") as file:
        writer = csv.writer(file)
        writer.writerow([doc_id, doc_name, creator])

    return Message(
        status=MsgStatus.INFO,
        detail="Info file updated successfuly"
    )


@router.post("/new/{workspace_name}", response_model=Message, status_code=201)
async def create_new_workspace(workspace_name: str, creator: str):
    """
    TODO function docstring
    """

    workspace_id = random_filename()
    path = get_workspace_path() / workspace_id

    if path.exists():
        raise HTTPException(
            status_code=409,
            detail=f"Workspace with id <<{workspace_id}>> already exists"
        )

    path.mkdir()
    (path / DOCS_DIR).mkdir()

    update_main_info_file(workspace_id, workspace_name, creator)

    with open(path / INFO_FILE, "w") as info:
        writer = csv.writer(info, quoting=csv.QUOTE_ALL)
        writer.writerow(["document_id", "document_name", "creator"])

    with open(path / CONFIG_FILE, "w") as config:
        config.write("")

    return Message(
        status=MsgStatus.INFO,
        detail="Workspace created successfuly",
        values={"workspace_id": workspace_id}
    )


@router.post("/new/{workspace_id}/{doc_name}", response_model=Message, status_code=201)
async def create_new_document(workspace_id: str, doc_name: str, creator: str):
    """
    TODO function docstring
    """
    doc_id = random_filename()
    path = get_doc_path(workspace_id=workspace_id) / doc_id

    if path.exists():
        raise HTTPException(
            status_code=409,
            detail=f"Document with id <<{doc_id}>> already exists in workspace <<{workspace_id}>>"
        )

    path.mkdir()
    (path / DOC_IMGS_DIR).mkdir()
    (path / DOC_ATCHS_DIR).mkdir()

    update_workspace_info_file(workspace_id, doc_id, doc_name, creator)

    with open(path / INFO_FILE, "w") as info:
        info.write("")

    return Message(
        status=MsgStatus.INFO,
        detail="Document created successfuly",
        values={"document_id": doc_id}
    )
