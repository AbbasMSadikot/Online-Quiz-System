# Deviation and Gap Log

Compared with the submitted SRS, Software Architecture and Design Specification (SAD), and Test Plan on 30 October 2026. The original PDFs remain unchanged.

| Ref | Source baseline | Affected requirement/test/design | Current implementation or gap | Rationale | Disposition |
| --- | --- | --- | --- | --- | --- |
| DEV-01 | Test Plan, page 1, lists PostgreSQL for the database test item | Test Plan database environment; FR1/FR2 persistence checks | Prisma currently uses SQLite (`app/api/prisma/schema.prisma`). SRS page 2 and SAD page 2 call for a relational database; SQLite meets that broad constraint, but does not match the Test Plan's named engine. | The owner selected SQLite for the initial local prototype on 27 Oct 2026 to avoid requiring a separate database service. | The owner selected SQLite for the prototype after the stack recommendation on 27 Oct 2026. Database-specific verification is against SQLite. Before a PostgreSQL deployment, migrate the schema and rerun persistence tests; do not describe PostgreSQL as tested. This records owner acceptance of the prototype choice, not a claim of instructor approval. |
| GAP-01 | Test Plan TC-01 expects valid student login to route to a Student Dashboard | FR1 / TC-01; FR3 | A signed-in student now sees available quizzes, starts a timed attempt, answers questions, and sees the graded result. | FR3 student flow was added on 2 Nov 2026 and verified locally. | Resolved in the current code; see [FR3/NFR2 verification](../7-Testing-Tools-and-Fixes/FR3-and-NFR2-verification-2026-11-02.md). GitHub issue #4 remains open for its assignee/team review. |
| GAP-02 | SRS FR3/FR4 and Test Plan TC-04/TC-05 define quiz submission and grading | FR3, FR4, TC-04, TC-05, NFR1/TC-06 | Timed submissions, answer-key privacy, grading, and local NFR1/NFR2 measurements are implemented and tested. | Local code and synthetic-load checks passed on 2 Nov 2026. | Local verification is recorded; production capacity and deployment verification remain separate. Issue ownership/state were not changed. |
| GAP-03 | SRS SEC3 requires TLS 1.2 or higher | SEC3 | No deployed HTTPS endpoint or TLS verification evidence is present. | No deployment target/configuration has been supplied in the repository. | Keep issue #7 open; verify HTTPS after deployment configuration exists. |

No baseline PDF was edited.
