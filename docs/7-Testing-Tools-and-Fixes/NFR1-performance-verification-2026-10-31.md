# NFR1 Grading Performance Verification — 31 October 2026

## Result

**Pass for the documented local single-client normal-load profile.** The maximum measured grading response was 0.88 ms, below the SRS threshold of 2,000 ms.

## Method

- Endpoint: `POST /api/quizzes/{quizId}/submit`, added to `main` by collaborator PR #22.
- Environment: macOS 26.6.2, Apple Silicon (`arm64`), Node.js 26.5.0, Prisma with local SQLite test database.
- Fixture: one synthetic quiz with 10 multiple-choice questions and a student bearer token.
- Load profile: one local client, sequential requests, no competing workload. This is the documented normal-load baseline; it does not simulate concurrent students.
- Procedure: 5 warm-up submissions followed by 100 measured submissions. Timing includes the Express request/response path exercised through Supertest, without external network latency.
- Repeatability: run `npm run benchmark:grading --workspace @online-quiz/api`. The script exits nonzero if any measured response reaches or exceeds 2,000 ms. Application checks runs this same probe after the API suite.
- Cleanup: each run deletes only its uniquely named quiz and synthetic fixture users.

## Measurements

| Sample | p50 | p95 | Maximum | Threshold | Result |
| --- | ---: | ---: | ---: | ---: | --- |
| Run 1: 100 measured submissions | 0.49 ms | 0.69 ms | 0.88 ms | < 2,000 ms | Pass |
| Run 2: 100 measured submissions | 0.50 ms | 0.84 ms | 1.08 ms | < 2,000 ms | Pass |

The probe checks that every response is HTTP 200 and returns the expected 10/10 score. It records latency distribution and maximum, not only an average.

## Limits

This local measurement verifies NFR1 for a single sequential client and a 10-question quiz. It does not establish performance through a deployed network, under a production workload, or for 500 concurrent students; NFR2 remains separately assigned and open. The freeze record carries that work forward without claiming those requirements passed.

The earlier [30 October assessment](NFR1-performance-assessment-2026-10-30.md) accurately records that measurement was blocked before PR #22 supplied the grading endpoint; this verification supersedes that status.
