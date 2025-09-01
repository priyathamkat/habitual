from habitual.models.entry import Entry

in_memory_db = {}


async def create_entry_db(entry: Entry):
    in_memory_db[entry.id] = entry
    return entry
