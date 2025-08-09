from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List
from datetime import datetime

class FeedbackBase(BaseModel):
    name: str
    email: Optional[str] = None
    rating: int
    message: str

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackResponse(FeedbackBase):
    id: int
    sentiment: str
    created_at: datetime

    class Config:
        from_attributes = True

class AnalyticsResponse(BaseModel):
    total_feedback: int
    sentiment_distribution: Dict[str, int]
    rating_distribution: Dict[str, int]
    average_rating: float
    recent_feedback: List[Dict] 