import os

from sqlmodel import SQLModel, create_engine


def _build_database_url() -> str:
    user = os.environ["DB_USER"]
    password_file = os.environ["DB_PASSWORD_FILE"]
    host = os.environ["DB_HOST"]
    port = os.environ["DB_PORT"]
    name = os.environ["DB_NAME"]
    with open(password_file, "r") as f:
        password = f.read().strip()
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}"


DATABASE_URL = _build_database_url()
engine = create_engine(DATABASE_URL, pool_pre_ping=True)


def initialize_db() -> None:
    SQLModel.metadata.create_all(engine)
