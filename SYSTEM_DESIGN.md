# System Design - Fullstack JWT Notes Application

## Overview
A full-stack web application for managing personal notes with secure JWT-based authentication. The application demonstrates modern web development practices including RESTful API design, token-based authentication, and separation of concerns.

## Architecture

### High-Level Architecture
```
┌─────────────────┐
│   Frontend      │
│   (React/Vite)  │
│   Vercel        │
└────────┬────────┘
         │ HTTPS
         │ JWT Tokens
         ▼
┌─────────────────┐
│   Backend API    │
│   (Django REST)  │
│   Railway        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
│   (SQLite/MySQL)│
└─────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Authentication**: JWT (stored in localStorage)
- **Deployment**: Vercel

### Backend
- **Framework**: Django 5.2
- **API**: Django REST Framework
- **Authentication**: djangorestframework-simplejwt
- **CORS**: django-cors-headers
- **Database**: SQLite (development) / MySQL (production)
- **Deployment**: Railway

## System Components

### 1. Frontend Architecture

#### Component Structure
```
src/
├── components/
│   ├── Form.jsx              # Reusable form for login/register
│   ├── Navbar.jsx            # Navigation bar with user info
│   ├── Note.jsx              # Individual note component
│   ├── ProtectedRoute.jsx   # Route guard for authenticated routes
│   └── Toast.jsx             # Notification system
├── context/
│   └── AuthContext.jsx       # Global authentication state
├── pages/
│   ├── Home.jsx             # Main notes dashboard
│   ├── Login.jsx            # Login page
│   └── Register.jsx         # Registration page
└── api.js                   # Axios instance with interceptors
```

#### Authentication Flow
1. User submits credentials via Form component
2. API call to `/api/token/` endpoint
3. Backend validates and returns JWT tokens (access + refresh)
4. Tokens stored in localStorage
5. Access token decoded to extract username
6. User state updated in AuthContext
7. Protected routes become accessible

#### Token Management
- **Access Token**: Short-lived (30 minutes), sent with every API request
- **Refresh Token**: Long-lived (1 day), used to obtain new access tokens
- **Automatic Refresh**: Axios interceptor handles 401 errors and refreshes tokens automatically
- **Token Storage**: localStorage (consider httpOnly cookies for production)

### 2. Backend Architecture

#### API Structure
```
/api/
├── user/register/          # POST - Create new user
├── token/                  # POST - Obtain JWT tokens
├── token/refresh/          # POST - Refresh access token
└── notes/                  # GET, POST - List/create notes
    └── delete/<id>/       # DELETE - Delete note
```

#### Authentication System

**JWT Token Customization**
- Custom serializer extends `TokenObtainPairSerializer`
- Adds `username` and `user_id` to token payload
- Enables frontend to display username without additional API calls

**Token Lifecycle**
```
Login Request
    ↓
Validate Credentials
    ↓
Generate Access Token (30 min) + Refresh Token (1 day)
    ↓
Return Tokens to Frontend
    ↓
Frontend stores in localStorage
    ↓
Access Token sent with each request
    ↓
If expired (401), use Refresh Token
    ↓
Get new Access Token
```

#### Security Features
- **CORS Configuration**: Whitelist specific origins
- **JWT Authentication**: Stateless authentication
- **Password Hashing**: Django's built-in PBKDF2
- **Permission Classes**: IsAuthenticated for protected endpoints
- **Token Expiration**: Configurable via environment variables

### 3. Database Schema

#### User Model (Django Built-in)
- `id`: Primary key
- `username`: Unique identifier
- `password`: Hashed password

#### Note Model
```python
class Note(models.Model):
    title = CharField(max_length=100)
    content = TextField()
    author = ForeignKey(User, on_delete=CASCADE)
    created_at = DateTimeField(auto_now_add=True)
```

**Relationships**
- One-to-Many: User → Notes
- Cascade delete: Deleting user deletes all their notes

## Data Flow

### Registration Flow
```
User Input → Form Validation → API POST /api/user/register/
    ↓
Backend validates → Creates user → Returns success
    ↓
Frontend redirects to login
```

### Note Creation Flow
```
User Input → Form Validation → API POST /api/notes/
    ↓
Backend validates JWT → Extracts user from token
    ↓
Creates note with author=request.user
    ↓
Returns note data → Frontend updates UI
```

### Token Refresh Flow
```
API Request with expired token → 401 Unauthorized
    ↓
Axios interceptor catches error
    ↓
Calls /api/token/refresh/ with refresh token
    ↓
Backend validates refresh token → Returns new access token
    ↓
Retry original request with new token
```

## API Design

### RESTful Principles
- **GET**: Retrieve resources
- **POST**: Create resources
- **DELETE**: Remove resources
- **Consistent URL patterns**: `/api/resource/` or `/api/resource/<id>/`

### Request/Response Format
- **Content-Type**: `application/json`
- **Authentication**: `Authorization: Bearer <token>`
- **Error Handling**: Consistent error response format

### Example API Calls

**Register User**
```http
POST /api/user/register/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Login**
```http
POST /api/token/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Create Note**
```http
POST /api/notes/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note content here"
}
```

## Deployment Architecture

### Frontend (Vercel)
- **Build**: Vite production build
- **Environment Variables**: `VITE_API_BASE_URL`
- **Routing**: Client-side routing with fallback
- **CDN**: Global edge network

### Backend (Railway)
- **Runtime**: Python 3.x
- **WSGI Server**: Gunicorn (Railway default)
- **Environment Variables**: 
  - `SECRET_KEY`
  - `DEBUG`
  - `ALLOWED_HOSTS`
  - `DB_*` (database credentials)
- **Database**: MySQL (production)

## Security Considerations

### Implemented
- ✅ JWT token-based authentication
- ✅ Password hashing (Django default)
- ✅ CORS configuration
- ✅ Token expiration
- ✅ HTTPS in production
- ✅ Environment variable management

### Recommendations for Production
- [ ] Use httpOnly cookies for token storage
- [ ] Implement rate limiting
- [ ] Add request validation middleware
- [ ] Set up logging and monitoring
- [ ] Regular security audits
- [ ] CSRF protection for state-changing operations
- [ ] Input sanitization
- [ ] SQL injection prevention (Django ORM handles this)

## Scalability Considerations

### Current Limitations
- Single database instance
- No caching layer
- Stateless JWT (good for horizontal scaling)

### Future Improvements
- **Database**: Move to PostgreSQL with connection pooling
- **Caching**: Redis for session management
- **Load Balancing**: Multiple backend instances
- **CDN**: Static asset optimization
- **Database Indexing**: Optimize queries for large datasets

## Performance Optimizations

### Frontend
- Code splitting with Vite
- Lazy loading routes
- Optimized bundle size
- Efficient re-renders with React Context

### Backend
- Database query optimization
- Pagination for large datasets
- Efficient serialization
- Connection pooling

## Monitoring & Logging

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics / Plausible
- **Uptime Monitoring**: UptimeRobot
- **Logs**: Railway logs / CloudWatch

## Development Workflow

### Local Development
1. Backend: `python manage.py runserver`
2. Frontend: `npm run dev`
3. Database: SQLite (default)

### Production Deployment
1. Push code to repository
2. Railway auto-deploys backend
3. Vercel auto-deploys frontend
4. Environment variables configured in respective platforms

## Conclusion

This architecture demonstrates:
- **Separation of Concerns**: Clear frontend/backend separation
- **Modern Authentication**: JWT-based stateless authentication
- **RESTful API Design**: Standard HTTP methods and status codes
- **Scalable Structure**: Ready for horizontal scaling
- **Production Ready**: Deployed on modern cloud platforms

The system is designed to be maintainable, scalable, and secure while following industry best practices.