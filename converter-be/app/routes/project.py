from fastapi import APIRouter
from fastapi.responses import JSONResponse
import os

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(BASE_DIR, "demo.er")


@router.get("/demo")
async def get_project():
    print(file_path)
    if os.path.exists(file_path):
        with open(file_path) as f:
            content = f.read()
        response = eval(content)
        return JSONResponse(response)
    return JSONResponse({"error": "Not found"}, status_code=404)


@router.post("/demo")
async def create_project(project: dict):
    with open(file_path, "w") as f:
        f.write(str(project))
    return JSONResponse({"message": "Project created"}, status_code=201)
