from sqlalchemy import Column,String, Integer, Float, Date, func, ForeignKey
from app.core.config import Base


class Product(Base):
    __tablename__ = "producto"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(40))
    descripcion = Column(String(300))
    precio = Column(Float)
    imagen = Column(String(200))
    existencias = Column(Integer)
    ultima_actualizacion = Column(Date, default=func.now(), onupdate=func.now())
    id_categoria = Column(Integer,ForeignKey("categoria.id"))