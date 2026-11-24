# Client release report — template, not execution evidence

**Client/application:** StreamFlix QE showcase
**Release/build:** [commit or build ID]
**Environment:** [URL, deployment, region, browser/device matrix]
**Period / owner:** [date range, QE lead]
**Overall recommendation:** [GO / CONDITIONAL / NO-GO]

## Executive summary
[One paragraph on validated customer journeys, unresolved risks and what changed since previous build.]

## Execution metrics (fill from real pipeline)
| Indicator | Result | Evidence |
| --- | --- | --- |
| Smoke tests | Not run | [GitHub Actions run link] |
| Regression tests | Not run | [report artifact] |
| Critical requirements covered | [assessed / not assessed] | [test or report links] |
| Critical open defects | [number] | [issue links] |
| High open defects | [number] | [issue links] |
| Cross-browser coverage | [project list / outcomes] | [JUnit] |
| Physical device coverage | [device, firmware, result] | [manual pack] |
| Known flaky test rate | [rate / trend] | [CI history] |

## Known risks and mitigations
- Device compatibility/DRM/sound/remote behaviour not certified by Playwright.
- No real backend/API security coverage in this frontend-only application.
- Third-party poster/media availability affects real playback scenarios.

## Release decision criteria
- Blocking defects triaged by impact and likelihood.
- Critical customer paths validated in the target environment.
- Supported devices meet agreed minimum matrix.
- Client/product owner accepts known limitations with documented mitigations and rollback.

## Communication
[Client update / engineering owners / follow-up retest dates / QA recommendation]

**Important:** Never turn mock numbers into presented actuals; link to real executed reports and state what was not tested.
