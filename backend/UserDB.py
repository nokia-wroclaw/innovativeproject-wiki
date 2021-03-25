from tinydb import TinyDB, where

# Replace all 'return None' with appropriate Message object
# Complete missing docs


class UserDB:
    """ TODO """

    def __init__(self):
        self.db = TinyDB("db.json")

    def does_user_exist(self, username: str) -> bool:
        """
        Checks if the user with a given username exists in the database.

        Parameters:
            username (str): Given username

        Returns:
            bool: True if user exists in a database, False otherwise
        """
        if not self._is_non_empty_string(username):
            return False

        return self.db.contains(where('username') == username)

    def add_user(self, username: str, password_hash: str, email: str):
        """ TODO """
        if not self._is_non_empty_string((username, password_hash, email)):
            return None

        if self.does_user_exist(username):
            return None
        else:
            self.db.insert({
                'username': username,
                'password_hash': password_hash,
                'email': email
            })
            return None

    def delete_user(self, username: str):
        """ TODO """
        if not self._is_non_empty_string(username):
            return None

        if not self.does_user_exist(username):
            return None
        else:
            self.db.remove(where('username') == username)
            return None

    def change_username(self, username: str, new_username: str):
        """ TODO """
        if not self._is_non_empty_string((username, new_username)):
            return None

        if not self.does_user_exist(username):
            return None
        else:
            self.db.update({'username': new_username},
                           where('username') == username)
            return None

    def change_password(self, username: str, new_password_hash: str):
        """ TODO """
        if not self._is_non_empty_string((username, new_password_hash)):
            return None

        if not self.does_user_exist(username):
            return None
        else:
            self.db.update({'password_hash': new_password_hash},
                           where('username') == username)
            return None

    def change_email(self, username: str, new_email: str):
        """ TODO """
        if not self._is_non_empty_string((username, new_email)):
            return None

        if not self.does_user_exist(username):
            return None
        else:
            self.db.update({'email': new_email},
                           where('username') == username)
            return None

    def _is_non_empty_string(self, data):
        """
        Checks

        Parameters:
            data (list): Description of arg1

        Returns:
            bool: Returning value
        """
        for field in data:
            if not isinstance(field, str):
                # This is not a string
                return False
            elif not field:
                # This string is empty
                return False

        return True
