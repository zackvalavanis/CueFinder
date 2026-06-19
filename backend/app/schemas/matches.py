from pydantic import BaseModel
import uuid
from uuid import UUID
from pydantic import ConfigDict
from datetime import datetime


class PlayerInfo(BaseModel):
    id: UUID
    first_name: str
    last_name: str

    model_config = ConfigDict(from_attributes=True)


class MatchesResponse(BaseModel):
    id: UUID
    player1: PlayerInfo
    player2: PlayerInfo
    winner_id: UUID | None = None
    location: str | None = None
    played_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MatchesCreate(BaseModel):
    player1_id: UUID
    player2_id: UUID
    winner_id: UUID | None = None
    location: str | None = None
