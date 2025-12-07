# Setup Guide - Construction Mini ERP

## Quick Start

### Option 1: One-Click Start (Recommended)
```powershell
cd "c:\Users\Asus\Downloads\Mini ERP & Finance System"
.\start.bat
```

### Option 2: Docker Compose (Production-Like)
```powershell
cd "c:\Users\Asus\Downloads\Mini ERP & Finance System"
docker-compose up --build
```

Access:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs
- **Adminer (DB)**: http://localhost:8080

---

## Manual Setup (Development)

### Prerequisites
- Node.js 16+ installed
- MySQL 8.0+ installed (or Docker)
- Git (optional)

### Step 1: Database Setup

#### Using MySQL Directly
```powershell
# Start MySQL and create database
mysql -u root -p

# In MySQL shell:
CREATE DATABASE mini_erp;
USE mini_erp;
SOURCE C:/Users/Asus/Downloads/Mini ERP & Finance System/backend/sql/schema.sql;
SOURCE C:/Users/Asus/Downloads/Mini ERP & Finance System/backend/sql/sample_data.sql;
exit;
```

#### Using Docker for Database
```powershell
docker run -d --name mini-erp-db `
  -e MYSQL_ROOT_PASSWORD=root `
  -e MYSQL_DATABASE=mini_erp `
  -p 3306:3306 `
  -v "${PWD}\backend\sql:/docker-entrypoint-initdb.d" `
  mysql:8.0

# Wait 30 seconds for initialization
Start-Sleep -Seconds 30
```

### Step 2: Backend Setup

```powershell
# Navigate to backend
cd "c:\Users\Asus\Downloads\Mini ERP & Finance System\backend"

# Install dependencies
npm install

# Configure environment
if (!(Test-Path .env)) { Copy-Item .env.example .env }

# Edit .env if needed:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=root
# DB_NAME=mini_erp
# PORT=4000
# JWT_SECRET=your_secret_key

# Start backend
npm run dev
```

Backend runs at: **http://localhost:4000**

### Step 3: Frontend Setup

```powershell
# Open new terminal, navigate to frontend
cd "c:\Users\Asus\Downloads\Mini ERP & Finance System\frontend"

# Install dependencies
npm install

# Configure environment
if (!(Test-Path .env)) { Copy-Item .env.example .env }

# Start frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Complete Fresh Install

```powershell
# 1. Navigate to project
cd "c:\Users\Asus\Downloads\Mini ERP & Finance System"

# 2. Backend setup
cd backend
npm install
if (!(Test-Path .env)) { Copy-Item .env.example .env }

# 3. Frontend setup
cd ..\frontend
npm install
if (!(Test-Path .env)) { Copy-Item .env.example .env }

# 4. Start database (Docker)
cd ..
docker run -d --name mini-erp-db `
  -e MYSQL_ROOT_PASSWORD=root `
  -e MYSQL_DATABASE=mini_erp `
  -p 3306:3306 `
  -v "${PWD}\backend\sql:/docker-entrypoint-initdb.d" `
  mysql:8.0

# Wait for DB
Start-Sleep -Seconds 30

# 5. Start backend (Terminal 1)
cd backend
node index.js

# 6. Start frontend (Terminal 2 - new window)
cd ..\frontend
npm run dev
```

---

## Login Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

---

## Available Commands

### Backend
```powershell
cd backend

npm install          # Install dependencies
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production mode
npm test             # Run tests
```

### Frontend
```powershell
cd frontend

npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Docker
```powershell
docker-compose up              # Start all services
docker-compose up --build      # Rebuild and start
docker-compose down            # Stop all services
docker-compose restart         # Restart services
docker-compose logs -f         # View logs
```

---

## Testing the Application

### 1. Test API Endpoints

**Register User:**
```powershell
curl -X POST http://localhost:4000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

**Login:**
```powershell
curl -X POST http://localhost:4000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Create Project:**
```powershell
# Save token from login response
$token = "your_jwt_token_here"

curl -X POST http://localhost:4000/api/projects `
  -H "Authorization: Bearer $token" `
  -H "Content-Type: application/json" `
  -d '{"name":"New Construction Site","budget":500000,"progress":15}'
```

### 2. Run Test Suite
```powershell
cd backend
npm test
```

### 3. Access Web Interface
1. Open browser: http://localhost:5173
2. Login with admin credentials
3. Navigate through Dashboard, Projects, Finance, Admin

---

## Troubleshooting

### Port Already in Use
```powershell
# Check ports
netstat -ano | findstr :4000
netstat -ano | findstr :5173
netstat -ano | findstr :3306

# Kill process (replace <PID> with actual PID)
taskkill /PID <PID> /F
```

### Database Connection Error
```powershell
# Check MySQL is running
Get-Service MySQL*

# Or check Docker container
docker ps -a

# Restart MySQL
net stop MySQL80
net start MySQL80

# Or restart Docker container
docker restart mini-erp-db
```

### Frontend Not Loading
```powershell
# Clear npm cache
cd frontend
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install

# Restart dev server
npm run dev
```

### Backend API Errors
```powershell
# Check .env configuration
cd backend
Get-Content .env

# View logs
npm run dev

# Check database connection
mysql -u root -p -e "USE mini_erp; SHOW TABLES;"
```

---

## Environment Variables

### Backend (.env)
```
PORT=4000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=mini_erp
JWT_SECRET=changeme_jwt_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:4000/api
```

---

## Project Structure

```
Mini ERP & Finance System/
├── backend/
│   ├── controllers/       # Business logic
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & validation
│   ├── sql/              # Database schemas
│   ├── tests/            # Test files
│   ├── .env              # Environment config
│   ├── index.js          # Entry point
│   └── package.json      # Dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/        # React pages
│   │   ├── components/   # React components
│   │   ├── services/     # API client
│   │   └── styles.css    # Styles
│   ├── .env              # Environment config
│   ├── index.html        # HTML template
│   └── package.json      # Dependencies
├── docker-compose.yml    # Docker orchestration
├── README.md             # Project overview
└── start.bat             # Quick start script
```

---

## Production Deployment

### Build Frontend
```powershell
cd frontend
npm run build
# Output in dist/ folder
```

### Start Production Server
```powershell
cd backend
npm start
```

### Docker Production
```powershell
docker-compose -f docker-compose.yml up -d
```

---

## Features Checklist

- ✅ User Authentication (JWT)
- ✅ Project Management (CRUD)
- ✅ Invoice Management (CRUD)
- ✅ Accounts Receivable Tracking
- ✅ AI Risk Insights Engine
- ✅ Dashboard with Charts
- ✅ Admin User Management
- ✅ Role-Based Access Control
- ✅ RESTful API
- ✅ Responsive UI
- ✅ Docker Support

---

## Support

For issues or questions:
1. Check logs in terminal
2. Review .env configuration
3. Ensure all dependencies installed
4. Verify database is running
5. Check API documentation: http://localhost:4000/api/docs

---

**Last Updated**: December 2025  
**Version**: 1.0.0
