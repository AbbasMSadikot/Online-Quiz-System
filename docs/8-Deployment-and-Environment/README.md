# Deployment and Environment

This folder records the environment described by the current source. These steps are for local development; there is no cloud/production deployment target or TLS configuration in the repository yet.

## Stack and requirements

- Node.js 22 or newer and npm
- React web client served by Vite during development
- Node.js/Express REST API
- Prisma ORM with SQLite for local persistence
- A private `AUTH_JWT_SECRET` with at least 32 characters

SQLite satisfies the SAD's relational database requirement. The Test Plan names PostgreSQL; see the [deviation log](../3-Requirements-Engineering/deviation-log.md). Do not describe PostgreSQL as tested.

## Local setup

From the repository root:

1. Install dependencies: `npm install`.
2. Copy `app/api/.env.example` to `app/api/.env`. Replace `AUTH_JWT_SECRET` with a private random value; do not commit `.env`.
3. Generate the Prisma client and create/update the local SQLite schema:

   ```sh
   npm run db:generate --workspace @online-quiz/api
   npm run db:push --workspace @online-quiz/api
   ```

4. Start the API in one terminal: `npm run dev:api`.
5. Start the web client in another terminal: `npm run dev:web`.
6. Open the Vite URL shown in the terminal, normally `http://localhost:5173`. Complete a registration/login flow to check the API and database together.

The local database is created from the `DATABASE_URL` in `app/api/.env`; the example points to a SQLite file managed by Prisma. Tests use the separate `app/api/.env.test` configuration and test database.

## Test and production limitations

- GitHub Actions runs Prisma setup, API tests, and the React production build.
- No rollback/migration plan for a hosted database has been validated. Back up any local database file before changing the Prisma schema.
- No production hosting target, HTTPS endpoint, or TLS 1.2+ verification exists yet. SEC3 remains open as issue #7; do not use the local HTTP development server for real user data.
- Store deployment screenshots and sanitized logs in this folder after an actual target has been selected and deployed.