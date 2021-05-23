"""
TODO module docstring
"""
from pathlib import Path
from tinydb import TinyDB, where
from app.utils.message import Message, MsgStatus


class UserDB:
    """
    Interface for communication with the user database.

    Attributes:
        database (TinyDB): instance of the database
    """

    def __init__(self):
        self.database = TinyDB(Path("./data/users/database.json").absolute())

    def does_user_exist(self, username: str) -> bool:
        """
        Checks if a user with a given username already exists in the database.

        Parameters:
            username (str): searched user

        Returns:
            bool: True if a user exists in a database, False otherwise
        """
        if not _is_non_empty_string(username):
            return False

        return self.database.contains(where("username") == username)

    def add_user(self, username: str, password_hash: str, email: str):
        """
        Adds a new user to a database (only if a username isn't already taken).

        Parameters:
            username (str): username of the new user
            password_hash (str): hashed password of the new user
            email (str): email of the new user

        Returns:
            Message: the result of an attempted user addition (SUCCESS/FAILURE) with additional info
        """
        if not _is_non_empty_string((username, password_hash, email)):
            return Message(
                status=MsgStatus.ERROR, detail="Invalid parameter type detected"
            )

        if self.does_user_exist(username):
            return Message(status=MsgStatus.INFO, detail="Given user already exists")

        self.database.insert(
            {
                "username": username,
                "password_hash": password_hash,
                "email": email,
                "profile_picture": None,
                "active_workspaces": [],
            }
        )
        return Message(status=MsgStatus.INFO, detail="User added successfully")

    def remove_user(self, username: str):
        """
        Removes user from a database (only if user exists).

        Parameters:
            username (str): user to remove

        Returns:
            Message: the result of an attempted user deletion (SUCCESS/FAILURE)
                     with some additional info
        """
        if not _is_non_empty_string(username):
            return Message(
                status=MsgStatus.ERROR, detail="Invalid parameter type detected"
            )

        if not self.does_user_exist(username):
            return Message(status=MsgStatus.INFO, detail="Given user doesn't exists")

        self.database.remove(where("username") == username)
        return Message(status=MsgStatus.INFO, detail="User removed successfully")

    def get_user_data(self, username: str):
        """
        Get user data from a database (only if user exists).

        Parameters:
            username (str): the user whose data we are interested in

        Returns:
        If extraction of the user data was successful:
            dict: {"username": x, "password_hash": x, "email": x}
        Otherwise:
            Message: information about the cause of failure
        """
        if not _is_non_empty_string(username):
            return Message(
                status=MsgStatus.ERROR, detail="Invalid parameter type detected"
            )

        if self.does_user_exist(username):
            return self.database.get(where("username") == username)

        return Message(status=MsgStatus.INFO, detail="Given user doesn't exists")

    def edit_user_data(self, username, edited_field, new_value):
        """
        Removes user from a database (only if user exists).

        Parameters:
            username (str): user we are editing
            edited_field (str): field we want to edit.
                                Possible values: "username", "hashed_password", "email"
            new_value (str): new value of selected field

        Returns:
            Message: the result of an attempted user data edition (SUCCESS/FAILURE)
                     with some additional info
        """
        if not _is_non_empty_string((username, new_value)):
            return Message(
                status=MsgStatus.ERROR, detail="Invalid parameter type detected"
            )

        if not self.does_user_exist(username):
            return Message(status=MsgStatus.INFO, detail="Given user doesn't exists")

        if edited_field in ("password_hash", "username", "email", "profile_picture"):
            self.database.update(
                {edited_field: new_value}, where("username") == username
            )
            return Message(
                status=MsgStatus.INFO, detail="User data edited successfully"
            )

        return Message(
            status=MsgStatus.INFO,
            detail=f"Non-existent field type - {edited_field}",
        )


def _is_non_empty_string(data: list) -> bool:
    """
    Checks if all values in list are non-empty string

    Parameters:
        data (list): list of values ​​to be checked

    Returns:
        bool: True if all values are non-empty string, False otherwise
    """
    for field in data:
        if not isinstance(field, str) or not field:
            return False

    return True
