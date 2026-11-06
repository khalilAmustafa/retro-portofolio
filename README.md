# Personal Channel — current prototype

The main entry now uses the approved 3D CRT with an Arc-inspired content system: a curved eleven-project collection, shared cover-to-case transitions, actual-media case studies, profile and interactive geographical atlas. The content is reconciled from the previous portfolio and khalils.codes. Contact uses the email selected by the user.

Run `npm run dev -- --host 127.0.0.1 --port 5188`, then open `http://127.0.0.1:5188/#room`. Enter the television from the restored 3D desk. Direct links such as `#work` and `#atlas` open the screen immediately.

- `/` or `/channel.html`: current content experience.
- `/previous.html`: retained earlier room and sample-interaction prototype.
- `/tv-review.html`: standalone model inspection.
- `/legacy.html`: original portfolio presentation.

Current checks: `npm test`, `npm run build`, and `node tests/channel-browser.mjs`. Use `CHANNEL_URL` to target another main-entry URL. Original prototype browser scripts now target `/previous.html`.

The earlier V2 documentation follows for source/history context.

# Retro Portfolio V2 — Khalil Asad Mustafa

Interactive 1970s comic-book + curved CRT television engineering portfolio for **Khalil Asad Mustafa** (*Computer Science · Backend Systems · Cloud Infrastructure · Applied AI*, Amman, Jordan).

---

## Quick Start

```bash
# Install dependencies (Vite + Vitest)
npm install

# Start local dev server with HMR
npm run dev

# Run data-integrity & hash-router unit tests
npm test

# Build deployable static bundle into dist/
npm run build

# Run headless Chrome end-to-end smoke, accessibility & responsive suite
npm run test:smoke

# Preview built static site locally
npm run preview
```

---

## Architecture & Directory Layout

```text
retro-portofolio/
  index.html                  # Physical CRT television shell, SVG barrel filter & hardware controls
  package.json                # Vite + Vitest scripts
  vite.config.js              # Relative base ('./') static bundle configuration
  public/
    robots.txt
    assets/
      bezel.png               # Original TV bezel frame (preserved)
      vision-animated-spritesheet.png # Original 8-frame pixel-art VISION sprite (preserved)
      vision-preview.gif      # Social preview
      projects/               # Drop-in folders for real project screenshots (.webp)
      education/              # Drop-in folder for ASU & UPV campus photos (.webp)
      credentials/            # Drop-in folder for official badges & CV PDF
  src/
    main.js                   # Application bootstrap & single-bind event wiring
    data/                     # Single structured source of truth (zero inline HTML)
      profile.js              # Positioning, CTAs, 4-cell Home evidence strip & VISION config
      evidence.js             # Central registry of verified proofs & attribution scopes
      experience.js           # Expandable CH 02 engineering journey milestones
      education.js            # CH 03 ASU & UPV academic passport records + languages
      skills.js               # CH 04 capability domains & project proof links
      projects.js             # CH 05 featured case studies + secondary builds
      credentials.js          # CH 06 featured AWS certification, honors & collapsible coursework
      contacts.js             # CH 07 email, GitHub, LinkedIn, availability & CV status
    core/
      crt.js                  # Memoized 1024x1024 CRT-Lottes barrel map & preset controller
      tv-controller.js        # Rotary dial, channel buttons, volume knob/OSD, blank & power
      navigation.js           # Deep-link hash router (#home, #projects/rooms, Back/Forward, scroll restore)
      vision.js               # Delegated VISION companion controller (zero listener leaks)
      sound.js                # Web Audio tactile click & power synthesis
      preferences.js          # CRT preset persistence & prefers-reduced-motion handling
      dom.js                  # HTML escaping & relative asset resolution
    components/               # Reusable retro cards, evidence strip, timeline, gallery & case study views
    channels/                 # Dedicated renderers & delegated interactions for CH 01 – CH 07
    styles/                   # Modular CSS: tokens, shell, components, channels, motion, responsive
  tests/
    data.test.js              # Schema, link, evidence & truthfulness guardrail tests
    navigation.test.js        # Canonical hash route & fallback unit tests
    smoke-browser.mjs         # End-to-end headless Chrome CDP verification & screenshot suite
  docs/
    CONTENT_INVENTORY.md      # Claim-by-claim verification & attribution audit
    ASSET_LIST.md             # Prepared drop-in paths & privacy checklist for real captures
    RELEASE_CHECKLIST.md      # Pre-release verification & rollback instructions
    baselines/                # V1 & V2 desktop/mobile comparison screenshots
```

---

## Updating Content & Adding Real Screenshots

All portfolio copy lives in `src/data/*.js` — you never need to edit HTML template strings to update projects, roles, or credentials:

1. **Add a real project screenshot:**
   - Export an authentic capture as `.webp` (`1200–1600px` wide, PII redacted).
   - Drop it into `public/assets/projects/<project-id>/` (see [`docs/ASSET_LIST.md`](./docs/ASSET_LIST.md) for exact filenames).
   - In `src/data/projects.js`, flip `ready: false` to `ready: true` on that project's `media` entry. Both the gallery thumbnail and zoomable case-study lightbox activate automatically.
2. **Add `HappensBefore` repository or CLI captures:**
   - Update the `happensbefore` object in `src/data/projects.js` (`links`, `status`, and `media`) once the CLI runner is ready.
3. **Verify before deploying:**
   - Run `npm test && npm run build && npm run test:smoke` to confirm all cross-references and truthfulness guardrails pass.

---

## Deployment

`npm run build` outputs a pure static site into `dist/` with relative asset paths (`base: './'`), ready for **Vercel**, **Cloudflare Pages**, **Netlify**, or **GitHub Pages** without server-side rewrites.

