from fastapi import APIRouter, File, UploadFile

router = APIRouter()


@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    with open('/home/dominik/Sandbox/InnerDocs/backend/data/img/'+file.filename, 'wb+') as f:
        bytes = await file.read()
        f.write(bytes)
        f.close()
        return {"filename": file.filename, "type": file.content_type}
