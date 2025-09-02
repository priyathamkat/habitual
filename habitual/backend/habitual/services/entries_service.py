from fastapi import HTTPException, status

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
):
    entry = Entry(**entry_create.model_dump())
    entry_db = await create_entry_db(entry)
    return {"entry": entry_db}


async def list_entries_service(limit: int, offset: int, order: str):
    order_desc = order.lower() != "asc"
    items, total = await list_entries_db(limit=limit, offset=offset, order_desc=order_desc)
    return {"items": items, "total": total, "limit": limit, "offset": offset}


async def get_entry_service(entry_id: str):
    entry = await get_entry_db(entry_id)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return {"entry": entry}


async def update_entry_service(entry_id: str, content: str | None):
    entry = await update_entry_db(entry_id, content)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return {"entry": entry}


async def delete_entry_service(entry_id: str) -> None:
    ok = await delete_entry_db(entry_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
