from sqlalchemy import Column, String, Integer ,ForeignKey, DateTime, func, SmallInteger
from app.core.config import Base


class Review(Base):
    __tablename__ = "reseña"
    
    id = Column(Integer, primary_key=True)
    id_usuario = Column(Integer,ForeignKey("carrito_pedido.id_usuario"))
    id_producto = Column(Integer,ForeignKey("carrito_pedido.id_producto"))
    id_pedido = Column(Integer,ForeignKey("carrito_pedido.id_pedido"))
    comentario = Column(String(200))
    calificacion = Column(SmallInteger)
    fecha_reseña = Column(DateTime, server_default=func.now())