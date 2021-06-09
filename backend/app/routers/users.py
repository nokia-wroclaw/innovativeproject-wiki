"""
TODO module docstring
"""

from pathlib import Path

from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import FileResponse

from app.routers.authorization import get_current_user, hash_password
from app.utils.message import Message, MsgStatus
from app.utils.user_db import UserDB
from app.routers.files import (
    Directory,
    random_filename_keep_ext,
    upload_file,
    remove_file,
    get_profile_picture_path,
)

router = APIRouter(prefix="/api/user", tags=["User Management"])
user_db = UserDB()


@router.post("/update_data")
async def change_user_authentication_data(
    new_data: dict, user: dict = Depends(get_current_user)
):
    """TODO function docstring"""

    for field in new_data:
        if field == "password":
            user_db.edit_user_data(
                user["username"], "password_hash", hash_password(new_data[field])
            )
        else:
            user_db.edit_user_data(user["username"], field, new_data[field])

    return Message(status=MsgStatus.INFO, detail="User data updated successfully")


@router.post("/profile_picture")
async def change_user_profile_picture(
    new_picture: UploadFile = File(...), user: dict = Depends(get_current_user)
):
    """TODO function docstring"""

    old_filename = (
        user["profile_picture"] if user["profile_picture"] is not None else ""
    )
    new_filename = random_filename_keep_ext(new_picture.filename)

    old_path = get_profile_picture_path(old_filename)
    new_path = (
        Path(".")
        / Directory.DATA.value
        / Directory.USERS.value
        / Directory.PROFILE_PICTURES.value
        / new_filename
    )

    user_db.edit_user_data(user["username"], "profile_picture", new_filename)

    if old_filename != "":
        await remove_file(old_path)

    await upload_file(new_picture, new_path)


@router.get("/profile_picture")
async def get_user_profile_picture(user: dict = Depends(get_current_user)):
    """TODO function docstring"""

    filename = user["profile_picture"]
    path = get_profile_picture_path(filename if filename is not None else "default.png")

    return FileResponse(path.absolute())


@router.get("/active_workspaces")
async def get_all_user_workspaces(user: dict = Depends(get_current_user)) -> list:
    """TODO function docstring"""

    result = []
    active_workspaces = user_db.get_user_data(user["username"])["active_workspaces"]

    for workspace_name in active_workspaces:
        result.append({"name": workspace_name, "last_updated": "TODO"})

    return result


@router.get("/me", response_model=dict)
async def get_user(user: dict = Depends(get_current_user)):
    """
    TODO function docstring
    """
    return user
