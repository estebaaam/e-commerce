from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.crud import crudProduct
from app.models import productModel
from app.schemas import productSchema
from app.core.config import SessionLocal, engine
from app.core.security import verify_token

productModel.Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.post("/products/", response_model=productSchema.ProductCreate)
def create_product(product: productSchema.ProductCreate, db: Session = Depends(get_db), email: str = Depends(verify_token)):
  return crudProduct.create_product(db=db, product=product)


@router.get("/products/", response_model=list[productSchema.Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    products = crudProduct.get_products(db, skip=skip, limit=limit)
    return products

@router.get("/products/active", response_model=list[productSchema.Product])
def red_active_products(db: Session = Depends(get_db)):
    products = crudProduct.get_active_products(db)
    return products

@router.get("/products/{id}", response_model=productSchema.Product)
def read_product(id: int, db: Session = Depends(get_db)):
    db_product = crudProduct.get_product(db, id=id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.put("/products/{id}", response_model=productSchema.Product)
def update_product(id: int, product: productSchema.ProductCreate, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    db_product = crudProduct.get_product(db, id=id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="User not found")
    updated_product = crudProduct.update_product(db=db, id=id, updated_product=product)
    return updated_product
  
@router.delete("/products/{id}", response_model=productSchema.Product)
def delete_product(id: int, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    db_product = crudProduct.get_product(db, id=id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="User not found")
    deleted_product = crudProduct.delete_product(db=db, id=id)
    return deleted_product