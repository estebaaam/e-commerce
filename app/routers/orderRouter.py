from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from app.crud import crudOrder
from app.models import orderModel
from app.schemas import orderShema
from app.core.config import SessionLocal, engine

orderModel.Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.post("/orders/", response_model=orderShema.Order)
def create_order(order: orderShema.OrderCreate, db: Session = Depends(get_db)):
  return crudOrder.create_order(db=db, order=order)

@router.get("/orders/", response_model=list[orderShema.Order])
def read_all_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    orders = crudOrder.get_all_orders(db, skip=skip, limit=limit)
    return orders

@router.get("/orders/{id_usuario}", response_model=list[orderShema.Order])
def read_orders(id_usuario: int, db: Session = Depends(get_db)):
    orders = crudOrder.get_orders(db, id_usuario=id_usuario)
    return orders

@router.put("/orders/{id}", response_model=orderShema.Order)
def update_order(id: int, order: orderShema.OrderCreate, db: Session = Depends(get_db)):
    updated_product = crudOrder.update_order(db=db, id=id, updated_order=order)
    return updated_product
