from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models import Country, City, Business, Tourism, Product


app = FastAPI(
    title="ASEM Global API",
    version="1.0.0",
)


@app.get("/")
def home():
    return {
        "project": "ASEM Global Platform",
        "status": "online",
    }


@app.get("/health")
def health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "status": "healthy",
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        )


@app.get("/countries")
def countries(db: Session = Depends(get_db)):
    return [
        item.to_dict()
        for item in db.query(Country).all()
    ]


@app.get("/cities")
def cities(db: Session = Depends(get_db)):
    return [
        item.to_dict()
        for item in db.query(City).all()
    ]


@app.get("/businesses")
def businesses(db: Session = Depends(get_db)):
    return [
        item.to_dict()
        for item in db.query(Business).all()
    ]


@app.get("/tourism")
def tourism(db: Session = Depends(get_db)):
    return [
        item.to_dict()
        for item in db.query(Tourism).all()
    ]


@app.get("/products")
def products(db: Session = Depends(get_db)):
    return [
        item.to_dict()
        for item in db.query(Product).all()
    ]
