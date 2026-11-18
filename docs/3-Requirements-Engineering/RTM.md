# Requirements Traceability Matrix

Requirement IDs and wording trace to the submitted SRS. Status below reflects the current source and evidence records as reviewed on 19 November 2026. “Implemented” describes repository behavior, not instructor acceptance or production deployment.

| ID | Requirement summary | Backlog | Implementation / evidence | Current disposition |
| --- | --- | --- | --- | --- |
| FR1 | Register and securely log in with email/password | [#2](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/2) | `app/api/src/auth.js`; auth tests; [PR #18](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/18) | Implemented; historical PR has no recorded review submission |
| SEC1 | Store passwords as salted hashes | [#2](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/2) | bcrypt usage and auth tests | Implemented; source-level test coverage |
| FR2 | Teacher creates quiz with title, instructions, MCQs | [#3](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/3) | `app/api/src/quizzes.js`, React teacher workspace; [PR #20](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/20) | Implemented; test suite covers create/validation/roles |
| FR3 | Student selects active quiz, answers, submits within time | [#4](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/4) | `app/api/src/quizzes.js`; [FR3/NFR2 record](../7-Testing-Tools-and-Fixes/FR3-and-NFR2-verification-2026-11-02.md); [16-test local run](../2-Test-Planning/execution-and-traceability.md) | Implemented; TC-04 no-retake regression passed locally 19 Nov |
| FR4 | Automatically calculate and return score | [#5](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/5) | Grading route/tests; [PR #22](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/22); [FR4 record](../7-Testing-Tools-and-Fixes/FR4-grading-verification-2026-10-31.md) | Implemented; historical PR has no recorded review submission |
| SEC2 | Prevent students from teacher/admin operations | [#6](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/6) | Auth/quiz role checks and API tests; [SEC2 record](../7-Testing-Tools-and-Fixes/SEC2-RBAC-verification-2026-10-30.md) | Implemented and previously CI-verified |
| SEC3 | TLS 1.2+ client/server transport | [#7](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/7) | TLS server support and probe described in deployment docs | Deployment requirement unverified: no live HTTPS target/certificate evidence |
| NFR1 | Graded response under 2 sec under normal load | [#8](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/8) | [NFR1 record](../7-Testing-Tools-and-Fixes/NFR1-performance-verification-2026-10-31.md); later full-flow probe in [FR3/NFR2 record](../7-Testing-Tools-and-Fixes/FR3-and-NFR2-verification-2026-11-02.md) | Local sequential profile passed; not a deployed/network performance claim |
| NFR2 | 500 concurrent students without performance degradation | [#11](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/11) | [500-client local exercise](../7-Testing-Tools-and-Fixes/FR3-and-NFR2-verification-2026-11-02.md) | 500 synthetic local requests completed in recorded runs; production capacity and an agreed degradation threshold are unverified |
| NFR3 | Teacher learns quiz creation under 15 minutes | [#9](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/9) | [Usability record](../7-Testing-Tools-and-Fixes/NFR3-teacher-usability-session-2026-10-30.md) | Recorded trial mean 3.75 minutes; review the record for sample/context |

## Unimplemented baseline use cases

The submitted SRS also lists grade-history viewing and administrator user management. The current application returns an immediate quiz score but does not provide a grade-history feature or user-management UI/API. These gaps are listed in the [deviation log](deviation-log.md) and [use-case diagram](../4-Architecture-and-Design/use-cases.puml).

## GitHub workflow and evidence status

- GitHub Project: [Online Quiz System](https://github.com/users/AbbasMSadikot/projects/1). Last reviewed 19 Nov 2026: Story Points fields were blank on displayed items; issues #12–#16 were in Sprint 3, while the assignment brief describes two sprints. Reconcile the board before presenting it as a two-sprint plan.
- Issues #2–#16 appeared closed during the review. Closed issues and merged PRs do not establish independent PR approval.
- PRs #18 and #20–#22 were merged, but the review list showed no submitted reviews. Owner review/approval evidence is therefore missing for those merges.
- Current historical recordings: [Sprint 1](../9-Demo/sprint-1-product-demo.mov) and [Sprint 2](../9-Demo/sprint-2-product-demo.mp4). Neither video demonstrates the complete current teacher-to-student timed quiz-to-score flow; see [demo assessment](../9-Demo/README.md).
- Architecture/API sources are in [folder 4](../4-Architecture-and-Design/); no MUL export, Copilot session capture, or GitHub/Jira project screenshots are present in the checkout.

The submitted SRS, SAD, and Test Plan PDFs remain unchanged. The baseline Test Plan names PostgreSQL, while the local implementation uses SQLite; see DEV-01.
