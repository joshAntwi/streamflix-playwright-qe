# StreamFlix — risk-based quality engineering strategy

## Product assumptions and evidence honesty

The pinned StreamFlix application is a **frontend-only** React concept. Login is simulated and catalogue/watchlist data live in localStorage/static fixtures. No real authentication server, entitlement or streaming backend exists. One public Mux HLS test stream and externally hosted poster art introduce external dependencies.

**Principle:** Test business-observable outcomes, not HTML root elements or mere presence of UI controls. Distinguish what the tests actually demonstrate from what a real commercial streaming platform requires.

## Risk and automation coverage

| Product area | User risk | Automated business outcome | Limitations / manual follow-up |
| --- | --- | --- | --- |
| Sign-in and protected routes | High | Demo login/profile shows browse content; invalid credentials do not create a session; anonymous player route redirects | No real security/authentication |
| Discovery and deep links | High | Case-insensitive matching, exclusion of unrelated titles, genre filtering, browser bookmark/reload preserves results | Search catalogue is synchronous fixture data |
| Saved list | High | Add/remove a discovered title and verify persisted state after refresh | Pre-populated demo list and no profile isolation |
| Player controls | High | Actual `HTMLVideoElement.muted` and `playbackRate` change; invalid-title recovery returns to catalogue | Real CDN playback isolated under optional `@external-media` |
| Media error reporting | Critical | Expected-failing `BUG-001` reproduces no user-facing error when HLS manifest fails | Requires upstream fix and retest |
| Network resilience | Medium | Blocking poster CDN does not break search and details | Needs degraded network / offline / stream retry sessions |
| Accessibility | High | Dialog keyboard focus trap and focus restoration; axe assessment | Screen readers and remote-input devices need manual verification |
| State corruption | Medium | Invalid localStorage can recover through sign-in to browse | No schema migration tests |
| Frontend delivery | Medium | HTML references accessible executable JS asset | HTTP check does not prove client-side routing |

See [assertion-quality review](coverage-review.md) for the former weak checks and their replacements.

## Test structure and runners

- `tests/`: Playwright Test acceptance, static delivery, resilience, accessibility and opt-in real media tests.
- `bdd/`: native Cucumber.js + Playwright automation using World and before/after hooks; independent runner and reports.
- `pw-bdd/`: Gherkin step definitions through `playwright-bdd`, generated tests executed by Playwright Test's runner.
- Shared `pages/` Page Objects keep selectors consistent. BDD implementations intentionally overlap coverage to illustrate architectural trade-offs, not add independent requirement counts.

## CI gates

- Pull requests: Chromium critical smoke + BDD smoke.
- Main pushes: Chromium smoke and regression; complete native Cucumber and Playwright-BDD scenarios.
- Manual/scheduled: cross-browser Playwright regression, subject to product risk and supported-browser requirements.
- Isolated contexts; deterministic signed-in storage fixtures for Playwright; genuine demo UI sign-in for Cucumber/Playwright-BDD.
- Committed npm lockfiles and `npm ci` for every dependency install.
- Playwright HTML/JUnit and Cucumber reports, screenshots/trace retention on failures.
- Track retries/flakes as quality signals. Don't weaken assertions merely to keep CI green.

## Release decisions

Require no unresolved critical issues without accepted risks and rollback, passing relevant critical journeys, verified supported-browser coverage, and documented device/manual checks. Publish known defects and testing gaps alongside results. A green browser pipeline **does not certify** codecs, DRM, captions, physical television remote navigation, scale or real API security.

## Prioritised manual charters

Playback after network interruption, sign-in entitlement/DRM on actual devices, captions/audio descriptions, multi-profile saved-list privacy, back/exit remote navigation, memory/performance and sustained viewing sessions.
