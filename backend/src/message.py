# pylint: disable=no-name-in-module, too-few-public-methods
"""
    This module is responsible for everything related with logs.
    TODO: Make this docstring better
"""
import sys
from datetime import datetime, date
from typing import Optional

FILE = 0  # log to file
STD = 1  # log to stdout or stderr
SYSLOG = 2  # log to syslog

LOG_TYPE = FILE  # default for now; TODO: read from some config file


class Message:
    """
        A class representing a message.

        Attributes
        ----------
        category: str
            A kind of an enum type that indicates the importance of the message.
            Most often: INFO, WARNING, ERROR.
        content: str
            The content of the message.
        value: Optional[int]
            Extra information about the message.
    """

    def __init__(self, category: str, content: str, value: Optional[int] = None):
        """
            Constructor for the Message class.

            Parameters:
            category: str

            content: str

            value: Optional[int]
        """
        self.category = category
        self.content = content
        self.value = value


def log_to_file(message: Message) -> None:
    """
        Writes logs to files.
        Logs are stored in 'logs\' folder.
        Example logs filename: '2021_03_25.log'

        Parameters:
            message (Message): Message that contains log information.

        Returns:
            None
    """
    today = date.today()
    day = today.strftime('%Y_%m_%d')
    with open(fr"backend\logs\{day}.log", "a") as file:
        now = datetime.now()
        current_time = now.strftime('%H:%M:%S')
        file.write(f"[{message.category}] [{current_time}] [{message.value}] {message.content}\n")


# todo improve?
def log_to_std(message: Message, is_error: bool) -> None:
    """
        Writes logs to stdout/stderr depending on the message.

        Parameters:
            message (Message): Message that contains log information.
            is_error (bool): todo write something

        Returns:
            None
    """
    now = datetime.now()
    day_time = now.strftime('%Y_%m_%d %H:%M:%S')
    if is_error:
        print(f"[{message.category}] [{day_time}] [{message.value}] {message.content}\n", file=sys.stderr)
    else:
        print(f"[{message.category}] [{day_time}] [{message.value}] {message.content}\n")
