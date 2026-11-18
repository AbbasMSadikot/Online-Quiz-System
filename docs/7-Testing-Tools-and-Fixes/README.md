# Software Testing Tools, Bug Fixes, and Retests

Record the tools actually used, findings, patches, and retests. Do not claim a pass when a prerequisite feature is missing.

- [SEC2 role-based access verification](SEC2-RBAC-verification-2026-10-30.md)
- [NFR1 grading performance verification](NFR1-performance-verification-2026-10-31.md)
- [NFR3 teacher usability session record](NFR3-teacher-usability-session-2026-10-30.md)
- [FR4 automatic grading verification](FR4-grading-verification-2026-10-31.md)
- [FR3 timed student flow and NFR2 local 500-client load verification](FR3-and-NFR2-verification-2026-11-02.md)

Local verification on 19 November 2026 passed 19 API tests, one web XSS rendering test, the Vite production build, the grading benchmark, and a fresh 500-client run with zero errors. Grade history and admin user/role management are covered; role changes apply to existing tokens. The last recorded GitHub Actions run predates these changes; the workflow now runs the web security test. Load evidence uses one local Node process and SQLite. NFR3 teacher usability evidence reports a 3.75-minute mean from the recorded trials.
