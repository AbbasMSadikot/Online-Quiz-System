# Deployment and Environment

This folder records the environment described by the current source. The API supports HTTPS when a deployment supplies a certificate and private key; local HTTP remains the default for development.

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

4. For an HTTPS deployment, set `TLS_CERT_FILE` and `TLS_KEY_FILE` to the certificate and key paths. The Node HTTPS server enforces TLS 1.2 as its minimum protocol.
5. Start the API in one terminal: `npm run dev:api`.
6. Start the web client in another terminal: `npm run dev:web`.
7. Verify a deployed endpoint with `TLS_CHECK_URL=https://your-host.example.com npm run verify:tls --workspace @online-quiz/api`.
8. Open the Vite URL shown in the terminal, normally `http://localhost:5173`. Complete a registration/login flow to check the API and database together.

The local database is created from the `DATABASE_URL` in `app/api/.env`; the example points to a SQLite file managed by Prisma. Tests use the separate `app/api/.env.test` configuration and test database.

## Test and production limitations

- GitHub Actions runs Prisma setup, API tests, and the React production build.
- No rollback/migration plan for a hosted database has been validated. Back up any local database file before changing the Prisma schema.
- A production hosting target and certificate lifecycle are deployment responsibilities. The API's HTTPS mode is configured for TLS 1.2+ and the `verify:tls` probe records the negotiated protocol. Do not use the local HTTP development server for real user data.
- Store deployment screenshots and sanitized logs in this folder after an actual target has been selected and deployed.
