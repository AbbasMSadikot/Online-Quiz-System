# Mini-Project Deliverable Completion Matrix

Checked against the submitted PDFs, current repository source, existing evidence files, and the GitHub board review on 19 November 2026. This matrix distinguishes artifacts actually present from actions that require real GitHub/course-account evidence or a new recording. The submitted SRS, SAD, and Test Plan PDFs are preserved as baselines.

## Part 1 — repository deliverables

| Folder | Required content | What is in this repository | Status / remaining evidence |
| --- | --- | --- | --- |
| [1 — SRS and WBS](1-SRS-and-WBS/) | SRS, work breakdown | Submitted SRS PDF and current WBS/requirement map | Present. The WBS calls out the board's two-sprint mismatch. |
| [2 — Test Planning](2-Test-Planning/) | Test Plan and test coverage/execution | Submitted Test Plan PDF, FR/NFR traceability, 19 API tests, one web security test, local benchmark/load results | Automated/local results recorded. A signed manual execution record for every applicable baseline test case and PostgreSQL execution are not present. |
| [3 — Requirements Engineering](3-Requirements-Engineering/) | FR/NFR register, RTM, deviations | RTM links requirements, code/tests/issues; deviation log records SQLite, API, HTTPS, and evidence differences | Present and aligned to current source. Baseline PDFs were not overwritten. |
| [4 — Architecture and Design](4-Architecture-and-Design/) | Architecture, patterns, API, component, sequence, use case diagrams | API catalog, inline Mermaid figures, and editable PlantUML for architecture, component, two sequences, and use cases | Viewable diagrams and source are present. The required MUL export is not present; source-authored diagrams are not represented as MUL evidence. |
| [5 — Project and Sprint Evidence](5-Project-and-Sprint-Evidence/) | GitHub project/backlog/sprints/PR evidence | Project link, dated board audit, historical exit/freeze records | Genuine screenshots and independent owner-review records for historical merged PRs are absent. In the 19 Nov board review, Story Points were blank and issues #12–#16 were in Sprint 3 despite the brief specifying two sprints. |
| [6 — AI Tool Evidence](6-Copilot-Evidence/) | Copilot/AI tool, prompt/code evidence, repo link | Brief Codex/GPT work log with affected files, commits, test results, and repository link | Selected changes are documented as GPT-assisted. Copilot was not used; no Copilot session/screenshot is claimed. |
| [7 — Testing Tools and Fixes](7-Testing-Tools-and-Fixes/) | Tool use, defect, patch, retest | Node test suites, SQLi-shaped input and XSS text regressions, TC-04 retake fix, performance/load evidence | Local checks passed. These focused checks are not a full penetration test; current Actions status for the latest push was not available during this review. |
| [8 — Deployment and Environment](8-Deployment-and-Environment/) | Deployment, infrastructure, environment setup | Local Node/React/SQLite setup, HTTPS configuration and TLS probe instructions, admin seeding | Local setup documented. No hosted endpoint/certificate proof or PostgreSQL migration/deployment is present. |
| [9 — Demo](9-Demo/) | Sprint clips/current working-product demo | Historical Sprint 1 and Sprint 2 recordings with corrected descriptions | Sprint 1 clip is retrospective and only proves registration. Sprint 2 is a static slide walkthrough from before FR3/FR4. A new clean live end-to-end recording is still needed. |

## Part 2 — backlog and sprint process

| Brief item | Current evidence/status |
| --- | --- |
| Create GitHub Project and link repo | Project exists and is linked; links in root README and folder 5. Screenshot not checked in. |
| Create FR/NFR backlog, estimate stories, assign members | Issues and assignments exist. Story Point cells were blank in the 19 Nov board review, so estimates are not evidenced. |
| Plan two sprints (19–23 Oct and 26–30 Oct) | Historical records describe those dates. The live board showed Sprint 3 on issues #12–#16; reconcile the actual board before submission. |
| Complete Sprint 1 and Sprint 2 with working products | Code now includes auth, teacher quiz management, timed student flow, grading, grade history, and admin user management. The stored sprint videos do not demonstrate the current full flow. |
| GitHub Actions for commits/PRs | Application and documentation workflows exist. Local checks passed; no status result for the latest push was returned during this review. |
| Member raises PR; repo owner reviews and merges | Historical PRs #18 and #20–#22 are merged, but no submitted review records were found. This evidence cannot be backfilled as if it happened. Use a real collaborator PR and owner review for future work. |
| Demos and deviations | Historical recordings and dated deviation/freeze records are present. Capture a current final demo and explain the recorded SQLite/PostgreSQL, API, and deployment deviations. |
| Complete docs and freeze development | Folder indexes and a 31 Oct historical submission freeze exist. Later November implementation continued after that snapshot; treat the freeze file as historical, not a final freeze of the latest code. |

