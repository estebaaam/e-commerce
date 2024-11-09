from pydantic import BaseModel
from datetime import datetime

class OrderCreate(BaseModel):
    id_usuario: int
    estado: str
    nombre_envio: str
    telefono_envio: str
    correo_envio: str
    direccion_envio: str
    cantidad_total: int
    precio_total: float

class Order(BaseModel):
    id: int
    id_usuario: int
    estado: str
    nombre_envio: str
    telefono_envio: str
    correo_envio: str
    direccion_envio: str
    cantidad_total: int
    precio_total: float
    fecha_pedido: datetime

    class Config:
        orm_mode = True

class OrderUpdate(BaseModel):
    estado: str

    class Config:
        orm_mode = True

