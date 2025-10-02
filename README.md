## full-stack Notes App (DRF + React)

A full‑stack starter that provides a JWT‑secured Django REST API for personal notes and a React (Vite) frontend scaffold. It includes user registration, token auth, and note CRUD (list, create, delete for the authenticated user).

### Tech Stack
- **Backend**: Django 5, Django REST Framework, Simple JWT, CORS Headers, postgresql
- **Frontend**: React 19 with Vite, React Router, Axios

---

## Features
- **JWT Authentication**: Obtain/refresh tokens via `/api/token/` and `/api/token/refresh/`
- **User Registration**: `POST /api/user/register/`
- **Notes API**:
  - `GET /api/notes/` – list notes of the current user
  - `POST /api/notes/` – create a note for the current user
  - `DELETE /api/notes/delete/:id/` – delete your note
- **CORS enabled** for local React development

---

## Project Structure
```
  backend/            # Django project (API)
  frontend/           # React app (Vite)
  venv/               # Python virtual environment (local)
```

---
 
 ## Quick Start (Clone and Run)
 
 1) Clone the repository
 ```bash
 git clone https://github.com/mo-hossam-stack/fullstack-jwt-notes.git
 cd fullstack-jwt-notes
 ```
 
 2) Create and activate a Python virtual environment (Windows PowerShell)
 ```bash
 python -m venv venv
 ./venv/Scripts/Activate.ps1
 ```
 
 3) Install backend dependencies
 ```bash
 pip install -r backend/requirment.txt
 ```
 
 4) Configure environment
 - Create a file `backend/backend/.env` with at least:
 ```env
 SECRET_KEY=replace-with-a-long-random-string
 DEBUG=True
 ALLOWED_HOSTS=*
 ```
 
 5) Initialize database and run the API server
 ```bash
 python backend/manage.py migrate
 python backend/manage.py runserver
 ```
 API is available at `http://127.0.0.1:8000/`.
 
 6) In a new terminal, start the frontend
 ```bash
 cd frontend
 npm install
 npm run dev
 ```
 Frontend is available at the Vite URL (usually `http://127.0.0.1:5173`).
 
 Optional
 ```bash
 # create an admin user
 python backend/manage.py createsuperuser
 ```
 
 Tip: If you prefer a single terminal sequence on Windows PowerShell, run:
 ```bash
 git clone https://github.com/mo-hossam-stack/fullstack-jwt-notes.git; cd fullstack-jwt-notes; python -m venv venv; ./venv/Scripts/Activate.ps1; pip install -r backend/requirment.txt; Set-Content -Path backend/backend/.env -Value "SECRET_KEY=dev-key`nDEBUG=True`nALLOWED_HOSTS=*"; python backend/manage.py migrate; python backend/manage.py runserver
 ```
 Open another terminal for the frontend:
 ```bash
 cd frontend; npm install; npm run dev
 ```
 
 ---

## Backend Setup (Django)

1) Create and activate a virtualenv (Windows PowerShell):
```bash
python -m venv venv
./venv/Scripts/Activate.ps1
```

2) Install dependencies:
```bash
pip install -r backend/requirment.txt
```

3) Create a `.env` file in `backend/backend/` (same folder as `settings.py`):
```env
# Required
SECRET_KEY=replace-with-a-long-random-string

# Optional (defaults shown)
DEBUG=True
ALLOWED_HOSTS=*
ACCESS_TOKEN_LIFETIME=30      # minutes
REFRESH_TOKEN_LIFETIME=1      # days
```

4) Apply migrations and run:
```bash
python backend/manage.py migrate
python backend/manage.py runserver
```

Server runs at `http://127.0.0.1:8000/`.

Optional: create an admin user
```bash
python backend/manage.py createsuperuser
```

---

## Frontend Setup (React + Vite)

1) Install dependencies:
```bash
cd frontend
npm install
```

2) Start development server:
```bash
npm run dev
```

Vite will print a local URL (typically `http://127.0.0.1:5173`).

Notes:
- The frontend is scaffolded. You can wire API calls in `frontend/src/api.js` and constants (e.g., API base URL) in `frontend/src/constants.js`.
- Default CORS is open in development per Django settings.

---

## Environment Variables Reference

Backend (`backend/backend/.env`):
- `SECRET_KEY` (string, required): Django secret key
- `DEBUG` (bool string): `True` or `False`
- `ALLOWED_HOSTS` (csv): e.g. `localhost,127.0.0.1`
- `ACCESS_TOKEN_LIFETIME` (int minutes)
- `REFRESH_TOKEN_LIFETIME` (int days)

Frontend (optional, if you introduce config):
- Vite uses `import.meta.env`. Add variables prefixed with `VITE_` in `frontend/.env`.

Example:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## API Reference

Base URL: `http://127.0.0.1:8000`

Auth endpoints:
- `POST /api/user/register/`
- `POST /api/token/` (obtain access+refresh)
- `POST /api/token/refresh/`

Notes endpoints (require `Authorization: Bearer <access>`):
- `GET /api/notes/`
- `POST /api/notes/`
- `DELETE /api/notes/delete/<id>/`

### Request/Response Examples

Register user:
```bash
curl -X POST http://127.0.0.1:8000/api/user/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "StrongPass123"}'
```

Obtain token pair:
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "StrongPass123"}'
```
Response:
```json
{
  "refresh": "<refresh-token>",
  "access": "<access-token>"
}
```

Create a note:
```bash
curl -X POST http://127.0.0.1:8000/api/notes/ \
  -H "Authorization: Bearer <access-token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "First Note", "content": "Hello"}'
```

List my notes:
```bash
curl -H "Authorization: Bearer <access-token>" \
  http://127.0.0.1:8000/api/notes/
```

Delete a note:
```bash
curl -X DELETE -H "Authorization: Bearer <access-token>" \
  http://127.0.0.1:8000/api/notes/delete/1/
```

---

## Development Tips
- DRF browsable API is available; visit endpoints in the browser when logged in
- Use admin at `/admin/` to inspect users and notes
- Keep `DEBUG=False` and set proper `ALLOWED_HOSTS` in production

---

## Scripts

Backend (from repo root with venv active):
```bash
python backend/manage.py runserver
python backend/manage.py migrate
python backend/manage.py createsuperuser
```

Frontend:
```bash
cd frontend
npm run dev
npm run build
npm run preview
```
