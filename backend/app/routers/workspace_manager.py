"""
TODO module docstring
#slugify(txt, separator='_', regex_pattern=r'[^-a-z0-9#]+')
"""
import json
import os
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException

from app.routers.auth import get_current_user
from app.utils.message import Message, MsgStatus

router = APIRouter(prefix="/workspace", tags=["workspaces"])

DATA_DIR = "data"
WORKSPACES_DIR = "workspaces"
DOCUMENTS_DIR = "docs"
IMAGES_DIR = "imgs"
ATTACHMENTS_DIR = "atchs"

CONFIG_FILE = "config.json"
INFO_FILE = "info.json"
DOCUMENT_FILE = "document.json"


def get_workspace_path(workspace_name: str = "") -> Path:
    """
    Returns path to directory of workspace with given name.
    If no argument is given - returns path to workspaces collective directory.

    Path schema (when workspace name is specified):
        /.../workspaces/{workspace_name}

    Path schema (when workspace name is not specified):
        /.../workspaces

    Parameters:
        workspace_name (str, optional): name of the workspace to locate

    Returns:
        Path: path to the specified workspace

    Raises:
        HTTPException [404]: if workspace with given name doesn't exist
    """

    path = Path(".") / DATA_DIR / WORKSPACES_DIR / workspace_name
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Workspace with name <<{workspace_name}>> doesn't exist",
        )

    return path


def get_document_path(workspace_name: str, doc_name: str = "") -> Path:
    """
    Returns path to directory of document with given name.
    If no argument is given - returns path to documents collective directory.

    Path schema (when document name is specified):
        /.../workspaces/{workspace_name}/docs/{doc_name}

    Path schema (when document name is not specified):
        /.../workspaces/{workspace_name}/docs

    Parameters:
        workspace_name (str): name of the workspace that contains the document
        doc_name (str, optional): name of the document to locate

    Returns:
        Path: path to the specified document

    Raises:
        HTTPException [404]: if document with given name doesn't exist
    """

    workspace_path = get_workspace_path(workspace_name)

    path = workspace_path / DOCUMENTS_DIR / doc_name
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Document with name <<{doc_name}>>" +
                   f" doesn't exist in workspace <<{workspace_name}>>",
        )

    return path


def get_image_path(workspace_name: str, document_name: str, img: str = "") -> Path:
    """
    Returns path to image file with given name.
    If no argument is given - returns path to images collective directory.

    Path schema (when image name is specified):
        /.../workspaces/{workspace_id}/imgs/{img}

    Path schema (when image name is not specified):
        /.../workspaces/{workspace_id}/imgs

    Parameters:
        workspace_name (str): name of the workspace that contains the document
        document_name (str): name of the document that contains the image file
        img (str, optional): name of the image file to locate (with extension)

    Returns:
        Path: path to the specified image file

    Raises:
        HTTPException [404]: if image with given name doesn't exist
    """

    document_path = get_document_path(workspace_name, document_name)

    path = document_path / IMAGES_DIR / img
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Image with name <<{img}>> doesn't exist in workspace <<{workspace_name}>>",
        )

    return path


def get_attachment_path(workspace_name: str, document_name: str, atch: str = "") -> Path:
    """
    Returns path to attachment file with given name.
    If no argument is given - returns path to attachments collective directory.

    Path schema (when attachment name is specified):
        /.../workspaces/{workspace_id}/atchs/{atch}

    Path schema (when attachment name is not specified):
        /.../workspaces/{workspace_id}/atchs

    Parameters:
        workspace_name (str): name of the workspace that contains the document
        document_name (str): name of the document that contains the attachment file
        atch (str, optional): name of the attachment file to locate (with extension)

    Returns:
        Path: path to the specified attachment file

    Raises:
        HTTPException [404]: if attachment with given name doesn't exist
    """

    document_path = get_document_path(workspace_name, document_name)

    path = document_path / ATTACHMENTS_DIR / atch
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Attachment with name <<{atch}>>" +
                   f" doesn't exist in workspace <<{workspace_name}>>",
        )

    return path


async def update_virtual_structure(
        workspace_name: str, document_name: str, virtual_path: str
) -> Message:
    """TODO function docstring"""

    path = get_workspace_path(workspace_name) / CONFIG_FILE
    if not path.exists():
        raise HTTPException(
            status_code=404, detail=f"Can't find config file at {path.absolute()}"
        )

    with open(path, "r") as config_file:
        config_data = json.load(config_file)

    value = {"name": document_name, "virtual_path": virtual_path}

    for document in config_data["virtual_structure"]:
        if document["name"] == document_name:
            document["virtual_path"] = virtual_path
            break
    else:
        config_data["virtual_structure"].append(value)

    with open(path, "w") as config_file:
        json.dump(config_data, config_file, indent=4)

    return Message(
        status=MsgStatus.INFO,
        detail=f"<<{workspace_name}>> virtual structure updated successfully"
    )


def _add_new_folder(folder: dict, new_folder_name: str, level: int) -> (dict, int):
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
        "children": []
    }
    folder["children"].append(new_folder)
    return new_folder, level + 1


@router.get("/translate/{workspace_name}")
async def translate_workspace_virtual_structure_to_frontend(workspace_name: str) -> json:
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

    path = get_workspace_path(workspace_name) / CONFIG_FILE
    if not path.exists():
        raise HTTPException(
            status_code=404, detail=f"Can't find config file at {path.absolute()}"
        )

    with open(path, "r") as config_file:
        config_data = json.load(config_file)

    virtual_structure = config_data["virtual_structure"]

    nodes = []

    for document in virtual_structure:
        name = document['name']
        virtual_path = document['virtual_path'].split('/')[1:]
        if len(virtual_path) == 1 and virtual_path[0] == '':  # root
            nodes.append(
                {
                    "text": name,
                    "level": 0
                }
            )
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
                    "children": []
                }
                nodes.append(first_folder)
                folder = first_folder

            level = 1
            for i in range(1, len(virtual_path)):
                folder, level = _add_new_folder(folder, virtual_path[i], level)
            folder["children"].append(
                {
                    "text": name,
                    "level": level
                }
            )
    return nodes


def clear_directory(path: Path):
    """TODO function docstring"""

    for child in path.glob('*'):
        if child.is_file():
            child.unlink()
        else:
            clear_directory(child)
    path.rmdir()


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
    """

    path = get_workspace_path() / workspace_name

    if path.exists():
        raise HTTPException(
            status_code=409,
            detail=f"Workspace with name <<{workspace_name}>> already exists",
        )

    path.mkdir()
    (path / DOCUMENTS_DIR).mkdir()

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

    return Message(
        status=MsgStatus.INFO,
        detail="Workspace created successfully",
        values={"workspace_name": workspace_name},
    )


@router.post(
    "/remove/{workspace_name}", response_model=Message, status_code=200
)
async def remove_workspace(
        workspace_name: str,
        user: str = Depends(get_current_user)
) -> Message:
    """TODO function docstring"""

    path = get_workspace_path(workspace_name)

    with open(path / INFO_FILE, "r") as info_file:
        info_data = json.load(info_file)

    if user["username"] != info_data["creator"]:
        raise HTTPException(
            status_code=401,
            detail=f"Only creator of the workspace - {info_data['creator']}, can delete it"
        )

    clear_directory(path)

    return Message(
        status=MsgStatus.INFO,
        detail="Workspace removed successfully"
    )


@router.post(
    "/new/{workspace_name}/{document_name}", response_model=Message, status_code=201
)
async def create_new_document(
        workspace_name: str,
        document_name: str,
        virtual_path: str,
        creator: str = Depends(get_current_user)
) -> Message:
    """
    Create a new document in given workspace

    Parameters:
        workspace_name (str): name of the workspace that contains the document
        document_name (str): name of the new document
        virtual_path (str): todo
        creator (str): todo

    Returns:
        Message: details about result of operation

    Raises:
        HTTPException (409): if selected name collides with already
                             existing document
    """

    path = get_workspace_path(workspace_name) / DOCUMENTS_DIR / document_name

    if path.exists():
        raise HTTPException(
            status_code=409,
            detail=f"Document <<{document_name}>> already exists in workspace <<{workspace_name}>>",
        )

    path.mkdir()
    (path / IMAGES_DIR).mkdir()
    (path / ATTACHMENTS_DIR).mkdir()

    with open(path / DOCUMENT_FILE, "w") as document_file:
        document_file.write("")

    await update_virtual_structure(workspace_name, document_name, virtual_path)

    return Message(
        status=MsgStatus.INFO,
        detail="Document created successfully",
        values={"document_name": document_name, "creator": creator},
    )


@router.post(
    "/remove/{workspace_name}/{document_name}", response_model=Message, status_code=200
)
async def remove_document(
        workspace_name: str,
        document_name: str,
        user: str = Depends(get_current_user)
) -> Message:
    """TODO function docstring"""

    path = get_workspace_path(workspace_name)

    with open(path / INFO_FILE, "r") as info_file:
        info_data = json.load(info_file)

    if user["username"] != info_data["creator"]:
        raise HTTPException(
            status_code=401,
            detail="Only creator of the workspace can delete it"
        )

    path = get_workspace_path(workspace_name) / CONFIG_FILE
    with open(path, "r") as config_file:
        config_data = json.load(config_file)

    for document in config_data["virtual_structure"]:
        if document["name"] == document_name:
            config_data["virtual_structure"].remove(document)

    with open(path, "w") as config_file:
        json.dump(config_data, config_file, indent=4)

    path = get_document_path(workspace_name, document_name)
    clear_directory(path)

    return Message(
        status=MsgStatus.INFO,
        detail="Document removed successfully"
    )


@router.get("/{workspace_name}/{document_name}")
async def load_document_content(workspace_name: str, document_name: str) -> json:
    """TODO function docstring"""

    path = get_document_path(workspace_name, document_name) / DOCUMENT_FILE

    with open(path, "r") as document_file:
        document_data = json.load(document_file)

    return document_data


@router.post("/{workspace_name}/{document_name}")
async def save_document_content(
        workspace_name: str,
        document_name: str,
        document_data: list
) -> Message:
    """TODO function docstring"""

    path = get_document_path(workspace_name, document_name) / DOCUMENT_FILE

    with open(path, "w") as document_file:
        json.dump(document_data, document_file, indent=4)

    return Message(
        status=MsgStatus.INFO,
        detail="Document content updated successfully"
    )


@router.get("/get")
async def get_all_user_workspaces(user: str = Depends(get_current_user)) -> list:
    """TODO function docstring"""

    user_workspaces = []

    workspaces = [ folder.path for folder in os.scandir(get_workspace_path()) if folder.is_dir() ]
    for workspace in workspaces:
        info_path = workspace + "/" + INFO_FILE
        with open(info_path, "r") as info_file:
            info_data = json.load(info_file)
            if info_data["creator"] == user["username"]:
                user_workspaces.append({"name": info_data["name"], "last_updated": info_data["last_updated"]})

    return user_workspaces