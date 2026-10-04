from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

APP_DIR = Path(__file__).resolve().parent
DB_PATH = APP_DIR / "contentbravio.db"

app = FastAPI(
    title="Content Bravio API",
    version="0.1.0",
    description="Development API for Content Bravio."
)

# Development-only CORS.
# We will restrict this to the real Content Bravio domain when the API is deployed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ClientCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    company: str = Field(min_length=1, max_length=160)


class Client(ClientCreate):
    id: int


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialise_database():
    with get_connection() as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                company TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        db.commit()


initialise_database()


@app.get("/")
def root():
    return {
        "name": "Content Bravio API",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/clients", response_model=list[Client])
def list_clients():
    with get_connection() as db:
        rows = db.execute(
            "SELECT id, name, company FROM clients ORDER BY id DESC"
        ).fetchall()

    return [dict(row) for row in rows]


@app.post("/clients", response_model=Client, status_code=status.HTTP_201_CREATED)
def create_client(payload: ClientCreate):
    name = payload.name.strip()
    company = payload.company.strip()

    if not name or not company:
        raise HTTPException(
            status_code=400,
            detail="Name and company are required."
        )

    with get_connection() as db:
        cursor = db.execute(
            "INSERT INTO clients (name, company) VALUES (?, ?)",
            (name, company),
        )
        db.commit()
        client_id = cursor.lastrowid

    return {
        "id": client_id,
        "name": name,
        "company": company,
    }


@app.delete("/clients/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_client(client_id: int):
    with get_connection() as db:
        cursor = db.execute(
            "DELETE FROM clients WHERE id = ?",
            (client_id,),
        )
        db.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Client not found.")

    return None
