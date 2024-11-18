from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.crud import crudUser
from app.models import userModel
from app.schemas import userSchema
from app.core.config import SessionLocal, engine
from app.core.security import verify_token

userModel.Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

@router.get("/users/", response_model=list[userSchema.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    users = crudUser.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/users/{correo}", response_model=userSchema.User)
def read_user(correo: str, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    db_user = crudUser.get_user_by_email(db, correo=correo)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/users/id/{id}", response_model=userSchema.User)
def read_user(id: int, db: Session = Depends(get_db)):
    db_user = crudUser.get_user(db, id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/users/{id}", response_model=userSchema.User)
def update_user(id: int, user: userSchema.User, db: Session = Depends(get_db), email: str = Depends(verify_token)):
    db_user = crudUser.get_user(db, id=id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user = crudUser.update_user(db=db, id=id, updated_user=user)
    return updated_user


