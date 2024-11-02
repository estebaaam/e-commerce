from pydantic import BaseModel

class CartOrder(BaseModel):
  id_producto: int
  id_usuario: int
  id_pedido: int
  cantidad: int
  
  class Config:
        orm_mode = True