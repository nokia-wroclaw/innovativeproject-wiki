"""
TODO module docstring
#slugify(txt, separator='_', regex_pattern=r'[^-a-z0-9#]+')
"""
import csv
import json
from datetime import datetime
from pathlib import Path
from slugify import slugify
from fastapi import APIRouter, HTTPException

from app.utils.message import Message, MsgStatus

router = APIRouter(prefix="/workspace", tags=["workspaces"])

DATA_DIR = "data"
WORKSPACES_DIR = "workspaces"
DOCS_DIR = "docs"
WS_IMGS_DIR = "imgs"
WS_ATCHS_DIR = "atchs"

WORKSPACE_LIST_FILE = "list.csv"
INFO_FILE = "info.json"


def get_workspace_path(workspace_name: str = ""):
    """
    Returns path to directory of workspace with given name.
    If no argument is given - returns path to workspaces collective directory.

    Path schema (when workspace name is specified):
        /.../workspaces/{workspace_name}

    Path schema (when workspace name is not specified):
        /.../workspaces

    Parameters:
        workspace_name (str, optional): name of the workspace to locate

    Returns:
        Path: path to the specified workspace

    Raises:
        HTTPException [404]: if workspace with given name doesn't exist
    """

    path = Path(".") / DATA_DIR / WORKSPACES_DIR / workspace_name
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Workspace with name <<{workspace_name}>> doesn't exist",
        )

    return path


def get_document_path(workspace_name: str, doc_name: str = ""):
    """
    Returns path to directory of document with given name.
    If no argument is given - returns path to documents collective directory.

    Path schema (when document name is specified):
        /.../workspaces/{workspace_name}/docs/{doc_name}

    Path schema (when document name is not specified):
        /.../workspaces/{workspace_name}/docs

    Parameters:
        workspace_name (str): name of the workspace that contains the document
        doc_name (str, optional): name of the document to locate

    Returns:
        Path: path to the specified document

    Raises:
        HTTPException [404]: if document with given name doesn't exist
    """

    workspace_path = get_workspace_path(workspace_name)

    path = workspace_path / DOCS_DIR / doc_name
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Document with name <<{doc_name}>> doesn't exist in workspace <<{workspace_name}>>",
        )

    return path


def get_image_path(workspace_name: str, img: str = ""):
    """
    Returns path to image file with given name.
    If no argument is given - returns path to images collective directory.

    Path schema (when image name is specified):
        /.../workspaces/{workspace_id}/imgs/{img}

    Path schema (when image name is not specified):
        /.../workspaces/{workspace_id}/imgs

    Parameters:
        workspace_name (str): name of the workspace that contains the image file
        img (str, optional): name of the image file to locate (with extension)

    Returns:
        Path: path to the specified image file

    Raises:
        HTTPException [404]: if image with given name doesn't exist
    """

    workspace_path = get_workspace_path(workspace_name)

    path = workspace_path / WS_IMGS_DIR / img
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Image with name <<{img}>> doesn't exist in workspace <<{workspace_name}>>",
        )

    return path


def get_attachment_path(workspace_name: str, atch: str = ""):
    """
    Returns path to attachment file with given name.
    If no argument is given - returns path to attachments collective directory.

    Path schema (when attachment name is specified):
        /.../workspaces/{workspace_id}/atchs/{atch}

    Path schema (when attachment name is not specified):
        /.../workspaces/{workspace_id}/atchs

    Parameters:
        workspace_name (str): name of the workspace that contains the document
        img (str, optional): name of the attachment file to locate (with extension)

    Returns:
        Path: path to the specified attachment file

    Raises:
        HTTPException [404]: if attachment with given name doesn't exist
    """

    workspace_path = get_workspace_path(workspace_name)

    path = workspace_path / WS_ATCHS_DIR / atch
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Attachment with name <<{atch}>> doesn't exist in workspace <<{workspace_name}>>",
        )

    return path


def append_new_workspace_to_list(workspace_name: str):
    """
    Append a new entry (row) to the file listing all workspaces in the application.

    Parameters:
        workspace_name (str): name of the newly created workspace

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (404): if the info file cannot be located
    """

    path = get_workspace_path() / WORKSPACE_LIST_FILE
    if not path.exists():
        raise HTTPException(
            status_code=404, detail=f"Can't find info file at {path.absolute()}"
        )

    with open(path.absolute(), "a") as file:
        writer = csv.writer(file)
        writer.writerow([workspace_name, "admin", datetime.today().strftime('%Y-%m-%d')])

    return Message(status=MsgStatus.INFO, detail="Info file updated successfuly")


def append_new_document_to_info(workspace_name: str, doc_name: str):
    """
    Append a new entry (row) to the file listing all documents in the workspace.

    Parameters:
        workspace_name (str): name of the workspace that contains the created document
        doc_name (str): name of the newly created document

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (404): if the info file cannot be located
    """

    path = get_workspace_path(workspace_name) / INFO_FILE
    if not path.exists():
        raise HTTPException(
            status_code=404, detail=f"Can't find info file at {path.absolute()}"
        )

    return Message(status=MsgStatus.INFO, detail="Info file updated successfuly")


@router.post("/new/{workspace_name}", response_model=Message, status_code=201)
async def create_new_workspace(workspace_name: str):
    """
    Create a new workspace and its subdirectories

    Parameters:
        workspace_name (str): name of the new workspace

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (409): if selected name collides with already
                             existing workspace
    """

    path = get_workspace_path() / workspace_name

    if path.exists():
        raise HTTPException(
            status_code=409,
            detail=f"Workspace with name <<{workspace_name}>> already exists",
        )

    path.mkdir()
    (path / DOCS_DIR).mkdir()
    (path / WS_IMGS_DIR).mkdir()
    (path / WS_ATCHS_DIR).mkdir()

    append_new_workspace_to_list(workspace_name)

    data = {"structure" : []}
    with open(path / INFO_FILE, "w") as structure:
        json.dump(data, structure)

    return Message(
        status=MsgStatus.INFO,
        detail="Workspace created successfuly",
        values={"workspace_name": workspace_name},
    )


@router.post("/new/{workspace_name}/{doc_name}", response_model=Message, status_code=201)
async def create_new_document(workspace_name: str, doc_name: str, virtual_path: str = ""):
    """
    Create a new document in given workspace

    Parameters:
        workspace_name (str): name of the workspace that contains the document
        doc_name (str): name of the new document

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (409): if selected name collides with already
                             existing document
    """

    path = get_workspace_path(workspace_name) / DOCS_DIR / doc_name

    if path.exists():
        raise HTTPException(
            status_code=409,
            detail=f"Document with name <<{doc_name}>> already exists in workspace <<{workspace_name}>>",
        )

    path.mkdir()

    append_new_document_to_info(workspace_name, doc_name)

    return Message(
        status=MsgStatus.INFO,
        detail="Document created successfuly",
        values={"document_name": doc_name},
    )
