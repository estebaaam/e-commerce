from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from app.crud import crudReview
from app.models import reviewModel
from app.schemas import reviewSchema
from app.core.config import SessionLocal, engine

reviewModel.Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.post("/reviews/", response_model=reviewSchema.ReviewCreate)
def create_review(review: reviewSchema.ReviewCreate, db: Session = Depends(get_db)):
  return crudReview.create_review(db=db, review=review)


@router.get("/reviews/product/{id_producto}", response_model=list[reviewSchema.Review])
def read_product_review(id_producto: int, db: Session = Depends(get_db)):
    reviews = crudReview.get_product_review(db, id_producto=id_producto)
    return reviews


@router.get("/reviews/user/{id_usuario}", response_model=list[reviewSchema.Review])
def read_user_reviews(id_usuario: int, db: Session = Depends(get_db)):
    reviews = crudReview.get_user_reviews(db, id_usuario=id_usuario)
    return reviews

@router.put("/reviews/{id}", response_model=reviewSchema.Review)
def update_review(id: int, review: reviewSchema.ReviewCreate, db: Session = Depends(get_db)):
    updated_review = crudReview.update_review(db=db, id=id, updated_review=review)
    return updated_review
  
@router.delete("/reviews/{id}", response_model=reviewSchema.Review)
def delete_review(id: int, db: Session = Depends(get_db)):
    deleted_review = crudReview.delete_review(db=db, id=id)
    return deleted_review