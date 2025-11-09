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

### Issue: Network Error / Cannot see requests in Network tab
**This is the most common issue!**

**Symptoms:**
- "Network Error" message
- No requests visible in browser Network tab
- Console shows "NOT SET" for VITE_API_BASE_URL

**Solution:**
1. **Check Vercel Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify `VITE_API_BASE_URL` exists and is set to `https://fullstack-jwt-notes-production.up.railway.app`
   - Make sure it's enabled for **Production** environment
   
2. **Rebuild Frontend:**
   - After setting/updating the environment variable, you MUST redeploy
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click "Redeploy" on the latest deployment, or push a new commit
   - **Important:** Vite environment variables are baked into the build at build time, so you must rebuild!

3. **Verify in Browser Console:**
   - Open your deployed frontend
   - Open browser console (F12)
   - Look for: `🔗 API Base URL:` - it should show your Railway URL
   - If it shows `http://127.0.0.1:8000` or `NOT SET`, the environment variable isn't configured correctly

4. **Check Backend CORS:**
   - Make sure `https://fullstack-jwt-notes.vercel.app` is in `CORS_ALLOWED_ORIGINS`
   - Verify backend is running and accessible

### Issue: CORS Error
**Solution:** 
- Make sure `https://fullstack-jwt-notes.vercel.app` is in `CORS_ALLOWED_ORIGINS` in `backend/backend/settings.py`
- Check browser console for specific CORS error message
- Verify backend allows OPTIONS requests (preflight)

### Issue: 400 Bad Request / Invalid Host Header
**Solution:** 
- Add `fullstack-jwt-notes-production.up.railway.app` to `ALLOWED_HOSTS` in backend `.env` on Railway
- Make sure `ALLOWED_HOSTS` doesn't include `https://` - just the domain name

### Issue: API calls going to wrong URL
**Solution:** 
- Check browser console for `🔗 API Base URL:` log
- Verify `VITE_API_BASE_URL` in Vercel dashboard
- Rebuild the frontend after setting the variable
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Environment variable not working
**Solution:** 
- Vite environment variables must start with `VITE_`
- **You MUST rebuild/redeploy after changing environment variables**
- For Vercel, set it in the dashboard, not just in `.env` file
- Check that the variable is enabled for the correct environment (Production/Preview/Development)

## Next Steps

1. **Set `VITE_API_BASE_URL` in Vercel dashboard:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://fullstack-jwt-notes-production.up.railway.app`
   - Enable for Production environment
   - **IMPORTANT:** Redeploy after adding the variable!

2. **Update backend `.env` on Railway:**
   - Go to Railway Dashboard → Your Project → Variables
   - Set `ALLOWED_HOSTS` = `fullstack-jwt-notes-production.up.railway.app,localhost,127.0.0.1`
   - Set `DEBUG` = `False`
   - Railway will automatically restart the backend

3. **Rebuild and redeploy both frontend and backend:**
   - Frontend: Redeploy in Vercel (or push a new commit)
   - Backend: Railway will auto-restart when you update variables

4. **Test the connection:**
   - Open your deployed frontend
   - Open browser console (F12)
   - Check for `🔗 API Base URL:` - should show Railway URL
   - Try to register a new account
   - Check Network tab for API requests
   - If you see "Network Error", check the console logs for details

## Quick Debug Checklist

- [ ] `VITE_API_BASE_URL` is set in Vercel dashboard
- [ ] Frontend has been redeployed after setting the variable
- [ ] Browser console shows correct API URL (not "NOT SET")
- [ ] Backend `ALLOWED_HOSTS` includes Railway domain
- [ ] Backend CORS includes Vercel frontend URL
- [ ] Backend is running and accessible
- [ ] No CORS errors in browser console