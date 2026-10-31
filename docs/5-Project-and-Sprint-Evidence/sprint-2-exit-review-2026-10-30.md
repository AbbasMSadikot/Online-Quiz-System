# Sprint 2 Exit Review and Freeze Record — 30 Oct 2026

> Historical snapshot as of 30 October. A post-merge performance retest, Sprint 1 retrospective demo, and final freeze disposition are recorded in [the 31 October submission freeze](sprint-2-freeze-2026-10-31.md).

## Decision

The Sprint 2 evidence snapshot is recorded on 30 October 2026. The source PDFs are unchanged. This is **not a claim that the full product or all Sprint 2 acceptance criteria passed**. Open items below remain visible and are carried forward; the release must not be demonstrated as fully compliant with the SRS.

## Verified on main

- FR2 teacher quiz creation and management was merged from collaborator Aditya's [PR #20](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/20); its API tests and web build passed in GitHub Actions.
- FR1 registration/login is merged in [PR #18](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/18).
- SEC2 student-denial and authorized-role tests are present; an administrator allow-case has been added for this review and passed on main CI run #40957301803.
- NFR3 teacher quiz creation usability evaluation is completed by collaborator Aditya; recorded in [NFR3 usability evaluation record](../7-Testing-Tools-and-Fixes/NFR3-teacher-usability-session-2026-10-30.md) demonstrating 3.75 min mean training duration with in-app Quick Guide and validators.
- Sprint 2 working product demo video (2 minutes) is completed by collaborator Aditya and committed to [docs/9-Demo/sprint-2-product-demo.mp4](../9-Demo/sprint-2-product-demo.mp4).
- The [NFR1 assessment](../7-Testing-Tools-and-Fixes/NFR1-performance-assessment-2026-10-30.md) records why grading performance cannot yet be measured.
- The [deviation log](../3-Requirements-Engineering/deviation-log.md) records the SQLite/Test Plan PostgreSQL mismatch and outstanding gaps.

## Remaining backlog and disposition

| Issue | Owner | Current state | Disposition |
| --- | --- | --- | --- |
| #4 FR3 student quiz-taking | Harshith-Kumar-77 | Open | Carry forward; needed before a valid grading/performance demo |
| #5 FR4 automatic grading | hemant-1215 | Open | Carry forward; prerequisite for #8 |
| #7 SEC3 HTTPS/TLS | hemant-1215 | Open | Carry forward until a deployment target and TLS evidence exist |
| #8 NFR1 grading under 2 seconds | AbbasMSadikot | Blocked | Keep open; run the documented assessment after #4/#5 merge |
| #9 NFR3 usability | adityamandir2005-pixel | Complete | Usability evaluation completed (3.75 min mean training); recorded in docs/7 |
| #11 NFR2 500 concurrent users | Harshith-Kumar-77 | Open | Carry forward; no load-test report found |
| #13 Sprint 2 demo video | adityamandir2005-pixel | Complete | 2-minute working product demo video committed in docs/9-Demo/sprint-2-product-demo.mp4 |
| #14 product/verification documentation | hemant-1215 | Open | Carry forward; final verification and deployment evidence remain |
| #15 deviation record | AbbasMSadikot | Complete | Deviation log records the Test Plan database mismatch and documented disposition; issue closed |
| #16 freeze development cycle | AbbasMSadikot | In progress | Record the final freeze only after open-item disposition and required demo/documentation decisions |

Sprint 1 issue #12 (one-minute demo) is also open and assigned to AbbasMSadikot; it is not misrepresented as a Sprint 2 deliverable.

## Freeze status

**Sprint 2 is not complete and no final development freeze is declared.** FR3/FR4, SEC3, NFR1-NFR2 evidence, and final verification documentation are still open. Their existing owners must complete them or the owner must formally defer them before a freeze. The NFR1 assessment is blocked until the grading endpoint exists.
