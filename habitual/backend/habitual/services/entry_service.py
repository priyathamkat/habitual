from habitual.models.entry import Entry
from habitual.repositories.entry_repo import create_entry_db
from habitual.schemas.entry import EntryCreate


async def create_entry_service(
    entry_create: EntryCreate,
):
    entry = Entry(**entry_create.model_dump())
    entry_db = await create_entry_db(entry)
    return {"entry": entry_db}
