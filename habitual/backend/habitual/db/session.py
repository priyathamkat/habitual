from sqlmodel import Session

from .base import engine


def get_session():
    with Session(engine) as session:
        yield session
