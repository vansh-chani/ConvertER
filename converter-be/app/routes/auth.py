from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.schemas.token import Token, TokenData
from app.schemas.user import User
from app.schemas.auth import signup_form
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import authenticate_user, get_current_active_user
from app.core.security import create_access_token, oauth2_scheme, create_user
from app.core.config import settings
from datetime import datetime, timedelta
router = APIRouter()

@router.post("/signup", response_model=Token)
async def signup (signup_data: signup_form = Depends()):
    user = create_user(signup_data.username, signup_data.password, signup_data.email)
    if not user:
        return JSONResponse(status_code=400, content={"detail": "User already exists"})
    access_token_expires =  timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "email": user.email},
        expires_delta=access_token_expires
    )
    return JSONResponse(content={"access_token": access_token, "token_type": "bearer"})

@router.post("/login", response_model=Token)
async def login (form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        return JSONResponse(status_code=401, content={"detail": "Invalid credentials"}, headers={"WWW-Authenticate": "Bearer"})
    access_token_expires =  timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )
    return JSONResponse(content={"access_token": access_token, "token_type": "bearer"})

@router.get("/users/me", response_model=User)
async def read_users_me(curr_user: User = Depends(get_current_active_user)):
    return curr_user