import os

from fastapi import FastAPI, File, Form
from starlette.responses import FileResponse

import backend.filemanager as filemanager

app = FastAPI()


@app.get("/get")
async def get(pos: str):
    res = filemanager.list_directory(pos)
    return res


@app.post("/rename")
async def rename(old: str, newname: str):
    res = filemanager.rename(old, newname)
    return res


@app.post("/upload")
async def upload(file: bytes = File(...), path: str = Form(...)):
    res = filemanager.upload(file, path)
    return res


@app.get("/download")
async def download(path: str):
    path = filemanager.get_path(path)
    if path is None:
        return False
    return FileResponse(path=path, filename=os.path.basename(path), media_type='application/octet-stream')


@app.post("/delete")
async def delete(path: str):
    res = filemanager.delete(path)
    return res
