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
    Returns path to directory of workspace with given id.
    If no argument is given - returns path to workspaces collective directory.

    Path schema (when workspace id is specified):
        /.../workspaces/{workspace_id}

    Path schema (when workspace id is not specified):
        /.../workspaces

    Parameters:
        workspace_id (str, optional): id of the workspace to locate

    Returns:
        Path: path to the specified workspace

    Raises:
        HTTPException [404]: if workspace with given id doesn't exist
    """

    path = Path(".") / DATA_DIR / WORKSPACES_DIR / workspace_id
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Workspace with id <<{workspace_id}>> doesn't exist",
        )

    return path


def get_doc_path(workspace_id: str, doc_id: str = ""):
    """
    Returns path to directory of document with given id.
    If no argument is given - returns path to documents collective directory.

    Path schema (when document id is specified):
        /.../workspaces/{workspace_id}/docs/{doc_id}

    Path schema (when document id is not specified):
        /.../workspaces/{workspace_id}/docs

    Parameters:
        workspace_id (str): id of the workspace that contains the document
        doc_id (str, optional): id of the document to locate

    Returns:
        Path: path to the specified document

    Raises:
        HTTPException [404]: if document with given id doesn't exist
    """

    workspace_path = get_workspace_path(workspace_id)

    path = workspace_path / DOCS_DIR / doc_id
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Document with id <<{doc_id}>> doesn't exist in workspace <<{workspace_id}>>",
        )

    return path


def get_doc_img_path(workspace_id: str, doc_id: str, img: str = ""):
    """
    Returns path to image file with given name.
    If no argument is given - returns path to images collective directory.

    Path schema (when image name is specified):
        /.../workspaces/{workspace_id}/docs/{doc_id}/imgs/{img}

    Path schema (when image name is not specified):
        /.../workspaces/{workspace_id}/docs/{doc_id}/imgs

    Parameters:
        workspace_id (str): id of the workspace that contains the document
        doc_id (str): id of the document that contains the image file
        img (str, optional): name of the image file to locate (with extension)

    Returns:
        Path: path to the specified image file

    Raises:
        HTTPException [404]: if image with given name doesn't exist
    """

    doc_path = get_doc_path(workspace_id, doc_id)

    path = doc_path / DOC_IMGS_DIR / img
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Image with name <<{img}>> doesn't exist in document <<{doc_id}>>",
        )

    return path


def get_doc_atch_path(workspace_id: str, doc_id: str, atch: str = ""):
    """
    Returns path to attachment file with given name.
    If no argument is given - returns path to attachments collective directory.

    Path schema (when attachment name is specified):
        /.../workspaces/{workspace_id}/docs/{doc_id}/atchs/{atch}

    Path schema (when attachment name is not specified):
        /.../workspaces/{workspace_id}/docs/{doc_id}/atchs

    Parameters:
        workspace_id (str): id of the workspace that contains the document
        doc_id (str): id of the document that contains the attachment file
        img (str, optional): name of the attachment file to locate (with extension)

    Returns:
        Path: path to the specified attachment file

    Raises:
        HTTPException [404]: if attachment with given name doesn't exist
    """

    doc_path = get_doc_path(workspace_id, doc_id)

    path = doc_path / DOC_ATCHS_DIR / atch
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Attachment with name <<{atch}>> doesn't exist in document <<{doc_id}>>",
        )

    return path


def update_main_info_file(workspace_id: str, workspace_name: str, creator: str):
    """
    Append a new entry (row) to the file listing all workspaces in the application.

    Parameters:
        workspace_id (str): id of the newly created workspace
        workspace_name (str): name of the newly created workspace
        creator (str): workspace creator username

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (404): if the info file cannot be located
    """

    path = get_workspace_path() / INFO_FILE
    if not path.exists():
        raise HTTPException(
            status_code=404, detail=f"Can't find info file at {path.absolute()}"
        )

    with open(path.absolute(), "a") as file:
        writer = csv.writer(file)
        writer.writerow([workspace_id, workspace_name, creator])

    return Message(status=MsgStatus.INFO, detail="Info file updated successfuly")


def update_workspace_info_file(
        workspace_id: str, doc_id: str, doc_name: str, creator: str):
    """
    Append a new entry (row) to the file listing all documents in the workspace.

    Parameters:
        workspace_id (str): id of the workspace that contains the created document
        doc_id (str): id of the created document
        doc_id (str): name of the created document
        creator (str): document creator username

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (404): if the info file cannot be located
    """

    path = get_workspace_path(workspace_id) / INFO_FILE
    if not path.exists():
        raise HTTPException(
            status_code=404, detail=f"Can't find info file at {path.absolute()}"
        )

    with open(path.absolute(), "a") as file:
        writer = csv.writer(file)
        writer.writerow([doc_id, doc_name, creator])

    return Message(status=MsgStatus.INFO, detail="Info file updated successfuly")


@router.post("/new/{workspace_name}", response_model=Message, status_code=201)
async def create_new_workspace(workspace_name: str, creator: str):
    """
    Create a new workspace and its subdirectories

    Parameters:
        workspace_name (str): name of the new workspace
        creator (str): workspace creator username

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (409): if generated id collides with already
                             existing workspace
    """

    workspace_id = random_filename()
    path = get_workspace_path() / workspace_id

    if path.exists():
        raise HTTPException(
            status_code=409,
            detail=f"Workspace with id <<{workspace_id}>> already exists",
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
        values={"workspace_id": workspace_id},
    )


@router.post("/new/{workspace_id}/{doc_name}", response_model=Message, status_code=201)
async def create_new_document(workspace_id: str, doc_name: str, creator: str):
    """
    Create a new document in given workspace

    Parameters:
        workspace_id (str): id of the workspace that contains the document
        doc_name (str): name of the new document
        creator (str): document creator username

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (409): if generated id collides with already
                             existing document
    """

    doc_id = random_filename()
    path = get_doc_path(workspace_id=workspace_id) / doc_id

    if path.exists():
        raise HTTPException(
            status_code=409,
            detail=f"Document with id <<{doc_id}>> already exists in workspace <<{workspace_id}>>",
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
        values={"document_id": doc_id},
    )
