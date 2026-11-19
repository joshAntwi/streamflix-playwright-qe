# 25-minute senior QE interview walkthrough

## 0–4 min — Start with business risk, not code
- Explain StreamFlix scope and test pyramid/layers; identify playback, search and watchlist as key journeys.
- Open test-strategy.md and traceability.md; call out API/auth/CTV limits candidly.
- Discuss which testing remains manual and why.

## 4–8 min — Architecture and maintainability
- Explain Playwright projects, retries, trace/reporters and separation of tests/pages/fixtures.
- Show authenticatedPage fixture and why it seeds localStorage once instead of on every navigation.
- Explain semantic locators, auto-wait assertions, isolation, test tagging and source pinning.

## 8–14 min — Execute test journeys
- npm run test:smoke
- Show a real login, search->modal, watchlist save->reload, and player controls check.
- Open tests/api/http.spec.ts and clarify static HTTP checks are not backend contract tests.
- Discuss negative paths, resilience mocking, accessibility and screenshot baselines.

## 14–19 min — Debug a defect
- npm run test:known-issues
- Explain BUG-001 and HLS manifest request interception.
- Inspect Playwright trace, console and network request from an actual failing run if available.
- Describe repro, severity/priority tradeoffs and an engineering triage conversation.

## 19–23 min — Delivery and CI/CD
- Open .github/workflows/playwright.yml: separate upstream checkout, typecheck, smoke gate and manual/nightly regression.
- Show real pipeline artifacts when present, not invented passing screenshots.
- Mention GitLab alternative, branch/PR review practice, failure quarantine policy and device-lab escalation.

## 23–25 min — Client confidence
- Show manual test pack and release-report template.
- Explain release go/no-go: business impact, uncovered risks, blockers and residual risk acceptance.
- Ask how FX Digital combines Playwright and real connected-TV automation evidence.

## Backup plan
Keep a locally generated trace and cached playwright-report from a successful prior run if possible. If live execution is unavailable, show exactly what was last verified and what remains unverified.
