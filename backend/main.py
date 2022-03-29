import os
import shutil
import threading
from datetime import timedelta

from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles

from fastapi import FastAPI, File, Form, HTTPException, Depends
from starlette import status
from starlette.responses import FileResponse

import filemanager as filemanager
from backend.auth import Token, authenticate_user, ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, User, \
    get_current_active_user

app = FastAPI()


@app.get("/get")
async def get(pos: str, current_user: User = Depends(get_current_active_user)):
    res = filemanager.list_directory(pos)
    return res


@app.post("/rename")
async def rename(old: str, newname: str, current_user: User = Depends(get_current_active_user)):
    res = filemanager.rename(old, newname)
    return res


@app.post("/upload")
async def upload(file: bytes = File(...), path: str = Form(...), current_user: User = Depends(get_current_active_user)):
    res = filemanager.upload(file, path)
    return res


@app.get("/download")
async def download(path: str, current_user: User = Depends(get_current_active_user)):
    path = filemanager.get_path(path)
    if path is None:
        return False
    if os.path.isdir(path):
        shutil.make_archive(os.path.join(os.getcwd(), "download"), "zip", path)
        response = FileResponse(os.path.join(os.getcwd(), "download.zip"),
                                filename=os.path.splitext(os.path.basename(path))[0] + ".zip",
                                media_type='application/octet-stream')
        threading.Timer(1.0, lambda: os.remove(os.path.join(os.getcwd(), "download.zip"))).start()
        return response
    else:
        return FileResponse(path=path, filename=os.path.basename(path), media_type='application/octet-stream')


@app.post("/delete")
async def delete(path: str, current_user: User = Depends(get_current_active_user)):
    res = filemanager.delete(path)
    return res


@app.get("/")
async def server_index():
    if not os.path.isfile(os.path.join(os.getcwd(), "static/index.html")):
        raise HTTPException(status_code=404)

    return FileResponse(path=os.path.join(os.getcwd(), "static/index.html"), media_type="text/html")


@app.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": os.environ["ADMIN_LOGIN"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


app.mount("/", StaticFiles(directory="static"), name="static")
