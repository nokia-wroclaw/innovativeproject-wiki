"""
    This module is responsible for everything related with logs.
    TODO: Make this docstring better
"""
import sys
import syslog
from datetime import datetime, date
from typing import Optional
from enum import Enum
from pydantic import BaseModel


class MsgStatus(str, Enum):
    """
    Enum type indicating the type of the message.
    """

    EMERGENCY = "Emergency"
    ALERT = "Alert"
    CRITICAL = "Critical"
    ERROR = "Error"
    WARNING = "Warning"
    NOTICE = "Notice"
    INFO = "Info"
    DEBUG = "Debug"


class Message(BaseModel):
    """
    A class representing a message.

    Attributes
    ----------
    status: MsgStatus
        An enum type that indicates the type of the message.
    detail: str
        The content of the message.
    values: Any
        Extra information about the message.
    """

    status: MsgStatus
    detail: str
    values: Optional[dict] = None

    class Config:
        """Message config"""

        use_enum_values = True


def _prepare_message_as_string(message: Message, time: str) -> str:
    """
    Formats a message into a string to be logged to file or stdout/stderr.

    Parameters:
        message (Message): Message that contains log information.

        time (str): Time formatted as a string.

    Returns:
        None
    """

    value = message.values
    if value is None:
        value = ""

    return f"[{message.type.name}] [{time}] [{value}]: {message.detail}\n"


class LogDestination(Enum):
    """
    Enum type representing the log destination.
    """

    FILE = 0  # log to file
    STD = 1  # log to stdout or stderr
    SYSLOG = 2  # log to syslog


LOG_DESTINATION = LogDestination["STD"]


def log(message: Message) -> None:
    """
    Writes logs to the destination given in config file.

    Parameters:
        message (Message): Message that contains log information.

    Returns:
        None
    """
    if LOG_DESTINATION == LogDestination.FILE:
        log_to_file(message)
    elif LOG_DESTINATION == LogDestination.STD:
        log_to_std(message)
    elif LOG_DESTINATION == LogDestination.SYSLOG:
        log_to_syslog(message)


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
    day = today.strftime("%Y_%m_%d")
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    message_to_print = _prepare_message_as_string(message, current_time)
    with open(fr"/app/logs/{day}.log", "a") as file:
        file.write(message_to_print)


def log_to_std(message: Message) -> None:
    """
    Writes logs to stdout/stderr depending of the message.

    Parameters:
        message (Message): Message that contains log information.

    Returns:
        None
    """
    now = datetime.now()
    day_time = now.strftime("%Y-%m-%d %H:%M:%S")

    message_to_print = _prepare_message_as_string(message, day_time)

    # stdout
    if message.status == MsgStatus.NOTICE or message.status == MsgStatus.INFO:
        print(message_to_print)
    # stderr
    else:
        print(message_to_print, file=sys.stderr)


# https://docs.python.org/3/library/syslog.html
def log_to_syslog(message: Message) -> None:
    """
    Writes logs to syslog.

    Parameters:
        message (Message): Message that contains log information.

    Returns:
        None
    """
    syslog.syslog(message.status.values, message.detail)
