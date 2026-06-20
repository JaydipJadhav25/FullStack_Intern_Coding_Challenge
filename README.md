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

Query params for `/api/admin/users`: `search`, `role`, `sortBy` (name/email/address/role), `sortOrder` (asc/desc).
Query params for `/api/admin/stores` and `/api/stores`: `search`, `sortBy` (name/email/address/rating), `sortOrder`.

## Validation Rules (enforced both client- and server-side)

- **Name:** 20–60 characters
- **Address:** required, max 400 characters
- **Password:** 8–16 characters, at least 1 uppercase letter, at least 1 special character
- **Email:** standard email format
- **Rating:** integer 1–5, one rating per user per store (subsequent submissions use `PUT` to update)

## Database Notes

- `users.role` is an enum: `ADMIN`, `USER`, `STORE_OWNER`.
- `ratings` has a unique constraint on `(user_id, store_id)` — enforced at the DB level via Prisma's `@@unique`.
- The `rating BETWEEN 1 AND 5` constraint is enforced via `express-validator` on every write; Prisma doesn't support native CHECK constraints in the schema file, so if you want DB-level enforcement too, add a raw SQL migration with `ALTER TABLE ratings ADD CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5);`.

## What's Left for You

1. Run the Prisma migration locally (couldn't be verified in this sandbox — see note above).
2. Consider adding pagination to the admin users/stores tables if your dataset grows large (currently unpaginated).
3. Tighten CORS_ORIGIN in `.env` for production.
4. Swap the JWT_SECRET for a real secret before deploying.
