# Requirements-to-test traceability

This is a demonstration requirements matrix, not a vendor contract. Automated test references map to executable specs.

| ID | Requirement | Automated tests | Manual follow-up | Risk |
| --- | --- | --- | --- | --- |
| REQ-AUTH-01 | User enters demo credentials and chooses a profile | tests/ui/auth.spec.ts | Login usability and copy | High |
| REQ-AUTH-02 | Invalid short passwords are rejected | tests/ui/auth.spec.ts | Validation and error placement | High |
| REQ-AUTH-03 | Protected routes redirect unauthenticated visitors | tests/ui/auth.spec.ts | Back/forward navigation | High |
| REQ-SEARCH-01 | Users find content by title | tests/ui/search.spec.ts | Search exploratory charter | High |
| REQ-SEARCH-02 | No matches return a clear message | tests/ui/search.spec.ts | Language and keyboard feedback | Medium |
| REQ-SEARCH-03 | Search input can be reset | tests/ui/search.spec.ts | Screen reader labels | Medium |
| REQ-LIST-01 | Users see empty watchlist feedback | tests/ui/watchlist.spec.ts | Mobile copy/layout | Medium |
| REQ-LIST-02 | Saved titles persist on reload | tests/ui/watchlist.spec.ts | Account switching | High |
| REQ-LIST-03 | Titles can be removed | tests/ui/watchlist.spec.ts | Consistency across views | High |
| REQ-STATE-01 | Corrupt persisted data does not crash | tests/ui/persistence.spec.ts | Recovery and support route | Medium |
| REQ-PLAYER-01 | Player shell and controls render | tests/ui/player.spec.ts | Playback/DRM/captions/sound | Critical |
| REQ-PLAYER-02 | Invalid title does not crash the app | tests/ui/player.spec.ts | Back navigation | Medium |
| REQ-HTTP-01 | Production bundle and SPA deep links load | tests/api/http.spec.ts | Hosting/CDN cache | Medium |
| REQ-RESILIENCE-01 | Image failure does not block login | tests/resilience/network.spec.ts | Slow/offline network | Medium |
| REQ-RESILIENCE-02 | Fatal HLS failure gives feedback | tests/resilience/known-issue.spec.ts (expected failure) | Record BUG-001 | High |
| REQ-A11Y-01 | No critical automated accessibility findings | tests/accessibility/a11y.spec.ts | Keyboard and screen reader | High |
| REQ-VISUAL-01 | Empty watchlist has approved visual baseline | tests/visual/empty-list.spec.ts (opt-in) | Review diffs | Medium |

**Interpretation:** one requirement may have multiple checks, and passing tests cannot certify an untested platform. Coverage should be discussed by business risk, not only the number of tests.
