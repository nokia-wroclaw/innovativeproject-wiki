# pylint: disable=no-name-in-module, too-few-public-methods
"""
    This module is responsible for everything related with logs.
    TODO: Make this docstring better
"""
import sys
import syslog
from datetime import datetime, date
from typing import Optional
from enum import Enum

# log destination constants
FILE = 0  # log to file
STD = 1  # log to stdout or stderr
SYSLOG = 2  # log to syslog

LOG_DESTINATION = FILE  # default for now; TODO: read from some config file


class Severity(Enum):
    """
        Enum type indicating the severity of the message.
    """
    EMERGENCY = 0
    ALERT = 1
    CRITICAL = 2
    ERROR = 3
    WARNING = 4
    NOTICE = 5
    INFO = 6
    DEBUG = 7


class Message:
    """
        A class representing a message.

        Attributes
        ----------
        severity: Severity
            An enum type that indicates the severity of the message.
        content: str
            The content of the message.
        value: Optional[int]
            Extra information about the message.
    """

    def __init__(self, severity: Severity, content: str, value: Optional[int] = None):
        """
            Constructor for the Message class.

            Parameters:
                severity: Severity

                content: str

                value: Optional[int]
        """
        self.severity = severity
        self.content = content
        self.value = value


def log(message: Message) -> None:
    """
        Writes logs to the destination given in config file.

        Parameters:
            message (Message): Message that contains log information.

        Returns:
            None
    """
    if LOG_DESTINATION == FILE:
        log_to_file(message)
    elif LOG_DESTINATION == STD:
        log_to_std(message)
    elif LOG_DESTINATION == SYSLOG:
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
    day = today.strftime('%Y_%m_%d')
    with open(fr"backend\logs\{day}.log", "a") as file:
        now = datetime.now()
        current_time = now.strftime('%H:%M:%S')
        file.write(f"[{message.severity}] [{current_time}] [{message.value}] {message.content}\n")


def log_to_std(message: Message) -> None:
    """
        Writes logs to stdout/stderr depending of the message.

        Parameters:
            message (Message): Message that contains log information.

        Returns:
            None
    """
    now = datetime.now()
    day_time = now.strftime('%Y_%m_%d %H:%M:%S')
    if message.severity == "ERROR":  # todo improve
        print(f"[{message.severity}] [{day_time}] [{message.value}] {message.content}\n",
              file=sys.stderr)
    else:
        print(f"[{message.severity}] [{day_time}] [{message.value}] {message.content}\n")


# https://docs.python.org/3/library/syslog.html todo improve
def log_to_syslog(message: Message) -> None:
    """
        Writes logs to syslog.

        Parameters:
            message (Message): Message that contains log information.

        Returns:
            None
    """
    syslog.syslog(message.content)
