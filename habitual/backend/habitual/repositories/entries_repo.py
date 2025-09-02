from datetime import datetime
from typing import cast

from fastapi.concurrency import run_in_threadpool
from sqlalchemy import func
from sqlalchemy.sql.elements import ColumnElement
from sqlmodel import select

from habitual.db.session import get_session
from habitual.models.entry import Entry


def _create_entry(entry: Entry) -> Entry:
    with get_session() as session:
        session.add(entry)
        session.commit()
        session.refresh(entry)
        return entry


async def create_entry_db(entry: Entry) -> Entry:
    # Run blocking DB work in a thread to avoid blocking the event loop
    return await run_in_threadpool(_create_entry, entry)


def _list_entries(limit: int, offset: int, order_desc: bool) -> tuple[list[Entry], int]:
    with get_session() as session:
        stmt = select(Entry)
        if order_desc:
            stmt = stmt.order_by(cast(ColumnElement[datetime], Entry.timestamp).desc())
        else:
            stmt = stmt.order_by(cast(ColumnElement[datetime], Entry.timestamp).asc())
        total = session.exec(select(func.count()).select_from(Entry)).one()
        result = session.exec(stmt.offset(offset).limit(limit))
        return list(result.all()), int(total)


async def list_entries_db(limit: int, offset: int, order_desc: bool) -> tuple[list[Entry], int]:
    return await run_in_threadpool(_list_entries, limit, offset, order_desc)


def _get_entry(entry_id: str) -> Entry | None:
    with get_session() as session:
        return session.get(Entry, entry_id)


async def get_entry_db(entry_id: str) -> Entry | None:
    return await run_in_threadpool(_get_entry, entry_id)


def _update_entry(entry_id: str, content: str | None) -> Entry | None:
    with get_session() as session:
        entry = session.get(Entry, entry_id)
        if not entry:
            return None
        if content is not None:
            entry.content = content
        session.add(entry)
        session.commit()
        session.refresh(entry)
        return entry


async def update_entry_db(entry_id: str, content: str | None) -> Entry | None:
    return await run_in_threadpool(_update_entry, entry_id, content)


def _delete_entry(entry_id: str) -> bool:
    with get_session() as session:
        entry = session.get(Entry, entry_id)
        if not entry:
            return False
        session.delete(entry)
        session.commit()
        return True


async def delete_entry_db(entry_id: str) -> bool:
    return await run_in_threadpool(_delete_entry, entry_id)
