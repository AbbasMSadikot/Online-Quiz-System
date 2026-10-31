# Sprint 2 Submission Freeze — 31 October 2026

## Freeze decision

Freeze the current `main` snapshot for the mini-project submission on 31 October 2026. This is a documentation and submission freeze with known gaps; it is **not** a declaration that every SRS requirement or every team's backlog issue is complete.

The repo owner disposition is to carry the open work below into a follow-up iteration. No collaborator issue is reassigned or closed by this record. The source baseline PDFs remain unchanged.

## Abbas Sadikot assigned issues

| Issue | Requirement | Disposition at freeze |
| --- | --- | --- |
| #2 | FR1 registration/login and SEC1 password hashing | Complete; merged in PR #18 |
| #6 | SEC2 role-based access control | Complete; evidence and passing CI recorded |
| #8 | NFR1 grading response under 2 seconds | Complete for the documented local single-client profile; two 100-request runs had p95 0.69–0.84 ms and maximum 0.88–1.08 ms; not a 500-user load result |
| #12 | Sprint 1 one-minute working-product demo | Complete as a 59.99-second retrospective recording captured 31 October; it is not represented as footage from the original Sprint 1 dates |
| #15 | Requirements and design deviation record | Complete; deviation log preserves the submitted baselines |
| #16 | Development-cycle freeze | Complete by this record; open team work is carried forward |

## Team work carried forward

| Issue | Owner | State / disposition |
| --- | --- | --- |
| #4 FR3 timed student quiz-taking | Harshith-Kumar-77 | Open; student quiz selection and timer are not implemented. Carry forward. |
| #5 FR4 automatic grading | hemant-1215 | Grading endpoint and verification were merged in PR #22. Issue remains open with its assignee; do not mark it closed on their behalf. |
| #7 SEC3 deployed HTTPS | hemant-1215 | TLS 1.2+ server support and a probe are merged in PR #22; no deployed HTTPS endpoint has been verified. Carry deployment evidence forward. |
| #11 NFR2 500 concurrent students | Harshith-Kumar-77 | Open; no 500-user load result is claimed. Carry forward. |
| #14 final product/verification documentation | hemant-1215 | Open with its assignee; recent docs updates do not replace their issue closure. |

Collaborator-owned #9 usability and #13 Sprint 2 demo were completed in PR #21. Their evidence remains attributed to Aditya. Issues #3 and #10 are unchanged by this freeze.

## Verification snapshot

- API suite: 12 of 12 tests pass on the prepared SQLite test database.
- Web production build: passes.
- NFR1 local grading probe: two runs of 100 measured submissions each pass the 2,000 ms threshold; see [performance verification](../7-Testing-Tools-and-Fixes/NFR1-performance-verification-2026-10-31.md).
- Sprint 1 and Sprint 2 recordings are indexed in [the demo folder](../9-Demo/README.md).

The remaining FR3, deployed TLS, NFR2, and team documentation work means the product must not be presented as fully compliant with the submitted SRS.
