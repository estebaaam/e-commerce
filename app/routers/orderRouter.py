from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.crud import crudOrder
from app.models import orderModel
from app.schemas import orderShema
from app.core.config import SessionLocal, engine
from app.schemas.orderShema import OrderUpdate
from app.core.security import verify_token

orderModel.Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.post("/orders/", response_model=orderShema.Order)
def create_order(order: orderShema.OrderCreate, db: Session = Depends(get_db), email: str = Depends(verify_token)):
  return crudOrder.create_order(db=db, order=order)

@router.get("/orders/", response_model=list[orderShema.Order])
def read_all_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    orders = crudOrder.get_all_orders(db, skip=skip, limit=limit)
    return orders

@router.get("/orders/{id_usuario}", response_model=list[orderShema.Order])
def read_orders(id_usuario: int, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    orders = crudOrder.get_orders(db, id_usuario=id_usuario)
    return orders

@router.put("/orders/{id}", response_model=orderShema.Order)
def update_order(id: int, order: OrderUpdate, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    updated_order = crudOrder.update_order(db=db, id=id, updated_order=order)
    if not updated_order:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return updated_order