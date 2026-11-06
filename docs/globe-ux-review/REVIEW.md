# Globe motion and targeted UX refinement

The user requested natural glide after releasing the globe and better usability. The existing globe was reproduced stopping immediately on pointer release: its drag handler set both position and target, leaving no release momentum. A browser regression compared rendered canvas output before and after release and failed before the fix.

## Changes

- Estimate recent angular velocity during dragging; release into exponential, frame-rate-independent deceleration.
- Stop old momentum when grabbing the globe, holding before release, selecting a place, resetting, canceling a pointer, or hiding the page. Respect reduced-motion preference, including a live preference change.
- Clamp pitch, use the shortest arc when centering a place, and keep rendering batched to animation frames. Cache the graticule instead of reallocating it every draw.
- Add Reset view and a visible drag/release hint; city markers can be selected directly.
- Add a searchable project index, available from the collection and the `/` shortcut. Enter opens the first filtered result; Escape closes and restores focus. Background controls are inert while the dialog is open.
- Keep Collection available in the header while reading a case, clarify the scroll cue, distinguish Select/Open labels, and increase text size and secondary-text contrast.

## Checks

Four momentum unit tests pass: visible continuation/deceleration, equivalent distance at 60/144Hz, fresh versus held releases, and pitch boundaries. The full unit suite passes 47/47 and production build passes; the prior Three.js bundle warning remains.

The production browser check verifies actual rendered movement after release, natural settling, held-release cancellation, reset/place controls, search/open, reduced motion, real CDP touch input, phone layout, modal Escape and focus restoration. The existing eleven-case/navigation/history/video/responsive/fallback browser suite also passes. Screenshots in this directory were inspected.

Independent narrow review found a per-event drag threshold that misclassified fine-grained mouse movement as a click. It was corrected to measure travel from pointer-down, with a 60-step browser drag regression verifying continued motion. The reviewer also verified empty search results, focus trapping, Escape, focus restoration, inert cleanup, and live reduced-motion cancellation.

This is a targeted interaction refinement, not a claim of an exhaustive accessibility or UX audit across every possible device. Local frame measurements are recorded in `docs/channel-review/performance.json`.
