from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.country import Country

router = APIRouter(
    prefix="/countries",
    tags=["Countries"],
)


@router.get("/")
def get_countries(
    db: Session = Depends(get_db),
):
    statement = select(Country).order_by(Country.code)
    return db.scalars(statement).all()
