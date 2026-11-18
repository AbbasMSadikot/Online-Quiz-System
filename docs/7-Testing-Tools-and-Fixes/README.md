# Software Testing Tools, Bug Fixes, and Retests

Record the tools actually used, findings, patches, and retests. Do not claim a pass when a prerequisite feature is missing.

- [SEC2 role-based access verification](SEC2-RBAC-verification-2026-10-30.md)
- [NFR1 grading performance verification](NFR1-performance-verification-2026-10-31.md)
- [NFR3 teacher usability session record](NFR3-teacher-usability-session-2026-10-30.md)
- [FR4 automatic grading verification](FR4-grading-verification-2026-10-31.md)
- [FR3 timed student flow and NFR2 local 500-client load verification](FR3-and-NFR2-verification-2026-11-02.md)

Local verification on 19 November 2026 passed all 16 API tests, including the new no-retake regression; the Vite production build and updated grading benchmark also passed. The last recorded GitHub Actions API run predates that local change. FR3 covers student quiz selection, server-side timing, publishing state, answer-key privacy, and attempt submission; FR4 covers full, zero, partial, malformed, and authorization cases. A local 500-client exercise passed with zero errors; its record describes single-process SQLite limits. NFR3 teacher usability evidence reports a 3.75-minute mean from the recorded trials.
