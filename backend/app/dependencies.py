"""
TODO module docstring
"""

from enum import Enum
import os
import string
import secrets


class Directory(Enum):
    """
    TODO enum docstring
    """

    DATA = "data"
    WORKSPACES = "workspaces"
    USERS = "users"
    IMAGES = "imgs"
    ATTACHMENTS = "atchs"
    PROFILE_PICTURES = "profile_pictures"


def random_filename(length=16, endwith=""):
    """
    TODO function docstring
    """

    alpha_num = string.ascii_letters + string.digits
    return "".join(secrets.choice(alpha_num) for _ in range(length)) + endwith


def random_filename_keep_ext(filename: str):
    """
    TODO function docstring
    """

    _, ext = os.path.splitext(filename)
    return random_filename(length=16, endwith=ext)


def is_non_empty_string(data: list) -> bool:
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
