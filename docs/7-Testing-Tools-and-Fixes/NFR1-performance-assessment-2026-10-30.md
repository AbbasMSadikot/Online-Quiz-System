# NFR1 Grading Performance Assessment — 30 Oct 2026

**Historical assessment (30 October 2026): blocked at that time.** The grading route was not yet present. This assessment was superseded after collaborator PR #22 merged; see the [31 October NFR1 performance verification](NFR1-performance-verification-2026-10-31.md).

## Requirement

The SRS NFR1 and Test Plan TC-06 require a representative quiz submission to be graded and returned in under 2.0 seconds under documented normal server load.

## Finding

At the 30 October review, the main-branch API mounted authentication and quiz-management routes but did not implement the SAD's `POST /api/quizzes/{id}/submit` endpoint. Collaborator PR #22 added the grading route on 31 October.

Without a real grading endpoint and a result payload, there was no representative grading request to time. An HTTP response from an unrelated/missing route would not measure grading performance, so no latency numbers were reported in this historical assessment.

## Result and disposition

- **Result on 30 October:** Not measured; NFR1 was unverified and issue #8 remained open.
- **Evidence at that time:** route review of `app/api/src/app.js` and `app/api/src/quizzes.js`; PR #22 subsequently added the grading route.
- **Dependencies at that time:** an API submission path was required before a representative grading request could be timed.
- **Retest:** Completed on 31 October; see [the NFR1 performance verification](NFR1-performance-verification-2026-10-31.md) for the repeatable local profile, measurements, and limits.

This assessment records a blocker; it does not satisfy the performance acceptance criterion.
