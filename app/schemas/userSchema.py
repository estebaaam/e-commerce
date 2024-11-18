from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    nombre: str
    correo: EmailStr
    telefono: str
    direccion: str
    contraseña: str
    rol: str

class User(BaseModel):
    id: int
    nombre: str
    correo: str
    telefono: str
    direccion: str
    rol: str

    class Config:
        orm_mode = True
