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
import json


class LogDestination(Enum):
    """
        Enum type representing the log destination.
    """
    FILE = 0  # log to file
    STD = 1  # log to stdout or stderr
    SYSLOG = 2  # log to syslog


with open("../../config.json") as config_file:
    json_data = json.load(config_file)

LOG_DESTINATION = LogDestination[json_data['log_destination']]  # todo default value in json for now


# https://en.wikipedia.org/wiki/Syslog#Severity_level
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


def _prepare_message_as_string(message: Message, time: str) -> str:
    """
        Formats a message into a string to be logged to file or stdout/stderr.

        Parameters:
            message (Message): Message that contains log information.

            time (str): Time formatted as a string.

        Returns:
            None
    """
    # don't 'print' None
    value = message.value
    if value is None:
        value = ""

    return f"[{message.severity.name}] [{time}] [{value}]: {message.content}\n"


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
    day = today.strftime('%Y_%m_%d')
    now = datetime.now()
    current_time = now.strftime('%H:%M:%S')
    message_to_print = _prepare_message_as_string(message, current_time)
    with open(fr"backend\logs\{day}.log", "a") as file:
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
    day_time = now.strftime('%Y-%m-%d %H:%M:%S')

    message_to_print = _prepare_message_as_string(message, day_time)

    # stdout
    if message.severity == Severity.NOTICE or message.severity == Severity.INFO:
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
    syslog.syslog(message.severity.value, message.content)
