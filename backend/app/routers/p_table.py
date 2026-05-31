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


@router.get("/p_tables/{id}", response_model=PTablesResponse)
def get_table(
    id: UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    table = (
        db.query(P_Table).filter(P_Table.user_id == user.id, P_Table.id == id).first()
    )
    return table


@router.post("/p_tables", response_model=PTablesResponse)
def new_p_table(
    new_p_table: PTablesCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    new_p_table = P_Table(
        rating=new_p_table.rating,
        location=new_p_table.location,
        table_size=new_p_table.table_size,
        user_id=user.id,
    )
    db.add(new_p_table)
    db.commit()
    db.refresh(new_p_table)
    return new_p_table


@router.delete("/p_tables/{id}", response_model=PTablesResponse)
def delete_p_table(id: UUID, db: Session = Depends(get_db)):
    db_p_table = db.query(P_Table).filter(P_Table.id == id).first()

    if not db_p_table:
        raise HTTPException(status_code=404, detail="Pool table not found.")

    db.delete(db_p_table)
    db.commit()
    return db_p_table
