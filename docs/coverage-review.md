# Assertion quality review — from element checks to product confidence

This portfolio uses a real pinned StreamFlix demo, but **it is not a real streaming service**. The review below records why each change improves signal, and the boundaries we still cannot claim.

| Risk / outcome | Former check | Now exercised with meaningful assertions | Gap / honest caveat |
| --- | --- | --- | --- |
| SPA deep-link usability | HTTP GET /search returns an HTML `#root` shell | `tests/ui/deeplink.spec.ts`: signed-in browser follows `/search?q=crimson`, renders matching title/query, reload retains both | Direct URL routing on a production CDN still requires deployment testing |
| Protected player deep links | HTTP 200 for any SPA route | `tests/ui/auth.spec.ts`: anonymous `/watch/t1` redirects to login; no video leaks | Demo authentication uses localStorage, NOT server-side entitlement |
| Search correctness | One card merely exists | `tests/ui/search.spec.ts`: case-insensitive matches, excluded irrelevant title, filter change moves between no results and matching results | Catalogue is static/mock; no latency, pagination, ranking contracts |
| Saved content | Card visible | `tests/ui/watchlist.spec.ts`: user adds/removes target through UI, verifies persisted state after refresh | Demo watchlist state is shared by profiles. See exploratory follow-up |
| Player controls | `video` exists | `tests/ui/player.spec.ts`: mute and keyboard toggle update `video.muted`; speed selection updates `video.playbackRate`; invalid-title recovery navigates back to usable catalogue | These controls can work while a real stream fails; optional `@external-media` scenario validates actual playback advancement |
| Artwork outage | Sign-in link still clickable | `tests/resilience/network.spec.ts`: abort image-CDN requests but still find content and open actionable details | Doesn't assess all slow/offline states |
| Keyboard dialog | Automated axe severity only | `tests/accessibility/keyboard.spec.ts`: Enter opens details, Tab remains inside dialog, Escape restores triggering focus | Screen reader and actual TV remote still need human/device checks |
| Data corruption | Landing doesn't throw | `tests/ui/persistence.spec.ts`: invalid localStorage followed by an actually usable sign-in and catalogue | Does not test migration between state schema versions |
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
- `@known-issue`: expected failure for no accessible error after fatal HLS manifest failure. Not a passing functional requirement.
- `@external-media`: skipped unless `RUN_MEDIA=1` because the HLS stream is owned by a third party; when enabled, it verifies media readiness and actual clock advancement. Separate deterministic UI-controls tests do not pretend to validate decoded video.

## Remaining testing to discuss at interview

Production login, DRM licenses, entitlements, multi-profile isolation, playback start-up metrics, buffering recovery, network switching, TV remote/focus navigation, captions, actual codec/device support, data privacy and true API contracts need a more representative system and/or device lab. Don't infer these from browser emulation.
