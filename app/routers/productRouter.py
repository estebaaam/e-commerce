from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.crud import crudProduct
from app.models import productModel
from app.models import categoryModel
from app.schemas import productSchema
from app.core.config import SessionLocal, engine

productModel.Base.metadata.create_all(bind=engine)
categoryModel.Base.metadata.create_all(bind=engine)


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.post("/products/", response_model=productSchema.ProductCreate)
def create_user(product: productSchema.ProductCreate, db: Session = Depends(get_db)):
  return crudProduct.create_product(db=db, product=product)


@router.get("/products/", response_model=list[productSchema.Product])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crudProduct.get_products(db, skip=skip, limit=limit)
    return products


@router.get("/products/{id}", response_model=productSchema.Product)
def read_user(id: str, db: Session = Depends(get_db)):
    db_product = crudProduct.get_product(db, id=id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product