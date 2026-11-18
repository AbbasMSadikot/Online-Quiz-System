# Architecture and Design Evidence

Use the submitted [Software Architecture & Design Specification.pdf](Software%20Architecture%20%26%20Design%20Specification.pdf) as the immutable baseline. Editable PlantUML sources below describe the checked-in code as of 19 November 2026. Render with PlantUML to PNG/SVG for a slide deck or attach the exported files after reviewing them; GitHub renders the source text but may not render every UML diagram inline.

## Required items

- [x] Architecture diagram: [architecture.puml](architecture.puml)
- [x] Pattern rationale: layered separation, Express middleware/router, Prisma data-access abstraction, React component composition; see below
- [x] API specification: [API.md](API.md)
- [x] Component diagram: [components.puml](components.puml)
- [x] Two sequence diagrams: [teacher-creates-quiz.puml](teacher-creates-quiz.puml), [student-takes-quiz.puml](student-takes-quiz.puml)
- [ ] Use-case diagram exported from MUL: [use-cases.puml](use-cases.puml) is an editable UML source replacement, not proof of MUL authorship/export
- [x] Deviations from submitted SAD noted in [deviation log](../3-Requirements-Engineering/deviation-log.md)

## Architecture and patterns

The checked-in system is a three-tier web application: React/Vite browser UI, Express JSON API, and Prisma ORM over a local SQLite relational database. JWT bearer authentication is validated in API middleware; route handlers enforce role checks. Quiz route handlers coordinate persistence through Prisma. The project does not implement a separate repository class, microservice, event bus, or production hosting layer, so diagrams do not imply any of those.

Patterns present in the source: layered architecture separates presentation, API, and persistence; middleware centralizes bearer-token authentication; route modules group related API behavior; React composition separates role-specific workspaces and reusable UI. Prisma is the data-access abstraction. These are implementation patterns, not claims of a formally enforced repository design pattern.

PlantUML source can be rendered using the PlantUML CLI or editor plugin. Review the rendered figures against the code and current data flow before submission. The attached baseline SAD describes a `GET /api/quizzes/{id}` endpoint; implementation instead returns quiz questions from the student start endpoint. See DEV-03.
