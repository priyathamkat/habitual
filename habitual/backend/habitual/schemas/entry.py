from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class EntryCreate(BaseModel):
    content: str


class EntryRead(BaseModel):
    id: str
    timestamp: datetime
    content: str


class EntryUpdate(BaseModel):
    content: Optional[str] = None


class EntryListResponse(BaseModel):
    items: List[EntryRead]
    total: int
    limit: int
    offset: int
