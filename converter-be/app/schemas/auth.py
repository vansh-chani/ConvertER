from pydantic import BaseModel


class signup_form(BaseModel):
    username: str
    email: str 
    password: str
    

