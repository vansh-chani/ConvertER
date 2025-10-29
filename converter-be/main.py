from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/projects/demo")
async def get_project():
    file_path = f"demo.er"
    if os.path.exists(file_path):
        with open(file_path) as f:
            content = f.read()
        response = eval(content)
        return JSONResponse(response)
    return JSONResponse({"error": "Not found"}, status_code=404)

@app.post("/project/demo")
async def create_project(project: dict):
    file_path = f"demo.er"
    with open(file_path, "w") as f:
        f.write(str(project))
    return JSONResponse({"message": "Project created"}, status_code=201)
