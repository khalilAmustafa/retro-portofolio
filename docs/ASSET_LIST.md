# Retro Portfolio V2 — Approved Asset Manifest (`RPV2-03`)

> **Authenticity Rule:** Never place AI-generated mock UI screenshots or stock campus photos without usage rights into `public/assets/`. Until real captures are dropped into the paths below and marked `ready: true` in `src/data/`, the portfolio renders honest technical architecture schematics and labeled artifact slots.

---

## 1. Active Core Shell & Brand Assets (Committed)

| Asset Path | Purpose | Dimensions / Format | Status |
|---|---|---|---|
| `public/assets/bezel.png` | Physical CRT television frame & inner mask | Original PNG (854 KB) | Active — **Do not modify** |
| `public/assets/vision-animated-spritesheet.png` | 8-frame horizontal pixel-art blinking idle sheet for VISION | Original PNG (`800% × 100%` frame strip) | Active — **Do not modify** |
| `public/assets/vision-preview.gif` | Social / README preview of VISION mascot | Animated GIF (21 KB) | Active |

---

## 2. Drop-In Project Media Slots (`public/assets/projects/`)

To activate any screenshot below:
1. Export a real capture as `.webp` (recommended width `1200–1600px`, target `120–300 KB`).
2. Redact any participant emails, phone numbers, IDs, or private API keys.
3. Place the file at the exact path below and change `ready: false` to `ready: true` on the matching media entry in `src/data/projects.js`.

| Project ID | Drop-In File Path | Recommended Content | Privacy Check Required |
|---|---|---|---|
| `rooms` | `public/assets/projects/rooms/gameplay-lobby-01.webp` | Live multiplayer study room / challenge lobby | Hide personal student emails if visible |
| `rooms` | `public/assets/projects/rooms/quiz-round-02.webp` | Active quiz round & scoreboard feedback | Hide private room tokens |
| `nasa-space-apps` | `public/assets/projects/nasa-space-apps/landing-registration-01.webp` | Event landing page & team registration workflow | Redact any real registrant PII |
| `happensbefore` | `public/assets/projects/happensbefore/trace-check-01.webp` | Real terminal run / trace causal graph output once CLI is ready | None (synthetic test trace) |
| `space-day` | `public/assets/projects/space-day/station-passport-01.webp` | Digital passport progress & station approval screen | Redact participant names & QR codes |
| `space-day` | `public/assets/projects/space-day/certificate-preview-02.webp` | Sample generated completion certificate (demo name) | Use sample name only |
| `bandup` | `public/assets/projects/bandup/lesson-workspace-01.webp` | Live IELTS lesson & guided tutoring screen from `bandup.khalils.codes` | None |
| `makan` | `public/assets/projects/makan/colmap-splat-comparison-01.webp` | Side-by-side input video frame vs. COLMAP sparse poses / 3DGS render | Ensure room owner permission |

---

## 3. Education & Credentials Slots

| Category | Drop-In File Path | Recommended Content | Status |
|---|---|---|---|
| Education (`asu`) | `public/assets/education/asu.webp` | Personal or authorized photo at Applied Science Private University, Amman | Slot prepared (`ready: false`) |
| Education (`upv`) | `public/assets/education/upv.webp` | Personal study/campus photo at ETSINF, Universitat Politècnica de València | Slot prepared (`ready: false`) |
| Credential (`aws-ccp`) | `public/assets/credentials/aws-ccp-badge.webp` | Official AWS Certified Cloud Practitioner badge or redacted certificate | Slot prepared (`ready: false`) |
| Resume / CV | `public/assets/credentials/khalil-mustafa-cv.pdf` | Verified PDF resume matching V2 portfolio claims | Hidden until `available: true` in `src/data/contacts.js` |
