"""
This is module docstring.
Main module that runs basic fast api app.
"""
from fastapi import FastAPI

from .routers import auth, file_manager

app = FastAPI()
app.include_router(auth.router)
app.include_router(file_manager.router)


@app.get("/connect", response_model=dict)
async def connect_test():
    '''
    TODO function docstring
    '''
    return {"Connected": "You are"}
