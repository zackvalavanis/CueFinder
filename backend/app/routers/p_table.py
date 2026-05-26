from app.schemas.p_tables import PTablesCreate, PTablesResponse
from app.database import get_db
from app.utils.auth import get_current_user
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.p_table import P_Table
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

router = APIRouter()


@router.get("/p_tables", response_model=List[PTablesResponse])
def get_tables(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tables = db.query(P_Table).filter(P_Table.user_id == user.id).all()
    return tables
