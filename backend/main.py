"""
This is module docstring.
Main module that runs basic fast api app.
"""
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
""" This is function docstring."""
    return {"message": "Hello World"}
