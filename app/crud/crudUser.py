from sqlalchemy.orm import Session

from app.models import userModel
from app.schemas import userSchema

def get_user(db: Session, id: int):
    return db.query(userModel.User).filter(userModel.User.id == id).first()


def get_user_by_email(db: Session, correo: str):
    return db.query(userModel.User).filter(userModel.User.correo == correo).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(userModel.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: userSchema.UserCreate):
    db_user = userModel.User(nombre=user.nombre, correo=user.correo, contraseña=user.contraseña, telefono= user.telefono, direccion=user.direccion,rol=user.rol)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, id: int, updated_user: userSchema.UserCreate):
    db_user = db.query(userModel.User).filter(userModel.User.id == id).first()
    if not db_user:
        return None
    db_user.nombre = updated_user.nombre
    db_user.correo = updated_user.correo
    db_user.telefono = updated_user.telefono
    db_user.direccion = updated_user.direccion
    db_user.rol = updated_user.rol
    db.commit()
    db.refresh(db_user)
    return db_user