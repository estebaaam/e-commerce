from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from core.config import Base
from models.rol import Rol

class User(Base):
    __tablename__ = "usuario"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(30))
    correo = Column(String(30), unique=True, index=True)
    contraseña = Column(String(30))
    telefono = Column(String(30))
    direccion = Column(String(30))
    
    id_rol = Column(String(30), ForeignKey("rol.id"))
    
    rol = relationship("Rol", back_populates="usuario")
