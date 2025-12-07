# Construction Mini ERP & Finance System (Prototype)

This workspace contains a Node.js + Express backend and a Vite + React frontend implementing a Construction-focused Mini ERP with projects, invoices, accounts receivable and a rule-based AI insights engine.

Folders:
- `backend/` : Express API, MySQL access, controllers, models, SQL schema
- `frontend/` : Vite + React app

Quick start (Windows PowerShell):

Backend

```powershell
cd "c:\Users\Asus\Downloads\Mini ERP & Finance System\backend"
npm install
# copy .env.example to .env and set DB credentials
# create DB and tables
mysql -u root -p < sql/schema.sql
mysql -u root -p mini_erp < sql/sample_data.sql
npm run dev
```

Frontend

```powershell
cd "c:\Users\Asus\Downloads\Mini ERP & Finance System\frontend"
npm install
# optionally set VITE_API_URL in .env
npm run dev
```

API Examples (cURL)

Register:

```bash
curl -X POST http://localhost:4000/api/auth/register -H "Content-Type: application/json" -d '{"name":"User","email":"u@example.com","password":"pass123"}'
```

Login:

```bash
curl -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"u@example.com","password":"pass123"}'
```

Create Project (use token):

```bash
curl -X POST http://localhost:4000/api/projects -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"name":"SiteX","budget":100000}'
```

Create Invoice (updates A/R and project spent):

```bash
curl -X POST http://localhost:4000/api/invoices -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"project_id":1,"amount":5000,"description":"Materials"}'
```

Insights

```bash
curl -X GET http://localhost:4000/api/insights/project/1 -H "Authorization: Bearer $TOKEN"
```

See `backend/README_API.md` for full route list.
