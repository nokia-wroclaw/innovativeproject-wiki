import time
import hashlib
import os
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import FileResponse

DATA_DIR = './data/'
PAGES_DIR = DATA_DIR + 'pages/'
USERS_DIR = DATA_DIR + 'users/'
PAGE_IMG_DIR = PAGES_DIR + '{id!s}/img/'
PAGE_ATCH_DIR = PAGES_DIR + '{id!s}/atch/'

router = APIRouter()


def new_file_name(page_id: str, old_filename: str):
    filename = page_id + str(time.time())
    filename = hashlib.md5(filename.encode('utf-8')).hexdigest()
    _, ext = os.path.splitext(old_filename)

    return filename + ext


async def upload_file(file: UploadFile, path: str):
    contents = await file.read()
    file.close()
    with open(path, "w+b") as f:
        f.write(contents)

    return {'Result': 'Success', 'File path': path}


@router.post('/uploadfile/{page_id}/img')
async def upload_img(page_id: str, username: str,
                     file: UploadFile = File(...)):
    path = PAGE_IMG_DIR.format(id=page_id) + \
        new_file_name(page_id, file.filename)
    return await upload_file(file, path)


@router.post('/uploadfile/{page_id}/atch')
async def upload_atch(page_id: str, username: str,
                      file: UploadFile = File(...)):
    path = PAGE_ATCH_DIR.format(id=page_id) + \
        new_file_name(page_id, file.filename)
    return await upload_file(file, path)


@router.get('/files/{page_id}/img/{img_id}')
async def get_img(page_id: str, img_id: str):
    path = PAGE_IMG_DIR.format(id=page_id) + img_id
    return FileResponse(path)


@router.get('/files/{page_id}/atch/{atch_id}')
async def get_atch(page_id: str, atch_id: str):
    path = PAGE_ATCH_DIR.format(id=page_id) + atch_id
    return FileResponse(path)
