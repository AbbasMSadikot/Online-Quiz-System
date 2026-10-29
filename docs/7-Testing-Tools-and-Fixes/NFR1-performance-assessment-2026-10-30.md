# NFR1 Grading Performance Assessment — 30 Oct 2026

**Status: blocked; no performance pass is claimed.**

## Requirement

The SRS NFR1 and Test Plan TC-06 require a representative quiz submission to be graded and returned in under 2.0 seconds under documented normal server load.

## Finding

The main-branch API currently mounts authentication routes and quiz-management routes. The quiz router implements quiz creation and listing; it does not implement the SAD's `POST /api/quizzes/{id}/submit` endpoint. FR3 student submissions (issue #4) and FR4 automatic grading (issue #5) are still open.

Without a real grading endpoint and a result payload, there is no representative grading request to time. An HTTP response from an unrelated/missing route would not measure grading performance, so no latency numbers are reported.

## Result and disposition

- **Result:** Not measured; NFR1 is unverified and remains open as issue #8.
- **Evidence:** main-branch route review of `app/api/src/app.js` and `app/api/src/quizzes.js`; current requirement status is in [the RTM](../3-Requirements-Engineering/RTM.md).
- **Dependencies:** FR3 issue #4 and FR4 issue #5 must be implemented and merged.
- **Retest:** After the submission/grading endpoint exists, run authenticated representative submissions against the documented deployment under a recorded normal-load profile; report sample count, concurrency, environment, median, p95, maximum, errors, and whether the 2.0-second criterion passed.

This assessment records a blocker; it does not satisfy the performance acceptance criterion.