from contextlib import asynccontextmanager

from fastapi import FastAPI

from habitual.api.v1 import version_router as v1_router
from habitual.db.base import initialize_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_db()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(v1_router, prefix="/api/v1")
