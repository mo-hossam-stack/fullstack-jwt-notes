# Production Setup Guide

## Backend Configuration (Railway)

### Backend .env File (`backend/backend/.env`)

Make sure your backend `.env` file on Railway includes:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=fullstack-jwt-notes-production.up.railway.app,localhost,127.0.0.1
ACCESS_TOKEN_LIFETIME=30
REFRESH_TOKEN_LIFETIME=1

# Database configuration using MySQL
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=3306
```

**Important Notes:**
- `ALLOWED_HOSTS` must include `fullstack-jwt-notes-production.up.railway.app` (without `https://`)
- Set `DEBUG=False` for production
- Make sure your Railway environment variables match these settings

## Frontend Configuration (Vercel)

### Option 1: Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variable:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://fullstack-jwt-notes-production.up.railway.app`
   - **Environment:** Production, Preview, Development (or just Production)

### Option 2: Local .env File (for local builds)

Create `frontend/.env` file:
```env
VITE_API_BASE_URL=https://fullstack-jwt-notes-production.up.railway.app
```

**Note:** For Vercel deployments, you MUST set the environment variable in the Vercel dashboard. The `.env` file is only used for local development.

## Key Changes Made

1. ✅ **Backend CORS Settings**: Updated to allow the frontend URL and added development mode support
2. ✅ **API URL Handling**: Fixed to automatically remove trailing slashes
3. ✅ **Frontend Environment**: Configured to use production backend URL

## Verification Steps

1. **Backend (Railway):**
   - Verify `ALLOWED_HOSTS` includes your Railway domain
   - Verify `DEBUG=False` in production
   - Verify CORS allows `https://fullstack-jwt-notes.vercel.app`

2. **Frontend (Vercel):**
   - Verify `VITE_API_BASE_URL` is set in Vercel dashboard
   - Rebuild and redeploy after setting the environment variable

3. **Test the Connection:**
   - Open browser console on your frontend
   - Try to register/login
   - Check Network tab for API calls
   - Verify requests go to `https://fullstack-jwt-notes-production.up.railway.app`

## Common Issues & Solutions

### Issue: CORS Error
**Solution:** Make sure `https://fullstack-jwt-notes.vercel.app` is in `CORS_ALLOWED_ORIGINS` in `backend/backend/settings.py`

### Issue: 400 Bad Request / Invalid Host Header
**Solution:** Add `fullstack-jwt-notes-production.up.railway.app` to `ALLOWED_HOSTS` in backend `.env`

### Issue: API calls going to wrong URL
**Solution:** 
- Check `VITE_API_BASE_URL` in Vercel dashboard
- Rebuild the frontend after setting the variable
- Clear browser cache

### Issue: Environment variable not working
**Solution:** 
- Vite environment variables must start with `VITE_`
- Rebuild the frontend after changing environment variables
- For Vercel, set it in the dashboard, not just in `.env` file

## Next Steps

1. Set `VITE_API_BASE_URL` in Vercel dashboard
2. Update backend `.env` on Railway with correct `ALLOWED_HOSTS`
3. Rebuild and redeploy both frontend and backend
4. Test the connection