from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=True)
    rating = Column(Integer, nullable=False)
    message = Column(Text, nullable=False)
    sentiment = Column(String(20), nullable=False)  # positif, negatif, neutral
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 