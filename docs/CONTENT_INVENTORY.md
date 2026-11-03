# Retro Portfolio V2 — Verified Content Inventory (`RPV2-02` / `RPV2-04`)

This document audits every professional claim from V1 (`app.js` at commit `fcc9cee`) alongside new V2 items, recording verification status, personal vs. team/event attribution, conservative rewrites applied per Section 3.3, and structured data destination.

---

## 1. Identity & Positioning

| Claim / Field | V1 Wording | V2 Approved Wording | Status | Attribution | Destination |
|---|---|---|---|---|---|
| Full Name | `KHALIL ASAD MUSTAFA` | `KHALIL ASAD MUSTAFA` | Verified | Personal | `src/data/profile.js` |
| Location & Timezone | `Amman, Jordan` / `GMT+3` | `Amman, Jordan` · `GMT+3` | Verified | Personal | `src/data/profile.js`, `src/data/contacts.js` |
| Subtitle / Descriptor | `COMPUTER SCIENCE / APPLIED AI / SOFTWARE DEVELOPMENT` | `COMPUTER SCIENCE · BACKEND SYSTEMS · CLOUD · APPLIED AI` | Approved V2 | Positioning | `src/data/profile.js` |
| Home Copy | *"Building useful software. Exploring intelligent systems. Turning ideas into real experiences."* | *"Computer Science student and software engineer focused on backend systems, cloud infrastructure, and applied AI — building event platforms, workflow tools, and interactive learning software. Studying Computer Science in Amman with an Erasmus+ exchange at UPV Valencia."* | Approved V2 | Positioning | `src/data/profile.js` |
| VISION Mascot Label | `VISION // COMPANION` · `CLICK TO CHAT` | `VISION // INTERACTIVE COMPANION` · `CLICK FOR NOTE` | Rewritten (conservative) | UI Mascot | `src/data/profile.js`, `src/core/vision.js` |

---

## 2. Experience & Operational Deliveries

| Item | V1 Claim | V2 Conservative Wording | Verification Note | Attribution | Destination |
|---|---|---|---|---|---|
| Contract Software & Web Development | `MAY 2026 – PRESENT`, MENA / Jordan / Remote, *"high-throughput registration systems"* | `2026-05 – Present`, MENA / Jordan / Remote; bilingual Arabic/English web apps, registration workflows, relational schemas, APIs, and live event support | Removed unquantified *"high-throughput"* adjective; keep `Present` until contract practice concludes | Personal | `src/data/experience.js` |
| NASA Space Apps Availability | *"OPERATED LIVE WITH FLAWLESS AVAILABILITY"*, *"ZERO REGISTRATION DOWNTIME"* | *"Supported live participant registration and event communications"* | **Dropped** *"flawless availability"* and *"zero downtime"* (no external uptime monitor log attached) | Personal delivery | `src/data/experience.js`, `src/data/projects.js` |
| NASA Space Apps Scale | `85+ TEAMS · 380+ PARTICIPANTS` | `Event serving 85+ teams and 380+ participants` | Explicitly attributed to **regional event cohort scale**, not solo personal user-acquisition metric | Event scale | `src/data/evidence.js`, `src/data/profile.js`, `src/data/projects.js` |
| Space Day Digital Passport | Registrations, station progression, instructor approvals, PDF completion certificates (`TypeScript`, `PostgreSQL`, `Drizzle ORM`) | Retained with concrete dataflow & idempotent station-approval engineering decision | Verified stack and workflow | Personal delivery | `src/data/experience.js`, `src/data/projects.js` |

---

## 3. Education & Languages

| Item | V1 Claim | V2 Approved Wording | Verification Note | Attribution | Destination |
|---|---|---|---|---|---|
| Applied Science Private University (ASU) | B.Sc. Computer Science, Amman, Jordan, Expected Graduation 2027 | B.Sc. in Computer Science · Amman, Jordan · Expected Graduation 2027 (In Progress) | No invented enrollment start year (e.g., 2013 mockup artifact excluded); degree clearly marked in-progress | Personal | `src/data/education.js` |
| Universitat Politècnica de València (UPV) | Informatics Engineering, ETSINF, Valencia, Spain, Spring 2026, Erasmus+ | Erasmus+ International Exchange · Informatics Engineering (ETSINF) · Valencia, Spain · Spring 2026 | Clearly distinguished as an exchange semester rather than a separate degree | Personal | `src/data/education.js`, `src/data/credentials.js` |
| Spoken Languages | Arabic (Native), English B2 (EF SET Certified) | Arabic — Native proficiency; English — B2 Upper-Intermediate (EF SET) | Optional `proofUrl` slot prepared in `src/data/evidence.js` | Personal | `src/data/education.js` |

---

## 4. Projects & Engineering Artifacts

| Project ID | Title | Stage / Status | Personal vs. Team Attribution | Key Evidence / Caveat | Destination |
|---|---|---|---|---|---|
| `rooms` | ROOMS by VISION | `active` (Hackathon Winner · Team Project) | **Team result:** 3rd Place — Replit AI Hackathon (2026). **Personal role:** Interactive challenge state flows, structured AI quiz/feedback prompts, session coordination | Clearly separates team award from personal contribution | `src/data/projects.js` |
| `nasa-space-apps` | NASA Space Apps Event Platform | `delivered` | **Personal role:** Event web platform, registration form validation, persistence, live event updates. **Event scale:** 85+ teams, 380+ participants | Zero unverified uptime claims | `src/data/projects.js` |
| `happensbefore` | HappensBefore | `in-development` | **Personal role:** Solo systems prototype designing execution trace capture, causal happens-before partial-order graph, and invariant violation reporting | Explicitly labeled `In Development`; no fabricated CLI output | `src/data/projects.js` |
| `space-day` | Space Day Digital Passport | `delivered` | **Personal role:** Full-stack workflow (`TypeScript`, `PostgreSQL`, `Drizzle ORM`), station approvals, organizer dashboard, PDF certificates | Concrete idempotency tradeoff documented | `src/data/projects.js` |
| `bandup` | BandUp | `r-and-d` | **Personal role:** Creator of live IELTS Academic platform (`https://bandup.khalils.codes`) and author of proposed Learning Graph R&D | Clearly separates live web platform from proposed adaptive graph branching | `src/data/projects.js` |
| `makan` | Makan | `experimental` | **Personal role:** Solo CV/3D pipeline builder (`COLMAP` SfM + `3D Gaussian Splatting`) | `318/318 images registered` & `0.88 px` explicitly caveated as single-sequence camera registration accuracy | `src/data/projects.js` |
| `futureing` | Futureing | `prototype` (Secondary) | **Personal role:** Local-first Expo + SQLite + Gemini structured tool-routing prototype | Listed in `More Builds & Experiments` | `src/data/projects.js` |
| `asad-math` | Asad Math | `delivered` (Secondary) | **Personal role:** Arabic Grade 12 math EdTech platform for students in Oman | Listed in `More Builds & Experiments` | `src/data/projects.js` |
| `abyss-of-the-loss` | Abyss of the Loss | `active` (Secondary) | **Personal role:** 2D psychological horror game (`Godot`, `GDScript`) | Live web build + public GitHub repo verified | `src/data/projects.js` |

---

## 5. Skills & Credentials Exclusions (Strict Guardrails)

- **Excluded permanently:** Self-rated skill percentages (`95%`, `90%`, etc.) and self-proclaimed `"Expert"` labels. Replaced with qualitative evidence labels (`used in live events`, `project experience`, `certified`, `r-and-d`, `experimental`, `currently learning`) linked to specific projects.
- **Excluded from earned credentials:** `AWS Solutions Architect Associate (SAA)` and `Docker Certification` (future learning targets only — never rendered as earned badges).
- **Featured credential:** `AWS Certified Cloud Practitioner` (`2026-05`, Amazon Web Services).
- **Demoted to collapsible drawer:** Coursera/IBM/Google/Meta individual course completions (`Other Coursework & Certificates`).
