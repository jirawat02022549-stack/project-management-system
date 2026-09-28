from datetime import date
from typing import Optional

from pydantic import BaseModel, EmailStr, validator


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

    @validator("full_name")
    def validate_full_name(cls, value: str):
        if len(value.strip()) < 2:
            raise ValueError("Full name must contain at least 2 characters")
        return value.strip()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ProjectCreate(BaseModel):
    name: str
    description: str = ""
    status: str = "active"

    @validator("name")
    def validate_name(cls, value: str):
        if len(value.strip()) < 2:
            raise ValueError("Project name must contain at least 2 characters")
        return value.strip()


class ProjectUpdate(ProjectCreate):
    pass


class ProjectOut(BaseModel):
    id: int
    name: str
    description: str
    status: str
    owner_id: int
    created_at: Optional[date] = None

    class Config:
        orm_mode = True


class TaskCreate(BaseModel):
    title: str
    description: str = ""
    status: str = "todo"
    priority: str = "medium"
    due_date: Optional[date] = None
    assignee_id: Optional[int] = None

    @validator("title")
    def validate_title(cls, value: str):
        if len(value.strip()) < 2:
            raise ValueError("Task title must contain at least 2 characters")
        return value.strip()


class TaskUpdate(TaskCreate):
    pass


class TaskOut(BaseModel):
    id: int
    title: str
    description: str
    status: str
    priority: str
    due_date: Optional[date] = None
    project_id: int
    assignee_id: Optional[int]
    created_at: Optional[date] = None

    class Config:
        orm_mode = True


class DashboardSummary(BaseModel):
    total_projects: int
    total_tasks: int
    completed_tasks: int
    active_tasks: int
    upcoming_deadlines: int
    projects: list[ProjectOut]
    tasks: list[TaskOut]
