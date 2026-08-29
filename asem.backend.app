from fastapi import FastAPI, HTTPException
from sqlalchemy import text

from app.database.connection import engine
from app.api.routes import router

app = FastAPI(
    title="ASEM Global API",
    version="1.0.0",
)

app.include_router(router, prefix="/api")


@app.get("/")
def home():
    return {
        "project": "ASEM Global Platform",
        "status": "online",
    }


@app.get("/health")
def health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "status": "healthy",
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        )
