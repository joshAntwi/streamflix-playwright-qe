# StreamFlix Quality Engineering — Playwright + TypeScript

A **senior-level quality engineering showcase** testing the real [StreamFlix demo app](https://github.com/alokp0274/streamflix), without changing or copying the upstream app. It demonstrates test strategy, maintainable browser tests, HTTP-level checks, resilience, accessibility, CI/CD, reproducible failure evidence, exploratory coverage, and release-risk reporting.

> **Scope honesty:** StreamFlix is a frontend-only concept with simulated localStorage login and in-memory catalogue data. It has no backend API; tests in `tests/api` validate static HTTP delivery, *not* a production service. Video streams and imagery are hosted externally. TV remote simulation is *not* physical Smart-TV certification.

## Versions and provenance

- **Playwright 1.65.1** (verified latest stable 2026-11-19) and TypeScript **7.0.2**.
- Node.js **22+** (Playwright also supports current Node 24 and 26).
- Upstream StreamFlix pinned to **[`3d50dabe2c8ee4efd6a56ef0d2bfdc275fa2a42a`](https://github.com/alokp0274/streamflix/commit/3d50dabe2c8ee4efd6a56ef0d2bfdc275fa2a42a)** for CI reproducibility.
- Official docs: [Playwright installation](https://playwright.dev/docs/intro), [test fixtures](https://playwright.dev/docs/test-fixtures), [CI](https://playwright.dev/docs/ci), [trace viewer](https://playwright.dev/docs/trace-viewer).

## Local quick start

```bash
# Clone the independent app into a SIBLING directory
mkdir streamflix-showcase && cd streamflix-showcase
git clone https://github.com/alokp0274/streamflix.git streamflix
cd streamflix
git checkout 3d50dabe2c8ee4efd6a56ef0d2bfdc275fa2a42a
npm install
cd ..

# Place/unzip or clone this framework here as streamflix-playwright-qe
cd streamflix-playwright-qe
npm install
npx playwright install --with-deps
npm run typecheck
npm run test:smoke
npm run report
```

The Playwright `webServer` config automatically builds StreamFlix and starts `vite preview` on port **4173**. You do **not** need to start the app manually. If the app is elsewhere, set `STREAMFLIX_DIR` to its path. To test an already running deployment, set `BASE_URL`; this disables automatic app startup. On Windows PowerShell use `$env:STREAMFLIX_DIR='..\\streamflix'` etc.

**Dependency lock:** This deliverable was produced without npm registry access, so a real `package-lock.json` cannot be generated or verified here. On first connected setup run `npm install`, commit its generated lockfile, and replace `npm install` with `npm ci` in both CI configurations. Never hand-write a fake lockfile.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm run typecheck` | TypeScript static check |
| `npm run test:smoke` | Fast Chromium critical path |
| `npm run test:regression` | All browser/mobile projects for `@regression` tests |
| `npm run test:api` | App shell / static delivery HTTP requests |
| `npm run test:a11y` | Axe accessibility assessment |
| `npm run test:known-issues` | Documented expected-failing bug reproduction |
| `RUN_VISUAL=1 npm run test:visual:update` | Create visual baseline locally; review it before committing |
| `RUN_VISUAL=1 npm run test:visual` | Compare against approved baseline |
| `npm run test:ui` | Interactive Playwright debugging |
| `npx playwright test --debug` | Step-through inspector |
| `npx playwright show-trace test-results/.../trace.zip` | Inspect failed test trace |

## Framework architecture

```text
streamflix-playwright-qe/
├── fixtures/auth.fixture.ts       # deterministic, isolated mock user state
├── pages/                        # page object models (login, search)
├── tests/
│   ├── ui/                       # sign in, routes, search, list, player, persistence
│   ├── api/                      # HTTP delivery checks only (no upstream API)
│   ├── resilience/               # failed asset requests and a tracked known defect
│   ├── accessibility/            # axe scan and evidence
│   └── visual/                   # opt-in baseline workflow
├── docs/                         # strategy, traceability, manual pack, bug, release report
├── .github/workflows/playwright.yml
├── .gitlab-ci.yml
└── playwright.config.ts
```

Tests use **accessible locators**, browser-context isolation, a one-time session seeding helper (not global `addInitScript`, which could invalidate reload tests), **web-first assertions**, and clear `@smoke`, `@regression`, `@api`, `@a11y`, `@visual`, `@known-issue` tags. All page selectors were cross-checked against the upstream source at the pinned revision; browser execution still needs to be validated on a networked machine.

## CI strategy

**GitHub Actions** runs smoke tests for pull requests/pushes, and cross-browser regression on scheduled/manual runs. It checks out the pinned StreamFlix app separately, installs dependencies, builds/serves the production Vite bundle, publishes HTML and JUnit reports plus failure screenshots, videos, and traces. **GitLab CI** mirrors the smoke gate and provides JUnit reports suitable for merge-request display.

**Known issue:** `BUG-001` reproduces missing player error feedback when the HLS manifest fails. It's deliberately isolated from the normal gate using `@known-issue` and a Playwright expected-failure annotation. Run `npm run test:known-issues` to see the expected failure. See [defect report](docs/defect-BUG-001.md). Do not interpret this as a resolved bug.

**Accessibility:** Axe is an automated scanner, not a substitute for keyboard/screen reader or real-device testing. **Visual:** no baseline is invented here; generate and approve one on the environment that will run CI. For the interview, demonstrate the process without falsely claiming it has already been executed.

## Quality ownership and interview narrative

1. [Test strategy and risk matrix](docs/test-strategy.md): coverage selection, layers and release gates.
2. [Traceability matrix](docs/traceability.md): each requirement maps to a test or manual session.
3. [Manual pack and exploratory charter](docs/manual-test-pack.md): TV/DRM/performance and accessibility gaps.
4. [Known defect](docs/defect-BUG-001.md): reproducible steps, impact, triage.
5. [Sample client report](docs/release-report-template.md): evidence-based release confidence.
6. [Interview walkthrough](docs/interview-walkthrough.md): a 20–30 minute demo script.

## Constraints / review before using for a real client

- App is upstream and could change. The pinned commit prevents unexpected test drift; review upgrades intentionally.
- HTTP delivery checks are **not** comprehensive API, security, contract or load tests. A real service needs its own request-layer suite with valid/invalid payloads, auth, idempotence, data cleanup and schema assertions.
- Browser/device emulation cannot certify playback, DRM, codec support, remote controls or memory on Tizen/webOS/Fire TV/Apple TV. Maintain a physical-device matrix and manual pack.
- This project has **not been executed against a live browser in the creation environment** because network-based npm installation and the upstream clone were unavailable. Run the commands above, record results and fix any upstream differences before presenting.

Original StreamFlix code remains under its own MIT license; this framework is an independent demonstration and is not affiliated with Netflix or its brands.