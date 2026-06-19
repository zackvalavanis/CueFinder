from datetime import datetime
from app.schemas.matches import MatchesCreate, MatchesResponse
from app.database import get_db
from app.utils.auth import get_current_user
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.match import Match
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from sqlalchemy.orm import joinedload

router = APIRouter()


@router.get("/matches", response_model=List[MatchesResponse])
def get_all_matches(db: Session = Depends(get_db)):
    matches = (
        db.query(Match)
        .options(joinedload(Match.player1), joinedload(Match.player2))
        .all()
    )
    return matches


@router.get("/matches/me", response_model=list[MatchesResponse])
def get_my_matches(
    db: Session = Depends(get_db), current_user=Depends(get_current_user)
):
    matches = (
        db.query(Match)
        .options(joinedload(Match.player1), joinedload(Match.player2))
        .filter(
            (Match.player1_id == current_user.id)
            | (Match.player2_id == current_user.id)
        )
        .all()
    )
    return matches


@router.post("/matches", response_model=MatchesResponse)
def create_match(
    match: MatchesCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    new_match = Match(
        player1_id=user.id,
        player2_id=match.player2_id,
        winner_id=match.winner_id,
        location=match.location,
    )
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return new_match


@router.patch("/matches/{id}", response_model=MatchesResponse)
def update_match(
    id: UUID,
    match: MatchesCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_match = (
        db.query(Match).filter(Match.id == id, Match.player1_id == user.id).first()
    )
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    db_match.winner_id = match.winner_id
    db_match.location = match.location
    db.commit()
    db.refresh(db_match)
    return db_match


@router.delete("/matches/{id}", response_model=MatchesResponse)
def delete_match(
    id: UUID, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    db_match = (
        db.query(Match).filter(Match.id == id, Match.player1_id == user.id).first()
    )
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    db.delete(db_match)
    db.commit()
    return db_match


@router.get("/matches/record")
def get_record(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wins = db.query(Match).filter(Match.winner_id == user.id).count()
    losses = (
        db.query(Match)
        .filter(
            ((Match.player1_id == user.id) | (Match.player2_id == user.id))
            & (Match.winner_id != user.id)
            & (Match.winner_id != None)
        )
        .count()
    )
    return {"wins": wins, "losses": losses}


@router.post("/matches/session")
def create_session(matches: list[MatchesCreate], db: Session = Depends(get_db)):
    for m in matches:
        match = Match(
            player1_id=m.player1_id,
            player2_id=m.player2_id,
            winner_id=m.winner_id,
            played_at=datetime.utcnow(),
        )
        db.add(match)
    db.commit()
    return {"Saved:", len(matches)}


@router.get("/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).all()

    result = []

    for user in users:
        wins = db.query(Match).filter(Match.winner_id == user.id).count()
        losses = (
            db.query(Match)
            .filter(
                ((Match.player1_id == user.id) | (Match.player2_id == user.id)),
                Match.winner_id != user.id,
                Match.winner_id != None,
            )
            .count()
        )
        result.append(
            {
                "id": str(user.id),
                "first_name": user.first_name,
                "last_name": user.last_name,
                "wins": wins,
                "losses": losses,
            }
        )
    return sorted(result, key=lambda x: x["wins"], reverse=True)
