"""
TODO module docstring
"""

from enum import Enum
from datetime import datetime
from pathlib import Path
from tinydb import TinyDB, where
from app.utils.message import Message, MsgStatus
from app.dependencies import Directory


class PermissionType(Enum):
    """
    TODO enum docstring
    """

    OWNER = 3
    EDIT_WORKSPACE = 2
    EDIT_DOCUMENTS = 1
    VIEW_ONLY = 0


class WorkspaceDB:
    """
    Interface for communication with the workspace database.

    Attributes:
        database (TinyDB): instance of the database
    """

    def __init__(self):
        self.database = TinyDB(
            Path(".")
            / Directory.DATA.value
            / Directory.WORKSPACES.value
            / "database.json"
        )

    def does_workspace_exist(self, workspace_name: str) -> bool:
        """
        Checks if a workspace with a given name already exists in the database.

        Parameters:
            workspace_name (str): searched workspace

        Returns:
            bool: True if a workspace already exists in a database, False otherwise
        """

        return self.database.contains(where("name") == workspace_name)

    def add_workspace(self, workspace_name: str, creator: str, public: bool):
        """
        TODO docstring
        """

        if self.does_workspace_exist(workspace_name):
            return Message(
                status=MsgStatus.ERROR, detail="Workspace with that name already exists"
            )

        creation_date = datetime.now()
        creation_date_normalized = {
            "year": creation_date.year,
            "month": creation_date.month,
            "day": creation_date.day,
            "hour": creation_date.hour,
            "minute": creation_date.minute,
            "second": creation_date.second,
        }

        self.database.insert(
            {
                "name": workspace_name,
                "public": public,
                "creator": creator,
                "creation_date": creation_date_normalized,
                "last_updated": creation_date_normalized,
                "permissions": [],
                "virtual_structure": [],
            }
        )

        return Message(status=MsgStatus.INFO, detail="Workspace added successfully")

    def remove_workspace(self, workspace_name: str):
        """
        TODO docstring
        """

        if not self.does_workspace_exist(workspace_name):
            return Message(
                status=MsgStatus.ERROR, detail="Workspace with that name doesn't exist"
            )

        self.database.remove(where("name") == workspace_name)
        return Message(status=MsgStatus.INFO, detail="Workspace removed successfully")

    def get_workspace_data(self, workspace_name: str):
        """
        TODO docstring
        """

        if not self.does_workspace_exist(workspace_name):
            return Message(
                status=MsgStatus.ERROR, detail="Workspace with that name doesn't exist"
            )

        return self.database.get(where("name") == workspace_name)

    def add_to_virtual_structure(
        self,
        workspace_name: str,
        element_name: str,
        element_type: str,
        virtual_path: str,
    ):
        """
        TODO docstring
        """

        if not self.does_workspace_exist(workspace_name):
            return Message(
                status=MsgStatus.ERROR, detail="Workspace with that name doesn't exist"
            )

        virtual_structure = self.get_workspace_data(workspace_name)["virtual_structure"]
        value = {
            "name": element_name,
            "type": element_type,
            "virtual_path": virtual_path,
        }

        for element in virtual_structure:
            if element["name"] == element_name and element["type"] == element_type:
                element["virtual_path"] = virtual_path
                break
        else:
            virtual_structure.append(value)

        self.database.update(
            {"virtual_structure": virtual_structure},
            where("username") == workspace_name,
        )

        return Message(
            status=MsgStatus.INFO,
            detail=f"Workspace <<{workspace_name}>> virtual structure updated successfully",
        )

    def remove_from_virtual_structure(
        self, workspace_name: str, element_name: str, element_type: str
    ):
        """
        TODO docstring
        """

        if not self.does_workspace_exist(workspace_name):
            return Message(
                status=MsgStatus.ERROR, detail="Workspace with that name doesn't exist"
            )

        virtual_structure = self.get_workspace_data(workspace_name)["virtual_structure"]

        for element in virtual_structure:
            if element["name"] == element_name and element["type"] == element_type:
                virtual_structure.remove(element)

        self.database.update(
            {"virtual_structure": virtual_structure},
            where("username") == workspace_name,
        )

        return Message(
            status=MsgStatus.INFO,
            detail=f"Workspace <<{workspace_name}>> virtual structure updated successfully",
        )

    def change_user_permissions(
        self, workspace_name: str, username: str, permission_type: PermissionType
    ):
        """
        TODO docstring
        """

        if not self.does_workspace_exist(workspace_name):
            return Message(
                status=MsgStatus.ERROR, detail="Workspace with that name doesn't exist"
            )

        permissions = self.get_workspace_data(workspace_name)["permissions"]

        for element in permissions:
            if element["username"] == username:
                element["permission_type"] = permission_type.value
                break
        else:
            permissions.append(
                {"username": username, "permission_type": permission_type.value}
            )

        self.database.update(
            {"permissions": permissions},
            where("username") == username,
        )

        return Message(
            status=MsgStatus.INFO,
            detail=f"Workspace <<{workspace_name}>> access permissions updated successfully",
        )

    def remove_user_from_workspace(self, workspace_name: str, username: str):
        """
        TODO docstring
        """

        if not self.does_workspace_exist(workspace_name):
            return Message(
                status=MsgStatus.ERROR, detail="Workspace with that name doesn't exist"
            )

        permissions = self.get_workspace_data(workspace_name)["permissions"]

        for element in permissions:
            if element["username"] == username:
                permissions.remove(element)

        self.database.update(
            {"permissions": permissions},
            where("username") == username,
        )

        return Message(
            status=MsgStatus.INFO,
            detail=f"Workspace <<{workspace_name}>> access permissions updated successfully",
        )
