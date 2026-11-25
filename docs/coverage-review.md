# Assertion quality review — from element checks to product confidence

This portfolio uses a real pinned StreamFlix demo, but **it is not a real streaming service**. The review below records why each change improves signal, and the boundaries we still cannot claim.

| Risk / outcome | Former check | Now exercised with meaningful assertions | Gap / honest caveat |
| --- | --- | --- | --- |
| SPA deep-link usability | HTTP GET /search returns an HTML `#root` shell | `tests/ui/deeplink.spec.ts`: signed-in browser follows `/search?q=crimson`, renders matching title/query, reload retains both | Direct URL routing on a production CDN still requires deployment testing |
| Protected player deep links | HTTP 200 for any SPA route | `tests/ui/auth.spec.ts`: anonymous `/watch/t1` redirects to login and displays the sign-in screen | Demo authentication uses localStorage, NOT server-side entitlement |
| Search correctness | One card merely exists | `tests/ui/search.spec.ts`: case-insensitive matches, excluded irrelevant title, filter change moves between no results and matching results | Catalogue is static/mock; no latency, pagination, ranking contracts |
| Saved content | Card visible | `tests/ui/watchlist.spec.ts`: user adds/removes target through UI, verifies persisted state after refresh | Demo watchlist state is shared by profiles. See exploratory follow-up |
| Playback and resume | `video` exists | `tests/ui/player.spec.ts`: start an episode, advance the media clock with a synthetic HLS clip, and verify reopening seeks to the saved position. Separate checks cover mute, speed, and invalid-title recovery. | The fixture runs on desktop Chromium. The opt-in `@external-media` test checks the external stream. |
| Artwork outage | Sign-in link still clickable | `tests/resilience/network.spec.ts`: confirm the rendered title artwork request was aborted, then verify that details still open | The test blocks service workers so the artwork cache cannot bypass the simulated outage. |
| Automated accessibility | Empty watchlist scan | `tests/accessibility/a11y.spec.ts`: sign-in is part of regression and blocks on critical axe violations. All axe findings are attached as JSON. | The on-demand watchlist scan reports an upstream `button-name` violation on the profile menu. |
| Keyboard dialog | Automated axe severity only | `tests/accessibility/keyboard.spec.ts`: Enter opens details, Tab remains inside dialog, Escape restores triggering focus | Screen reader and actual TV remote still need human/device checks |
| Data corruption | Landing doesn't throw | `tests/ui/persistence.spec.ts`: recover from malformed localStorage, sign in, and retain the session and catalogue across reload | Does not test migration between state schema versions |
| Bundle delivery | HTML `#root` shell returned | `tests/api/http.spec.ts`: production HTML references a downloadable executable JS bundle | Explicitly HTTP delivery, not a user-facing SPA route test |

## Three examples of the same acceptance thinking

1. **Plain Playwright Test:** `tests/ui/deeplink.spec.ts`, `tests/ui/watchlist.spec.ts`, `tests/ui/player.spec.ts`
2. **Native Cucumber.js:** `bdd/features/streaming.feature` and `bdd/steps/streaming.steps.ts` use World and Cucumber-managed hooks
3. **Playwright-BDD:** `pw-bdd/features/customer-journeys.feature` and `pw-bdd/steps/customer-journeys.steps.ts` generate Playwright Test cases while retaining fixtures and Playwright reporters

They intentionally cover overlapping business outcomes to compare runner design, not to multiply claimed coverage. A duplicated scenario is **not** another independent requirement covered.

## Gates and known risks

- PR: root Chromium smoke; native Cucumber smoke; Playwright-BDD smoke.
- Main: root Chromium smoke plus Chromium regression; native Cucumber full tagged suite; Playwright-BDD full suite.
- Scheduled/manual root workflow: broader cross-browser regression.
- The root CI suite retries once for diagnostics. A pass on retry still fails the job as flaky. Use the HTML report and trace to investigate before treating the gate as green.
- `@external-media`: skipped unless `RUN_MEDIA=1` because the HLS stream is owned by a third party; when enabled, it verifies media readiness and actual clock advancement. Separate deterministic UI-controls tests do not pretend to validate decoded video.

## Reviewing a run

Open the workflow's `playwright-results-*` artifact for the HTML report, JUnit results, and failure traces. Locate the failed assertion in the trace and compare it with the DOM snapshot, network requests, and any axe JSON attachment.

The watchlist scan provides a reproducible failure to walk through locally. Its trace shows the unnamed profile menu button alongside the axe `button-name` finding.

```bash
npx playwright test tests/accessibility/a11y.spec.ts --project=chromium --grep 'empty watchlist' --output=test-results/interview-axe
npx playwright show-trace test-results/interview-axe/*/trace.zip
```

## Remaining coverage

Production login, DRM licenses, entitlements, multi-profile isolation, playback start-up metrics, buffering recovery, network switching, TV remote/focus navigation, captions, actual codec/device support, data privacy and true API contracts need a more representative system and/or device lab. Don't infer these from browser emulation.
