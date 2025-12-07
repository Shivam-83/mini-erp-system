# API Documentation (Construction Mini ERP Backend)

Base URL: `http://localhost:4000/api`

Auth
- POST `/api/auth/register` { name, email, password }
- POST `/api/auth/login` { email, password } -> returns `{ token, user }`

Projects
- POST `/api/projects` (auth) { name, description, budget, progress }
- GET `/api/projects` (auth)
- GET `/api/projects/:id` (auth)
- PUT `/api/projects/:id` (auth)

Invoices
- POST `/api/invoices` (auth) { project_id, description, amount, status }
- GET `/api/invoices` (auth)

Dashboard
- GET `/api/dashboard` (auth)

Insights
- GET `/api/insights/project/:id` (auth)

Notes
- All routes besides `/api/auth/*` require `Authorization: Bearer <token>` header.
