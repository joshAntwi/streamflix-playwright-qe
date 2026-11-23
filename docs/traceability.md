# Requirements-to-test traceability

This is a demonstration requirements matrix, not a vendor contract. Automated test references map to executable specs.

| ID | Requirement | Automated tests | Manual follow-up | Risk |
| --- | --- | --- | --- | --- |
| REQ-AUTH-01 | User signs in and reaches a usable catalogue after profile selection | tests/ui/auth.spec.ts | Login usability and copy | High |
| REQ-AUTH-02 | Invalid short passwords are rejected without creating a session | tests/ui/auth.spec.ts | Validation and error placement | High |
| REQ-AUTH-03 | Unauthenticated search deep links redirect to login | tests/ui/auth.spec.ts | Back/forward navigation | High |
| REQ-AUTH-04 | Sign-out revokes access to protected routes | tests/ui/auth.spec.ts | Real server session revocation is unavailable in this demo | High |
| REQ-SEARCH-01 | Navbar search finds content and opens its details | tests/ui/search.spec.ts | Search exploratory charter | High |
| REQ-SEARCH-02 | No matches return a clear message | tests/ui/search.spec.ts | Language and keyboard feedback | Medium |
| REQ-SEARCH-03 | Search can be cleared to restore catalogue results | tests/ui/search.spec.ts | Screen reader labels | Medium |
| REQ-SEARCH-04 | Bookmarked search URLs hydrate the query and results across reloads | tests/ui/search.spec.ts | External linking and browser-history exploration | High |
| REQ-LIST-01 | Users see empty watchlist feedback | tests/ui/watchlist.spec.ts | Mobile copy/layout | Medium |
| REQ-LIST-02 | Saved titles persist across reload | tests/ui/watchlist.spec.ts | Account switching | High |
| REQ-LIST-03 | Removed titles stay absent after reload | tests/ui/watchlist.spec.ts | Consistency across views | High |
| REQ-STATE-01 | Corrupt persisted data recovers to an anonymous session | tests/ui/persistence.spec.ts | Recovery and support route | Medium |
| REQ-PLAYER-01 | Open selected title in player and use mute to update the media element | tests/ui/player.spec.ts | Real device output, sound and DRM | High |
| REQ-PLAYER-02 | Playback speed setting changes the actual media playbackRate | tests/ui/player.spec.ts | Physical-device behaviour and media audio pitch | High |
| REQ-PLAYER-03 | Unknown title gives an explanation and working return to browse | tests/ui/player.spec.ts | Deep-link error handling | Medium |
| REQ-PLAYER-04 | Video actually decodes and timeline advances (optional external HLS) | tests/ui/player.spec.ts (@external-stream) | Codecs, DRM, sustained playback, device testing | Critical |
| REQ-HTTP-01 | HTML bundle, JavaScript entry and HTTP history fallback are served (not a functional deep link) | tests/api/http.spec.ts | Hosting/CDN cache | Medium |
| REQ-RESILIENCE-01 | Image failure does not block login | tests/resilience/network.spec.ts | Slow/offline network | Medium |
| REQ-RESILIENCE-02 | Fatal HLS failure gives feedback | tests/resilience/known-issue.spec.ts (expected failure) | Record BUG-001 | High |
| REQ-A11Y-01 | No critical automated accessibility findings | tests/accessibility/a11y.spec.ts | Keyboard and screen reader | High |
| REQ-VISUAL-01 | Empty watchlist has approved visual baseline | tests/visual/empty-list.spec.ts (opt-in) | Review diffs | Medium |

**Interpretation:** one requirement may have multiple checks, and passing tests cannot certify an untested platform. Coverage should be discussed by business risk, not only the number of tests.
