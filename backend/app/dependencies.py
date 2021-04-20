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
    DATA = Path("./data").absolute()
    WORKSPACES = DATA / "workspaces"
    USERS = DATA / "users"
    PAGES = WORKSPACES / "{workspace_id!s}/pages"
    PAGE_IMG = PAGES / "{page_id!s}/img"
    PAGE_ATCH = PAGES / "{page_id!s}/atch"

    return {
        "data": DATA,
        "workspaces": WORKSPACES,
        "users": USERS,
        "pages": PAGES,
        "page_img": PAGE_IMG,
        "page_athc": PAGE_ATCH
    }
