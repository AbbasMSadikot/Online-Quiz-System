# Online Quiz System

A mini project for an online quiz system. The submitted Software Requirements Specification (SRS), Software Architecture and Design Specification (SAD), and Test Plan are the project baselines. Do not silently change those submitted documents; record approved deviations in the deviation log.

## Project links

- Repository: https://github.com/AbbasMSadikot/Online-Quiz-System
- GitHub Project: https://github.com/users/AbbasMSadikot/projects/1
- Backlog: [repository issues](https://github.com/AbbasMSadikot/Online-Quiz-System/issues)

## Submitted baseline documents

- [SRS.pdf](docs/1-SRS-and-WBS/SRS.pdf)
- [Software Architecture & Design Specification.pdf](docs/4-Architecture-and-Design/Software%20Architecture%20%26%20Design%20Specification.pdf)
- [Test Plan.pdf](docs/2-Test-Planning/Test%20Plan.pdf)

## Repository layout

- `app/api/`: Node.js/Express REST API, Prisma data model, and automated API tests.
- `app/web/`: React web client.
- `docs/`: the nine required submission and evidence areas.

## FR1 implementation

FR1 provides account registration and login using an email and password. The API normalizes email addresses, validates required fields, stores passwords as salted bcrypt hashes, and issues short-lived signed JWTs. The frontend keeps the token in memory for the current signed-in session. A protected `GET /api/auth/me` endpoint verifies the bearer token.

The initial implementation uses SQLite through Prisma for local setup. SQLite meets the SAD's relational-database requirement; the Test Plan names PostgreSQL, so this difference and its disposition are recorded in [the deviation log](docs/3-Requirements-Engineering/deviation-log.md).

## FR2 and NFR3 implementation

FR2 allows authorized teachers and administrators to create quizzes with titles, instructions, and multiple-choice questions. The API exposes `POST /api/quizzes` to persist quizzes and associated questions with role enforcement and input validation, as well as `GET /api/quizzes` to load the teacher's quiz management list. The React web client provides a dedicated teacher workspace to compose quizzes, add/remove multiple-choice questions, specify unique options and correct answers, and view newly created quizzes in the management list.

To satisfy NFR3 (usability), the workspace incorporates an in-app Quick Start Guide, live option count indicators, and real-time answer matching validation, verified through teacher usability trials with an average training duration of 3.75 minutes (< 15-minute threshold).

## Run locally

Requirements: Node.js 22 or newer and npm.

1. Copy `app/api/.env.example` to `app/api/.env` and set `AUTH_JWT_SECRET` to a private random value with at least 32 characters.
2. From the repository root, install dependencies: `npm install`.
3. Generate the database client and create the local database:

   ```sh
   npm run db:generate --workspace @online-quiz/api
   npm run db:push --workspace @online-quiz/api
   ```

4. (Optional) Provision a local teacher account for testing quiz creation:

   ```sh
   npm run db:seed --workspace @online-quiz/api
   ```

   Default credentials: `teacher@example.com` / `Teacher123!`.

5. In one terminal, start the API: `npm run dev:api`.
6. In another terminal, start the web client: `npm run dev:web`.
7. Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## Verification

From the repository root, run `npm run build` for the web production build. For API tests, copy `app/api/.env.test` to `app/api/.env`, then run:

```sh
npm run db:generate --workspace @online-quiz/api
npm run db:push --workspace @online-quiz/api
npm test --workspace @online-quiz/api
```

The API test suite covers registration, email normalization, required-field validation, duplicate registration, valid and invalid login, bcrypt password storage, bearer-token authentication, teacher quiz creation with multiple-choice questions, validation rules, teacher quiz listing, and role-based access control (RBAC). GitHub Actions runs API tests and builds the web client on relevant pull requests.

## Backlog and sprint plan

See GitHub issues [#2 – FR1 User Authentication](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/2), [#3 – FR2 Teacher Quiz Creation](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/3), [#9 – NFR3 Teacher Quiz Creation Usability](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/9), and [#13 – DEMO Sprint 2 Working Product Video](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/13) for acceptance criteria and implementation history.

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

Current code implements FR1 and FR2, verified with NFR3 usability and the Sprint 2 demo video ([docs/9-Demo/sprint-2-product-demo.mp4](docs/9-Demo/sprint-2-product-demo.mp4)). FR3/FR4 and remaining Sprint 2 verification items are tracked in the project backlog for subsequent implementation.
