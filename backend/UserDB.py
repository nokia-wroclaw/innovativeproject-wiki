from tinydb import TinyDB, Query


class UserDB:
    """ """

    def __init__(self):
        self.db = TinyDB("db.json")

    
    def find_user(username):
        """ """
        
        pass   

    def add_user(username, password_hash, email):
        """ """

        pass

    def delete_user(username):
        """ """

        pass

    def change_username(username, new_username):
        """ """

        pass

    def change_password(username, new_password):
        """ """

        pass

    def change_email(username, new_email):
        """ """

        pass
