"""
This is module docstring.
Main module that runs basic fast api app.
"""
from typing import Optional
from user_db import UserDB
from message import Message, log
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.hash import bcrypt

app = FastAPI()
user_db = UserDB()

SECRET_KEY = "7505d3e581d01c02fd31667cdc67cdb64173a9d4f715e73bf0a8e196fa02a15c"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='auth/token')


def verify_password(plain_password, hashed_password):
    return bcrypt.verify(plain_password, hashed_password)


def hash_password(plain_password):
    return bcrypt.hash(plain_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
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
    if not verify_password(password, user['password_hash']):
        return False
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)):
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
    except JWTError:
        raise credentials_exception
    user = user_db.get_user_data(username)
    if isinstance(user, Message):
        log(user)
        raise credentials_exception
    return user


@app.post("/auth/token")
async def generate_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"username": user["username"]}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@app.post('/auth/register')
async def create_user(form_data: OAuth2PasswordRequestForm = Depends()):
    if user_db.does_user_exist(form_data.username):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Given user already exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_db.add_user(
        form_data.username,
        hash_password(form_data.password),
        "testowy@email.com"
    )


@app.get('/users/me', response_model=dict)
async def get_user(user: dict = Depends(get_current_user)):
    return user

@app.get('/connect', response_model=dict)
async def connect_test():
    return {"Connected": "You are"}
