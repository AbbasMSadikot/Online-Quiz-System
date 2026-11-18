# Test-plan execution and traceability

This record separates historical results from checks still due. Source review date: 19 November 2026. Baseline: [submitted Test Plan PDF](Test%20Plan.pdf). Environment for documented local test records is Node.js, Express/Supertest, Prisma, and SQLite; the Test Plan names PostgreSQL, so results here do not claim PostgreSQL validation.

## Requirement and test coverage map

| Baseline area | Current test/evidence source | Recorded disposition / limitation |
| --- | --- | --- |
| FR1 / SEC1 registration, login, password hash | `app/api/test/auth.test.js`; [SEC2/RBAC record](../7-Testing-Tools-and-Fixes/SEC2-RBAC-verification-2026-10-30.md) | Auth tests were included in the historical CI/API pass. |
| FR2 quiz authoring and field validation | `app/api/test/auth.test.js`; GitHub Application checks | Authoring and role cases are covered; see CI and PR history. |
| FR3 active quiz list, timed attempt, answer privacy, expiry | `app/api/test/auth.test.js`, `app/api/test/grading.test.js`; [FR3/NFR2 record](../7-Testing-Tools-and-Fixes/FR3-and-NFR2-verification-2026-11-02.md) | 17 API tests passed locally on 19 Nov, including the no-retake and SQL-injection-shaped ID regressions. |
| FR4 full/zero/partial scores; malformed and unauthorized submission | `app/api/test/grading.test.js`; [FR4 verification](../7-Testing-Tools-and-Fixes/FR4-grading-verification-2026-10-31.md) | Historical cases and current 19 Nov API run passed. |
| SEC2 role access control | `app/api/test/auth.test.js`; [SEC2 evidence](../7-Testing-Tools-and-Fixes/SEC2-RBAC-verification-2026-10-30.md) | Historical CI pass; not a penetration test. |
| SEC3 TLS 1.2+ | HTTPS server/probe described in folder 8 | No deployed endpoint; execution not complete. |
| NFR1 under 2 seconds | Benchmark script and [performance records](../7-Testing-Tools-and-Fixes/NFR1-performance-verification-2026-10-31.md), [later run](../7-Testing-Tools-and-Fixes/FR3-and-NFR2-verification-2026-11-02.md) | Local sequential profile only; not external network/production evidence. |
| NFR2 500 concurrent students | Load-test script and [local 500-client record](../7-Testing-Tools-and-Fixes/FR3-and-NFR2-verification-2026-11-02.md) | Synthetic local SQLite exercise only. Production profile/degradation criteria remain unverified. |
| NFR3 usability | [Teacher usability record](../7-Testing-Tools-and-Fixes/NFR3-teacher-usability-session-2026-10-30.md) | Trial record reports mean training time; sample/context are in that evidence file. |
| Security test plan: SQL injection / XSS | `app/api/test/auth.test.js` rejects SQL-injection-shaped quiz IDs; `app/web/test/security.test.js` verifies hostile quiz content is rendered as escaped text through `SafeText` | Focused regression tests added 19 Nov; this is not a full penetration test. |
| TC-04 no quiz retake after submission | New regression in `app/api/test/grading.test.js` | Source change added 19 Nov; not yet run at time of this document. |

## Execution record

| Date | Environment/command | Result | Evidence boundary |
| --- | --- | --- | --- |
| 2 Nov 2026 | `npm test --workspace @online-quiz/api` | 15/15 historical API tests passed | Predates the no-retake test added 19 Nov; not the current test count. |
| 2 Nov 2026 | `npm run build --workspace @online-quiz/web` | Passed | Historical production build; rerun after future frontend edits. |
| 2 Nov 2026 | `npm run benchmark:grading --workspace @online-quiz/api` | 100 workflows after 5 warmups; p50 1.70 ms, p95 2.12 ms, max 2.25 ms; threshold <2,000 ms | Historical sequential local SQLite profile. |
| 2 Nov 2026 | `NFR2_CONCURRENCY=500 npm run load-test:500 --workspace @online-quiz/api` | Three recorded runs; 500 synthetic starts/submissions per run, zero errors | Local single process/SQLite only. |
| 19 Nov 2026 | `npm test --workspace @online-quiz/api` | **17/17 passed** | Includes the SQL-injection-shaped quiz ID and no-retake regressions. |
| 19 Nov 2026 | `npm test --workspace @online-quiz/web` | **1/1 passed** | Server-rendered hostile quiz text is escaped; the UI uses this `SafeText` component for user-authored content. |
| 19 Nov 2026 | `npm run build` | **Passed** | Vite production build; 30 modules transformed. |
| 19 Nov 2026 | `npm run benchmark:grading --workspace @online-quiz/api` | **Passed**: 100 measured workflows after 5 warmups; p50 1.76 ms, p95 2.17 ms, max 2.19 ms; threshold <2,000 ms | Local sequential SQLite profile. Benchmark fixture creates a separate synthetic student for each workflow to respect the no-retake rule. |

There is not yet a complete tester-signed pass/fail record for every manual case in the submitted PDF. Preserve the baseline; add dated manual execution results and genuine screenshots/video after actually executing those cases. Do not convert a closed GitHub issue into a passed test result.
