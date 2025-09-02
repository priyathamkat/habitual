from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI

from habitual.api.v1 import version_router as v1_router
from habitual.db.base import initialize_db
from habitual.db.session import get_session


@asynccontextmanager
async def lifespan(app: FastAPI):
    initialize_db()
    yield


app = FastAPI(lifespan=lifespan)

# Pass dependency correctly as Depends(get_session) for all v1 routes
app.include_router(v1_router, prefix="/api/v1", dependencies=[Depends(get_session)])
