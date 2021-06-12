"""
TODO module docstring
"""

from pathlib import Path

from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import FileResponse

from app.routers.authorization import get_current_user, hash_password
from app.utils.message import Message, MsgStatus
from app.utils.user_db import UserDB
from app.utils.workspace_db import WorkspaceDB
from app.routers.files import (
    Directory,
    random_filename_keep_ext,
    upload_file,
    remove_file,
    get_profile_picture_path,
)

router = APIRouter(prefix="/api/user", tags=["User Management"])
user_db = UserDB()
workspace_db = WorkspaceDB()


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
        workspace_data = workspace_db.get_workspace_data(workspace_name)
        # last_updated_data = json.loads(workspace_data["last_updated"])
        last_updated_data = workspace_data["last_updated"]

        if last_updated_data['month'] <= 9:
            last_updated_month = f"0{str(last_updated_data['month'])}"
        else:
            last_updated_month = str(last_updated_data['month'])

        if last_updated_data['day'] <= 9:
            last_updated_day = f"0{str(last_updated_data['day'])}"
        else:
            last_updated_day = str(last_updated_data['day'])

        last_updated = f"{str(last_updated_data['year'])}-{last_updated_month}-{last_updated_day}"
        result.append({"name": workspace_name, "last_updated": last_updated})

    return result


@router.get("/me", response_model=dict)
async def get_user(user: dict = Depends(get_current_user)):
    """
    TODO function docstring
    """
    return user
