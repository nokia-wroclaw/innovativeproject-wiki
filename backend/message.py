"""
    This module is responsible for everything related with logs.
    TODO: Make this docstring better
"""
from datetime import datetime, date
from pydantic import BaseModel
from typing import Optional

class Message(BaseModel):
    """
        A class representing a message.

        Attributes
        ----------
        status: str
            A kind of an enum type that indicates the importance of the message.
            Most often: INFO, WARNING, ERROR.
        content: str
            The content of the message.
        value: object
            Extra information about the message.            
    """
    status: str
    content: str
    value: Optional[object]

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
        file.write(f"[{message.status}] [{current_time}] [{message.value}] {message.content}\n")
