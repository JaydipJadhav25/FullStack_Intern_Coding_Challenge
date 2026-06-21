# Store Rating App

A full-stack store rating platform with role-based access control (Admin, Normal User, Store Owner), built for a Full Stack Intern coding assessment.

**Stack:** React + Vite + Tailwind (frontend) · Express + Prisma + MySQL + JWT (backend)

## Project Structure

```
store-rating-app/
├── backend/      Express API, Prisma schema, JWT auth, RBAC
└── frontend/     React + Vite + Tailwind SPA
```

## 1. Backend Setup

```bash
cd backend
npm install

```

Edit `.env` and set `DATABASE_URL` to point at your MySQL instance, e.g.:

```
DATABASE_URL="mysql://root:password@localhost:3306/store_rating_db"
```

Create the database, generate the Prisma client, and run migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run seed     # optional: creates demo admin/owner/user accounts + sample stores
npm run dev       # starts on http://localhost:5000
```

### Seeded demo accounts (after `npm run seed`)

| Role        | Email                | Password   |
|-------------|----------------------|------------|
| Admin       | admin@example.com    | Admin@123  |
| Store Owner | spice@gmail.com      | Owner@123  |
| User        | jaydip@example.com   | User@123   |

## 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # defaults to http://localhost:5000/api, adjust if needed
npm run dev             # starts on http://localhost:5173
```

## API Overview

| Area  | Method & Path                          | Access            |
|-------|-----------------------------------------|--------------------|
| Auth  | `POST /api/auth/signup`                 | Public             |
| Auth  | `POST /api/auth/login`                  | Public             |
| Auth  | `POST /api/auth/change-password`        | Any logged-in user |
| Admin | `GET /api/admin/dashboard`              | Admin              |
| Admin | `GET /api/admin/users` (search/sort/filter via query params) | Admin |
| Admin | `GET /api/admin/users/:id`              | Admin              |
| Admin | `POST /api/admin/users`                 | Admin              |
| Admin | `GET /api/admin/stores` (search/sort)   | Admin              |
| Admin | `POST /api/admin/stores`                | Admin              |
| User  | `GET /api/stores` (search)              | User, Admin        |
| User  | `POST /api/ratings`                     | User, Admin        |
| User  | `PUT /api/ratings/:storeId`             | User, Admin        |
| Owner | `GET /api/owner/dashboard`              | Store Owner        |
| Owner | `GET /api/owner/ratings`                | Store Owner        |

