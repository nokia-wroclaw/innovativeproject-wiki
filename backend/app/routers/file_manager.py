"""
TODO module docstring
"""

import time
import hashlib
import os
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse

DATA_DIR = "./data/"
DOCS_DIR = DATA_DIR + "docs/"
USERS_DIR = DATA_DIR + "users/"
DOC_IMG_DIR = DOCS_DIR + "{id!s}/img/"
DOC_ATCH_DIR = DOCS_DIR + "{id!s}/atch/"

router = APIRouter()


def new_file_name(old_filename: str):
    """
    TODO function docstring
    """
    filename = old_filename + str(time.time())
    filename = hashlib.md5(filename.encode("utf-8")).hexdigest()
    _, ext = os.path.splitext(old_filename)

    return filename + ext


async def upload_file(file: UploadFile, path: str):
    """
    TODO function docstring
    """
    contents = await file.read()
    file.close()
    with open(path, "w+b") as new_file:
        new_file.write(contents)

    return {"Result": "Success", "File path": path}


@router.post("/uploadfile/{doc_id}/img")
async def upload_img(doc_id: str, file: UploadFile = File(...)):
    """
    TODO function docstring
    """
    path = DOC_IMG_DIR.format(id=doc_id) + new_file_name(file.filename)
    return await upload_file(file, path)


@router.post("/uploadfile/{doc_id}/atch")
async def upload_atch(doc_id: str, file: UploadFile = File(...)):
    """
    TODO function docstring
    """
    path = DOC_ATCH_DIR.format(id=doc_id) + new_file_name(file.filename)
    return await upload_file(file, path)


@router.get("/files/{doc_id}/img/{img_id}")
async def get_img(doc_id: str, img_id: str):
    """
    TODO function docstring
    """
    path = DOC_IMG_DIR.format(id=doc_id) + img_id
    return FileResponse(path)


@router.get("/files/{doc_id}/atch/{atch_id}")
async def get_atch(doc_id: str, atch_id: str):
    """
    TODO function docstring
    """
    path = DOC_ATCH_DIR.format(id=doc_id) + atch_id
    return FileResponse(path)
