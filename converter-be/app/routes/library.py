from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime
from app.schemas.project import Project
from app.schemas.user import User
from app.schemas.library import Library
from app.core.security import get_current_active_user
from app.core.utils import create_project_in_library, get_library_by_id, get_project_by_id
import os

router = APIRouter()


@router.get("/get_library", response_model=Library)
async def get_library(current_user: User = Depends(get_current_active_user)):
    library_id = current_user.library_id
    library = get_library_by_id(library_id)

    if not library:
        raise HTTPException(status_code=404, detail="Not found")

    return library


@router.get("/get_projects")
async def get_projects(
    current_user: User = Depends(get_current_active_user),
    sort_by: str = "most_recent"
):
    library_id = current_user.library_id
    library = get_library_by_id(library_id)
    if not library:
        return []

    projects_data = []

    for project_id in library.projects:
        project = get_project_by_id(project_id)
        if project:
            project_dict = project.model_dump()
            project_dict["project_id"] = project_id
            projects_data.append(project_dict)

    # Sorting
    if sort_by == "most_recent":
        projects_data.sort(key=lambda x: x["last_modified_at"], reverse=True)
    elif sort_by == "oldest":
        projects_data.sort(key=lambda x: x["last_modified_at"])

    return projects_data
