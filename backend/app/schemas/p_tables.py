from pydantic import BaseModel
import uuid
from uuid import UUID
from pydantic import ConfigDict


class PTablesResponse(BaseModel):
    id: UUID
    rating: float
    table_size: float
    location: str
    user_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class PTablesCreate(BaseModel):
    rating: float
    table_size: float
    location: str
