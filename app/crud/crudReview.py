from sqlalchemy.orm import Session

from app.models import reviewModel
from app.schemas import reviewSchema

def get_product_review(db: Session, id_producto: int):
    return db.query(reviewModel.Review).filter(reviewModel.Review.id_producto == id_producto).all()

def get_user_reviews(db: Session, id_usuario: int):
    return db.query(reviewModel.Review).filter(reviewModel.Review.id_usuario == id_usuario).all()

def create_review(db: Session, review: reviewSchema.ReviewCreate):
    db_review = reviewModel.Review(id_usuario=review.id_usuario, id_producto=review.id_producto, id_pedido=review.id_pedido,comentario=review.comentario, calificacion= review.calificacion)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def update_review(db: Session, id: int, updated_review: reviewSchema.ReviewCreate):
    db_review = db.query(reviewModel.Review).filter(reviewModel.Review.id == id).first()
    if not db_review:
        return None
    db_review.id_usuario = updated_review.id_usuario
    db_review.id_producto = updated_review.id_producto
    db_review.id_pedido = updated_review.id_pedido
    db_review.comentario = updated_review.comentario
    db_review.calificacion = updated_review.calificacion
    db.commit()
    db.refresh(db_review)
    return db_review

def delete_review(db: Session, id: int):
    db_review = db.query(reviewModel.Review).filter(reviewModel.Review.id == id).first()
    if not db_review:
        return None
    db.delete(db_review)
    db.commit()
    return db_review