from fastapi.concurrency import run_in_threadpool

from habitual.db.session import get_session
from habitual.models.entry import Entry


def _save_entry(entry: Entry) -> Entry:
    with get_session() as session:
        session.add(entry)
        session.commit()
        session.refresh(entry)
        return entry


async def create_entry_db(entry: Entry) -> Entry:
    # Run blocking DB work in a thread to avoid blocking the event loop
    return await run_in_threadpool(_save_entry, entry)
