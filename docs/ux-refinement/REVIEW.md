# CRT portfolio refinement — 2026-11-08

Base: `origin/main`, `613a4ce`. Branch: `codex/ux-content-refinement`.

This pass implements the supplied refinement brief against the existing main branch. Earlier uncommitted room/content experiments remain in their original checkout and are excluded from this PR.

## Component changes and before/after behavior

| Component | Before | After / UX purpose |
| --- | --- | --- |
| `content.js` | Several shelf lines and introductions describe a mood rather than a product. Opening metadata names generic categories. | All nine projects have factual product descriptions, precise contribution labels, and short result/status statements. NASA numbers explicitly describe event scale; ROOMS placement is a team award; Makan figures cover one sequence. BandUp research, Futureing prototype and HappensBefore development are explicit. |
| `case.js` | External project/source links are after the whole case study; achievements are mostly below the architecture and captures. | Existing links move into the opening, with a result/status in the existing metadata row. No source URL or demo is invented for private/unpublished work. Detailed outcomes and supporting records remain. HappensBefore architecture is labelled planned. |
| `gallery.js` | “Open project ↗” can suggest opening a live app; “Index” is easy to miss. | “View case study →” names the internal destination; existing button reads “Project index”. Covers, ordering, carousel motion, index search and controls remain. |
| `main.js`, `routes.js` | Direct sections focus an offscreen Profile h1; cold routes never receive section focus. Hardware dial treats every Profile section as Experience. | Correct selected heading and page title, including cold deep links. Focus is retained if interaction begins during a fade. Existing TV buttons select their actual sections; dial progression follows the active section. The current route parser is extracted for regression coverage and gains institution-specific academic links. Existing aliases and all nine projects are preserved. |
| `profile.js` | Every experience accomplishment requires opening a disclosure; first-screen identity is poetic; some history links target removed projects. Contact email is below the opening viewport. | Existing timeline summaries show their accomplishment and role category. Responsibility remains progressive. Name/developer identity is explicit and introductory copy shorter. Removed project links are filtered. Contact is more compact. AWS, team award and academic selection retain existing prominence; supporting records use smaller headings. |
| `atlas.js` | Full university names are absent from city copy; Valencia’s study link opens generic education. | Existing globe and inertia remain. City copy states ASU/UPV and Spring 2026 accurately; each existing city action opens its corresponding academic institution. Existing academic-details action remains. |
| `style.css` | Tiny secondary text, weak metadata, small touch areas, and a few pixels of horizontal overflow from transformed media. | Scoped readability and contrast adjustments use the same palette/fonts. Important metadata uses body text; redundant keyboard/map captions are removed. Tablet/phone primary browsing buttons are 44px. Case bounds contain parallax overflow. No new panels/navigation or global font-size increase. |
| `frame.js` | Three.js warns that PCFSoftShadowMap was removed and substitutes PCFShadowMap. | Select PCFShadowMap directly, matching the renderer’s existing fallback. Geometry, materials, lights, shadow settings, camera and scene composition are otherwise unchanged. |

## Existing solutions retained

- Searchable project index, keyboard shortcuts, focus trap and empty state.
- Dedicated case pages, carousel, project selection and Back-to-collection link.
- Cream/olive CRT, 3D room, original fonts, cover art, camera/route animations and inertial globe.
- AWS Certified Cloud Practitioner feature; separate team award/academic selection; supporting records behind a disclosure; IBM completion explicitly 8/12 and in progress.
- All external URLs and source media attribution. No dependencies or lockfile changes. No publication workflow changes.

## Verification

- Baseline main: 49 unit tests passed; production build passed.
- Added route tests for every active case, removed/malformed/inherited-property IDs, existing aliases and both academic destinations. Added factual-scope regression tests for event/team/benchmark claims and prototype/research status.
- Final production build passed; **54 tests in 13 files passed**. Known Three.js chunk-size advisory remains; no bundle-splitting rewrite was attempted for a UX pass.
- HTTP verification: **32 unique public external URLs succeeded**; **25 rendered local assets exist**. Full statuses and redirect destinations: `link-checks.json`. The explicitly unready HappensBefore screenshot placeholder is excluded from rendered assets.
- Actual production-browser interactions at 1280×720 and 390×844: opened all nine case routes, checked correct titles/result metadata and no horizontal scroll overflow; exercised index search/Enter, carousel Home/Enter, case Back, and Contact with Tab reaching its email.
- Confirmed cold Contact and Valencia academic links focus their corresponding heading. Contact email is within the initial viewport. Valencia city action reaches UPV details.
- Experience summaries expose five accomplishments before expansion; expanded the organization role; no links to Asad Math or Pulse remain there.
- Original 3D controls exercised by pointer: Skills button then main dial progresses to Projects.
- Reduced-motion room → Enter → collection exercised. No-WebGL Space Day case opened, Back and keyboard End/Enter reached Abyss. Temporary browser preference/viewport overrides cleared.
- Fresh final WebGL render produced zero console warnings/errors after replacing the obsolete shadow-map enum with its existing runtime fallback.
- Independent static review caught two stale browser-script assertions and cold-start focus; all corrected. `tests/channel-browser.mjs` is updated for nine projects and current copy. That standalone automated browser script was not run; browser verification above used the connected browser directly.

## Scope and limitations

- This is a targeted UX review, not an exhaustive accessibility/CWV certification. No performance scores are inferred from unit tests or screenshots.
- Source links were HTTP-verified and the MENA GitHub action was clicked; the external browser’s final repository page was not inspected. Email sending and external mail-client launch were not exercised.
- No public source links are added for ROOMS, Space Day, Futureing or HappensBefore because the existing catalog does not provide them. Existing showcases/records remain where available.
- No new navigation, content “operating system”, game metaphors, visual redesign, merged PR or deployment is included.
