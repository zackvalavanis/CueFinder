from pydantic import BaseModel
import uuid
from uuid import UUID
from pydantic import ConfigDict


class PTablesResponse(BaseModel):
    id: UUID
    place_id: str
    rating: float | None = None
    table_size: float | None = None
    location: str
    user_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class PTablesCreate(BaseModel):
    rating: float | None = None
    table_size: float | None = None
    location: str
    place_id: str
