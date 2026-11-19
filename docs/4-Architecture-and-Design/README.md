# Architecture and Design Evidence

Use the submitted [Software Architecture & Design Specification.pdf](Software%20Architecture%20%26%20Design%20Specification.pdf) as the immutable baseline. The [Mermaid diagrams](diagrams.md) render inline on GitHub; editable PlantUML sources below describe checked-in code as of 19 November 2026. See the [detailed architecture and environment inventory](deployment-architecture.md) for hardware, software versions, ports, CI, role boundaries, and limitations. The use-case source is not a MUL export.

## Required items

- [x] Architecture diagram: [architecture.puml](architecture.puml), [inline rendered figure](diagrams.md#system-architecture)
- [x] Pattern rationale: layered separation, Express middleware/router, Prisma data-access abstraction, React component composition; see below
- [x] API specification: [API.md](API.md)
- [x] Component diagram: [components.puml](components.puml), [inline rendered figure](diagrams.md#component-view)
- [x] Two sequence diagrams: [PlantUML sources](teacher-creates-quiz.puml) and [student-takes-quiz.puml](student-takes-quiz.puml); Mermaid versions in [diagrams.md](diagrams.md)
- [x] Detailed deployment/software architecture and observed hardware/version inventory: [deployment-architecture.md](deployment-architecture.md)
- [ ] Use-case diagram exported from MUL: [use-cases.puml](use-cases.puml) is an editable UML source replacement, not proof of MUL authorship/export
- [x] Deviations from submitted SAD noted in [deviation log](../3-Requirements-Engineering/deviation-log.md)

## Architecture and patterns

The checked-in system is a three-tier web application: React/Vite browser UI, Express JSON API, and Prisma ORM over a local SQLite relational database. JWT bearer authentication is validated in API middleware; route handlers enforce role checks. Quiz route handlers coordinate persistence through Prisma. The project does not implement a separate repository class, microservice, event bus, or production hosting layer, so diagrams do not imply any of those.

Patterns present in the source: layered architecture separates presentation, API, and persistence; middleware centralizes bearer-token authentication; route modules group related API behavior; React composition separates role-specific workspaces and reusable UI. Prisma is the data-access abstraction. These are implementation patterns, not claims of a formally enforced repository design pattern.

The attached baseline SAD describes a `GET /api/quizzes/{id}` endpoint; implementation instead returns quiz questions from the student start endpoint. See DEV-03.
