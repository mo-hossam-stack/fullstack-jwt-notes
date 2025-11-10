## Full-Stack Notes App (DRF + React)

A production-ready full‑stack application that provides a JWT‑secured Django REST API for personal notes and a modern React (Vite) frontend. It includes user registration, token-based authentication, and complete note CRUD operations (list, create, delete) for authenticated users.

### 🌐 Live Demo

- **Frontend**: [https://fullstack-jwt-notes.vercel.app](https://fullstack-jwt-notes.vercel.app)
- **Backend API**: [https://fullstack-jwt-notes-production.up.railway.app](https://fullstack-jwt-notes-production.up.railway.app)

### Tech Stack
- **Backend**: Django 5, Django REST Framework, Simple JWT, CORS Headers, SQLite/MySQL
- **Frontend**: React 19 with Vite, React Router, Axios, Context API
- **Deployment**: Railway (Backend), Vercel (Frontend)

---

## Features

### Authentication & Security
- **JWT Authentication**: Secure token-based authentication with automatic refresh
  - **Custom JWT Token Serializer**: Extended Django's JWT to include username in token payload
  - **Token Refresh Mechanism**: Automatic token renewal on expiration via Axios interceptors
  - **Stateless Authentication**: No server-side sessions, fully scalable architecture
  - **Secure Token Storage**: Proper handling of access (30 min) and refresh (1 day) tokens
- **User Registration**: Simple registration with username and password
- **Protected Routes**: Frontend route protection with authentication checks
- **CORS Configuration**: Production-ready CORS setup for secure cross-origin requests

### Frontend Features
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Toast Notifications**: User-friendly error and success notifications
- **Form Validation**: Client-side validation with error messages
- **Loading States**: Visual feedback during API operations
- **Empty States**: Helpful messages when no data is available
- **Responsive Design**: Mobile-first approach with breakpoints
- **Context API**: Centralized state management for authentication

### Notes Management
- **List Notes**: View all your notes in a grid layout
- **Create Notes**: Simple form to create new notes with title and content
- **Delete Notes**: Confirmation dialog before deletion
- **Real-time Updates**: Automatic refresh after create/delete operations

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
**Note**: The requirements file is named `requirment.txt` (typo). Consider renaming it to `requirements.txt` for better convention.
 
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
git clone https://github.com/mo-hossam-stack/fullstack-jwt-notes.git; cd fullstack-jwt-notes; python -m venv venv; ./venv/Scripts/Activate.ps1; pip install -r backend/requirment.txt; Set-Content -Path backend/backend/.env -Value "SECRET_KEY=dev-key-$(Get-Random)`nDEBUG=True`nALLOWED_HOSTS=*"; python backend/manage.py migrate; python backend/manage.py runserver
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

**Frontend Configuration**:
- API base URL can be configured via `VITE_API_BASE_URL` environment variable (defaults to `http://127.0.0.1:8000`)
- Create `frontend/.env` file if you need to customize:
  ```env
  VITE_API_BASE_URL=http://127.0.0.1:8000
  ```

**Note**: CORS is configured to allow all origins in development. Update `backend/backend/settings.py` for production.

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

### Production API
Base URL: `https://fullstack-jwt-notes-production.up.railway.app`

### Local Development
Base URL: `http://127.0.0.1:8000`

### Authentication Endpoints

**Register User**
- `POST /api/user/register/` - Create a new user account
  - Request: `{"username": "string", "password": "string"}`
  - Response: `201 Created` with user data

**Obtain JWT Tokens**
- `POST /api/token/` - Login and get access + refresh tokens
  - Request: `{"username": "string", "password": "string"}`
  - Response: 
    ```json
    {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
    ```
  - **JWT Token Payload**: Includes `username`, `user_id`, `exp`, `iat`
  - **Access Token**: Valid for 30 minutes
  - **Refresh Token**: Valid for 1 day

**Refresh Access Token**
- `POST /api/token/refresh/` - Get new access token using refresh token
  - Request: `{"refresh": "refresh-token-string"}`
  - Response: `{"access": "new-access-token"}`

### Notes Endpoints (Require Authentication)

All notes endpoints require `Authorization: Bearer <access-token>` header.

- `GET /api/notes/` - List all notes for authenticated user
- `POST /api/notes/` - Create a new note
  - Request: `{"title": "string", "content": "string"}`
- `DELETE /api/notes/delete/<id>/` - Delete a note by ID

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
