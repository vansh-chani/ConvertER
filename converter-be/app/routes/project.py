from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from datetime import datetime
from app.schemas.project import Project
from app.schemas.user import User
from app.core.security import get_current_active_user
from app.core.utils import create_project_in_library, get_library_by_id, get_project_by_id, delete_project_by_id, delete_project_from_library, update_project
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
    project_id = create_project_in_library(library_id, curr_user.username)
    return JSONResponse({"message": "Project created", "project_id": project_id}, status_code=201)


@router.get("/get_project/{project_id}")
async def get_project(project_id: str):
    project = get_project_by_id(project_id)
    if project:
        return {**project.model_dump(), "project_id": project_id}
    return {"error": "Not found"}


@router.delete("/delete_project/{project_id}")
async def delete_project(
    project_id: str,
    curr_user: User = Depends(get_current_active_user)
) -> JSONResponse:
    library_id = curr_user.library_id
    if not library_id:
        return JSONResponse({"error": "Library ID is required"}, status_code=400)
    
    delete_project_from_library(library_id, project_id)
    delete_project_by_id(project_id)

    return JSONResponse({"message": "Project deleted"}, status_code=200)

@router.put("/save_project/{project_id}")
async def save_project(
    project_id: str,
    project_data: Project,
) -> JSONResponse:
    update_result = update_project(project_id, project_data)
    if update_result.matched_count == 0:
        return JSONResponse({"error": "Failed to update project"}, status_code=400)

    return JSONResponse({"message": "Project updated"}, status_code=200)