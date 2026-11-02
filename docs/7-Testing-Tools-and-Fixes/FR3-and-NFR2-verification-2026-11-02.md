# FR3 Student Quiz Flow and NFR2 Local Load Verification — 2 November 2026

## FR3 implementation and checks

- Teachers configure a whole-number duration from 1 to 180 minutes when creating a quiz; the default is 10 minutes.
- Student accounts can list available quizzes. The list does not disclose questions or answer keys.
- Starting a quiz creates a persisted attempt with a server-generated start time and expiry time. The student view displays the questions and a countdown.
- Submissions must identify the student's attempt and include exactly one answer per question. The API rejects expired attempts with HTTP 410, duplicate submissions with HTTP 409, and invalid/unauthorized requests with the relevant 4xx response.
- The API persists the submitted answers and score against the attempt. The student response includes the score and percentage, but does not include the correct answers.
- Automated coverage: student quiz list, answer-key redaction, configured duration, normal grading, malformed/incomplete/duplicate/unknown answers, late submission, duplicate attempt submission, and role checks.

Verification commands:

```sh
npm test --workspace @online-quiz/api
npm run build --workspace @online-quiz/web
```

Result on 2 November 2026: all 15 API tests passed; the React production build passed.

## NFR2 500-client local exercise

Command:

```sh
NFR2_CONCURRENCY=500 npm run load-test:500 --workspace @online-quiz/api
```

The repeatable harness creates uniquely named synthetic accounts and one 10-question quiz in the configured local test database. It sends 500 concurrent start requests, then 500 concurrent submissions, checks every returned score, records phase throughput and response latencies, and deletes its fixture quiz and accounts. Three 2 November 2026 runs each completed all 500 starts and submissions with zero errors.

| Measurement | Result |
| --- | ---: |
| Concurrent synthetic students | 500 |
| Quiz questions | 10 |
| Run 1 start phase | 361.15 ms; 1,384.47 requests/s |
| Run 1 submit phase | 420.16 ms; 1,190.03 submissions/s; p50/p95/max 175.50/248.82/419.61 ms |
| Run 2 start phase | 330.09 ms; 1,514.75 requests/s |
| Run 2 submit phase | 422.49 ms; 1,183.46 submissions/s; p50/p95/max 164.54/233.64/422.11 ms |
| Run 3 start phase | 279.01 ms; 1,792.06 requests/s; p50/p95/max 165.21/227.20/277.56 ms |
| Run 3 submit phase | 302.70 ms; 1,651.78 submissions/s; p50/p95/max 179.06/252.47/300.70 ms |
| Errors | 0 |

This is one local Node.js process using SQLite and synthetic bearer tokens. It does not verify production infrastructure, real user sessions, network latency, resource consumption on a deployment target, or multi-instance behavior. The issue's “without performance degradation” criterion has no numeric baseline in the submitted evidence, so this local result is evidence for the tested profile and not a production-capacity guarantee. Repeat the run on the intended deployment environment before making that claim.

## NFR1 check after the timed-attempt flow

The grading benchmark now times a full local start-plus-submit workflow so each measured answer submission has a fresh attempt. The 2 November 2026 run completed 100 measured workflows after 5 warmups with p50 1.70 ms, p95 2.12 ms, and maximum 2.25 ms, below the 2,000 ms threshold. This remains a single sequential local client measurement.
