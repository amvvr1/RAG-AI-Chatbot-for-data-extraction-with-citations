from pydantic import BaseModel
from typing import Optional,  List

class Request(BaseModel):
    query: str

class Citation(BaseModel):
    text: str
    document_name: str
    page_number: Optional[int]

class Response(BaseModel):
    answer: str
    citation: List[Citation]


