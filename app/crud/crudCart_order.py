from sqlalchemy.orm import Session

from app.models import cart_orderModel
from app.schemas import cart_orderSchema

def get_cart_order(db: Session, id_usuario: int):
    return db.query(cart_orderModel.CartOrder).filter(cart_orderModel.CartOrder.id_usuario == id_usuario).all()


def create_cart_order(db: Session, cart_order: cart_orderSchema.CartOrder):
    db_cart_order = cart_orderModel.CartOrder(id_producto=cart_order.id_producto, id_pedido=cart_order.id_pedido, id_usuario=cart_order.id_usuario, cantidad=cart_order.cantidad)
    db.add(db_cart_order)
    db.commit()
    db.refresh(db_cart_order)
    return db_cart_order