from pydantic import BaseModel
import uuid
from uuid import UUID
from pydantic import ConfigDict
from datetime import datetime


class MatchesResponse(BaseModel):
    id: UUID
    player1_id: UUID
    player2_id: UUID
    winner_id: UUID | None = None
    location: str | None = None
    played_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MatchesCreate(BaseModel):
    player2_id: UUID
    winner_id: UUID | None = None
    location: str | None = None
