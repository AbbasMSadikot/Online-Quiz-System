# Online Quiz System

A mini project for an online quiz system. The submitted Software Requirements Specification (SRS), Software Architecture and Design Specification (SAD), and Test Plan are the project baselines. Do not silently change those submitted documents; record approved deviations in the deviation log.

## Project links

- Repository: https://github.com/AbbasMSadikot/Online-Quiz-System
- GitHub Project: https://github.com/users/AbbasMSadikot/projects/1
- Backlog: [repository issues](https://github.com/AbbasMSadikot/Online-Quiz-System/issues)

## Submitted baseline documents

- [SRS.pdf](SRS.pdf)
- [Software Architecture & Design Specification.pdf](Software%20Architecture%20%26%20Design%20Specification.pdf)
- [Test Plan.pdf](Test%20Plan.pdf)

## Repository layout

- `app/api/`: Node.js/Express REST API, Prisma data model, and automated API tests.
- `app/web/`: React web client.
- `docs/`: the nine required submission and evidence areas.

## FR1 implementation

FR1 provides account registration and login using an email and password. The API normalizes email addresses, validates required fields, stores passwords as salted bcrypt hashes, and issues short-lived signed JWTs. The frontend keeps the token in memory for the current signed-in session. A protected `GET /api/auth/me` endpoint verifies the bearer token.

The initial implementation uses SQLite through Prisma for simple local setup. The SAD requires a relational database; SQLite satisfies that requirement for this mini-project. The schema can be moved to a hosted relational database if deployment needs it.

## Run locally

Requirements: Node.js 22 or newer and npm.

1. Copy `app/api/.env.example` to `app/api/.env` and set `AUTH_JWT_SECRET` to a private random value with at least 32 characters.
2. From the repository root, install dependencies: `npm install`.
3. Generate the database client and create the local database:

   ```sh
   npm run db:generate --workspace @online-quiz/api
   npm run db:push --workspace @online-quiz/api
   ```

4. In one terminal, start the API: `npm run dev:api`.
5. In another terminal, start the web client: `npm run dev:web`.
6. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Verification

From the repository root, run `npm run build` for the web production build. For API tests, copy `app/api/.env.test` to `app/api/.env`, then run:

```sh
npm run db:generate --workspace @online-quiz/api
npm run db:push --workspace @online-quiz/api
npm test --workspace @online-quiz/api
```

The API test suite covers registration, email normalization, required-field validation, duplicate registration, valid and invalid login, bcrypt password storage, and bearer-token authentication. GitHub Actions runs API tests and builds the web client on relevant pull requests.

## Backlog and sprint plan

See GitHub issue [#2 – FR1 User Authentication](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/2) for FR1 acceptance criteria and implementation history. Other assigned Sprint 1 and Sprint 2 items remain tracked in the project board; update status only after their acceptance criteria and evidence are verified.

The nine evidence folders map to the submission checklist:

1. [SRS and WBS](docs/1-SRS-and-WBS/)
2. [Test Planning](docs/2-Test-Planning/)
3. [Requirements Engineering](docs/3-Requirements-Engineering/)
4. [Architecture and Design](docs/4-Architecture-and-Design/)
5. [Project and Sprint Evidence](docs/5-Project-and-Sprint-Evidence/)
6. [Copilot Evidence](docs/6-Copilot-Evidence/)
7. [Testing Tools and Fixes](docs/7-Testing-Tools-and-Fixes/)
8. [Deployment and Environment](docs/8-Deployment-and-Environment/)
9. [Demo](docs/9-Demo/)

Current code implements FR1 only. Quiz creation, quiz taking, grading, and non-functional requirements are not claimed as complete.
