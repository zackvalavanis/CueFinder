from sqlalchemy import String, Column, Float, ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid


class P_Table(Base):
    __tablename__ = "p_tables"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=True)
    place_id = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    table_size = Column(Float, nullable=True)
    location = Column(String, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    maps_url = Column(String, nullable=True)

    user = relationship("User", back_populates="p_tables")
