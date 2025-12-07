# 📋 Deployment Checklist

## Pre-Deployment

### Backend Preparation
- [ ] Update `backend/.env.example` with all required variables
- [ ] Set Node.js version in `package.json` (✅ Done - v18+)
- [ ] Configure CORS for production URL (✅ Done)
- [ ] Test backend locally: `cd backend && npm start`

### Frontend Preparation
- [ ] Create `frontend/.env.production` with production API URL
- [ ] Configure Netlify redirects (✅ Done - netlify.toml)
- [ ] Test build locally: `cd frontend && npm run build`
- [ ] Test preview: `npm run preview`

### Database Preparation
- [ ] Export schema: `backend/sql/schema.sql` (✅ Ready)
- [ ] Export seed data: `backend/sql/seed_accounts.sql` (✅ Ready)
- [ ] Export demo data: `backend/sql/demo_data.sql` (✅ Ready)

---

## Deployment Steps

### 1. Database (PlanetScale/Railway)
- [ ] Create database instance
- [ ] Note connection credentials
- [ ] Run `schema.sql`
- [ ] Run `schema_extended.sql`
- [ ] Run `seed_accounts.sql`
- [ ] (Optional) Run `demo_data.sql`

### 2. Backend (Render/Railway)
- [ ] Create web service
- [ ] Set root directory to `backend`
- [ ] Configure environment variables:
  - [ ] `PORT=4000`
  - [ ] `DB_HOST`
  - [ ] `DB_PORT`
  - [ ] `DB_USER`
  - [ ] `DB_PASSWORD`
  - [ ] `DB_NAME`
  - [ ] `JWT_SECRET` (random 32+ chars)
  - [ ] `FRONTEND_URL` (your Netlify URL)
- [ ] Deploy and copy backend URL

### 3. Frontend (Netlify)
- [ ] Update `.env.production` with backend URL
- [ ] Build locally: `npm run build`
- [ ] Deploy via:
  - [ ] Netlify CLI: `netlify deploy --prod`, OR
  - [ ] Drag/drop `dist` folder, OR
  - [ ] Connect GitHub for auto-deploy
- [ ] Copy frontend URL

### 4. Final Configuration
- [ ] Update `FRONTEND_URL` in Render backend
- [ ] Verify CORS settings
- [ ] Test all endpoints

---

## Testing Checklist

### Authentication
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Token stored in localStorage
- [ ] Can logout

### Dashboard
- [ ] Dashboard loads with data
- [ ] Charts render correctly
- [ ] Stats display properly

### Projects
- [ ] Can view project list
- [ ] Can create new project
- [ ] Can edit project
- [ ] Can delete project

### Finance
- [ ] Can view invoices
- [ ] Can create invoice
- [ ] Invoice updates project spending

### Financial Statements
- [ ] Balance Sheet displays
- [ ] P&L Statement displays
- [ ] Cash Flow displays (no blank screen!)

### Customers & Vendors
- [ ] Can view customers list
- [ ] Can create/edit customers
- [ ] Can view vendors list
- [ ] Can create/edit vendors

### General Ledger
- [ ] Chart of Accounts displays
- [ ] Can view journal entries
- [ ] Can create journal entry

---

## Post-Deployment

### Performance
- [ ] Test load time (<3s)
- [ ] Check mobile responsiveness
- [ ] Verify all images/assets load

### Security
- [ ] HTTPS enabled (auto on Netlify)
- [ ] JWT secret is strong
- [ ] Database credentials secure
- [ ] CORS configured correctly

### Monitoring
- [ ] Check Render logs for errors
- [ ] Monitor Netlify bandwidth usage
- [ ] Set up error alerts (optional)

---

## Quick Commands

```bash
# Test backend locally
cd backend
npm install
npm start

# Test frontend locally
cd frontend
npm install
npm run dev

# Build frontend for production
cd frontend
npm run build
npm run preview

# Deploy with Netlify CLI
cd frontend
netlify deploy --prod
```

---

## Environment Variables Reference

### Backend (.env)
```env
PORT=4000
DB_HOST=<planetscale-host>
DB_PORT=3306
DB_USER=<database-user>
DB_PASSWORD=<database-password>
DB_NAME=mini_erp
JWT_SECRET=<your-secret-minimum-32-chars>
FRONTEND_URL=https://your-app.netlify.app
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## URLs After Deployment

- **Frontend**: `https://<your-app>.netlify.app`
- **Backend**: `https://<your-service>.onrender.com`
- **API Endpoint**: `https://<your-service>.onrender.com/api`

---

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Backend still deploying, wait 5-10 min |
| CORS Error | Update `FRONTEND_URL` in Render |
| Blank Page | Check console, verify `VITE_API_URL` |
| Database Error | Verify credentials, check schema loaded |
| Token Error | Clear localStorage, re-login |

---

✅ **All Done!** Your Mini ERP is now live on the internet! 🎉
