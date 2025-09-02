import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class Entry(SQLModel, table=True):
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        index=True,
        description="UUID primary key",
    )
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Creation timestamp (UTC)",
    )
    content: str = Field(description="Entry content")
