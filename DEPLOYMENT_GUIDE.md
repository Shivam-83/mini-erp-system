# 🚀 Mini ERP Deployment Guide

## Architecture Overview
- **Frontend**: Netlify (React + Vite)
- **Backend**: Render/Railway (Node.js + Express)
- **Database**: PlanetScale/Railway MySQL

---

## Part 1: Deploy Backend (Render.com)

### Step 1: Prepare Database (PlanetScale - Free Tier)

1. Go to [https://planetscale.com](https://planetscale.com)
2. Sign up/Login with GitHub
3. Click **"Create a new database"**
4. Name: `mini-erp-db`
5. Region: Choose closest to you
6. Click **"Create database"**
7. Click **"Connect"** → Select **"Node.js"**
8. Copy the connection details:
   ```
   DB_HOST=xxxxx.connect.psdb.cloud
   DB_PORT=3306
   DB_USER=xxxxx
   DB_PASSWORD=xxxxx
   DB_NAME=mini-erp-db
   ```

### Step 2: Initialize Database Schema

1. In PlanetScale Console, click **"Console"** tab
2. Run the schema SQL:
   - Copy content from `backend/sql/schema.sql`
   - Paste and execute in PlanetScale Console
3. Run extended schema:
   - Copy content from `backend/sql/schema_extended.sql`
   - Paste and execute
4. Run seed accounts:
   - Copy content from `backend/sql/seed_accounts.sql`
   - Paste and execute
5. (Optional) Run demo data:
   - Copy content from `backend/sql/demo_data.sql`
   - Paste and execute

### Step 3: Deploy Backend to Render

1. Go to [https://render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository (or upload code)
5. Configure:
   ```
   Name: mini-erp-backend
   Runtime: Node
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

6. Click **"Advanced"** → Add Environment Variables:
   ```
   PORT=4000
   DB_HOST=<from PlanetScale>
   DB_PORT=3306
   DB_USER=<from PlanetScale>
   DB_PASSWORD=<from PlanetScale>
   DB_NAME=mini-erp-db
   JWT_SECRET=<generate-random-32-char-string>
   FRONTEND_URL=https://<your-netlify-app>.netlify.app
   ```

7. Click **"Create Web Service"**
8. Wait 5-10 minutes for deployment
9. **Copy your backend URL**: `https://mini-erp-backend.onrender.com`

---

## Part 2: Deploy Frontend (Netlify)

### Step 1: Update Production Environment

1. Open `frontend/.env.production`
2. Replace with your actual backend URL:
   ```env
   VITE_API_URL=https://mini-erp-backend.onrender.com/api
   ```

### Step 2: Build Frontend Locally (Test)

```bash
cd frontend
npm install
npm run build
```

Verify `dist` folder is created.

### Step 3: Deploy to Netlify

#### Option A: Netlify CLI (Recommended)

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy from frontend folder:
   ```bash
   cd frontend
   netlify deploy --prod
   ```

4. Follow prompts:
   - Create new site? **Yes**
   - Site name: `mini-erp-system` (or your choice)
   - Publish directory: `dist`

5. Your site will be live at: `https://mini-erp-system.netlify.app`

#### Option B: Netlify Dashboard (Manual)

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Sign up/Login with GitHub
3. Click **"Add new site"** → **"Deploy manually"**
4. Drag and drop the `frontend/dist` folder
5. Site deployed! Click **"Site settings"** to customize domain

#### Option C: GitHub Auto-Deploy

1. Push code to GitHub repository
2. In Netlify Dashboard: **"Add new site"** → **"Import from Git"**
3. Connect GitHub and select repository
4. Configure:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
5. Add environment variable:
   ```
   VITE_API_URL=https://mini-erp-backend.onrender.com/api
   ```
6. Click **"Deploy site"**

---

## Part 3: Update Backend CORS

1. Go to Render Dashboard → Your backend service
2. Click **"Environment"**
3. Update `FRONTEND_URL` with your actual Netlify URL:
   ```
   FRONTEND_URL=https://mini-erp-system.netlify.app
   ```
4. Click **"Save Changes"** (service will auto-redeploy)

---

## Part 4: Test Deployment

1. Open your Netlify URL: `https://mini-erp-system.netlify.app`
2. **Register** a new account
3. **Login** with credentials
4. Test features:
   - Dashboard loads
   - Projects page works
   - Financial Statements display
   - Customers/Vendors CRUD operations

---

## 🔧 Troubleshooting

### Issue: "Network Error" on Login

**Solution**: 
- Check backend is running on Render
- Verify `VITE_API_URL` in Netlify env vars
- Check browser console for CORS errors
- Ensure `FRONTEND_URL` is set in Render backend

### Issue: Database Connection Failed

**Solution**:
- Verify PlanetScale credentials in Render
- Check database is active (not paused)
- Ensure schema is initialized

### Issue: Blank Page After Deployment

**Solution**:
- Check browser console for errors
- Verify build succeeded in Netlify deploy log
- Clear browser cache and hard reload (Ctrl+Shift+R)

### Issue: 502 Bad Gateway on Backend

**Solution**:
- Check Render logs for errors
- Verify PORT is set to 4000 or use `process.env.PORT`
- Wait for deployment to complete (5-10 min)

---

## 📊 Free Tier Limits

| Service | Free Tier Limit |
|---------|----------------|
| **Netlify** | 100GB bandwidth/month, 300 build minutes |
| **Render** | 750 hours/month, sleeps after 15min inactivity |
| **PlanetScale** | 1 database, 5GB storage, 1 billion row reads |

**Note**: Render free tier sleeps after inactivity. First request after sleep takes ~30 seconds to wake up.

---

## 🎉 You're Live!

Your Mini ERP System is now deployed and accessible worldwide!

**Frontend**: `https://mini-erp-system.netlify.app`  
**Backend**: `https://mini-erp-backend.onrender.com`

### Next Steps:
1. Configure custom domain in Netlify
2. Enable HTTPS (auto-enabled by default)
3. Set up monitoring with Render dashboard
4. Configure database backups in PlanetScale

---

## Alternative Backends (if Render doesn't work)

### Railway.app
1. Sign up at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add MySQL plugin
4. Configure same environment variables
5. Deploy backend service

### Heroku (Paid)
1. Create Heroku account
2. Install Heroku CLI
3. `heroku create mini-erp-backend`
4. Add ClearDB MySQL addon
5. Push code: `git push heroku main`

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check Render/Netlify deployment logs
3. Verify all environment variables are set correctly
4. Test backend API directly: `https://your-backend.onrender.com/api/auth/register`
