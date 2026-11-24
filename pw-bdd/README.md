# Playwright-BDD: Gherkin with the Playwright Test runner

This third implementation uses **playwright-bdd 9.2.1** (stable) plus **Playwright 1.65.1**, sharing the root dependencies and reusable Page Objects. It is distinct from [native Cucumber.js](../bdd/README.md).

## Architecture

- `features/customer-journeys.feature`: meaningful Gherkin behaviours
- `steps/customer-journeys.steps.ts`: Playwright-style `createBdd()` steps, reusing `pages/`
- `../playwright-bdd.config.ts`: `defineBddConfig()` and native Playwright Test runner configuration
- `pw-bdd/.features-gen/`: generated Playwright tests (ignored by Git)
- Playwright HTML/JUnit reports, traces on failure, screenshots, optional Cucumber-format report

**Run locally** after installing the pinned upstream StreamFlix app as documented in the root README:

```bash
# From the QE repository root
npm ci
npx playwright install chromium
npm run test:pw-bdd:smoke
npm run test:pw-bdd
```

Generation is explicit: `bddgen -c playwright-bdd.config.ts` converts scenarios to executable Playwright tests. **Do not edit generated files.** `BASE_URL` allows testing an already running deployment; otherwise the Playwright `webServer` builds and starts the pinned upstream app.

## Comparison

| Dimension | Native Cucumber.js (`bdd/`) | Playwright-BDD (`pw-bdd/`) |
| --- | --- | --- |
| Runner | Cucumber.js | Playwright Test |
| Gherkin step syntax | Cucumber World / this | Playwright fixtures / { page } |
| Browser lifecycle | Before/After hooks manage contexts | Playwright Test fixtures |
| Trace / HTML report | Custom hook attachments + Cucumber reporter | Playwright-native evidence |
| Single repository + shared Page Objects | Yes | Yes |

Both are legitimate choices. Pick a runner for a product team's requirements, not because Gherkin alone implies a separate automation framework. These are browser acceptance tests over a demo app, not real backend API tests or physical Smart-TV certification.
