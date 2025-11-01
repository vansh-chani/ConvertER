from pydantic import BaseModel
from app.schemas.project import Project
    
class Library(BaseModel):
    groups: list[str] = ["Personal"]
    projects: list[str] = []
    pinned: list[str] = []
    starred: list[str] = []
    
    
