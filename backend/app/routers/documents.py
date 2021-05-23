"""
TODO module docstring
"""

import json
from fastapi import APIRouter

from app.routers.files import get_document_path
from app.utils.message import Message, MsgStatus

router = APIRouter(prefix="/document", tags=["Document Management"])

DOCUMENT_FILE = "document.json"


@router.get("/{document_name}")
async def load_document_content(workspace_name: str, document_name: str) -> json:
    """TODO function docstring"""

    path = get_document_path(workspace_name, document_name) / DOCUMENT_FILE

    with open(path, "r") as document_file:
        document_data = json.load(document_file)

    return document_data


@router.post("/{document_name}")
async def save_document_content(
    workspace_name: str, document_name: str, document_data: list
) -> Message:
    """TODO function docstring"""

    path = get_document_path(workspace_name, document_name) / DOCUMENT_FILE

    with open(path, "w") as document_file:
        json.dump(document_data, document_file, indent=4)

    return Message(
        status=MsgStatus.INFO, detail="Document content updated successfully"
    )
