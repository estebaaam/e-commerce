from sqlalchemy import Column, Integer, ForeignKey
from app.core.config import Base


class Cart(Base):
    __tablename__ = "carrito"
    
    id_producto = Column(Integer,ForeignKey("producto.id"),primary_key=True)
    id_usuario = Column(Integer,ForeignKey("usuario.id"),primary_key=True)
    cantidad = Column(Integer)