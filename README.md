# Habit Tracker API (Node.js + TypeScript)

A production-style REST API for habit tracking, built as part of an API design learning project.  
The project focuses on modular architecture, validation, authentication, and clean backend structure.

## Tech Stack

- Node.js (ESM)
- Express 5
- TypeScript
- PostgreSQL
- Drizzle ORM + Drizzle Kit
- Zod (request validation)
- JWT (authentication)
- Vitest + Supertest (testing)

## Features

- User registration and login
- JWT-protected routes
- User profile management
- Habit CRUD operations
- Input validation with Zod
- Centralized error handling
- Database migrations and seeding support

## Project Structure

```text
src/
  controllers/    # Route handlers
  db/             # Drizzle schema, migrations helpers, seed
  middleware/     # Auth, validation, error handlers
  routes/         # API route modules
  tests/          # Test suites
  utils/          # Shared utility functions
  server.ts       # Express app setup
  index.ts        # Server startup entrypoint
```

## Prerequisites

- Node.js `>=24.3.0`
- PostgreSQL running locally or remotely

## Getting Started

1. **Clone and install**

   ```bash
   git clone https://github.com/Blopinpg1/api-design-on-node-v5.git
   cd api-design-on-node-v5
   npm install
   ```

2. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Update `.env` values (especially `DATABASE_URL` and `JWT_SECRET`).

3. **Run database setup**

   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start the API**

   ```bash
   npm run dev
   ```

   Server runs on `http://localhost:3000` by default.

## API Base URL

- Local: `http://localhost:3000/api`

## Main Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `POST /api/users/change-password`
- `GET /api/habits`
- `POST /api/habits`
- `GET /api/habits/:id`
- `PUT /api/habits/:id`
- `PATCH /api/habits/:id`
- `DELETE /api/habits/:id`

For detailed request/response examples, see [`API_DOCS.md`](./API_DOCS.md).

## Available Scripts

- `npm run dev` — Start in watch mode
- `npm start` — Start server
- `npm test` — Run tests
- `npm run test:watch` — Run tests in watch mode
- `npm run test:coverage` — Generate test coverage
- `npm run db:generate` — Generate Drizzle migrations
- `npm run db:push` — Push schema to database
- `npm run db:migrate` — Run migrations
- `npm run db:studio` — Open Drizzle Studio
- `npm run db:seed` — Seed database

## Health Check

- `GET /health` → `ok`

## License

This project is licensed under the ISC License.
