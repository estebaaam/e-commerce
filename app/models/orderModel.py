from sqlalchemy import Column, String, Integer, Float,ForeignKey, DateTime, func
from app.core.config import Base


class Order(Base):
    __tablename__ = "pedido"
    
    id = Column(Integer, primary_key=True)
    id_usuario = Column(Integer,ForeignKey("usuario.id"))
    estado = Column(String(30))
    nombre_envio = Column(String(30))
    telefono_envio = Column(String(30))
    correo_envio = Column(String(30))
    direccion_envio = Column(String(30))
    cantidad_total = Column(Integer)
    precio_total = Column(Float)
    fecha_pedido = Column(DateTime, server_default=func.now())