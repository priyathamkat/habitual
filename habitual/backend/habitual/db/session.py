from contextlib import contextmanager

from sqlmodel import Session

from .base import engine


@contextmanager
def get_session():
    with Session(engine) as session:
        yield session
