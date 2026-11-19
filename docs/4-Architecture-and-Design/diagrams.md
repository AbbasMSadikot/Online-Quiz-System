# Rendered Architecture and Interaction Diagrams

These Mermaid figures are based on the checked-in source as of 19 November 2026 and render directly in GitHub. Editable PlantUML source files remain alongside them. The use-case diagram in PlantUML is not a MUL export.

## System architecture

```mermaid
flowchart LR
  user[Student / Teacher / Admin] --> browser[React + Vite browser client]
  browser -->|JSON + Bearer JWT| api[Express REST API]
  api --> auth[JWT middleware and current DB role check]
  auth --> routes[Auth, quiz, and admin routes]
  routes --> prisma[Prisma ORM]
  prisma --> sqlite[(SQLite database)]
```

## Component view

```mermaid
flowchart TB
  subgraph Web[app/web — React client]
    authUI[Registration / login]
    studentUI[Student quiz workspace + grade history]
    teacherUI[Teacher quiz workspace]
    adminUI[Admin user management]
    client[Shared fetch/API calls]
    authUI --> client
    studentUI --> client
    teacherUI --> client
    adminUI --> client
  end
  subgraph API[app/api — Express]
    authRouter[Auth router]
    quizRouter[Quiz router]
    adminRouter[Admin router]
    middleware[JWT + database role middleware]
    data[Prisma Client]
    authRouter --> middleware
    quizRouter --> middleware
    adminRouter --> middleware
    middleware --> data
  end
  db[(SQLite: User / Quiz / Question / QuizAttempt)]
  client --> authRouter
  client --> quizRouter
  client --> adminRouter
  data --> db
```

## Teacher creates a quiz

```mermaid
sequenceDiagram
  actor T as Teacher
  participant W as React teacher workspace
  participant A as Express quiz API
  participant M as JWT/role middleware
  participant P as Prisma
  participant D as SQLite
  T->>W: Enter quiz and questions
  W->>A: POST /api/quizzes + bearer token
  A->>M: Verify token/current teacher or admin role
  M-->>A: Authorized principal
  A->>A: Validate title, duration, questions/options
  A->>P: Create quiz with question records
  P->>D: Insert related rows
  D-->>P: Persisted records
  P-->>A: Created quiz
  A-->>W: 201 Created
  W-->>T: Show quiz in management list
```

## Student completes a timed attempt

```mermaid
sequenceDiagram
  actor S as Student
  participant W as React student workspace
  participant A as Express quiz API
  participant M as JWT/role middleware
  participant P as Prisma
  participant D as SQLite
  S->>W: Browse active quizzes
  W->>A: GET /api/quizzes
  A->>M: Verify token/current student role
  M-->>A: Authorized principal
  A->>P: Read active quiz summaries
  P->>D: Query quiz metadata
  D-->>P: Quiz metadata
  P-->>A: Active quiz summaries
  A-->>W: Summaries without answer keys
  S->>W: Start selected quiz
  W->>A: POST /api/quizzes/{id}/start
  A->>M: Verify token/current student role
  M-->>A: Authorized principal
  A->>P: Create attempt and server deadline
  P->>D: Persist attempt
  D-->>P: Persisted attempt
  P-->>A: Stored questions/options and attempt data
  A->>A: Cryptographically shuffle question and option order
  A-->>W: Shuffled questions/options, stable IDs, attempt ID, expiry (no answer key)
  S->>W: Answer and submit
  W->>A: POST /api/quizzes/{id}/submit
  A->>M: Verify token/current student role
  M-->>A: Authorized principal
  A->>P: Check deadline, grade, save once
  P->>D: Update attempt result
  D-->>P: Persisted score
  P-->>A: Score result
  A-->>W: Score only, without answer key
  W->>A: GET /api/quizzes/results
  A->>M: Verify token/current student role
  M-->>A: Authorized principal
  A->>P: Read this student's submitted grades
  P->>D: Query grade history
  D-->>P: Submitted scores
  P-->>A: Grade history
  A-->>W: Score history
```

## Admin manages accounts

```mermaid
sequenceDiagram
  actor U as Administrator
  participant W as React admin workspace
  participant A as Express admin API
  participant M as JWT/current-role middleware
  participant P as Prisma
  participant D as SQLite
  U->>W: Open User Management
  W->>A: GET /api/admin/users
  A->>M: Verify admin role from database
  M-->>A: Authorized principal
  A->>P: Select safe account fields only
  P->>D: Query account records
  D-->>P: Account records
  P-->>A: List safe account fields
  A-->>W: Email and role (no password hashes)
  U->>W: Change student/teacher role
  W->>A: PATCH /api/admin/users/{id}/role
  A->>M: Verify admin role from database
  M-->>A: Authorized principal
  A->>P: Update role, disallow self/admin changes
  P->>D: Persist role update
  D-->>P: Updated account
  P-->>A: Updated account
  A-->>W: Updated account
```

For deviations and unimplemented deployment evidence, see the [RTM and deviation log](../3-Requirements-Engineering/).

For a versioned hardware/software inventory, detailed deployment topology, role trust boundaries, and configuration notes, see the [detailed architecture and environment](deployment-architecture.md).
