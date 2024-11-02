from sqlalchemy import Column, Integer, ForeignKey
from app.core.config import Base


class CartOrder(Base):
    __tablename__ = "carrito_pedido"
    
    id_producto = Column(Integer,primary_key=True)
    id_usuario = Column(Integer,primary_key=True)
    id_pedido = Column(Integer,ForeignKey("pedido.id"),primary_key=True)
    cantidad = Column(Integer)