"""
TODO module docstring
#slugify(txt, separator='_', regex_pattern=r'[^-a-z0-9#]+')
"""
import json
from datetime import datetime
from pathlib import Path
from re import fullmatch
from fastapi import APIRouter, Depends, HTTPException, status

from app.routers.authorization import get_current_user
from app.utils.message import Message, MsgStatus
from app.utils.user_db import UserDB
from app.routers import files

router = APIRouter(prefix="/api/workspace", tags=["Workspace Management"])
user_db = UserDB()

CONFIG_FILE = "config.json"
INFO_FILE = "info.json"
DOCUMENT_FILE = "document.json"


async def add_document_to_virtual_structure(
    workspace_name: str, document_name: str, virtual_path: str
) -> Message:
    """TODO function docstring"""

    path = files.get_workspace_path(workspace_name) / CONFIG_FILE
    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Can't find config file at {path.absolute()}",
        )

    with open(path, "r") as config_file:
        config_data = json.load(config_file)

    value = {"name": document_name, "type": "document", "virtual_path": virtual_path}

    for element in config_data["virtual_structure"]:
        if element["name"] == document_name and element["type"] == "document":
            element["virtual_path"] = virtual_path
            break
    else:
        config_data["virtual_structure"].append(value)

    with open(path, "w") as config_file:
        json.dump(config_data, config_file, indent=4)

    return Message(
        status=MsgStatus.INFO,
        detail=f"<<{workspace_name}>> virtual structure updated successfully",
    )


def clear_directory(path: Path):
    """TODO function docstring"""

    for child in path.glob("*"):
        if child.is_file():
            child.unlink()
        else:
            clear_directory(child)
    path.rmdir()


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

    path = files.get_workspace_path(workspace_name) / CONFIG_FILE
    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Can't find config file at {path.absolute()}",
        )

    with open(path, "r") as config_file:
        config_data = json.load(config_file)

    value = {"name": folder_name, "type": "folder", "virtual_path": virtual_path}

    for element in config_data["virtual_structure"]:
        if element["name"] == folder_name and element["type"] == "folder":
            element["virtual_path"] = virtual_path
            break
    else:
        config_data["virtual_structure"].append(value)

    with open(path, "w") as config_file:
        json.dump(config_data, config_file, indent=4)

    return Message(
        status=MsgStatus.INFO,
        detail=f"<<{workspace_name}>> virtual structure updated successfully",
    )


@router.post("/{workspace_name}/remove_folder/{folder_name}")
async def remove_folder_from_virtual_structure(
    workspace_name: str, folder_name: str
) -> Message:
    """TODO function docstring"""

    path = files.get_workspace_path(workspace_name) / CONFIG_FILE
    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Can't find config file at {path.absolute()}",
        )

    with open(path, "r") as config_file:
        config_data = json.load(config_file)

    for element in config_data["virtual_structure"]:
        if element["name"] == folder_name and element["type"] == "folder":
            config_data["virtual_structure"].remove(element)

    with open(path, "w") as config_file:
        json.dump(config_data, config_file, indent=4)

    return Message(
        status=MsgStatus.INFO,
        detail=f"<<{workspace_name}>> virtual structure updated successfully",
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

    path = files.get_workspace_path(workspace_name) / CONFIG_FILE
    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Can't find config file at {path.absolute()}",
        )

    with open(path, "r") as config_file:
        config_data = json.load(config_file)

    virtual_structure = config_data["virtual_structure"]

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

    path = files.get_workspace_path(workspace_name) / CONFIG_FILE
    if not path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Can't find config file at {path.absolute()}",
        )

    with open(path, "r") as config_file:
        config_data = json.load(config_file)

    return config_data["virtual_structure"]


@router.post("/new/{workspace_name}", response_model=Message, status_code=201)
async def create_new_workspace(
    workspace_name: str, private: bool, creator: str = Depends(get_current_user)
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

    path = files.get_workspace_path() / workspace_name

    if path.exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Workspace with name <<{workspace_name}>> already exists",
        )

    path.mkdir()
    (path / files.DOCUMENTS_DIR).mkdir()

    info_data = {
        "name": workspace_name,
        "private": private,
        "creator": creator["username"],
        "creation_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    with open(path / INFO_FILE, "w") as info_file:
        json.dump(info_data, info_file, indent=4)

    config_data = {"permissions": [], "virtual_structure": []}

    with open(path / CONFIG_FILE, "w") as config_file:
        json.dump(config_data, config_file, indent=4)

    user_db.add_active_workspace(creator["username"], workspace_name)

    return Message(
        status=MsgStatus.INFO,
        detail="Workspace created successfully",
        values={"workspace_name": workspace_name},
    )


@router.post("/remove/{workspace_name}", response_model=Message, status_code=200)
async def remove_workspace(
    workspace_name: str, user: str = Depends(get_current_user)
) -> Message:
    """TODO function docstring"""

    path = files.get_workspace_path(workspace_name)

    with open(path / INFO_FILE, "r") as info_file:
        info_data = json.load(info_file)

    if user["username"] != info_data["creator"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Only creator of the workspace - {info_data['creator']}, can delete it",
        )

    clear_directory(path)
    user_db.remove_active_workspace(user["username"], workspace_name)

    return Message(status=MsgStatus.INFO, detail="Workspace removed successfully")


@router.post(
    "/{workspace_name}/new_document/{document_name}", response_model=Message, status_code=201
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

    path = files.get_document_path(workspace_name) / document_name

    if path.exists():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Document <<{document_name}>> already exists in workspace <<{workspace_name}>>",
        )

    path.mkdir()
    (path / files.ATTACHMENTS_DIR).mkdir()
    (path / files.IMAGES_DIR).mkdir()

    empty_document = [{"type": "paragraph", "children": [{"text": " "}]}]
    with open(path / DOCUMENT_FILE, "w") as document_file:
        json.dump(empty_document, document_file, indent=4)

    await add_document_to_virtual_structure(workspace_name, document_name, virtual_path)

    return Message(
        status=MsgStatus.INFO,
        detail="Document created successfully",
        values={"document_name": document_name, "creator": creator},
    )


@router.post(
    "/{workspace_name}/remove_document/{document_name}", response_model=Message, status_code=200
)
async def remove_document(
    workspace_name: str, document_name: str, user: str = Depends(get_current_user)
) -> Message:
    """TODO function docstring"""

    path = files.get_workspace_path(workspace_name)

    with open(path / INFO_FILE, "r") as info_file:
        info_data = json.load(info_file)

    if user["username"] != info_data["creator"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Only creator of the workspace can delete it",
        )

    path = files.get_workspace_path(workspace_name) / CONFIG_FILE
    with open(path, "r") as config_file:
        config_data = json.load(config_file)

    for document in config_data["virtual_structure"]:
        if document["name"] == document_name:
            config_data["virtual_structure"].remove(document)

    with open(path, "w") as config_file:
        json.dump(config_data, config_file, indent=4)

    path = files.get_document_path(workspace_name, document_name)
    clear_directory(path)

    return Message(status=MsgStatus.INFO, detail="Document removed successfully")
