from pydantic import BaseModel

class Message(BaseModel):
    status: str
    message: str

testMessage = Message(status="Status", message="Wiadomość")