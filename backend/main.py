"""
This is module docstring.
Main module that runs basic fast api app.
"""
from fastapi import FastAPI

app = FastAPI()

"""
This is function docstring.
"""
@app.get("/")
async def root():
    return {"message": "Hello World"}
