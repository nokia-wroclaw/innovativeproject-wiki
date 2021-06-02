"""
TODO module docstring
"""

import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import FileResponse

from app.dependencies import random_filename
from app.utils.message import Message, MsgStatus

router = APIRouter(prefix="/api/files", tags=["Files Management"])

DATA_DIR = "data"
WORKSPACES_DIR = "workspaces"
USERS_DIR = "users"
DOCUMENTS_DIR = "docs"
IMAGES_DIR = "imgs"
ATTACHMENTS_DIR = "atchs"
PROFILE_PICTURES_DIR = "profile_pictures"


def get_workspace_path(workspace_name: str = "") -> Path:
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Workspace with name <<{workspace_name}>> doesn't exist",
        )

    return path


def get_document_path(workspace_name: str, doc_name: str = "") -> Path:
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

    path = workspace_path / DOCUMENTS_DIR / doc_name
    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with name <<{doc_name}>>"
            + f" doesn't exist in workspace <<{workspace_name}>>",
        )

    return path


def get_image_path(
    workspace_name: str, document_name: str, img: str = ""
) -> Path:
    """
    Returns path to image file with given name.
    If no argument is given - returns path to images collective directory.

    Path schema (when image name is specified):
        /.../workspaces/{workspace_id}/imgs/{img}

    Path schema (when image name is not specified):
        /.../workspaces/{workspace_id}/imgs

    Parameters:
        workspace_name (str): name of the workspace that contains the document
        document_name (str): name of the document that contains the image file
        img (str, optional): name of the image file to locate (with extension)

    Returns:
        Path: path to the specified image file

    Raises:
        HTTPException [404]: if image with given name doesn't exist
    """

    document_path = get_document_path(workspace_name, document_name)

    path = document_path / IMAGES_DIR / img
    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image with name <<{img}>> doesn't exist in workspace <<{workspace_name}>>",
        )

    return path


def get_attachment_path(
    workspace_name: str, document_name: str, atch: str = ""
) -> Path:
    """
    Returns path to attachment file with given name.
    If no argument is given - returns path to attachments collective directory.

    Path schema (when attachment name is specified):
        /.../workspaces/{workspace_id}/atchs/{atch}

    Path schema (when attachment name is not specified):
        /.../workspaces/{workspace_id}/atchs

    Parameters:
        workspace_name (str): name of the workspace that contains the document
        document_name (str): name of the document that contains the attachment file
        atch (str, optional): name of the attachment file to locate (with extension)

    Returns:
        Path: path to the specified attachment file

    Raises:
        HTTPException [404]: if attachment with given name doesn't exist
    """

    document_path = get_document_path(workspace_name, document_name)

    path = document_path / ATTACHMENTS_DIR / atch
    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attachment with name <<{atch}>>"
            + f" doesn't exist in workspace <<{workspace_name}>>",
        )

    return path


def get_profile_picture_path(profile_picture: str = "") -> Path:
    """
    Returns path to given profile picture.
    If no argument is given - returns path to profile pictures collective directory.

    Path schema (when profile picture name is specified):
        /.../users/profile_pictures/{profile_picture}

    Path schema (when attachment name is not specified):
        /.../users/profile_pictures

    Parameters:
        profile_picture (str, optional): name of the profile picture to locate (with extension)

    Returns:#/cified profile picture

    Raises:
        HTTPException [404]: if profile picture with given name doesn't exist
    """

    path = Path(".") / DATA_DIR / USERS_DIR / PROFILE_PICTURES_DIR / profile_picture

    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Profile picture with name <<{profile_picture}>> doesn't exist",
        )

    return path


def random_filename_with_ext(filename: str):
    """
    TODO function docstring
    """

    _, ext = os.path.splitext(filename)
    return random_filename(length=16, endwith=ext)


async def upload_file(file: UploadFile, path: Path):
    """
    TODO function docstring
    """

    contents = await file.read()
    await file.close()
    with open(path, "w+b") as new_file:
        new_file.write(contents)

    return Message(
        status=MsgStatus.INFO,
        detail="File uploaded successfuly",
        values={"upload_path": path},
    )


async def remove_file(path: Path):
    """
    TODO function docstring
    """

    if path.exists():
        path.unlink()

        return Message(status=MsgStatus.INFO, detail="File removed successfuly")

    return Message(status=MsgStatus.ERROR, detail="No such file at given directory")


@router.post("/upload/{workspace_id}/{doc_id}/img")
async def upload_img(workspace_id: str, doc_id: str, file: UploadFile = File(...)):
    """
    TODO function docstring
    """

    path = get_image_path(workspace_id, doc_id) / random_filename_with_ext(
        file.filename
    )
    return await upload_file(file, path.absolute())


@router.post("/upload/{workspace_id}/{doc_id}/atch")
async def upload_atch(workspace_id: str, doc_id: str, file: UploadFile = File(...)):
    """
    TODO function docstring
    """

    path = get_attachment_path(workspace_id, doc_id) / random_filename_with_ext(
        file.filename
    )
    return await upload_file(file, path.absolute())


@router.get("/{workspace_id}/{doc_id}/img/{img_id}")
async def get_img(workspace_id: str, doc_id: str, img_id: str):
    """
    TODO function docstring
    """

    path = get_image_path(workspace_id, doc_id, img_id)
    return FileResponse(path.absolute())


@router.get("/{workspace_id}/{doc_id}/atch/{atch_id}")
async def get_atch(workspace_id: str, doc_id: str, atch_id: str):
    """
    TODO function docstring
    """

    path = get_attachment_path(workspace_id, doc_id, atch_id)
    return FileResponse(path.absolute())
