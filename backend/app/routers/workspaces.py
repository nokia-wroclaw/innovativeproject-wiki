"""
TODO module docstring
"""

import json
from pathlib import Path
from re import fullmatch
from fastapi import APIRouter, Depends, HTTPException, status

from app.routers.authorization import get_current_user
from app.utils.message import Message, MsgStatus
from app.utils.user_db import UserDB
from app.utils.workspace_db import WorkspaceDB, PermissionType
from app.routers.files import clear_directory, get_document_path
from app.dependencies import Directory

router = APIRouter(prefix="/api/workspace", tags=["Workspace Management"])
workspace_db = WorkspaceDB()
user_db = UserDB()

DOCUMENT_FILE = "document.json"


@router.post("/{workspace_name}/new_folder/{folder_name}")
async def add_folder_to_virtual_structure(
    workspace_name: str, folder_name: str, virtual_path: str
) -> Message:
    """TODO function docstring"""

    if not fullmatch("[A-Za-z0-9-_]+", folder_name):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Folder name must contain only upper and lower case characters, "
            + "numbers, and symbols - or _ ",
        )

    return workspace_db.add_to_virtual_structure(
        workspace_name, folder_name, "folder", virtual_path
    )


@router.post("/{workspace_name}/remove_folder/{folder_name}")
async def remove_folder_from_virtual_structure(
    workspace_name: str, folder_name: str
) -> Message:
    """TODO function docstring"""

    return workspace_db.remove_from_virtual_structure(
        workspace_name, folder_name, "folder"
    )


def _add_new_folder(folder: dict, new_folder_name: str, level: int):
    """
    Helper function for creating folders in frontend sidebar.

    Parameters:
        folder (dict): folder to be added to
        new_folder_name (str): name of the folder to add
        level (int): how nested the new folder is

    Returns:
        (dict, int): newly created folder (or existing one if it already existed)
         and increased nesting level
    """
    # check if the folder already exists
    for child in folder["children"]:
        if child["text"] == new_folder_name:
            return child, level + 1

    new_folder = {
        "text": new_folder_name,
        "level": level,
        "open": False,
        "children": [],
    }
    folder["children"].append(new_folder)
    return new_folder, level + 1


@router.get("/tree_structure/{workspace_name}")
async def get_workspace_tree_structure(workspace_name: str) -> json:
    """
    Translates the virtual structure of a given workspace (folders and files)
    in a way that frontend app understands.

    Parameters:
        workspace_name (str): name of the workspace that needs to be translated

    Returns:
        json: a json structured in a way that frontend can use

    Raises:
        HTTPException [404]: if the config file of a workspace cannot be found
    """

    virtual_structure = workspace_db.get_workspace_data(workspace_name)[
        "virtual_structure"
    ]
    nodes = []

    for element in virtual_structure:
        name = element["name"]
        virtual_path = element["virtual_path"].split("/")[1:]
        if len(virtual_path) == 1 and virtual_path[0] == "":  # root
            if element["type"] == "folder":
                nodes.append({"text": name, "level": 0, "open": False, "children": []})
            else:
                nodes.append({"text": name, "level": 0})
        else:
            folder = None
            # check if the folder already exists
            for child in nodes:
                if child["text"] == virtual_path[0]:
                    folder = child
                    break

            if folder is None:
                first_folder = {
                    "text": virtual_path[0],
                    "level": 0,
                    "open": False,
                    "children": [],
                }
                nodes.append(first_folder)
                folder = first_folder

            level = 1
            for i in range(1, len(virtual_path)):
                folder, level = _add_new_folder(folder, virtual_path[i], level)

            if element["type"] == "folder":
                folder["children"].append(
                    {"text": name, "level": level, "open": False, "children": []}
                )
            else:
                folder["children"].append({"text": name, "level": level})
    return nodes


@router.get("/raw_structure/{workspace_name}")
async def get_workspace_raw_structure(workspace_name: str) -> json:
    """TODO function docstring"""

    return workspace_db.get_workspace_data(workspace_name)["virtual_structure"]


@router.post("/new/{workspace_name}", response_model=Message, status_code=201)
async def create_new_workspace(
    workspace_name: str, public: bool, creator: str = Depends(get_current_user)
) -> Message:
    """
    Create a new workspace and its subdirectories

    Parameters:
        workspace_name (str): name of the new workspace
        private (bool): todo
        creator (str): todo

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (409): if selected name collides with already
                             existing workspace
        HTTPException (422): if selected name is incorrect
    """

    if not fullmatch("[A-Za-z0-9-_]+", workspace_name):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Workspace name must contain only upper and lower case characters, "
            + "numbers, and symbols - or _ ",
        )

    path = (
        Path(".") / Directory.DATA.value / Directory.WORKSPACES.value / workspace_name
    )

    if path.exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Workspace with name <<{workspace_name}>> already exists",
        )

    path.mkdir()

    user_db.add_active_workspace(creator["username"], workspace_name)

    return workspace_db.add_workspace(workspace_name, creator["username"], public)


@router.post("/remove/{workspace_name}", response_model=Message, status_code=200)
async def remove_workspace(
    workspace_name: str, user: str = Depends(get_current_user)
) -> Message:
    """TODO function docstring"""

    path = (
        Path(".") / Directory.DATA.value / Directory.WORKSPACES.value / workspace_name
    )

    workspace_data = workspace_db.get_workspace_data(workspace_name)
    if user["username"] != workspace_data["creator"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Only creator of the workspace - {workspace_data['creator']}, can delete it",
        )

    clear_directory(path)
    user_db.remove_active_workspace(user["username"], workspace_name)

    return workspace_db.remove_workspace(workspace_name)


@router.post(
    "/{workspace_name}/new_document/{document_name}",
    response_model=Message,
    status_code=201,
)
async def create_new_document(
    workspace_name: str,
    document_name: str,
    virtual_path: str,
    creator: str = Depends(get_current_user),
) -> Message:
    """
    Create a new document in given workspace

    Parameters:
        workspace_name (str): name of the workspace that contains the document
        document_name (str): name of the new document
        virtual_path (str): path of the new document
        creator (str): username of the creator of the new document

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (409): if selected name collides with already
                             existing document
        HTTPException (422): if selected name is incorrect
    """

    if not fullmatch("[A-Za-z0-9-_]+", document_name):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Document name must contain only upper and lower case characters, "
            + "numbers, and symbols - or _ ",
        )

    path = (
        Path(".")
        / Directory.DATA.value
        / Directory.WORKSPACES.value
        / workspace_name
        / document_name
    )

    if path.exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Document <<{document_name}>> already exists in workspace <<{workspace_name}>>",
        )

    path.mkdir()
    (path / Directory.IMAGES.value).mkdir()
    (path / Directory.ATTACHMENTS.value).mkdir()

    empty_document = [{"type": "paragraph", "children": [{"text": " "}]}]
    with open(path / DOCUMENT_FILE, "w") as document_file:
        json.dump(empty_document, document_file, indent=4)

    workspace_db.add_to_virtual_structure(
        workspace_name, document_name, "document", virtual_path
    )

    return Message(
        status=MsgStatus.INFO,
        detail="Document created successfully",
        values={"document_name": document_name, "creator": creator},
    )


@router.post(
    "/{workspace_name}/remove_document/{document_name}",
    response_model=Message,
    status_code=200,
)
async def remove_document(
    workspace_name: str, document_name: str, user: str = Depends(get_current_user)
) -> Message:
    """TODO function docstring"""

    path = get_document_path(workspace_name, document_name)

    workspace_data = workspace_db.get_workspace_data(workspace_name)

    if user["username"] != workspace_data["creator"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Only creator of the workspace can delete it",
        )

    workspace_db.remove_from_virtual_structure(
        workspace_name, document_name, "document"
    )

    await clear_directory(path)

    return Message(status=MsgStatus.INFO, detail="Document removed successfully")


@router.post("/{workspace_name}/invite_user")
async def invite_user(
    workspace_name: str,
    invited_user: str,
    inviting_user: str = Depends(get_current_user),
) -> Message:
    """TODO function docstring"""

    workspace_data = workspace_db.get_workspace_data(workspace_name)
    if inviting_user["username"] != workspace_data["creator"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Only creator of the workspace can invite users",
        )

    if not user_db.does_user_exist(invited_user):
        return Message(status=MsgStatus.ERROR, detail="Given user doesn't exists")

    if invited_user == workspace_data["creator"]:
        return Message(status=MsgStatus.ERROR, detail="Given user is already added to workspace")

    for element in workspace_data["permissions"]:
        if element["username"] == invited_user:
            return Message(
                status=MsgStatus.ERROR,
                detail="Given user is already added to workspace",
            )

    workspace_db.change_user_permissions(
        workspace_name, invited_user, PermissionType.ALL
    )

    user_db.add_active_workspace(invited_user, workspace_name)

    return Message(status=MsgStatus.INFO, detail="User invited successfully")


@router.post("/{workspace_name}/remove_user")
async def remove_user(
    workspace_name: str,
    removed_user: str,
    removing_user: str = Depends(get_current_user),
) -> Message:
    """TODO function docstring"""

    workspace_data = workspace_db.get_workspace_data(workspace_name)
    if removing_user["username"] != workspace_data["creator"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Only creator of the workspace can remove users",
        )

    if not user_db.does_user_exist(removed_user):
        return Message(status=MsgStatus.ERROR, detail="Given user doesn't exists")

    workspace_db.remove_user_from_workspace(workspace_name, removed_user)

    user_db.remove_active_workspace(removed_user, workspace_name)

    return Message(status=MsgStatus.INFO, detail="User removed successfully")


@router.get("/{workspace_name}/get_contributors")
async def get_all_contributors(workspace_name: str) -> Message:
    """TODO function docstring"""

    workspace_data = workspace_db.get_workspace_data(workspace_name)
    all_contributors = workspace_data["permissions"]
    all_contributors.append(
        {
            "username": workspace_data["creator"],
            "permission_type": PermissionType.OWNER.value,
        }
    )

    return all_contributors
