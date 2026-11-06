# Personal Channel — content review

## Scope delivered

The main `/` entry now renders the approved original-design 3D CRT and a new content system. `/channel.html` is an equivalent inspection entry. `/previous.html` retains the previous room/sample-interaction prototype; `/legacy.html` retains the original portfolio. The Desktop source has not been edited.

The new collection includes all 11 reconciled projects. Each has a designed typographic cover with actual project captures where available, a short editorial thesis, actual media, a focused engineering decision, contribution, attribution and outcomes. No sample quiz/passport interactions appear in this main flow. The profile includes career history, skills with learning stages, education, all 18 published credential records, honors and the user-selected contact email. The atlas uses real work/study contexts and public-domain coastlines.

The content uses accessible HTML inside a safe rectangle calculated from the actual 3D screen anchor and camera. The model is reused without replacing its physical identity. Portrait screens crop closer to the original television rather than stretching the model.

## Verification

- `npm test`: 43/43 tests passed.
- `npm run build`: passed. Existing Three.js chunk warning remains: approximately 615 kB minified, 155 kB gzip.
- `tests/channel-browser.mjs`: passed against both the development channel entry and the production main entry at local port 5191. All 11 cases, native video play/teardown, keyboard selection, browser Back/Forward, resize during opening, globe/place selection, 1440/768/390 layouts, reduced motion and WebGL startup fallback checked. No runtime errors or missing local assets.
- Desktop/tablet/phone screenshots in this directory were visually inspected. The collection starts on ROOMS with adjacent covers on both sides. The content surface is transparent so it blends into the physical curved glass.
- Independent read-only review found four P2 issues: stale keyboard focus after browsing, stale history selection, preserved velocity after reversing input, and lost focus when resizing an opening transition. All four were fixed and independently reverified. The reversal test was observed failing numerically before the fix, then passing.

## Local motion sample

See `performance.json` for the raw environment and results. At 1440×1000, DPR 1, warm assets in local headless Chrome: 178 measured frame intervals each; gallery p50 6.9ms / p95 7.3ms; globe p50 7.0ms / p95 13.7ms. Four retained wheel-to-first-motion samples were about 6.2ms. This is a small local sample, not a cross-device or universal frame-rate guarantee. No mobile hardware performance claim is made.

## Boundaries

The initial content revision did not include the wide room/environment journey. In the following desk integration, the previous environment was restored around the current real TV using one renderer and a reversible camera; see `docs/desk-review/checks.json` and screenshots. Root / `#room` opens that desk; content deep links still open the screen directly. External project deployments and credential URLs remain the source owner's links; this work does not republish or alter them. The globe shows work/study context, not live visitors or a client distribution. The portfolio has not been published remotely.
