from pydantic import BaseModel
from datetime import datetime

class ReviewCreate(BaseModel):
    id_usuario: int
    id_producto: int
    id_pedido: int
    comentario: str
    calificacion: int

class Review(BaseModel):
    id : int
    id_usuario: int
    id_producto: int
    id_pedido: int
    comentario: str
    calificacion: int
    fecha_reseña : datetime

    class Config:
        orm_mode = True
