from sqlalchemy.orm import Session

from app.models import cartModel
from app.schemas import cartSchema

def get_cart(db: Session, id_usuario: int):
    return db.query(cartModel.Cart).filter(cartModel.Cart.id_usuario == id_usuario).all()


def create_cart(db: Session, cart: cartSchema.Cart):
    db_cart = cartModel.Cart(id_producto=cart.id_producto, id_usuario=cart.id_usuario, cantidad=cart.cantidad)
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart
  
def update_cart(db: Session, id_usuario: int, id_producto: int, updated_cart: cartSchema.Cart):
    db_cart = db.query(cartModel.Cart).filter(
        cartModel.Cart.id_usuario == id_usuario,
        cartModel.Cart.id_producto == id_producto
    ).first()
    if not db_cart:
        return None
    db_cart.cantidad = updated_cart.cantidad
    db.commit()
    db.refresh(db_cart)
    return db_cart

def delete_cart(db: Session, id_usuario: int, id_producto: int):
    db_cart = db.query(cartModel.Cart).filter(
        cartModel.Cart.id_usuario == id_usuario,
        cartModel.Cart.id_producto == id_producto
    ).first()
    
    if not db_cart:
        return None
    db.delete(db_cart)
    db.commit()
    return db_cart