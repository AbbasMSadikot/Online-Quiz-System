# Requirements Traceability Matrix

Requirement IDs and wording trace to the submitted SRS. Status below reflects the current source and evidence records as reviewed on 19 November 2026. “Implemented” describes repository behavior, not instructor acceptance or production deployment.

| ID | Requirement summary | Backlog | Implementation / evidence | Current disposition |
| --- | --- | --- | --- | --- |
| FR1 | Register and securely log in with email/password | [#2](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/2) | `app/api/src/auth.js`; auth tests; [PR #18](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/18) | Implemented; historical PR has no recorded review submission |
| SEC1 | Store passwords as salted hashes | [#2](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/2) | bcrypt usage and auth tests | Implemented; source-level test coverage |
| FR2 | Teacher creates quiz with title, instructions, MCQs | [#3](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/3) | `app/api/src/quizzes.js`, React teacher workspace; [PR #20](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/20) | Implemented; test suite covers create/validation/roles |
| FR3 | Student selects active quiz, answers, submits within time | [#4](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/4) | `app/api/src/quizzes.js`; secure per-attempt question/option shuffling; student grade history `GET /api/quizzes/results`; [current test record](../2-Test-Planning/execution-and-traceability.md) | Implemented; timed flow, randomized presentation, grade history, and TC-04 no-retake regression passed locally |
| FR4 | Automatically calculate and return score | [#5](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/5) | Grading route/tests; [PR #22](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/22); [FR4 record](../7-Testing-Tools-and-Fixes/FR4-grading-verification-2026-10-31.md) | Implemented; historical PR has no recorded review submission |
| SEC2 | Prevent students from teacher/admin operations | [#6](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/6) | Auth/quiz/admin role checks, database-backed role validation, and API tests; [SEC2 record](../7-Testing-Tools-and-Fixes/SEC2-RBAC-verification-2026-10-30.md) | Implemented; role-change invalidation verified locally |
| SEC3 | TLS 1.2+ client/server transport | [#7](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/7) | TLS server support and probe described in deployment docs | Deployment requirement unverified: no live HTTPS target/certificate evidence |
| NFR1 | Graded response under 2 sec under normal load | [#8](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/8) | [historical verification](../7-Testing-Tools-and-Fixes/NFR1-performance-verification-2026-10-31.md); latest local run in [execution record](../2-Test-Planning/execution-and-traceability.md) | Local sequential profile passed; not a deployed/network performance claim |
| NFR2 | 500 concurrent students without performance degradation | [#11](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/11) | [historical 3-run record](../7-Testing-Tools-and-Fixes/FR3-and-NFR2-verification-2026-11-02.md); latest local run in [execution record](../2-Test-Planning/execution-and-traceability.md) | 500 synthetic workflows passed locally on 19 Nov with zero errors; production capacity and an agreed degradation threshold are unverified |
| NFR3 | Teacher learns quiz creation under 15 minutes | [#9](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/9) | [Usability record](../7-Testing-Tools-and-Fixes/NFR3-teacher-usability-session-2026-10-30.md) | Recorded trial mean 3.75 minutes; review the record for sample/context |

## Baseline use cases implemented

The application provides student grade history and administrator user/role management. Grade history is covered in `app/api/test/grading.test.js`; admin access, safe fields, role mutation, and immediate enforcement after demotion are covered in `app/api/test/auth.test.js`. Admin accounts are not publicly self-registered; provision one using private `ADMIN_EMAIL` and `ADMIN_PASSWORD` values before running the seed command. See the [deployment guide](../8-Deployment-and-Environment/README.md) and [deviation log](deviation-log.md) for these controls and limits.

## GitHub workflow and evidence status

- GitHub Project: [Online Quiz System](https://github.com/users/AbbasMSadikot/projects/1). Board reviewed 19 Nov 2026: #2–#5 were in Sprint 1, #6–#11 in Sprint 2, and #12–#16 in Sprint 3; all displayed Story Points were blank. Reconcile the board before presenting it as the required two-sprint plan.
- Issues #2–#16 appeared closed during the review. Closed issues and merged PRs do not establish independent PR approval.
- PRs #18 and #20–#22 were merged, but the review list showed no submitted reviews. Owner review/approval evidence is therefore missing for those merges.
- Current historical recordings: [Sprint 1](../9-Demo/sprint-1-product-demo.mov) and [Sprint 2](../9-Demo/sprint-2-product-demo.mp4). Neither video demonstrates the complete current teacher-to-student timed quiz-to-score flow; see [demo assessment](../9-Demo/README.md).
- Architecture/API sources are in [folder 4](../4-Architecture-and-Design/); no MUL export, Copilot session capture, or GitHub/Jira project screenshots are present in the checkout.

The submitted SRS, SAD, and Test Plan PDFs remain unchanged. The baseline Test Plan names PostgreSQL, while the local implementation uses SQLite; see DEV-01. The board audit above records the visible state; no board fields were changed in this documentation pass.
