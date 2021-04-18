from tinydb import TinyDB, where
from .message import Message

# Messages value codes
SUCCESS = 0
FAILURE = 1


class UserDB:
    """
    Interface for communication with the user database.

    Attributes:
        db (TinyDB): instance of the database
    """

    def __init__(self):
        self.db = TinyDB("db.json")

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

        return self.db.contains(where("username") == username)

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
            return Message("ERROR", "Invalid parameter type detected", FAILURE)

        if self.does_user_exist(username):
            return Message("INFO", "Given user already exists", FAILURE)
        else:
            self.db.insert(
                {"username": username, "password_hash": password_hash, "email": email}
            )
            return Message("INFO", "User added successfully", SUCCESS)

    def remove_user(self, username: str):
        """
        Removes user from a database (only if user exists).

        Parameters:
            username (str): user to remove

        Returns:
            Message: the result of an attempted user deletion (SUCCESS/FAILURE) with some additional info
        """
        if not _is_non_empty_string(username):
            return Message("ERROR", "Invalid parameter type detected", FAILURE)

        if not self.does_user_exist(username):
            return Message("INFO", "Given user doesn't exists", FAILURE)
        else:
            self.db.remove(where("username") == username)
            return Message("INFO", "User removed successfully", SUCCESS)

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
            return Message("ERROR", "Invalid parameter type detected", FAILURE)

        if self.does_user_exist(username):
            return self.db.get(where("username") == username)
        else:
            return Message("INFO", "Given user doesn't exists", FAILURE)

    def edit_user_data(self, username, edited_field, new_value):
        """
        Removes user from a database (only if user exists).

        Parameters:
            username (str): user we are editing
            edited_field (str): field we want to edit. Possible values: "username", "hashed_password", "email"
            new_value (str): new value of selected field

        Returns:
            Message: the result of an attempted user data edition (SUCCESS/FAILURE) with some additional info
        """
        if not _is_non_empty_string((username, new_value)):
            return Message("ERROR", "Invalid parameter type detected", FAILURE)

        if not self.does_user_exist(username):
            return Message("INFO", "Given user doesn't exists", FAILURE)
        else:
            if edited_field in ("username", "password_hash", "email"):
                self.db.update({edited_field: new_value}, where("username") == username)
                return Message("INFO", "User data edited successfully", SUCCESS)
            else:
                return Message("ERROR", "Non-existent field type", FAILURE)


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
