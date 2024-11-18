from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.config import SessionLocal
from app.core.security import create_access_token, verify_password
from app.core.security import verify_token
from app.crud.crudUser import get_user_by_email, create_user
from app.core.security import pwd_context
from app.schemas.authSchema import Token
from app.schemas.userSchema import UserCreate, User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, correo=form_data.username)
    if not user or not verify_password(form_data.password, user.contraseña):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": user.correo})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify-token")
async def check_token_validity(username: str = Depends(verify_token)):
    return {"valid": True, "username": username}

@router.post("/users/", response_model=Token)
async def create_user_endpoint(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, correo=user.correo)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = pwd_context.hash(user.contraseña)
    user.contraseña = hashed_password
    new_user = create_user(db, user)
    access_token = create_access_token({"sub": new_user.correo})
    return {"access_token": access_token, "token_type": "bearer"}