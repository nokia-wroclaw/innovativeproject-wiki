"""
TODO module docstring
"""

import time
import hashlib
import os
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse

router = APIRouter()


# def new_filename(filename: str):
#     """
#     TODO function docstring
#     """
#     _, ext = os.path.splitext(filename)

#     return random_filename(lenght=16, endwith=ext)


# async def upload_file(file: UploadFile, path: str):
#     """
#     TODO function docstring
#     """
#     contents = await file.read()
#     file.close()
#     with open(path, "w+b") as new_file:
#         new_file.write(contents)

#     return {"Result": "Success", "File path": path}


# @router.post("/uploadfile/{workspace_id}/{doc_id}/img", tags=["files"])
# async def upload_img(workspace_id: str, doc_id: str, file: UploadFile = File(...)):
#     """
#     TODO function docstring
#     """
#     path = paths["page_img"].format(workspace_id=workspace_id, doc_id=doc_id)
#     + new_filename(file.filename)
#     return await upload_file(file, path)


# @router.post("/uploadfile/{doc_id}/atch", tags=["files"])
# async def upload_atch(doc_id: str, file: UploadFile = File(...)):
#     """
#     TODO function docstring
#     """
#     path = DOC_ATCH_DIR.format(id=doc_id) + new_file_name(file.filename)
#     return await upload_file(file, path)


# @router.get("/files/{doc_id}/img/{img_id}", tags=["files"])
# async def get_img(doc_id: str, img_id: str):
#     """
#     TODO function docstring
#     """
#     path = DOC_IMG_DIR.format(id=doc_id) + img_id
#     return FileResponse(path)


# @router.get("/files/{doc_id}/atch/{atch_id}", tags=["files"])
# async def get_atch(doc_id: str, atch_id: str):
#     """
#     TODO function docstring
#     """
#     path = DOC_ATCH_DIR.format(id=doc_id) + atch_id
#     return FileResponse(path)
