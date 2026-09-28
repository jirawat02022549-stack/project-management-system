from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import Project, Task, User
from app.schemas import DashboardSummary

router = APIRouter()


@router.get("", response_model=DashboardSummary)
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    projects = db.query(Project).filter(Project.owner_id == current_user.id).all()
    tasks = db.query(Task).join(Project).filter(Project.owner_id == current_user.id).all()

    total_projects = len(projects)
    total_tasks = len(tasks)
    completed_tasks = sum(1 for task in tasks if task.status == "done")
    active_tasks = sum(1 for task in tasks if task.status != "done")

    today = date.today()
    upcoming_deadlines = sum(
        1 for task in tasks if task.due_date and task.due_date >= today
    )

    return DashboardSummary(
        total_projects=total_projects,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        active_tasks=active_tasks,
        upcoming_deadlines=upcoming_deadlines,
        projects=projects,
        tasks=tasks,
    )
