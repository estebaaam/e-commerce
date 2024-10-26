from pydantic import BaseModel
from datetime import date


class ProductCreate(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    imagen: str
    existencias: int
    ultima_actualizacion: date
    id_categoria: int

class Product(BaseModel):
    id: int
    nombre: str
    descripcion: str
    precio: float
    imagen: str
    existencias: int
    ultima_actualizacion: date
    id_categoria: int

    class Config:
        orm_mode = True
