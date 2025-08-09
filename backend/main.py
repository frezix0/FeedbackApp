from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import pandas as pd
from datetime import datetime
import json

from database import get_db, engine
from models import Base, Feedback
from schemas import FeedbackCreate, FeedbackResponse, AnalyticsResponse
from sentiment_analyzer import analyze_sentiment

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Feedback Analysis API",
    description="API untuk mengumpulkan dan menganalisis feedback pengguna",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Feedback Analysis API", "version": "1.0.0"}

@app.post("/feedback", response_model=FeedbackResponse)
async def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    """
    Submit feedback baru dengan analisis sentimen otomatis
    """
    # Analisis sentimen dengan mempertimbangkan rating
    sentiment = analyze_sentiment(feedback.message, feedback.rating)
    
    # Buat feedback baru
    db_feedback = Feedback(
        name=feedback.name,
        email=feedback.email,
        rating=feedback.rating,
        message=feedback.message,
        sentiment=sentiment
    )
    
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return db_feedback

@app.get("/feedback", response_model=List[FeedbackResponse])
async def get_feedback(
    skip: int = 0,
    limit: int = 100,
    sentiment: Optional[str] = None,
    rating: Optional[int] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db)
):
    """
    Ambil semua feedback dengan filtering dan sorting
    """
    query = db.query(Feedback)
    
    # Filtering
    if sentiment:
        query = query.filter(Feedback.sentiment == sentiment)
    if rating:
        query = query.filter(Feedback.rating == rating)
    
    # Sorting
    if sort_by == "name":
        order_column = Feedback.name
    elif sort_by == "rating":
        order_column = Feedback.rating
    elif sort_by == "sentiment":
        order_column = Feedback.sentiment
    else:
        order_column = Feedback.created_at
    
    if sort_order == "asc":
        query = query.order_by(order_column.asc())
    else:
        query = query.order_by(order_column.desc())
    
    feedback_list = query.offset(skip).limit(limit).all()
    return feedback_list

@app.get("/feedback/analytics", response_model=AnalyticsResponse)
async def get_analytics(db: Session = Depends(get_db)):
    """
    Ambil data analitik untuk dashboard
    """
    # Ambil semua feedback
    feedback_list = db.query(Feedback).all()
    
    if not feedback_list:
        return AnalyticsResponse(
            total_feedback=0,
            sentiment_distribution={"positif": 0, "negatif": 0, "neutral": 0},
            rating_distribution={},
            average_rating=0,
            recent_feedback=[]
        )
    
    # Analisis sentimen menggunakan SQLAlchemy
    sentiment_counts = {"positif": 0, "negatif": 0, "neutral": 0}
    rating_counts = {}
    total_rating = 0
    
    for feedback in feedback_list:
        # Count sentiment
        sentiment = feedback.sentiment.lower()
        if sentiment in sentiment_counts:
            sentiment_counts[sentiment] += 1
        
        # Count rating
        rating = str(feedback.rating)
        rating_counts[rating] = rating_counts.get(rating, 0) + 1
        
        # Sum rating for average
        total_rating += feedback.rating
    
    # Calculate average rating
    average_rating = round(total_rating / len(feedback_list), 2) if feedback_list else 0
    
    # Get recent feedback (5 terakhir)
    recent_feedback = []
    sorted_feedback = sorted(feedback_list, key=lambda x: x.created_at, reverse=True)
    for feedback in sorted_feedback[:5]:
        recent_feedback.append({
            "id": feedback.id,
            "name": feedback.name,
            "rating": feedback.rating,
            "sentiment": feedback.sentiment,
            "created_at": feedback.created_at.isoformat()
        })
    
    return AnalyticsResponse(
        total_feedback=len(feedback_list),
        sentiment_distribution=sentiment_counts,
        rating_distribution=rating_counts,
        average_rating=average_rating,
        recent_feedback=recent_feedback
    )

@app.get("/feedback/{feedback_id}", response_model=FeedbackResponse)
async def get_feedback_by_id(feedback_id: int, db: Session = Depends(get_db)):
    """
    Ambil feedback berdasarkan ID
    """
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if feedback is None:
        raise HTTPException(status_code=404, detail="Feedback tidak ditemukan")
    return feedback

@app.put("/feedback/fix-sentiments")
async def fix_sentiments(db: Session = Depends(get_db)):
    """
    Perbaiki sentimen untuk semua feedback yang sudah ada
    """
    try:
        feedback_list = db.query(Feedback).all()
        updated_count = 0
        
        for feedback in feedback_list:
            # Analisis ulang sentimen dengan rating
            new_sentiment = analyze_sentiment(feedback.message, feedback.rating)
            
            # Update jika sentimen berubah
            if feedback.sentiment != new_sentiment:
                feedback.sentiment = new_sentiment
                updated_count += 1
        
        db.commit()
        
        return {
            "message": f"Berhasil memperbaiki sentimen untuk {updated_count} feedback",
            "updated_count": updated_count,
            "total_feedback": len(feedback_list)
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Gagal memperbaiki sentimen: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 