"""
TODO module docstring
"""

import time
import hashlib
import os
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse

from app.routers.workspace_manager import get_doc_img_path, get_doc_atch_path
from app.dependencies import random_filename
from app.utils.message import Message, MsgStatus

router = APIRouter()


def random_filename_with_ext(filename: str):
    """
    TODO function docstring
    """

    _, ext = os.path.splitext(filename)
    return random_filename(lenght=16, endwith=ext)


async def upload_file(file: UploadFile, path: str):
    """
    TODO function docstring
    """

    contents = await file.read()
    file.close()
    with open(path, "w+b") as new_file:
        new_file.write(contents)

    return Message(
        status=MsgStatus.INFO,
        detail="File uploaded successfuly",
        values={"upload_path": path}
    )


@router.post("/uploadfile/{workspace_id}/{doc_id}/img", tags=["files"])
async def upload_img(workspace_id: str, doc_id: str, file: UploadFile = File(...)):
    """
    TODO function docstring
    """

    path = get_doc_img_path(workspace_id, doc_id) / random_filename_with_ext(file.filename)
    return await upload_file(file, path.absolute())


@router.post("/uploadfile/{workspace_id}/{doc_id}/atch", tags=["files"])
async def upload_atch(workspace_id: str, doc_id: str, file: UploadFile = File(...)):
    """
    TODO function docstring
    """

    path = get_doc_atch_path(workspace_id, doc_id) / random_filename_with_ext(file.filename)
    return await upload_file(file, path.absolute())


@router.get("/files/{workspace_id}/{doc_id}/img/{img_id}", tags=["files"])
async def get_img(workspace_id: str, doc_id: str, img_id: str):
    """
    TODO function docstring
    """

    path = get_doc_img_path(workspace_id, doc_id, img_id)
    return FileResponse(path.absolute())


@router.get("/files/{workspace_id}/{doc_id}/atch/{atch_id}", tags=["files"])
async def get_atch(workspace_id: str, doc_id: str, atch_id: str):
    """
    TODO function docstring
    """

    path = get_doc_atch_path(workspace_id, doc_id, atch_id)
    return FileResponse(path.absolute())
