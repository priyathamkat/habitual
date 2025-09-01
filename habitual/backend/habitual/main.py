from fastapi import FastAPI

from habitual.api.v1 import version_router as v1_router

app = FastAPI()


app.include_router(v1_router, prefix="/api/v1")
