import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class Entry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.now)
    content: str
