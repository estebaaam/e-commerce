from sqlalchemy.orm import Session

from app.models import orderModel
from app.schemas import orderShema
from app.schemas.orderShema import OrderUpdate

def get_orders(db: Session, id_usuario: int):
    return db.query(orderModel.Order).filter(orderModel.Order.id_usuario == id_usuario).all()
  
def get_all_orders(db: Session, skip: int = 0, limit: int = 100):
  return db.query(orderModel.Order).offset(skip).limit(limit).all()


def create_order(db: Session, order: orderShema.OrderCreate):
    db_order = orderModel.Order(id_usuario=order.id_usuario, estado=order.estado,nombre_envio=order.nombre_envio,telefono_envio=order.telefono_envio, correo_envio = order.correo_envio, direccion_envio=order.direccion_envio, cantidad_total= order.cantidad_total, precio_total=order.precio_total)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order
  
def update_order(db: Session, id: int, updated_order: OrderUpdate):
    db_order = db.query(orderModel.Order).filter(orderModel.Order.id == id).first()
    if not db_order:
        return None
    db_order.estado = updated_order.estado  # Solo se actualiza el estado
    db.commit()
    db.refresh(db_order)
    return db_order