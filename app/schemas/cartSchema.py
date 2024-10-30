from pydantic import BaseModel

class Cart(BaseModel):
  id_producto: int
  id_usuario: int
  cantidad: int
  
  class Config:
        orm_mode = True