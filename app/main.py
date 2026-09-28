from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request

from app.config import settings
from app.database import init_db
from app.api.routes.auth import router as auth_router
from app.api.routes.projects import router as projects_router
from app.api.routes.tasks import router as tasks_router
from app.api.routes.dashboard import router as dashboard_router

app = FastAPI(
    title="ProjectFlow",
    description="A modern project management platform for teams",
    version="1.0.0",
)

init_db()

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(projects_router, prefix="/api/projects", tags=["projects"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["dashboard"])

templates = Jinja2Templates(directory="app/templates")

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "ProjectFlow API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.host, port=settings.port, reload=True)
