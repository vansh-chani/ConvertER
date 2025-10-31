from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import project, auth
import os

app = FastAPI()
app.include_router(project.router, prefix="/project", tags=["Project"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


