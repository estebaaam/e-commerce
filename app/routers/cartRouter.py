from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.crud import crudCart
from app.models import cartModel
from app.schemas import cartSchema
from app.core.config import SessionLocal, engine
from app.core.security import verify_token

cartModel.Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.post("/cart/", response_model=cartSchema.Cart)
def create_cart(cart: cartSchema.Cart, db: Session = Depends(get_db), email: str = Depends(verify_token)):
  return crudCart.create_cart(db=db, cart=cart)


@router.get("/cart/{id_usuario}", response_model=list[cartSchema.Cart])
def read_cart(id_usuario: int, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    cart_items = crudCart.get_cart(db, id_usuario=id_usuario)
    return cart_items
  

@router.put("/cart/{id_usuario}/{id_producto}", response_model=cartSchema.Cart)
def update_cart(id_usuario: int, id_producto: int, cart: cartSchema.Cart, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    updated_cart = crudCart.update_cart(db=db, id_usuario=id_usuario, id_producto=id_producto, updated_cart=cart)
    if not updated_cart:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return updated_cart

@router.delete("/cart/{id_usuario}/{id_producto}", response_model=cartSchema.Cart)
def delete_cart(id_usuario: int, id_producto: int, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    deleted_cart = crudCart.delete_cart(db=db, id_usuario=id_usuario, id_producto=id_producto)
    if not deleted_cart:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return deleted_cart