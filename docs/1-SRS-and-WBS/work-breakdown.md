# Work Breakdown Structure

This is a current implementation/evidence map, checked 19 November 2026. Backlog IDs and assignments are linked to GitHub. The live Project board did not match the brief's two-sprint plan when checked: Story Points were blank and issues #12–#16 were in Sprint 3. Do not present the board as reconciled until corrected in GitHub.

| Step | Work package | Requirement / backlog | Evidence / dependency | Current status |
| --- | --- | --- | --- | --- |
| 1 | Baseline requirements, FR/NFR and acceptance criteria | SRS; issues #2–#11 | [SRS](SRS.pdf), [RTM](../3-Requirements-Engineering/RTM.md) | Requirements transcribed; verify/test evidence is tracked separately |
| 2 | Architecture, components, patterns, API, interactions | SAD; issue #15 | [SAD PDF](../4-Architecture-and-Design/Software%20Architecture%20%26%20Design%20Specification.pdf), editable sources in [folder 4](../4-Architecture-and-Design/) | Mermaid diagrams render inline; PlantUML sources and API catalog are present. No MUL export is included. |
| 3 | Registration, login, password security | FR1/SEC1; [#2](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/2) | Auth source/tests; [PR #18](https://github.com/AbbasMSadikot/Online-Quiz-System/pull/18) | Implemented; PR has no recorded review submission |
| 4 | Teacher quiz authoring and usability | FR2/NFR3; [#3](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/3), [#9](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/9) | Quiz route/client; [NFR3 record](../7-Testing-Tools-and-Fixes/NFR3-teacher-usability-session-2026-10-30.md) | Implemented; trial evidence recorded |
| 5 | Timed student attempt, grading, grade history, and admin user management | FR3/FR4; [#4](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/4), [#5](https://github.com/AbbasMSadikot/Online-Quiz-System/issues/5) | API/UI, [test execution record](../2-Test-Planning/execution-and-traceability.md) | Implemented; current API regressions passed locally |
| 6 | Security, performance, concurrent-use verification | SEC2/SEC3, NFR1/NFR2; issues #6–#8 and #11 | [Folder 7 records](../7-Testing-Tools-and-Fixes/) | SEC2 and local NFR1/NFR2 evidence exists; deployed TLS and production-scale capacity remain unverified |
| 7 | Test plan mapping, execution, defect fixes, retests | Test Plan; issues #10/#14 | [Test plan](../2-Test-Planning/Test%20Plan.pdf), [execution mapping](../2-Test-Planning/execution-and-traceability.md) | Automated API/web checks and local performance/load runs are recorded; signed manual execution of every baseline test-plan case is outstanding |
| 8 | Environment, infrastructure, deployment | SEC3 and submission brief | [Folder 8](../8-Deployment-and-Environment/) | Local setup documented; no live deployment/certificate proof |
| 9 | Project/sprint evidence, PRs, demos, freeze | issues #12–#16 | [Folder 5](../5-Project-and-Sprint-Evidence/), [folder 9](../9-Demo/) | Historical demos/freeze records exist; board estimates/sprint fields, genuine screenshots, independent review evidence, and a current end-to-end demo remain outstanding |

## Sprint allocation caveat

The course brief defines Sprint 1 as 19–23 Oct 2026 and Sprint 2 as 26–30 Oct 2026. Historical freeze and exit-review records in folder 5 are retained as dated snapshots; they are not rewritten to imply contemporaneous completion. The current Project board showed Sprint 3 on issues #12–#16 and blank Story Points. Correct those project fields on GitHub before presenting the board. The repository cannot provide authentic GitHub/Jira screenshots on your behalf.
