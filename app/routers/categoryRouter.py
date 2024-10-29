from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.crud import crudCategory
from app.models import categoryModel
from app.schemas import categoryShema
from app.core.config import SessionLocal, engine

categoryModel.Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.post("/categories/", response_model=categoryShema.CreateCategory)
def create_category(category: categoryShema.CreateCategory, db: Session = Depends(get_db)):
  return crudCategory.create_category(db=db, category=category)


@router.get("/categories/", response_model=list[categoryShema.Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = crudCategory.get_categories(db, skip=skip, limit=limit)
    return categories


@router.get("/categories/{id}", response_model=categoryShema.Category)
def read_category(id: int, db: Session = Depends(get_db)):
    db_category = crudCategory.get_category(db, id=id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.put("/categories/{id}", response_model=categoryShema.Category)
def update_category(id: int, category: categoryShema.CreateCategory, db: Session = Depends(get_db)):
    db_category = crudCategory.get_category(db, id=id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    updated_category = crudCategory.update_category(db=db, id=id, updated_category=category)
    return updated_category
  
@router.delete("/categories/{id}", response_model=categoryShema.Category)
def delete_category(id: int, db: Session = Depends(get_db)):
    db_category = crudCategory.get_category(db, id=id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    deleted_category = crudCategory.delete_category(db=db, id=id)
    return deleted_category
  