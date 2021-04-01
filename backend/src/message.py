# pylint: disable=no-name-in-module, too-few-public-methods
"""
    This module is responsible for everything related with logs.
    TODO: Make this docstring better
"""
from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel

class Message(BaseModel):
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
    category: str
    content: str
    value: Optional[int]

    def __init__(self, category: str, content: str, value: int=None):
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

def log(message: Message) -> None:
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
