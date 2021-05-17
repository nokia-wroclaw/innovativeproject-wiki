"""
TODO module docstring
"""
from re import fullmatch
from typing import Optional
from datetime import timedelta, datetime
from jose import JWTError, jwt
from passlib.hash import bcrypt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends, HTTPException, status

from app.utils.user_db import UserDB
from app.utils.message import Message, log

router = APIRouter(prefix="/auth", tags=["auth"])
user_db = UserDB()

SECRET_KEY = "7505d3e581d01c02fd31667cdc67cdb64173a9d4f715e73bf0a8e196fa02a15c"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def verify_password(plain_password, hashed_password):
    """
    TODO function docstring
    """
    return bcrypt.verify(plain_password, hashed_password)


def hash_password(plain_password):
    """
    TODO function docstring
    """
    return bcrypt.hash(plain_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    TODO function docstring
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_user(username: str, password: str):
    """
    Look for user in user_db.json (TinyDB).

    Parameters:
        username (str): username from form
        password (str): password from form

    Returns:
        bool: False if a user doesn't exist
        dict: Dict with user info if it does exist
    """
    user = user_db.get_user_data(username)
    if isinstance(user, Message):
        log(user)
        return False
    if not verify_password(password, user["password_hash"]):
        return False
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    TODO function docstring
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
    except JWTError as jwt_error:
        raise credentials_exception from jwt_error
    user = user_db.get_user_data(username)
    if isinstance(user, Message):
        log(user)
        raise credentials_exception
    return user


@router.post("/login")
async def generate_token(form: OAuth2PasswordRequestForm = Depends()):
    """
    TODO function docstring
    """
    user = authenticate_user(form.username, form.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"username": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register")
async def create_user(form: OAuth2PasswordRequestForm = Depends()):
    """
    TODO function docstring
    """
    username = form.username
    password = form.password
    email = form.scopes[0]

    if not fullmatch("[A-Za-z0-9-_]+", username):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Username must contain only upper and lower case characters, "
                   + "numbers, and symbols - or _ ",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if len(password) < 8:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Password must be at least 8 characters long.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not fullmatch("^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[A-Za-z]+$", email):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Incorrect e-mail address.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user_db.does_user_exist(username):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Given user already exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_db.add_user(form.username, hash_password(form.password), email)


@router.get("/me", response_model=dict)
async def get_user(user: dict = Depends(get_current_user)):
    """
    TODO function docstring
    """
    return user
