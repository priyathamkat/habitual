from typing import Any, Optional

from habitual.models.entry import Entry
from habitual.repositories.entries_repo import (
    create_entry_db,
    delete_entry_db,
    get_entry_db,
    list_entries_db,
    update_entry_db,
)
from habitual.schemas.entry import EntryCreate


async def create_entry_service(
    entry_create: EntryCreate,
) -> Entry:
    entry = Entry(**entry_create.model_dump())
    entry_db = await create_entry_db(entry)
    return entry_db


async def list_entries_service(limit: int, offset: int, order: str) -> dict[str, Any]:
    order_desc = order.lower() != "asc"
    items, total = await list_entries_db(limit=limit, offset=offset, order_desc=order_desc)
    return {"entries": items, "total": total, "limit": limit, "offset": offset}


async def get_entry_service(entry_id: str) -> Optional[Entry]:
    return await get_entry_db(entry_id)


async def update_entry_service(entry_id: str, content: Optional[str]) -> Optional[Entry]:
    return await update_entry_db(entry_id, content)


async def delete_entry_service(entry_id: str) -> bool:
    return await delete_entry_db(entry_id)
