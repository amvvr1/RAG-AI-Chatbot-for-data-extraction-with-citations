from pydantic import BaseModel
from typing import Optional,  List

class ChatRequest(BaseModel):
    query: str


class Response(BaseModel):
    answer: str
    document_name: str


