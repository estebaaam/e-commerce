from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.crud import crudUser
from app.models import userModel
from app.schemas import userSchema
from app.core.config import SessionLocal, engine

userModel.Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.post("/users/", response_model=userSchema.UserCreate)
def create_user(user: userSchema.UserCreate, db: Session = Depends(get_db)):
    db_user = crudUser.get_user_by_email(db, correo=user.correo)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crudUser.create_user(db=db, user=user)


@router.get("/users/", response_model=list[userSchema.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crudUser.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/users/{id}", response_model=userSchema.User)
def read_user(id: int, db: Session = Depends(get_db)):
    db_user = crudUser.get_user(db, id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/users/{id}", response_model=userSchema.User)
def update_user(id: int, user: userSchema.UserCreate, db: Session = Depends(get_db)):
    db_user = crudUser.get_user(db, id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user = crudUser.update_user(db=db, id=id, updated_user=user)
    return updated_user
  
@router.delete("/users/{id}", response_model=userSchema.User)
def delete_user(id: int, db: Session = Depends(get_db)):
    db_user = crudUser.get_user(db, id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    deleted_user = crudUser.delete_user(db=db, id=id)
    return deleted_user
        



