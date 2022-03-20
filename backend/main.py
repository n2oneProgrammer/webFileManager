from fastapi import FastAPI, File, Form

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
