"""
TODO module docstring
"""
from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import FileResponse

from app.routers.authorization import get_current_user, hash_password
from app.routers.files import (
    random_filename_with_ext,
    upload_file,
    remove_file,
    get_profile_picture_path,
)
from app.utils.message import Message, MsgStatus
from app.utils.user_db import UserDB

router = APIRouter(prefix="/user", tags=["User Management"])
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

    old_filename = user["profile_picture"] if user["profile_picture"] is not None else ""
    new_filename = random_filename_with_ext(new_picture.filename)

    old_path = get_profile_picture_path(old_filename)
    new_path = get_profile_picture_path() / new_filename

    user_db.edit_user_data(user["username"], "profile_picture", new_filename)

    if old_filename != "":
        await remove_file(old_path)

    await upload_file(new_picture, new_path)


@router.get("/profile_picture")
async def get_user_profile_picture(user: dict = Depends(get_current_user)):
    """TODO function docstring"""

    filename = user["profile_picture"]
    path = get_profile_picture_path(filename)

    return FileResponse(path.absolute())


@router.get("/active_workspaces")
async def get_all_user_workspaces(user: dict = Depends(get_current_user)) -> list:
    """TODO function docstring"""

    return user["active_workspaces"]
