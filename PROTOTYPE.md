# Personal Channel — current entry

Open `http://127.0.0.1:5188/#room` for the restored 3D desk. Enter the television to use the current Arc-inspired content inside the approved 3D CRT; Back to desk returns through the same camera move. Direct `#work`, `#atlas`, and project links open the screen immediately. Browse all eleven projects with wheel, drag, arrow keys or visible controls; open a cover, then scroll through actual media and the engineering story. Profile and Atlas remain inside the same television. The primary email is `khalil.asad.2005@gmail.com`, as selected by the user.

Current verification commands: `npm test`, `npm run build`, `node tests/channel-browser.mjs`. `CHANNEL_URL` selects a different current-entry URL for production checks. See `docs/channel-review/REVIEW.md` for screenshots, test evidence and measured motion timing.

The previous prototype is preserved at `/previous.html`, the original at `/legacy.html`, and standalone TV inspection at `/tv-review.html`. The historical notes below describe the previous prototype, not the current main entry.

# Earlier CRT experience prototype

This is a separate working copy. The Desktop portfolio was not edited.

## Run

```powershell
npm ci
npm run dev -- --host 127.0.0.1 --port 5188
```

Open http://127.0.0.1:5188 . Click Enter on the television. Browse with drag, wheel, arrow keys, cover clicks, hardware buttons or the dial. Open a project; Escape or Project library returns. Back to room reverses the entrance. Sound is off initially.

The original portfolio is retained at `/legacy.html`. Direct project links work; nonprototype projects and original sections redirect to the legacy entry.

## Build and checks

```powershell
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 5190
```

Browser scripts require installed Chrome or Edge. Override `CHROME_PATH` if necessary. `PREVIEW_URL` selects the test server.

```powershell
$env:PREVIEW_URL='http://127.0.0.1:5190'
node tests/experience-browser.mjs
node tests/experience-resilience.mjs
```

## Verified in this session

- 24 Vitest tests passed, including the original 12 checks.
- Production build passed and includes both entries. Vite warns that the Three.js chunk exceeds 500 kB uncompressed (approximately 149 kB gzip).
- Basic Chrome browser journey passed: entry, keyboard selection, project preview/return, Escape reversal, direct ROOMS link, responsive screenshots at 1440, 768 and 390 pixels, and WebGL-disabled/reduced-motion fallback. No console/runtime errors or failed local assets in that run.
- Screenshots are in `docs/screenshots/`.

## Pending verification

Final resilience/performance run was interrupted before results were obtained. No claim is made about measured frame timing, universal 60fps, actual touch-device behavior, context-loss recovery, or a complete legacy smoke pass. `tests/experience-resilience.mjs` contains the extended checks, including immediate wheel reversal, touch gestures, handoff calibration and frame timing. These remain to be run and any failures corrected.

This is a presentation prototype using existing project content; new playable demos, content engineering and the globe are later work. Room props are deliberately lightweight rather than a photoreal reconstruction of the generated approval image. Portrait layouts recompose the CSS shell; mobile handoff still needs visual motion review.

See `docs/ASSET_CREDITS.md` for provenance and `docs/IMPLEMENTATION_LEDGER.md` for implementation decisions.
