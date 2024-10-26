from sqlalchemy import Column,String, Integer
from app.core.config import Base

class User(Base):
    __tablename__ = "usuario"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(30))
    correo = Column(String(30))
    contraseña = Column(String(30))
    telefono = Column(String(30))
    direccion = Column(String(30))
    rol = Column(String(30))