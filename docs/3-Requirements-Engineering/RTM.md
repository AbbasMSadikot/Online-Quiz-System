# Requirements Traceability Matrix

Requirement wording and IDs were checked against the submitted SRS on 30 October 2026. Sprint and verification evidence is linked to the repository issues and CI runs.

| ID | SRS requirement | Backlog | Verification/evidence | Status as of 30 Oct 2026 |
| --- | --- | --- | --- | --- |
| FR1 | Register and securely log in with email and password | [#2](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/2) | [PR #18](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/18); auth API tests and CI | Implemented and merged |
| SEC1 | Store passwords using a strong salted hash | [#2](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/2) | bcrypt hash inspection and auth tests in PR #18 | Implemented and merged |
| FR2 | Teacher creates quizzes with title, instructions, and MCQs | [#3](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/3) | [PR #20](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/20); API tests and CI | Implemented and merged |
| FR3 | Student selects an active quiz, answers, and submits within a time limit | [#4](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/4) | Timed student-submission tests | Open; assigned implementation not yet present on main |
| FR4 | Automatically calculate and return a score after submission | [#5](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/5) | Answer-key and score-calculation tests | Open; grading endpoint not yet present on main |
| SEC2 | Prevent students from using teacher/admin API operations | [#6](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/6) | Student denied; teacher allowed; administrator cases added in `app/api/test/auth.test.js` | Verified: administrator allow-cases and all API tests passed in [Actions run #40957301803](https://github.com/AbbasMSadikot/Online-Quiz-System/actions/runs/40957301803) |
| SEC3 | Encrypt client-server traffic with TLS 1.2 or higher | [#7](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/7) | Deployment configuration and TLS check | Open; no deployed HTTPS endpoint/evidence |
| NFR1 | Return a graded result in under 2.0 seconds under normal load | [#8](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/8) | [NFR1 assessment](../7-Testing-Tools-and-Fixes/NFR1-performance-assessment-2026-10-30.md) | Blocked; no grading submission endpoint to measure |
| NFR2 | Support 500 concurrent students without performance degradation | [#11](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/11) | Repeatable concurrent load test and environment record | Open; evidence not present |
| NFR3 | Teacher learns quiz creation in under 15 minutes | [#9](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/9) | [NFR3 usability session record](../7-Testing-Tools-and-Fixes/NFR3-teacher-usability-session-2026-10-30.md) | Verified: 3.75 min mean training time recorded; all participants passed |

## Project-level evidence status

- Sprint 2 demo video: [sprint-2-product-demo.mp4](../9-Demo/sprint-2-product-demo.mp4) (recorded and linked in [issue #13](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/13) and [docs/9-Demo/](../9-Demo/README.md)).
- Product and verification documentation: [issue #14](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/14).
- Known deviations: [deviation log](deviation-log.md).
- Release/freeze decision and remaining work: [Sprint 2 exit review](../5-Project-and-Sprint-Evidence/sprint-2-exit-review-2026-10-30.md).

The three submitted PDFs remain unchanged.
