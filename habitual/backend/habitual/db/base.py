import os

from sqlmodel import SQLModel, create_engine


def _build_database_url() -> str:
    user = os.getenv("DB_USER", "habitual")
    password_file = os.getenv("DB_PASSWORD_FILE", "")
    host = os.getenv("DB_HOST", "mysql")
    port = os.getenv("DB_PORT", "3306")
    name = os.getenv("DB_NAME", "habitual")

    password = ""
    if password_file:
        with open(password_file, "r") as f:
            password = f.read().strip()
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}"


DATABASE_URL = _build_database_url()
engine = create_engine(DATABASE_URL, pool_pre_ping=True)


def initialize_db() -> None:
    SQLModel.metadata.create_all(engine)
