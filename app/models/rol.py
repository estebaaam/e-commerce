from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from core.config import Base

class Rol(Base):
    __tablename__ = "rol"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(30))
    
    users = relationship("User", back_populates="rol")
