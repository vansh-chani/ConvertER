from pydantic import BaseModel

    
class User(BaseModel):
    username: str
    email: str | None = None
    disabled: bool | None = None
    library_id: str | None = None
    
class UserInDB(User):
    hashed_password: str