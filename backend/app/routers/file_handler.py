"""
TODO module docstring
"""

import os
from fastapi import APIRouter, UploadFile

from app.dependencies import random_filename
from app.utils.message import Message, MsgStatus

router = APIRouter()


def random_filename_with_ext(filename: str):
    """
    TODO function docstring
    """

    _, ext = os.path.splitext(filename)
    return random_filename(length=16, endwith=ext)


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
        values={"upload_path": path},
    )
