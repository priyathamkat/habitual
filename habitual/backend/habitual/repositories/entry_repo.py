from fastapi.concurrency import run_in_threadpool
from sqlmodel import Session

from habitual.models.entry import Entry


def _save_entry(entry: Entry, session: Session) -> Entry:
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return entry


async def create_entry_db(entry: Entry, session: Session) -> Entry:
    # Run blocking DB work in a thread to avoid blocking the event loop
    return await run_in_threadpool(_save_entry, entry, session)
