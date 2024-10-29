from sqlalchemy.orm import Session

from app.models import categoryModel
from app.schemas import categoryShema

def get_category(db: Session, id: int):
    return db.query(categoryModel.Category).filter(categoryModel.Category.id == id).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(categoryModel.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: categoryShema.CreateCategory):
    db_category = categoryModel.Category(nombre=category.nombre)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category
  
def update_category(db: Session, id: int, updated_category: categoryShema.CreateCategory):
    db_category = db.query(categoryModel.Category).filter(categoryModel.Category.id == id).first()
    if not db_category:
        return None
    db_category.nombre = updated_category.nombre
    db.commit()
    db.refresh(db_category)
    return db_category

def delete_category(db: Session, id: int):
    db_category = db.query(categoryModel.Category).filter(categoryModel.Category.id == id).first()
    if not db_category:
        return None
    db.delete(db_category)
    db.commit()
    return db_category