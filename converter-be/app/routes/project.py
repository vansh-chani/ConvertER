from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from datetime import datetime
from app.schemas.project import Project
from app.schemas.user import User
from app.core.security import get_current_active_user
from app.core.utils import create_project_in_library
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


@router.post("/create_project")
async def create_project(curr_user: User = Depends(get_current_active_user)) -> JSONResponse:
    library_id = curr_user.library_id
    if not library_id:
        return JSONResponse({"error": "Library ID is required"}, status_code=400)
    create_project_in_library(library_id, curr_user.username)
    return JSONResponse({"message": "Project created"}, status_code=201)
