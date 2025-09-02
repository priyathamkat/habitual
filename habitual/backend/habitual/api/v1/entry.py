from fastapi import APIRouter

from habitual.db.session import SessionDep
from habitual.schemas.entry import EntryCreate
from habitual.services.entry_service import create_entry_service

router = APIRouter(prefix="/entry", tags=["Entry"])


@router.post("/create")
async def create_entry(entry_create: EntryCreate, session: SessionDep):
    return await create_entry_service(entry_create, session)
