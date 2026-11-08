# CRT experience review — 2026-11-08

Scope: targeted live desktop UX/design review, not an exhaustive accessibility or performance certification. Full ux-audit verdict: Incomplete; mobile matrix, axe, performance gates and exhaustive element manifest were not completed. No product changes made.

Persona: first-time recruiter/collaborator, comfortable with websites, limited time; wants to understand Khalil's contribution and see credible working evidence while enjoying the retro environment.

Observed interactions: room Enter -> collection; project index -> type rooms -> Enter -> ROOMS; scroll ROOMS case; Atlas navigation -> globe drag -> Oman selection; Profile -> Contact. Search opened the correct case and Contact eventually reached its correct section. Console reported PCFSoftShadowMap removal fallback.

## Findings and concrete changes

1. Collection scale (high design impact): at 1280x720 the project covers form a small cluster inside a dominant television. Enlarge the center cover to roughly 60-70% of the available collection stage height, show two partial neighbors, and shorten the surrounding instructions. Source: src/channel/gallery.js and style.css.
2. Atlas collision (high): navigate Atlas; globe and orbit cards visibly cross the heading and introductory paragraph. Reserve separate intro/world/detail regions; orbit cards must remain inside the world region. Source: src/channel/atlas.js and style.css.
3. Case evidence arrives late (medium): open ROOMS; first screen consists of title/description/metadata and a thin slice of video. Lead with readable title, contribution and substantial visible media, followed by optional deeper engineering chapters. Source: src/channel/case.js and style.css.
4. Unsupported geography (medium): select Oman; generic regional copy replaces the removed project's evidence; Academic story links to generic profile. Remove Oman until real relevant content exists. Keep Amman and Valencia. Source: src/channel/content.js and atlas.js.
5. Removed-project references (medium, source confirmed): profile history still maps unfiltered relatedProjectIds; source data contains asad-math, producing an unavailable route. Filter references against channelProjectsById. Source: src/channel/profile.js and data/experience.js.
6. Two competing navigation systems (medium): physical seven-channel labels differ from four in-screen destinations; Atlas illuminates Home. Define a consistent physical-control mapping, update legends and selection feedback. Source: src/channel/main.js, frame.js and experience/tv-model.js.
7. Opening selection (low): default index1 now selects Space Day, rather than ROOMS after removal. Select the featured project by ID rather than fixed index. Source: src/channel/main.js.
8. Renderer warning (low technical): PCFSoftShadowMap removed; runtime falls back. Use supported PCFShadowMap and compare shadows. Source: src/channel/frame.js:18.

## References and adaptation

- https://www.arcmarumo.com/ — searched and viewed live: dominant central cover, cropped neighbors, keyboard instructions and minimal navigation. Adopt scale and selection continuity while preserving original cream/olive TV.
- https://bruno-simon.com/ — official page inspected through web retrieval: explorable world, interaction controls, map, reset and recovery options. Adapt a few meaningful room objects with clear destinations and immediate escape; avoid requiring a game to access work.
- https://lusion.co/ — official page inspected through web retrieval: media-led featured projects and 3D storytelling. Adapt project-specific visual chapters; motion quality was not independently benchmarked.

## Proposed experience

Room -> enter -> large project shelf -> selected cover expands into real project footage -> short interactive engineering chapter -> outcome/evidence -> next project or exact shelf return.

ROOMS: scrub the real lifecycle Topic -> validated questions -> shared round -> review; clearly identify any illustrative reconstruction.
Space Day: follow the documented scan/request/trainer approval/completion flow, with ownership and server validation made visible.
Makan: compare documented reconstruction stages with a drag slider using existing captures, with single-sequence benchmark scope preserved.
Other projects: start with strong actual media and concise contribution; do not manufacture nine different mini-games.

Motion: direct response while dragging, velocity-based release, bounded settling, interruptible transitions, preserved scroll/selection on return. Reduced motion retains content and navigation without camera travel. No perpetual ambient camera motion or forced sound.

Order: repair collisions/routes/control mapping; enlarge collection and lead with evidence; build one exemplary project chapter; extend selectively; add subtle lamp/screen/hover feedback and optional audio last.
