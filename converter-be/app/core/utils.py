from app.schemas.user import UserInDB
from app.schemas.library import Library
from app.schemas.project import Project
from app.core.db import users_db, projects_db
from bson.objectid import ObjectId
from datetime import datetime


def insert_user_in_db(user_data: UserInDB):
    create_library_id = create_library()
    user_data.library_id = create_library_id
    return users_db.users.insert_one(user_data.model_dump())


def get_user_by_username_from_db(username: str):
    return users_db.users.find_one({"username": username})


def update_user(user_id: str, user_data: UserInDB):
    return users_db.users.update_one({"_id": user_id}, {"$set": user_data.model_dump()})


def delete_user(user_id: str):
    users_db.libraries.delete_one(
        {"_id": get_user_by_username_from_db(user_id)["library_id"]})
    return users_db.users.delete_one({"_id": user_id})


def create_library() -> str:
    library_data = Library()
    result = users_db.libraries.insert_one(library_data.model_dump())
    return str(result.inserted_id)


def update_library(library_id: str, library_data: Library):
    return users_db.libraries.update_one({"_id": library_id}, {"$set": library_data.model_dump()})


def create_new_project(created_by: str) -> str:
    project_data = Project(
        created_by=created_by,
        created_at=datetime.utcnow(),
        last_modified_at=datetime.utcnow(),
        last_modified_by=created_by
    )
    result = projects_db.projects.insert_one(project_data.model_dump())
    return str(result.inserted_id)


def create_project_in_library(library_id: str, username: str):
    project_data = create_new_project(created_by=username)

    return users_db.libraries.update_one(
        {"_id": ObjectId(library_id)},
        {"$push": {"projects": project_data}}
    )


# def save_project(library_id: str, project_data: Project):
#     return users_db.libraries.update_one(
#         {"_id": library_id, "projects.id": project_data.id},
#         {"$set": {"projects.$": project_data.model_dump()}}
#     )
