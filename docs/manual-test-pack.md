# Manual release test pack & exploratory charters

## Execution record
Capture test ID, tester, date/time, app build, device make/model, OS/firmware, region, network, result (Pass/Fail/Blocked/Not Run), defect reference and evidence location. Never claim unexecuted tests as passed.

| ID | Priority | Scenario | Steps | Expected result |
| --- | --- | --- | --- | --- |
| MAN-001 | High | Remote focus navigation | On physical TV use Up/Down/Left/Right/OK/Back between rails and modal | Focus remains visible, no traps, consistent selection |
| MAN-002 | Critical | Playback start | Choose content and start on target physical device | Player starts within agreed target with audio/video |
| MAN-003 | Critical | Temporary network loss | Start stream, disconnect network, reconnect, retry | Defined recoverable state; no freeze or unhandled crash |
| MAN-004 | High | Standby/resume | Pause playback, standby device, resume | Expected position and player state restored |
| MAN-005 | High | Subtitles and audio | Toggle supported subtitle/audio tracks | Correct language/track, no desynchronisation |
| MAN-006 | High | Low-memory device | Navigate 30+ screens, start/stop playback repeatedly | No worsening latency, lockup or crash |
| MAN-007 | High | Screen-reader login | Use keyboard and assistive technology | Inputs, errors and actions announced correctly |
| MAN-008 | Medium | Mobile landscape | Rotate small-screen device during player use | Usable controls; no clipped critical content |
| MAN-009 | Medium | Search exploratory | Try whitespace, special characters, duplicate terms, locale cases | Useful results/no-results and no crash |
| MAN-010 | High | Watchlist profile separation | Switch profiles and inspect saved items | Behaviour matches agreed requirements |

## Exploratory charter: playback recovery (30 min)
**Mission:** Understand failure/recovery of HLS playback on a constrained or older connected TV under unstable connectivity.

- Setup: identify device build/firmware, title/media manifest, network characteristics, user/profile.
- Explore: connection drop at startup / mid-playback / during seek; recovery; repeated network transitions; app background/foreground.
- Observe: focus, visual errors, audio state, retry affordance, playback position, CPU/memory where available.
- Report: defect severity and reproducible evidence, logs/video, workaround and potential client impact.

## Device evidence matrix
Create a row per actual model/firmware/OS/codec/DRM stack with session date and outcomes. Browser project emulation does not establish physical Smart-TV compatibility.

## Release acceptance
This pack complements automated tests, especially where end-to-end hardware input, DRM, codec, network and sustained-performance behaviour cannot be asserted reliably in a browser alone.
