# Original CRT: modelling reference and first review milestone

Live review: `/tv-review.html`. The existing room prototype is unchanged pending the model's visual review, as required by the approved revised plan.

## Measured reference

Original CSS/PNG television at 1560×1000, captured from `legacy.html#home`. Full measurements: `tv-review/measurements.json`. The original is retained at `public/assets/experience/original-tv-reference.png` solely as the comparison reference, not the model's front texture.

| Part | Original bounds in CSS pixels |
|---|---|
| TV | 0, 0, 1560, 1000 |
| Olive panel | 1283.81, 11, 265.19, 978 |
| Screen assembly | 11, 11, 1264.81, 978 |
| Glass layout region | 84.34, 84.34, 1118.13, 831.31 |
| Dial face | 1331.41, 63.83, 170, 170 |
| Speaker | 1306.64, 737.17, 219.53, 62 |
| Power | 1465.66, 845.17, 32, 44 |

The original bezel image partly overlaps the glass rectangle. The model approximates that visible aperture with a superellipse and a curved recessed surround. It is not a pixel-exact tracing of the PNG's irregular edge; review that shape explicitly against the original before integration.

## What is real geometry

Cream rounded casing and lip; olive panel and trim; a bezel extrusion with an actual opening plus a sculpted curved surround; curved phosphor/glass surfaces; rotary grip, instanced ridges, seven original channel buttons with LEDs; speaker recesses, lower volume knob, power switch, feet and restrained rear vents. Printed labels use transparent text textures. Screen welcome graphics use a separate caller-owned texture. No screenshot of the entire TV is mapped to the front.

The rear depth/vents and side details are inferred because the original asset shows the front only. All new TV geometry is authored in code. The old reference image/CSS and project content are preserved.

The seven original channel controls replace the simplified three-button hardware in the current prototype. Integrating channel selection with the future content system remains later-phase work. The model-review page lets you inspect dial/button selection, change camera view and switch neutral/evening illumination; these are inspection controls, not the finished portfolio navigation.

## Verification

The four new model tests were observed failing before the model existed, then passed. The full unit suite passed with 28 tests. Browser checks exercised front/angled view changes, lighting switch, channel selection, original-reference comparison and 390px layout, with no uncaught browser errors. Review screenshots are in `docs/tv-review/`.

Final measured review render: approximately 77,006 triangles and 89 draw calls, including shadow rendering. Dial ridge instancing reduced calls from the initial 142. These are review-scene counts, not final room performance measurements. The integration phase must further budget detail and measure frame timings.

This milestone is ready for user visual review, not a claim that the full revised room/rendering integration is finished. Later tasks in `../3d-crt-implementation-plan.md` remain pending.

Independent review found and fixed three P2 issues: comparison framing, rear-view raycast occlusion and keyboard-accessible screen power. All three regression checks were observed failing, then passing. Final full suite: 28/28; production build passed. Browser review screenshots regenerated with no uncaught errors. The model is awaiting the explicitly planned visual review before room integration.

## Material and lighting refinement
Replaced the continuous inflated bezel profile with a stepped moulded contour. Added deterministic plastic grain, roughness variation and restrained edge ageing; polished grip finish; stronger glass reflections; phosphor brightness falloff and scanlines; local screen light and a dark screen backing. Power now fades the screen and its local light together. The review stage uses a seamless shadow-only floor and filtered shadows with a raised evening key.
Before images: docs/tv-review-before-materials/. Updated images: docs/tv-review/. Visually inspected final front, angled, evening and mobile renders. Verification: 28 unit tests, build, review browser checks and comparison/occlusion/power regressions all pass. Existing Three.js bundle-size warning remains. No room integration or new portfolio content included in this pass.

## Stronger visible patina pass
User found the previous texture treatment too clean. Corrected the grain frequency (10x/8x repetition was filtered away at normal viewing size; now 2x). Added locally generated 1K finish maps with irregular oxidation, scratches, edge ageing, dial handling halo, button rub marks and speaker dust. Glass roughness varies around faint corner smears. No borrowed or generated photographic imagery added. The model colour identity, geometry and controls remain intact. Browser screenshots regenerated and inspected; final checks recorded in the execution ledger.

## Approved finish target — 5 November
User approved outputs/approved-crt-finish.png. Saved a local copy in public/assets/experience/approved-crt-finish.png and exposed it in the viewer. Refined bezel depth and UV mapping (the sculpted bezel previously had no UVs), fine edge wear, reduced broad cabinet staining, convex lens curvature, physically reflected divided window, walnut surface, and welcome screen composition. The generated image remains an art direction target, not a claim of photorealistic parity. Room integration remains pending.
