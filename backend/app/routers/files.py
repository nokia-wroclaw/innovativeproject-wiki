"""
TODO module docstring
"""

from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import FileResponse

from app.dependencies import Directory, random_filename_keep_ext
from app.utils.message import Message, MsgStatus

router = APIRouter(prefix="/api/files", tags=["Files Management"])


def check_files_integrity():
    """
    TODO docstring
    """

    paths = [
        Path(".") / Directory.DATA.value,
        Path(".") / Directory.DATA.value / Directory.USERS.value,
        Path(".")
        / Directory.DATA.value
        / Directory.USERS.value
        / Directory.PROFILE_PICTURES.value,
        Path(".") / Directory.DATA.value / Directory.WORKSPACES.value,
    ]

    for path in paths:
        if not path.exists():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Can't find catalog {path.absolute()}",
            )


def get_document_path(workspace_name: str, document_name: str) -> Path:
    """
    TODO docstring
    """

    path = (
        Path(".")
        / Directory.DATA.value
        / Directory.WORKSPACES.value
        / workspace_name
        / document_name
    )

    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with name <<{document_name}>>"
            + f" doesn't exist in workspace <<{workspace_name}>>",
        )

    return path


def get_image_path(workspace_name: str, document_name: str, image_name: str) -> Path:
    """
    TODO docstring
    """

    path = (
        get_document_path(workspace_name, document_name)
        / Directory.IMAGES.value
        / image_name
    )

    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image with name <<{image_name}>>"
            + f"doesn't exist in document <<{document_name}>>",
        )

    return path


def get_attachment_path(
    workspace_name: str, document_name: str, attachment_name: str
) -> Path:
    """
    TODO docstring
    """

    path = (
        get_document_path(workspace_name, document_name)
        / Directory.ATTACHMENTS.value
        / attachment_name
    )

    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Attachment with name <<{attachment_name}>>"
            + f" doesn't exist in document <<{document_name}>>",
        )

    return path


def get_profile_picture_path(profile_picture: str) -> Path:
    """
    TODO docstring
    """

    path = (
        Path(".")
        / Directory.DATA.value
        / Directory.USERS.value
        / Directory.PROFILE_PICTURES.value
        / profile_picture
    )

    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Profile picture with name <<{profile_picture}>> doesn't exist",
        )

    return path


async def clear_directory(path: Path):
    """TODO function docstring"""

    for child in path.glob("*"):
        if child.is_file():
            child.unlink()
        else:
            clear_directory(child)
    path.rmdir()


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

    return Message(status=MsgStatus.ERROR, detail="No such file at given path")


@router.post("/upload/{workspace_name}/{document_name}/img")
async def upload_image(
    workspace_name: str, document_name: str, file: UploadFile = File(...)
):
    """
    TODO function docstring
    """

    path = (
        get_document_path(workspace_name, document_name)
        / Directory.IMAGES.value
        / random_filename_keep_ext(file.filename)
    )

    return await upload_file(file, path)


@router.post("/upload/{workspace_name}/{document_name}/atch")
async def upload_attachment(
    workspace_name: str, document_name: str, file: UploadFile = File(...)
):
    """
    TODO function docstring
    """

    path = (
        get_document_path(workspace_name, document_name)
        / Directory.ATTACHMENTS.value
        / random_filename_keep_ext(file.filename)
    )

    return await upload_file(file, path)


@router.get("/{workspace_name}/{document_name}/img/{image_name}")
async def get_image(workspace_name: str, document_name: str, image_name: str):
    """
    TODO function docstring
    """

    path = get_image_path(workspace_name, document_name, image_name)
    return FileResponse(path)


@router.get("/{workspace_name}/{document_name}/atch/{attachment_name}")
async def get_attachment(workspace_name: str, document_name: str, attachment_name: str):
    """
    TODO function docstring
    """

    path = get_attachment_path(workspace_name, document_name, attachment_name)
    return FileResponse(path)
