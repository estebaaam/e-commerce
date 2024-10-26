from sqlalchemy import Column,String, Integer
from app.core.config import Base

class Category(Base):
    __tablename__ = "categoria"
    
    id = Column(Integer, primary_key=True)
    nombre = Column(String(30))