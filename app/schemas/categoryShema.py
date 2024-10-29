from pydantic import BaseModel

class CreateCategory(BaseModel):
  nombre: str
  
class Category(BaseModel):
  id: int
  nombre: str
  
  class Config:
        orm_mode = True