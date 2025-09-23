from pydantic import BaseModel
from typing import List, Optional


class Citation(BaseModel):
    document: str
    text: str

class Response(BaseModel):
    answer: str
    citations: List[Citation]



