from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.crud import crudCart_order
from app.models import cart_orderModel
from app.schemas import cart_orderSchema
from app.core.config import SessionLocal, engine

cart_orderModel.Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.post("/cartOrder/", response_model=cart_orderSchema.CartOrder)
def create_cart_order(cart_order: cart_orderSchema.CartOrder, db: Session = Depends(get_db)):
  return crudCart_order.create_cart_order(db=db, cart_order=cart_order)
  

@router.get("/cartOrder/{id_usuario}", response_model=list[cart_orderSchema.CartOrder])
def read_cart_order(id_usuario: int, db: Session = Depends(get_db)):
    cart_order = crudCart_order.get_cart_order(db, id_usuario=id_usuario)
    if cart_order is None:
        raise HTTPException(status_code=404, detail="Cart Order not found")
    return cart_order