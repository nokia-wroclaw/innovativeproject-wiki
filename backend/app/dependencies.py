"""
TODO module docstring
"""

import string
import secrets
from pathlib import Path


def random_filename(lenght=16, endwith=""):
    """
    TODO function docstring
    """
    alpha_num = string.ascii_letters + string.digits
    return "".join(secrets.choice(alpha_num) for _ in range(lenght)) + endwith


def get_data_paths():
    """
    TODO function docstring
    """
    data = Path("./data").absolute()
    workspaces = data / "workspaces"
    users = data / "users"
    pages = workspaces / "{workspace_id!s}/pages"
    page_img = pages / "{page_id!s}/img"
    page_atch = pages / "{page_id!s}/atch"

    return {
        "data": data,
        "workspaces": workspaces,
        "users": users,
        "pages": pages,
        "page_img": page_img,
        "page_athc": page_atch,
    }
