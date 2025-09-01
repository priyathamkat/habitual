from fastapi import APIRouter
from sqlmodel import Session

from habitual.schemas.entry import EntryCreate
from habitual.services.entry_service import create_entry_service

router = APIRouter(prefix="/entry", tags=["Entry"])


@router.post("/create")
async def create_entry(entry_create: EntryCreate, session: Session):
    return await create_entry_service(entry_create, session)
