from fastapi import APIRouter

from .entry import router as entry_router

version_router = APIRouter()
version_router.include_router(entry_router)
