# Native Cucumber.js + Playwright: BDD showcase

This is a small **separate runner**, not a second GitHub repository. It complements the existing Playwright Test suite.

- Gherkin in `features/streaming.feature` specifies business outcomes.
- Cucumber.js 13.3.0 parses scenarios, owns retries/tags, constructs World instances and produces Cucumber reports.
- Playwright 1.65.1 drives Chromium and provides web-first assertions.
- `steps/streaming.steps.ts` reuses the existing root `pages/*.page.ts` page objects.
- Cucumber hooks create/close a fresh browser context **per scenario** (no state leakage).
- `support/app-server.ts` builds/serves the pinned StreamFlix app: Cucumber does not use `playwright.config.ts` / Playwright Test's `webServer`.
- A screenshot is attached to the HTML report for failed scenarios.
- Tags `@smoke`, `@regression` and requirement IDs support selective, client-readable reporting. Scenarios now cover real search/deep-link refresh, genre filtering, saved-title removal/persistence, player media properties, recovery and protected routes.

## Run locally

Run this from a cloned repository with the upstream StreamFlix application available as sibling `../streamflix`:

```bash
# From QE repo root:
cd bdd
npm ci
npx playwright install chromium
npm run typecheck
npm run test:smoke
npm run test:regression
```

The upstream app must have dependencies installed via its *reconciled* lockfile (see the repository root README). By default the BDD hooks build it and start a local preview at http://127.0.0.1:4173. For an already running app, use `BASE_URL=http://127.0.0.1:4173 npm run test:smoke`. Set `STREAMFLIX_DIR` if the app checkout is in another directory.

Results: `bdd/reports/cucumber.html` and `bdd/reports/cucumber.json`. CI runs smoke scenarios on pull requests and all tagged regression scenarios on main pushes/manual runs; it publishes both reports as artifacts.

## Why the two frameworks?

| Native Cucumber.js | Playwright Test |
|---|---|
| Own Gherkin parser, runner, World/hooks, Cucumber HTML/JSON reports | Runner, projects, fixtures, automatic retries, traces and native Playwright reporting |
| More manual wiring for browser/context lifecycle, server, and debugging evidence | Works out of the box for TypeScript tests |
| Appropriate where teams specifically use native Cucumber and business-readable feature files | Usually simpler for pure engineering-led automation |

**Alternative:** `playwright-bdd` can generate Playwright Test cases from Gherkin so that you retain the Playwright runner and fixtures; it is a strong choice if the requirement is *Gherkin plus Playwright tooling*, not specifically the Cucumber.js runner.

The StreamFlix app has simulated authentication and no real backend. These BDD scenarios represent UI business flows; they are not evidence of server-side security or API behaviour.

## Test data caveat

A default UI login starts with **pre-populated saved titles** in the demo application. Native Cucumber scenarios therefore assert whether the *particular* title was added or removed, rather than asserting the list is globally empty. This is deliberately different from the Playwright Test fixture, which starts with an empty deterministic saved list.
