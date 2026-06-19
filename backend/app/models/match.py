from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime
from app.database import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime


class Match(Base):
    __tablename__ = "matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), nullable=True)
    player1_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    player2_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    winner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    location = Column(String, nullable=True)
    played_at = Column(DateTime, default=datetime.utcnow)

    player1 = relationship("User", foreign_keys=[player1_id])
    player2 = relationship("User", foreign_keys=[player2_id])
    winner = relationship("User", foreign_keys=[winner_id])
