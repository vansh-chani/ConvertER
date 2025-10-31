from pydantic import BaseModel
from app.schemas.project import Project
    
class Library(BaseModel):
    groups: list[str] = []
    projects: list[Project] = []
    pinned: list[str] = []
    starred: list[str] = []
    
    
