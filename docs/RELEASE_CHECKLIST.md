# Retro Portfolio V2 — Release & Rollback Checklist (`RPV2-34`)

## 1. Automated Verification Gates

- [ ] `npm test` passes all data-integrity, banned-claim, and hash-routing unit tests (`tests/data.test.js`, `tests/navigation.test.js`).
- [ ] `npm run build` completes cleanly with zero broken asset paths and outputs static bundle to `dist/`.
- [ ] Headless browser smoke & accessibility verification (`npm run test:smoke`) passes across desktop (`1280×820`) and mobile (`390×844`).

## 2. Functional & Hardware Shell Parity

- [ ] CRT bezel (`bezel.png`), cream phosphor palette (`#F5F1E6`), olive control panel, and VISION 8-frame idle blink match V1 baseline.
- [ ] Rotary channel dial (pointer drag, mouse wheel, `ArrowLeft`/`ArrowRight`/`Home`/`End`), 7 channel buttons, LED indicators, volume knob/slider/OSD, `BLANK SCREEN`, `CRT` preset toggle (`AUTHENTIC` / `PERFORMANCE` / `OFF`), and `POWER` switch all operate cleanly.
- [ ] Direct URLs (`#home`, `#experience`, `#education`, `#skills`, `#projects`, `#projects/rooms`, `#projects/happensbefore`, `#projects/bandup`, `#certifications`, `#contact`) load the exact view and synchronize dial + LED.
- [ ] Browser Back/Forward returns from `#projects/<id>` to `#projects` (preserving gallery scroll position) and then to the prior channel.
- [ ] Visiting `#home` 20+ times attaches zero duplicate click listeners to `#screen-content` or VISION.

## 3. Content Truthfulness Audit

- [ ] Zero invented skill percentages (`95%`, `90%`) or `"Expert"` self-ratings.
- [ ] Zero unverified uptime claims (`flawless availability`, `zero downtime`).
- [ ] Event counts (`85+ teams`, `380+ participants`) explicitly attributed to regional event scale.
- [ ] Team awards (`3rd Place — Replit AI Hackathon`) explicitly distinguish team achievement from personal engineering contribution.
- [ ] Incomplete/R&D projects (`HappensBefore`, `BandUp` Learning Graph, `Makan`) clearly display development stage.
- [ ] Future certification targets (`AWS SAA`, `Docker`) do not appear as earned badges.

## 4. Rollback Procedure

The original V1 static application remains intact on `main` (`commit fcc9ceefe42d3f5d4ae21a9104531b75b1afd86b`):

```bash
# Instant rollback to V1 baseline if needed:
git checkout main
```

To deploy V2 to any static host (Vercel, Cloudflare Pages, Netlify, GitHub Pages):
- **Build command:** `npm run build`
- **Publish directory:** `dist`
