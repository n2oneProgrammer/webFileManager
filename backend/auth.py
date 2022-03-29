import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel
import hashlib

SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


class UserInDB(User):
    hashed_password: str


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app = FastAPI()


def verify_password(plain_password, hashed_password):
    pwd_context = hashlib.sha256()
    pwd_context.update(bytes(plain_password, "UTF-8"))
    return pwd_context.hexdigest() == hashed_password


def get_password_hash(password):
    pwd_context = hashlib.sha256()
    pwd_context.update(bytes(password))
    return pwd_context.hexdigest()


def authenticate_user(username: str, password: str):
    if username != os.environ["ADMIN_LOGIN"]:
        return False
    print(os.environ, password, os.environ["ADMIN_PASS_SHA256"])
    if not verify_password(password, os.environ["ADMIN_PASS_SHA256"]):
        return False
    return True


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception

    if token_data.username != os.environ["ADMIN_LOGIN"]:
        raise credentials_exception
    return True


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    return current_user
