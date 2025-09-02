from fastapi import APIRouter, Request, Response, status

from habitual.schemas.entry import (
    EntryCreate,
    EntryListResponse,
    EntryRead,
    EntryUpdate,
)
from habitual.services.entries_service import (
    create_entry_service,
    delete_entry_service,
    get_entry_service,
    list_entries_service,
    update_entry_service,
)

router = APIRouter(prefix="/entries", tags=["Entries"])


@router.post("/", response_model=EntryRead, status_code=status.HTTP_201_CREATED)
async def create_entry(entry_create: EntryCreate, request: Request, response: Response):
    result = await create_entry_service(entry_create)
    entry = result["entry"]
    # Set Location header to the new resource
    response.headers["Location"] = str(request.url_for("get_entry", entry_id=entry.id))
    return entry


@router.get("/", response_model=EntryListResponse)
async def list_entries(limit: int = 20, offset: int = 0, order: str = "desc"):
    return await list_entries_service(limit=limit, offset=offset, order=order)


@router.get("/{entry_id}", response_model=EntryRead, name="get_entry")
async def get_entry(entry_id: str):
    result = await get_entry_service(entry_id)
    return result["entry"]


@router.patch("/{entry_id}", response_model=EntryRead)
async def update_entry(entry_id: str, entry_update: EntryUpdate):
    result = await update_entry_service(entry_id, content=entry_update.content)
    return result["entry"]


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(entry_id: str):
    await delete_entry_service(entry_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
