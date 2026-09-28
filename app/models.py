from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, ForeignKey, Integer, String, Date, Text, Table
from sqlalchemy.orm import relationship

from app.database import Base

project_members = Table(
    "project_members",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("projects.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="member")
    created_at = Column(Date, default=datetime.utcnow)

    owned_projects = relationship("Project", back_populates="owner")
    assigned_tasks = relationship("Task", back_populates="assignee")
    member_projects = relationship("Project", secondary=project_members, back_populates="members")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    status = Column(String(50), default="active")
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(Date, default=datetime.utcnow)

    owner = relationship("User", back_populates="owned_projects")
    tasks = relationship("Task", back_populates="project")
    members = relationship("User", secondary=project_members, back_populates="member_projects")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, default="")
    status = Column(String(50), default="todo")
    priority = Column(String(50), default="medium")
    due_date = Column(Date, nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(Date, default=datetime.utcnow)

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="assigned_tasks")
