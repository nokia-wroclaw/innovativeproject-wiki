from tinydb import TinyDB, where
from message import Message

# Messages value codes
SUCCESS = 0
FAILURE = 1


class UserDB:
    """ TODO """

    def __init__(self):
        self.db = TinyDB("db.json")

    def does_user_exist(self, username: str) -> bool:
        """
        Checks if user with a given username already exists in the database.

        Parameters:
            username (str): Given username

        Returns:
            bool: True if user exists in a database, False otherwise
        """
        if not _is_non_empty_string(username):
            return False

        return self.db.contains(where('username') == username)

    def add_user(self, username: str, password_hash: str, email: str):
        """ TODO """
        if not _is_non_empty_string((username, password_hash, email)):
            return Message("ERROR", "Invalid parameter type detected", FAILURE)

        if self.does_user_exist(username):
            return Message("INFO", "Given user already exists", FAILURE)
        else:
            self.db.insert({
                'username': username,
                'password_hash': password_hash,
                'email': email
            })
            return Message("INFO", "User added successfully", SUCCESS)

    def remove_user(self, username: str):
        """ TODO """
        if not _is_non_empty_string(username):
            return Message("ERROR", "Invalid parameter type detected", FAILURE)

        if not self.does_user_exist(username):
            return Message("INFO", "Given user doesn't exists", FAILURE)
        else:
            self.db.remove(where('username') == username)
            return Message("INFO", "User removed successfully", SUCCESS)

    def get_user_data(self, username: str):
        """ TODO """
        if not _is_non_empty_string(username):
            return Message("ERROR", "Invalid parameter type detected", FAILURE)

        if self.does_user_exist(username):
            return self.db.get(where('username') == username)
        else:
            return Message("INFO", "Given user doesn't exists", FAILURE)

    def edit_user_data(self, username, edited_field, new_value):
        """ TODO """
        if not _is_non_empty_string((username, new_value)):
            return Message("ERROR", "Invalid parameter type detected", FAILURE)

        if not self.does_user_exist(username):
            return Message("INFO", "Given user doesn't exists", FAILURE)
        else:
            if edited_field in ("username", "password_hash", "email"):
                self.db.update({edited_field: new_value},
                               where('username') == username)
                return Message("INFO", "User data edited successfully", SUCCESS)
            else:
                return Message("ERROR", "Non-existent field type", FAILURE)


def _is_non_empty_string(data: list) -> bool:
    """
    Checks if 

    Parameters:
        data (list): 

    Returns:
        bool: 
    """
    for field in data:
        if not isinstance(field, str) or not field:
            return False

    return True
