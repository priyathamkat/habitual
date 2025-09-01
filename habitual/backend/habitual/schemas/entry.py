from pydantic import BaseModel


class EntryCreate(BaseModel):
    content: str
