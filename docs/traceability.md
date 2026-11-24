# Acceptance criteria and test traceability

A requirement is counted once even if exercised through Playwright Test, native Cucumber.js and Playwright-BDD. These are deliberate **runner-comparison examples**, not independent extra coverage.

| Requirement | User-facing acceptance criterion | Playwright Test | Native Cucumber | Playwright-BDD | Evidence boundary |
| --- | --- | --- | --- | --- | --- |
| AUTH-01 | Valid demo user and chosen profile can browse usable content | `tests/ui/auth.spec.ts` | Sign-in scenario | Signed-in background step | Simulated login only |
| AUTH-02 | Invalid password blocks session | `tests/ui/auth.spec.ts` | Not duplicated | Not duplicated | UI validation only |
| AUTH-03 | Anonymous player URL does not expose content | `tests/ui/auth.spec.ts` | Anonymous deep link | Anonymous bookmark | Client-side guard only |
| DISC-01 | Search finds relevant titles and excludes unrelated ones | `tests/ui/search.spec.ts` | Case outline | Catalogue search step | Static catalogue |
| DISC-02 | Genre change updates results and empty-state feedback | `tests/ui/search.spec.ts` | Genre scenario | Not duplicated | No backend filters |
| DEEP-01 | Bookmarked search and query survive refresh | `tests/ui/deeplink.spec.ts` | Search bookmark scenario | Search bookmark scenario | SPA in local preview |
| DEEP-02 | Authenticated player bookmark renders title and controls | `tests/ui/deeplink.spec.ts` | Player route step | Player route step | No DRM/entitlement |
| LIST-01 | Target title can be saved and remains after refresh | `tests/ui/watchlist.spec.ts` | Add/reload scenario | Add/reload scenario | Demo localStorage |
| LIST-02 | Target title is removed and remains removed | `tests/ui/watchlist.spec.ts` | Remove/reload scenario | Remove/reload scenario | Default demo list pre-populated |
| PLAY-01 | Mute and speed controls change actual media properties | `tests/ui/player.spec.ts` | Player control scenario | Player control scenario | No assertion of decoded frames |
| PLAY-02 | Unknown title communicates failure and offers a recovery path | `tests/ui/player.spec.ts` | Player recovery | Player recovery | Not a CDN failure |
| PLAY-03 | External HLS loads and advances media playback clock | `tests/ui/player.spec.ts` `@external-media` | Not duplicated | Not duplicated | **Opt-in**; external dependency |
| PLAY-04 | Fatal HLS error gives accessible recovery feedback | `tests/resilience/known-issue.spec.ts` | Not duplicated | Not duplicated | Known upstream defect, expected failure |
| RES-01 | Missing external artwork doesn't block catalogue discovery | `tests/resilience/network.spec.ts` | Not duplicated | Not duplicated | Does not certify offline app |
| STATE-01 | Corrupt local state can recover to usable browse screen | `tests/ui/persistence.spec.ts` | Not duplicated | Not duplicated | Local state only |
| A11Y-01 | Modal keyboard focus is retained and returned on close | `tests/accessibility/keyboard.spec.ts` | Not duplicated | Not duplicated | Screen reader testing separate |
| A11Y-02 | No automated critical axe findings in empty-list UI | `tests/accessibility/a11y.spec.ts` | Not duplicated | Not duplicated | Automated WCAG partial |
| HTTP-01 | Production HTML references downloadable JS entrypoint | `tests/api/http.spec.ts` | Not duplicated | Not duplicated | **Not a deep-link functional test** |

**Coverage interpretation:** Requirement risk, meaningful assertions and honest boundaries outrank raw test counts. A green run can coexist with missing DRM, API, real TV or user-visible stream-error coverage.
