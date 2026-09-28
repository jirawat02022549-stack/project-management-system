# ProjectFlow

ProjectFlow is a modern Python project management application built with FastAPI, SQLAlchemy, and SQLite.

## Features
- User registration and login with JWT authentication
- Create, view, update, and delete projects
- Create, view, update, and delete tasks
- Task status and priority tracking
- Dashboard summary of project and task metrics
- Lightweight front-end dashboard for quick interaction

## Stack
- Python 3.11+
- FastAPI
- SQLAlchemy
- SQLite
- JWT authentication

## Run locally

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the API:
   ```bash
   uvicorn app.main:app --reload
   ```

4. Open in browser:
   - API docs: http://localhost:8000/docs
   - UI: http://localhost:8000/

## Project structure

```text
app/
  api/
    routes/
      auth.py
      dashboard.py
      projects.py
      tasks.py
  static/
    css/
    js/
  templates/
    index.html
  config.py
  database.py
  deps.py
  main.py
  models.py
  schemas.py
  security.py
requirements.txt
README.md
```

## Example workflow
- Register a new account
- Create a project
- Add tasks with status and priority
- View dashboard metrics

## Notes
The application uses SQLite by default for easy local development. You can switch the database by editing `app/config.py`.
