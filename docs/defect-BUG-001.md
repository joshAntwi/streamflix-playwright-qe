# BUG-001 — Fatal HLS manifest failure has no user-facing error

**Status:** Candidate upstream defect (to be confirmed with product owner); reproducible executable specification provided.

**Priority:** High / conditional on real customer impact
**Risk:** Playback failure leaves the user without sufficient recovery guidance.

## Preconditions
Demo app built from pinned StreamFlix commit. Signed-in demo session, playable title t1 selected.

## Reproduction
1. Run: npm run test:known-issues
2. The test aborts manifest requests to https://test-streams.mux.dev/.
3. Open /watch/t1 and observe UI after the fatal HLS error.

## Expected
A visible, accessible playback error explains the problem and ideally offers a retry, exit, or alternative path.

## Actual (from source inspection)
The upstream HLS error handler logs fatal errors with console.warn but does not render an accessible error message. The executable test checks for role=alert and documents the expected failure.

## Evidence to attach after execution
- Playwright trace, network HAR or failed request, browser console, screenshot/video
- Browser and version, test timestamp, app commit, external stream URL
- Device / firmware info if reproduced on physical hardware

## Investigation and triage
Differentiate external media service failure from application error handling. Confirm acceptance criteria with client and developer. Fix should include user recovery flow and appropriate telemetry. Retest on browser and supported physical devices.

**Note:** Playwright test.fail marks an intentionally known failing expectation; it does not mean the product has been repaired. The default quality gate excludes @known-issue tests.
