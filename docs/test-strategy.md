# StreamFlix — Risk-based test strategy

## Context and scope
StreamFlix is a **frontend-only** streaming concept. This suite tests a *pinned upstream application* and is not a fork. No real backend, DRM entitlement or account API exists. The login, catalogue and watchlist use localStorage/mock data. External HLS playback and poster URLs are not under our control.

## Objectives
- Demonstrate business-oriented quality ownership across requirements, execution, investigation and release decisions.
- Provide fast, deterministic smoke feedback on pull requests.
- Expand to cross-browser regression on schedule and before release.
- Capture actionable evidence: traces, screenshots/video on failure, HTML and JUnit reports.
- Make gaps and known defects visible instead of claiming unrealistic automation coverage.

## Risk-based coverage
| Area / risk | Impact | Likelihood | Automated mitigation | Manual / external mitigation |
| --- | --- | --- | --- | --- |
| Authentication and profile navigation | High | Medium | UI valid/invalid and protected routes | Usability review; real authentication out of scope |
| Search and catalogue discovery | High | Medium | Positive, negative, reset, content modal | Exploratory text/locale behaviour |
| Watchlist persistence | High | Medium | Add/remove, empty state, reload | Cross-profile exploratory |
| Playback UX | Critical | High | Video shell and player controls | Real stream, DRM, subtitle/audio and supported devices |
| Failed HLS stream | High | Medium | BUG-001 negative executable specification | Fix assessment and retest on actual devices |
| Browser compatibility | High | Medium | Chromium, Firefox, WebKit, mobile emulation | Actual supported device matrix |
| Accessibility | High | Medium | Axe critical scan, semantic locators | Keyboard, screen reader, focus, contrast |
| UI regressions | Medium | Medium | Opt-in reviewed screenshot baseline | Human review of visual and dynamic states |
| Static delivery | Medium | Low | HTML routing, JS bundle HTTP checks | Actual API contracts absent |

## Test layers and ownership
1. **Static verification**: TypeScript typecheck, dependency and repository hygiene.
2. **HTTP delivery checks**: frontend shell and built assets. NOT backend API contract coverage.
3. **Browser functional**: meaningful user journeys using role/label locators and isolated contexts.
4. **Resilience and accessibility**: controlled failures, expected broken behaviours and Axe.
5. **Exploratory / real device**: remote navigation, playback, codecs, DRM, power cycles, network and sustained performance.

## Entry criteria
- Upstream revision and test environment pinned, reachable and documented.
- Test data and browser build provisioned; deployment smoke ready.
- Test plan, feature requirements and priority device list agreed with stakeholders.

## Exit / release gates
- No unresolved critical defect unless formally accepted with mitigation and rollback.
- Critical-path smoke green; relevant regression executed with failures investigated.
- Known defects risk assessed, owners assigned; no unexplained failures masked by retries.
- Key supported devices and their firmware/OS coverage recorded outside Playwright.
- Stakeholder receives concise risk, coverage, blockers and release recommendation.

## CI and flakiness policy
- PR and push: typecheck + Chromium smoke, fast failure evidence.
- Scheduled/manual: tagged regression across browser projects.
- A retry (CI has one) is a diagnostic signal, not proof of reliability. Triage recurring flaky tests.
- Fully parallel tests require isolated localStorage contexts; shared accounts and mutable external systems would require data factories and cleanup.
- Generated HTML reports, JUnit XML and trace attachments are retained; secrets and storage states are never committed.

## Out of scope / future work
- No genuine CRUD API testing, authentication security, load testing or contract testing without a backend.
- No claim that emulated mobile is physical smart-TV testing.
- Extend to a device-lab integration once target TV platforms and available automation interfaces are known.
