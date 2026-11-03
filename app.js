'use strict';
const channels=['Home','Experience','Education','Skills','Projects','Certifications','Contact'];
const $=s=>document.querySelector(s),tv=$('#tv'),dial=$('#channel-dial'),knob=$('#sound-knob');
let channel=0,powered=true,volume=0,audio=null,tuneTimer,volumeTimer;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const pad=n=>String(n).padStart(2,'0');

const homeTemplate=`<article class="home-view" aria-label="Home transmission">
 <div class="comic-halftone-overlay" aria-hidden="true"></div>
 <div class="home-grid">
  <div class="home-left">
   <div class="home-heading-group">
    <h1 class="hero-name" aria-label="Khalil Asad Mustafa">
     <span class="name-row name-khalil">KHALIL</span>
     <span class="name-row name-asad">ASAD</span>
     <span class="name-row name-mustafa">MUSTAFA</span>
    </h1>
    <p class="hero-subtitle">COMPUTER SCIENCE / APPLIED AI / SOFTWARE DEVELOPMENT</p>
    <div class="hero-divider"></div>
   </div>
   <p class="hero-intro">Building useful software.<br>Exploring intelligent systems.<br>Turning ideas into real experiences.</p>
   <div class="hero-actions">
    <button type="button" class="btn-retro primary" id="btn-explore">
     <span class="btn-icon play-icon">▶</span>
     <span class="btn-label">EXPLORE MY WORK</span>
     <span class="btn-arrow">→</span>
    </button>
    <a href="mailto:khalil.mustafa.work@gmail.com" class="btn-retro secondary" id="btn-contact">
     <span class="btn-icon env-icon">✉</span>
     <span class="btn-label">GET IN TOUCH</span>
     <span class="btn-arrow">→</span>
    </a>
   </div>
  </div>
  <div class="home-right">
   <div class="companion-stage">
    <div class="character-interactive" id="character-vision" role="button" tabindex="0" aria-label="Vision, animated pixel companion. Click to talk." title="Click to chat with Vision">
     <div class="speech-bubble" id="speech-bubble" role="status" aria-live="polite" aria-hidden="true">
      <div class="bubble-text" id="bubble-text"><span>HEY!</span><span>I'M VISION.</span></div>
      <span class="bubble-tail"></span>
     </div>
     <div class="comic-emphasis" aria-hidden="true">
      <span class="em-mark mark-1"></span>
      <span class="em-mark mark-2"></span>
      <span class="em-mark mark-3"></span>
     </div>
     <div class="stage-frame" aria-hidden="true">
      <span class="corner tl"></span>
      <span class="corner tr"></span>
      <span class="corner bl"></span>
      <span class="corner br"></span>
     </div>
     <div class="character-viewport">
      <img src="assets/vision-animated-spritesheet.png" class="character-spritesheet" alt="Vision pixel-art character" draggable="false">
     </div>
     <div class="character-ground" aria-hidden="true">
      <div class="ground-shadow"></div>
      <div class="ground-pedestal"></div>
     </div>
    </div>
    <div class="companion-meta">
     <span class="meta-dot" aria-hidden="true"></span>
     <span class="meta-title">VISION // COMPANION</span>
     <span class="meta-hint">CLICK TO CHAT</span>
    </div>
   </div>
  </div>
 </div>
</article>`;

const visionQuotes=[
  "HEY!\nI'M VISION.",
  "BUILT WITH\nCURIOSITY.",
  "EXPLORE\nMY WORK →",
  "WELCOME TO\nMY WORLD."
];
let currentQuoteIdx=0;
let bubbleTimer=null;
let initialIntroShown=false;

/* --- TRANSMISSION CHANNEL TEMPLATES (CH 02 - CH 07) --- */
const channelTemplates = {
  // CH 02: ABOUT & EXPERIENCE
  1: `<article class="channel-view" aria-label="About and Experience transmission">
  <div class="channel-header-block">
    <span class="channel-eyebrow">CH 02 // TRANSMISSION: ABOUT &amp; EXPERIENCE</span>
    <h1 class="channel-main-title">BUILDING WHAT WORKS</h1>
    <p class="channel-main-subtitle">Software Engineering · Applied Artificial Intelligence · Practical Systems</p>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">ENGINEERING PHILOSOPHY</h2>
      <span class="card-badge">CORE PRINCIPLES</span>
    </div>
    <p class="card-desc"><strong>I like building things that actually work.</strong></p>
    <p class="card-desc">
      My interests sit at the intersection of software engineering, artificial intelligence, and experimental problem-solving. I'm particularly interested in systems that go beyond simple AI integrations — systems that can reason over structured knowledge, interact with tools, adapt to users, and solve practical problems.
    </p>
    <p class="card-desc" style="margin-bottom:0;">
      I approach projects by exploring available technologies, building prototypes, comparing different approaches, and evaluating results.
    </p>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">CONTRACT SOFTWARE &amp; WEB DEVELOPMENT</h2>
      <span class="card-badge status-live">MAY 2026 – PRESENT</span>
    </div>
    <div class="card-meta">MENA REGION · JORDAN / REMOTE · PROFESSIONAL PRACTICE</div>
    <p class="card-desc">
      Building and delivering web applications for events, organizations, and educational use cases.
    </p>
    <ul class="card-bullets">
      <li>Translating stakeholder requirements into functional software architectures.</li>
      <li>Developing comprehensive Arabic and English web experiences.</li>
      <li>Creating high-throughput registration systems, administrative workflows, and event applications.</li>
      <li>Architecting databases, APIs, authentication mechanisms, and deployment processes.</li>
      <li>Providing active operational support for real-world software during live event days.</li>
    </ul>

    <div style="border-top: 1.5px dashed rgba(34,58,43,0.3); padding-top: 14px; margin-top: 14px;">
      <div style="font-family:'Courier New',monospace; font-size:10.5px; font-weight:700; letter-spacing:0.12em; color:#243b29; margin-bottom:8px; text-transform:uppercase;">SELECTED PRODUCTION DELIVERIES</div>
      
      <div style="margin-bottom: 14px;">
        <div style="font-family:'Archivo Black',sans-serif; font-size:14px; color:var(--dark-ink);">NASA Space Apps — Event Website</div>
        <p class="card-desc" style="margin: 4px 0 6px 0;">
          Developed an event website supporting the registration workflow for an event involving more than 85 teams and 380 participants.
        </p>
        <div class="metric-callout">
          <span class="metric-stat">85+ TEAMS · 380+ PARTICIPANTS</span>
          <span class="metric-label">OPERATED LIVE WITH FLAWLESS AVAILABILITY</span>
        </div>
      </div>

      <div>
        <div style="font-family:'Archivo Black',sans-serif; font-size:14px; color:var(--dark-ink);">Space Day — Digital Passport</div>
        <p class="card-desc" style="margin: 4px 0 6px 0;">
          Developed a participant management experience with registrations, station progression, instructor approvals, and digital completion certificates.
        </p>
        <div class="tag-cloud">
          <span class="tag-pill accent">TypeScript</span>
          <span class="tag-pill">PostgreSQL</span>
          <span class="tag-pill">Drizzle ORM</span>
          <span class="tag-pill">Digital Certificates</span>
        </div>
      </div>
    </div>
  </div>

  <div class="channel-footer-nav">
    <button type="button" class="btn-back-home" data-select-channel="0">◀ Return to CH 01 (Home)</button>
    <button type="button" class="btn-card-link primary" data-select-channel="2">Next: CH 03 Education →</button>
  </div>
</article>`,

  // CH 03: EDUCATION
  2: `<article class="channel-view" aria-label="Education transmission">
  <div class="channel-header-block">
    <span class="channel-eyebrow">CH 03 // TRANSMISSION: EDUCATION &amp; LANGUAGES</span>
    <h1 class="channel-main-title">ACADEMIC FOUNDATIONS</h1>
    <p class="channel-main-subtitle">Computer Science Foundations · European Academic Exchange · Languages</p>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">APPLIED SCIENCE PRIVATE UNIVERSITY</h2>
      <span class="card-badge">AMMAN, JORDAN</span>
    </div>
    <div class="card-meta">BACHELOR OF SCIENCE IN COMPUTER SCIENCE · EXPECTED GRADUATION 2027</div>
    <p class="card-desc">
      Studying the foundations of computer science, including algorithms, data structures, object-oriented programming, databases, artificial intelligence, and software engineering.
    </p>
    <p class="card-desc" style="margin-bottom:0;">
      My interests extend beyond coursework into applied machine learning, intelligent software systems, and research-oriented technical experimentation.
    </p>
    <div class="tag-cloud" style="margin-top:10px;">
      <span class="tag-pill">Algorithms</span>
      <span class="tag-pill">Data Structures</span>
      <span class="tag-pill">Java OOP</span>
      <span class="tag-pill">Databases</span>
      <span class="tag-pill accent">Artificial Intelligence</span>
      <span class="tag-pill">Software Engineering</span>
    </div>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">UNIVERSITAT POLITÈCNICA DE VALÈNCIA</h2>
      <span class="card-badge status-award">ERASMUS+ SCHOLAR</span>
    </div>
    <div class="card-meta">INFORMATICS ENGINEERING · ETSINF · VALENCIA, SPAIN · SPRING 2026</div>
    <p class="card-desc">
      Selected for a prestigious international academic exchange through the European Union's Erasmus+ program.
    </p>
    <p class="card-desc" style="margin-bottom:0;">
      Studied in an international engineering environment, gaining exposure to different academic approaches, advanced European technical perspectives, and collaborative technical experiences.
    </p>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">SPOKEN LANGUAGES</h2>
      <span class="card-badge">COMMUNICATION</span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;">
      <div style="padding:10px 14px; background:rgba(84,106,77,0.1); border-radius:3px; border:1px solid rgba(43,62,46,0.3);">
        <div style="font-family:'Archivo Black',sans-serif; font-size:14px; color:var(--dark-ink);">ARABIC</div>
        <div style="font-family:'Courier New',monospace; font-size:11px; font-weight:700; color:#243b29; margin-top:2px;">NATIVE PROFICIENCY</div>
      </div>
      <div style="padding:10px 14px; background:rgba(84,106,77,0.1); border-radius:3px; border:1px solid rgba(43,62,46,0.3);">
        <div style="font-family:'Archivo Black',sans-serif; font-size:14px; color:var(--dark-ink);">ENGLISH</div>
        <div style="font-family:'Courier New',monospace; font-size:11px; font-weight:700; color:#243b29; margin-top:2px;">B2 (EF SET CERTIFIED)</div>
      </div>
    </div>
  </div>

  <div class="channel-footer-nav">
    <button type="button" class="btn-back-home" data-select-channel="0">◀ Return to CH 01 (Home)</button>
    <button type="button" class="btn-card-link primary" data-select-channel="3">Next: CH 04 Skills →</button>
  </div>
</article>`,

  // CH 04: SKILLS
  3: `<article class="channel-view" aria-label="Technical skills transmission">
  <div class="channel-header-block">
    <span class="channel-eyebrow">CH 04 // TRANSMISSION: TECHNICAL ARSENAL</span>
    <h1 class="channel-main-title">TECHNICAL SKILLS</h1>
    <p class="channel-main-subtitle">Computer Science · Applied AI · Computer Vision · Infrastructure</p>
  </div>

  <div class="skills-grid">
    <div class="retro-card skill-card">
      <h2 class="skill-category-title">PROGRAMMING &amp; COMPUTER SCIENCE</h2>
      <p class="card-desc">Algorithmic foundations, object-oriented paradigms, and system programming.</p>
      <div class="tag-cloud">
        <span class="tag-pill accent">C++</span>
        <span class="tag-pill accent">Python fundamentals</span>
        <span class="tag-pill">Java OOP</span>
        <span class="tag-pill">SQL</span>
        <span class="tag-pill">Algorithms</span>
        <span class="tag-pill">Data Structures</span>
        <span class="tag-pill">Object-Oriented Programming</span>
      </div>
    </div>

    <div class="retro-card skill-card">
      <h2 class="skill-category-title">APPLIED AI &amp; INTELLIGENT SYSTEMS</h2>
      <p class="card-desc">Autonomous tool routing, learning graph design, and source-grounded models.</p>
      <div class="tag-cloud">
        <span class="tag-pill accent">LLM Integration</span>
        <span class="tag-pill accent">AI Agents</span>
        <span class="tag-pill">Tool-Using Assistants</span>
        <span class="tag-pill">Source-Grounded Generation</span>
        <span class="tag-pill">Learning Graph Design</span>
        <span class="tag-pill">Machine Learning Experiments</span>
        <span class="tag-pill">Python Data Analysis</span>
      </div>
    </div>

    <div class="retro-card skill-card">
      <h2 class="skill-category-title">COMPUTER VISION &amp; 3D</h2>
      <p class="card-desc">Photogrammetric Structure from Motion, neural splatting, and camera estimation.</p>
      <div class="tag-cloud">
        <span class="tag-pill accent">COLMAP</span>
        <span class="tag-pill accent">Structure from Motion</span>
        <span class="tag-pill accent">3D Gaussian Splatting</span>
        <span class="tag-pill">Feature Matching</span>
        <span class="tag-pill">Camera Pose Estimation</span>
        <span class="tag-pill">Reconstruction Evaluation</span>
      </div>
    </div>

    <div class="retro-card skill-card">
      <h2 class="skill-category-title">SOFTWARE DEVELOPMENT</h2>
      <p class="card-desc">Modern full-stack web architectures, relational databases, and clean APIs.</p>
      <div class="tag-cloud">
        <span class="tag-pill accent">TypeScript</span>
        <span class="tag-pill">PostgreSQL</span>
        <span class="tag-pill">MySQL</span>
        <span class="tag-pill">SQLite</span>
        <span class="tag-pill">REST API Concepts</span>
        <span class="tag-pill">Git &amp; GitHub</span>
        <span class="tag-pill">AI-Assisted Development</span>
        <span class="tag-pill">Application Architecture</span>
      </div>
    </div>

    <div class="retro-card skill-card">
      <h2 class="skill-category-title">CLOUD &amp; INFRASTRUCTURE</h2>
      <p class="card-desc">Cloud architecture fundamentals, deployment configuration, and edge services.</p>
      <div class="tag-cloud">
        <span class="tag-pill accent">AWS Cloud Fundamentals</span>
        <span class="tag-pill">Deployment Configuration</span>
        <span class="tag-pill">Cloudflare</span>
        <span class="tag-pill">Vercel</span>
        <span class="tag-pill">Linux / WSL</span>
        <span class="tag-pill">Docker Workflow Exposure</span>
      </div>
    </div>

    <div class="retro-card skill-card" style="border-style:dashed;">
      <h2 class="skill-category-title">CURRENTLY LEARNING &amp; EXPANDING</h2>
      <p class="card-desc">Expanding technical horizons into enterprise backends and distributed computing.</p>
      <div class="tag-cloud">
        <span class="tag-pill">C#</span>
        <span class="tag-pill">ASP.NET</span>
        <span class="tag-pill">Java Concurrency</span>
        <span class="tag-pill">Parallel Programming</span>
        <span class="tag-pill">Cloud Infrastructure</span>
      </div>
    </div>
  </div>

  <div class="channel-footer-nav">
    <button type="button" class="btn-back-home" data-select-channel="0">◀ Return to CH 01 (Home)</button>
    <button type="button" class="btn-card-link primary" data-select-channel="4">Next: CH 05 Projects →</button>
  </div>
</article>`,

  // CH 05: PROJECTS
  4: `<article class="channel-view" aria-label="Selected projects transmission">
  <div class="channel-header-block">
    <span class="channel-eyebrow">CH 05 // TRANSMISSION: SELECTED PROJECTS</span>
    <h1 class="channel-main-title">SELECTED PROJECTS</h1>
    <p class="channel-main-subtitle">Adaptive AI Systems · 3D Neural Reconstruction · Event Web Platforms · Games</p>
  </div>

  <!-- 01. BandUp -->
  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">01. BANDUP</h2>
      <span class="card-badge status-research">ACTIVE R&amp;D</span>
    </div>
    <div class="card-meta">GRAPH-DRIVEN ADAPTIVE AI LEARNING · APPLIED AI · EDTECH</div>
    <p class="card-desc">
      BandUp is an IELTS Academic learning platform exploring a more adaptive approach to AI-powered education. Instead of treating AI as a simple question-answering chatbot, the platform is designed around guided learning paths, interactive exercises, and conversational tutoring.
    </p>
    <div class="metric-callout">
      <span class="metric-stat">RESEARCH DIRECTION: LEARNING GRAPH</span>
      <span class="metric-label">DYNAMIC PREREQUISITE BRANCHING &amp; PEDAGOGICAL DECISION MAKING</span>
    </div>
    <p class="card-desc">
      The proposed graph represents learning objectives, prerequisite relationships, concepts, and common misconceptions. When a student struggles with a concept, the tutor temporarily branches into prerequisite material, provides interactive explanations, assesses understanding, and returns to the original objective.
    </p>
    <ul class="card-bullets">
      <li><strong>Graph-Based Learning Representation:</strong> Modeling educational concepts and their dependencies through structured relationships.</li>
      <li><strong>Adaptive Conversational Branching:</strong> Dynamically navigating learning objectives while maintaining instructional coherence.</li>
      <li><strong>Student Modeling:</strong> Real-time detection of learner misconceptions to guide subsequent instruction.</li>
      <li><strong>Source-Grounded AI Tutoring:</strong> Workflows where claims can be traced to supporting educational materials.</li>
    </ul>
    <div class="tag-cloud">
      <span class="tag-pill accent">IELTS Academic</span>
      <span class="tag-pill">Learning Graphs</span>
      <span class="tag-pill">AI Tutoring</span>
      <span class="tag-pill">Conversational Lessons</span>
      <span class="tag-pill">Skill Assessment</span>
    </div>
    <div class="card-actions">
      <a href="https://bandup.khalils.codes" target="_blank" rel="noopener noreferrer" class="btn-card-link primary">Visit BandUp Website ↗</a>
    </div>
  </div>

  <!-- 02. Makan -->
  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">02. MAKAN</h2>
      <span class="card-badge">EXPERIMENTAL</span>
    </div>
    <div class="card-meta">PHONE VIDEO TO 3D RECONSTRUCTION · COMPUTER VISION · NEURAL RENDERING</div>
    <p class="card-desc">
      Makan explores how ordinary smartphone footage can be transformed into realistic, navigable 3D representations of interior spaces by combining camera pose estimation, geometric reconstruction, and neural rendering.
    </p>
    <div class="metric-callout">
      <span class="metric-stat">318 / 318 IMAGES REGISTERED</span>
      <span class="metric-label">0.88-PIXEL REPROJECTION ERROR IN TESTED SEQUENCE</span>
    </div>
    <ul class="card-bullets">
      <li>COLMAP workflow for Structure from Motion and accurate camera reconstruction.</li>
      <li>3D Gaussian Splatting for photorealistic real-time neural scene rendering.</li>
      <li>Frame extraction, preprocessing, and feature matching experimentation.</li>
      <li>Exploring hybrid walkthrough experiences combining 360° visual inspection with spatial geometry.</li>
    </ul>
    <div class="tag-cloud">
      <span class="tag-pill accent">COLMAP</span>
      <span class="tag-pill accent">3D Gaussian Splatting</span>
      <span class="tag-pill">Structure from Motion</span>
      <span class="tag-pill">Pose Estimation</span>
    </div>
  </div>

  <!-- 03. ROOMS by Vision -->
  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">03. ROOMS BY VISION</h2>
      <span class="card-badge status-award">3RD PLACE REPLIT AI HACKATHON</span>
    </div>
    <div class="card-meta">COMPETITIVE &amp; INTERACTIVE LEARNING · EDTECH · 2026</div>
    <p class="card-desc">
      Transforms studying into a more interactive and social experience through learning challenges, games, and competition between friends. Explores how playful interaction and competitive mechanics encourage active participation.
    </p>
    <ul class="card-bullets">
      <li>Interactive learning challenges and multiplayer study quests.</li>
      <li>Game-based studying experiences and collaborative motivation.</li>
      <li>AI-assisted educational feedback loop.</li>
      <li><strong>Achievement:</strong> Awarded Third Place — Replit AI Hackathon, 2026 (Team project).</li>
    </ul>
    <div class="tag-cloud">
      <span class="tag-pill accent">Hackathon Award</span>
      <span class="tag-pill">Gamified EdTech</span>
      <span class="tag-pill">Interactive Software</span>
    </div>
  </div>

  <!-- 04. Futureing -->
  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">04. FUTUREING</h2>
      <span class="card-badge">PRIVATE PROTOTYPE</span>
    </div>
    <div class="card-meta">A PERSONAL AI OPERATING SYSTEM · AI AGENTS · LOCAL-FIRST</div>
    <p class="card-desc">
      A private AI-powered personal organization application exploring how a conversational assistant can interact with structured personal data and trigger controlled application operations.
    </p>
    <ul class="card-bullets">
      <li>Built around the AI companion agent "Vision" for a unified conversational interface.</li>
      <li>Expo-based mobile architecture with local-first SQLite persistence.</li>
      <li>Gemini integration for conversational intelligence and reasoning.</li>
      <li>Shared action layer connecting user requests to application functions.</li>
      <li>Tool-based execution of structured commands with persistent memory.</li>
    </ul>
    <div class="tag-cloud">
      <span class="tag-pill accent">Expo</span>
      <span class="tag-pill accent">SQLite</span>
      <span class="tag-pill">Gemini</span>
      <span class="tag-pill">AI Agents</span>
      <span class="tag-pill">Tool Routing</span>
    </div>
  </div>

  <!-- 05. NASA Space Apps -->
  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">05. NASA SPACE APPS</h2>
      <span class="card-badge status-live">DELIVERED</span>
    </div>
    <div class="card-meta">EVENT WEBSITE &amp; REGISTRATION SYSTEM · WEB DEVELOPMENT · PRODUCTION</div>
    <p class="card-desc">
      Developed an event website supporting real participant registration and communications for a major regional NASA Space Apps event.
    </p>
    <div class="metric-callout">
      <span class="metric-stat">85+ TEAMS · 380+ PARTICIPANTS</span>
      <span class="metric-label">HIGH-VOLUME LIVE WORKFLOW AND ZERO REGISTRATION DOWNTIME</span>
    </div>
    <div class="tag-cloud">
      <span class="tag-pill">Event Web Experience</span>
      <span class="tag-pill">Registration Workflow</span>
      <span class="tag-pill">Production Deployment</span>
    </div>
  </div>

  <!-- 06. Space Day -->
  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">06. SPACE DAY</h2>
      <span class="card-badge status-live">DELIVERED</span>
    </div>
    <div class="card-meta">DIGITAL PASSPORT &amp; EVENT MANAGEMENT · TYPESCRIPT · POSTGRESQL · DRIZZLE</div>
    <p class="card-desc">
      Developed a digital passport system to help participants and organizers manage event progression across stations, instructor approvals, and digital completion certificates.
    </p>
    <ul class="card-bullets">
      <li>Participant registration and group management.</li>
      <li>Station progression tracking and instructor approval workflows.</li>
      <li>Completion verification and automated PDF completion certificates.</li>
      <li>Organizer-facing administrative management dashboard.</li>
    </ul>
    <div class="tag-cloud">
      <span class="tag-pill accent">TypeScript</span>
      <span class="tag-pill accent">PostgreSQL</span>
      <span class="tag-pill">Drizzle ORM</span>
      <span class="tag-pill">PDF Engine</span>
    </div>
  </div>

  <!-- Additional Experiments -->
  <div class="retro-card" style="background:rgba(245, 241, 230, 0.7); border-style:dashed;">
    <div class="card-header-row">
      <h2 class="card-title">MORE EXPERIMENTS &amp; BUILDS</h2>
      <span class="card-badge">LAB RELEASES</span>
    </div>

    <div style="margin-bottom:16px;">
      <div style="font-family:'Archivo Black',sans-serif; font-size:14px; color:var(--dark-ink);">ASAD MATH — DIGITAL MATHEMATICS PLATFORM</div>
      <p class="card-desc" style="margin:4px 0 6px 0;">
        Built an Arabic-language educational platform for Grade 12 mathematics students in Oman with student enrollment, payment approvals, protected video lessons, quizzes, PDFs, and administrative workflows.
      </p>
      <div class="tag-cloud">
        <span class="tag-pill">EdTech</span>
        <span class="tag-pill">Full-Stack</span>
        <span class="tag-pill">Arabic UI</span>
        <span class="tag-pill">Video Streaming</span>
      </div>
    </div>

    <div style="border-top:1px dashed rgba(34,58,43,0.3); padding-top:12px;">
      <div style="font-family:'Archivo Black',sans-serif; font-size:14px; color:var(--dark-ink);">ABYSS OF THE LOSS — 2D PSYCHOLOGICAL HORROR GAME</div>
      <p class="card-desc" style="margin:4px 0 8px 0;">
        A 2D psychological horror experience developed with Godot. Explores atmospheric storytelling, character state animations, interactive doors, lighting changes, and mystery-driven exploration.
      </p>
      <div class="tag-cloud" style="margin-bottom:10px;">
        <span class="tag-pill accent">Godot Engine</span>
        <span class="tag-pill accent">GDScript</span>
        <span class="tag-pill">Interactive Story</span>
      </div>
      <div class="card-actions">
        <a href="https://khalilamustafa.github.io/Abyss-of-the-Loss/" target="_blank" rel="noopener noreferrer" class="btn-card-link primary">Play Web Build ↗</a>
        <a href="https://github.com/khalilAmustafa/Abyss-of-the-Loss" target="_blank" rel="noopener noreferrer" class="btn-card-link secondary">View GitHub ↗</a>
      </div>
    </div>
  </div>

  <div class="channel-footer-nav">
    <button type="button" class="btn-back-home" data-select-channel="0">◀ Return to CH 01 (Home)</button>
    <button type="button" class="btn-card-link primary" data-select-channel="5">Next: CH 06 Certifications →</button>
  </div>
</article>`,

  // CH 06: CERTIFICATIONS
  5: `<article class="channel-view" aria-label="Certifications transmission">
  <div class="channel-header-block">
    <span class="channel-eyebrow">CH 06 // TRANSMISSION: CERTIFICATIONS &amp; ACHIEVEMENTS</span>
    <h1 class="channel-main-title">HONORS &amp; CREDENTIALS</h1>
    <p class="channel-main-subtitle">Cloud Architecture · Hackathon Honors · Academic Awards · Contests</p>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">AWS CERTIFIED CLOUD PRACTITIONER</h2>
      <span class="card-badge status-live">MAY 2026</span>
    </div>
    <div class="card-meta">AMAZON WEB SERVICES (AWS) · GLOBAL CLOUD CERTIFICATION</div>
    <p class="card-desc">
      Demonstrated foundational knowledge of AWS cloud services, architecture, security, compliance, pricing models, and cloud infrastructure deployment principles.
    </p>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">THIRD PLACE — REPLIT AI HACKATHON</h2>
      <span class="card-badge status-award">GLOBAL COMPETITION WINNER</span>
    </div>
    <div class="card-meta">ROOMS BY VISION · REPLIT GLOBAL AI HACKATHON · 2026</div>
    <p class="card-desc">
      Achieved 3rd place in an international AI hackathon as part of the team behind ROOMS, recognized for innovative AI-guided interactive learning mechanisms.
    </p>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">ERASMUS+ INTERNATIONAL EXCHANGE SCHOLAR</h2>
      <span class="card-badge status-award">SPRING 2026</span>
    </div>
    <div class="card-meta">UNIVERSITAT POLITÈCNICA DE VALÈNCIA · ETSINF · VALENCIA, SPAIN</div>
    <p class="card-desc">
      Competitively selected for an international European Union academic exchange to study Informatics Engineering in Valencia, Spain.
    </p>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">COMPETITIVE PROGRAMMING &amp; PROBLEM SOLVING</h2>
      <span class="card-badge">COLLEGIATE CONTESTS</span>
    </div>
    <p class="card-desc">
      Active competitor in collegiate algorithmic contests and timed technical problem-solving competitions:
    </p>
    <ul class="card-bullets">
      <li><strong>Amman CPC 2025:</strong> Contestant in the Collegiate Programming Contest.</li>
      <li><strong>IEEEXtreme 19.0:</strong> 24-hour virtual competitive programming challenge participant.</li>
      <li><strong>ASU Coding Club:</strong> Active member engaged in technical mentoring and competitive practice.</li>
      <li><strong>Hackathons:</strong> AI Week Hackathon 2025, Hack Ramadan Jordan 2026, UNI Agents Hackathon 2025.</li>
    </ul>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">PROFESSIONAL SPECIALIZATIONS &amp; CERTIFICATES</h2>
      <span class="card-badge">CONTINUOUS RIGOR</span>
    </div>
    
    <div style="margin-bottom:12px;">
      <div style="font-family:'Archivo Black',sans-serif; font-size:12.5px; color:var(--forest);">IBM / COURSERA — DATA SCIENCE &amp; PYTHON</div>
      <div class="tag-cloud">
        <span class="tag-pill">Python for Data Science, AI &amp; Dev</span>
        <span class="tag-pill">Data Analysis with Python</span>
        <span class="tag-pill">Databases and SQL for Data Science</span>
        <span class="tag-pill">Python Project for Data Science</span>
        <span class="tag-pill">Data Visualization</span>
        <span class="tag-pill">Data Science Methodology</span>
      </div>
    </div>

    <div style="margin-bottom:12px;">
      <div style="font-family:'Archivo Black',sans-serif; font-size:12.5px; color:var(--forest);">GOOGLE / COURSERA — DATA FOUNDATIONS</div>
      <div class="tag-cloud">
        <span class="tag-pill">Foundations: Data, Data, Everywhere</span>
        <span class="tag-pill">Ask Questions to Make Data Decisions</span>
        <span class="tag-pill">Prepare Data for Exploration</span>
      </div>
    </div>

    <div>
      <div style="font-family:'Archivo Black',sans-serif; font-size:12.5px; color:var(--forest);">META &amp; AWS</div>
      <div class="tag-cloud">
        <span class="tag-pill">Introduction to Front-End Development (Meta)</span>
        <span class="tag-pill">AWS Cloud Practitioner Essentials (AWS)</span>
      </div>
    </div>
  </div>

  <div class="channel-footer-nav">
    <button type="button" class="btn-back-home" data-select-channel="0">◀ Return to CH 01 (Home)</button>
    <button type="button" class="btn-card-link primary" data-select-channel="6">Next: CH 07 Contact →</button>
  </div>
</article>`,

  // CH 07: CONTACT
  6: `<article class="channel-view" aria-label="Contact transmission">
  <div class="channel-header-block">
    <span class="channel-eyebrow">CH 07 // TRANSMISSION: DIRECT CONTACT</span>
    <h1 class="channel-main-title">LET'S BUILD SOMETHING.</h1>
    <p class="channel-main-subtitle">Have an interesting problem? Open to collaborations, engineering roles &amp; technical builds.</p>
  </div>

  <div class="retro-card">
    <div class="card-header-row">
      <h2 class="card-title">OPEN FOR OPPORTUNITIES</h2>
      <span class="card-badge status-live">ACTIVE CHANNEL</span>
    </div>
    <p class="card-desc">
      I'm interested in opportunities where I can apply my technical background, contribute to meaningful projects, and keep developing as an engineer.
    </p>
    <p class="card-desc">
      <strong>Primary Focus Areas:</strong> Applied AI Engineering · AI Solutions · Software Development · Cloud &amp; Infrastructure · Research-Oriented Engineering.
    </p>
    <p class="card-desc" style="margin-bottom:0;">
      Open to internships, junior engineering opportunities, remote collaborations, and interesting technical projects.
    </p>
  </div>

  <div class="contact-grid">
    <a href="mailto:khalil.mustafa.work@gmail.com" class="contact-tile">
      <span class="contact-tile-label">DIRECT EMAIL</span>
      <span class="contact-tile-val">khalil.mustafa.work@gmail.com</span>
      <span class="contact-tile-icon">✉ Send Message ↗</span>
    </a>

    <a href="https://github.com/khalilAmustafa" target="_blank" rel="noopener noreferrer" class="contact-tile">
      <span class="contact-tile-label">CODE REPOSITORIES</span>
      <span class="contact-tile-val">github.com/khalilAmustafa</span>
      <span class="contact-tile-icon">⌘ Open GitHub ↗</span>
    </a>

    <a href="https://linkedin.com/in/khalil-mustafa-7722382b0" target="_blank" rel="noopener noreferrer" class="contact-tile">
      <span class="contact-tile-label">PROFESSIONAL NETWORK</span>
      <span class="contact-tile-val">LinkedIn Profile</span>
      <span class="contact-tile-icon">⚲ Connect on LinkedIn ↗</span>
    </a>

    <div class="contact-tile" style="cursor:default;">
      <span class="contact-tile-label">LOCATION &amp; TIMEZONE</span>
      <span class="contact-tile-val">Amman, Jordan (GMT+3)</span>
      <span class="contact-tile-icon">🌐 Available for Remote Work</span>
    </div>
  </div>

  <div class="retro-card" style="text-align:center; padding:18px;">
    <div style="font-family:'Archivo Black',sans-serif; font-size:16px; color:var(--dark-ink); margin-bottom:4px;">KHALIL ASAD MUSTAFA</div>
    <div style="font-family:'Courier New',monospace; font-size:11px; font-weight:700; color:#243b29; letter-spacing:0.08em;">BUILDING · EXPERIMENTING · LEARNING</div>
    <div style="font-family:'Courier New',monospace; font-size:9.5px; color:#556653; margin-top:8px;">© 2026 KHALIL ASAD MUSTAFA. ALL RIGHTS RESERVED.</div>
  </div>

  <div class="channel-footer-nav">
    <button type="button" class="btn-back-home" data-select-channel="0">◀ Return to CH 01 (Home)</button>
    <button type="button" class="btn-card-link secondary" data-select-channel="4">Review Projects (CH 05)</button>
  </div>
</article>`
};

function showVisionQuote(customText=null,duration=4200){
  const bubble=$('#speech-bubble');
  const bubbleText=$('#bubble-text');
  const character=$('#character-vision');
  if(!bubble||!bubbleText)return;

  const quote=customText||visionQuotes[(currentQuoteIdx=(currentQuoteIdx+1)%visionQuotes.length)];
  const lines=quote.split('\n');
  bubbleText.innerHTML=lines.map(line=>`<span>${line}</span>`).join('');

  bubble.classList.remove('is-active');
  void bubble.offsetWidth;
  bubble.classList.add('is-active');
  bubble.setAttribute('aria-hidden','false');
  character?.setAttribute('aria-expanded','true');

  character?.classList.remove('is-reacting');
  void character?.offsetWidth;
  character?.classList.add('is-reacting');
  setTimeout(()=>character?.classList.remove('is-reacting'),320);

  clearTimeout(bubbleTimer);
  bubbleTimer=setTimeout(()=>{
    hideVisionQuote();
  },duration);
}

function hideVisionQuote(){
  const bubble=$('#speech-bubble');
  const character=$('#character-vision');
  if(!bubble)return;
  bubble.classList.remove('is-active');
  bubble.setAttribute('aria-hidden','true');
  character?.setAttribute('aria-expanded','false');
  clearTimeout(bubbleTimer);
}

channels.forEach((name,i)=>{
  const button=document.createElement('button');
  button.className='channel-button';
  button.dataset.channel=i;
  button.setAttribute('aria-label',`Channel ${i+1}: ${name}`);
  button.innerHTML=`<span class="button-led" aria-hidden="true"></span><span class="number">${pad(i+1)}</span><span>${name.toUpperCase()}</span>`;
  button.addEventListener('click',()=>select(i));
  $('#channel-buttons').append(button);
  const mark=document.createElement('span');
  mark.className='dial-mark';
  mark.style.setProperty('--angle',`${-135+i*45}deg`);
  mark.textContent=i+1;
  $('#dial-marks').append(mark);
});

for(let i=0;i<15;i++)$('#volume-bars').append(document.createElement('i'));

function clickSound(power=false){
  if(!volume)return;
  try{
    audio??=new(window.AudioContext||window.webkitAudioContext)();
    audio.resume().catch(()=>{});
    const oscillator=audio.createOscillator(),gain=audio.createGain();
    oscillator.type=power?'sine':'triangle';
    oscillator.frequency.setValueAtTime(power?180:650,audio.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(power?60:110,audio.currentTime+.055);
    gain.gain.setValueAtTime(volume/100*.13,audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.07);
    oscillator.connect(gain);
    gain.connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime+.08);
  }catch{}
}

function render(){
  dial.style.transform=`rotate(${-135+channel*45}deg)`;
  dial.setAttribute('aria-valuenow',channel+1);
  dial.setAttribute('aria-valuetext',channels[channel]);
  document.querySelectorAll('.dial-mark').forEach((m,i)=>m.classList.toggle('active',i===channel));
  document.querySelectorAll('.channel-button').forEach((b,i)=>b.setAttribute('aria-pressed',i===channel));
  $('#channel-tag').textContent=`CH ${pad(channel+1)}`;
  tv.classList.toggle('is-off',!powered);
  $('#power').setAttribute('aria-checked',powered);
  $('#phosphor').inert=!powered;
  $('#status').textContent=powered?`Channel ${channel+1}: ${channels[channel]}`:'Television off';
  document.title=channel===0?`Khalil Asad Mustafa — Personal Channel`:`${channels[channel]} — Personal Channel`;
  
  const content=$('#screen-content');
  if(channel===0){
    content.innerHTML=homeTemplate;
    $('#btn-explore')?.addEventListener('click',()=>select(4));

    const charEl=$('#character-vision');
    if(charEl){
      charEl.addEventListener('click',e=>{
        e.stopPropagation();
        showVisionQuote();
      });
      charEl.addEventListener('keydown',e=>{
        if(e.key==='Enter'||e.key===' '){
          e.preventDefault();
          showVisionQuote();
        }
      });
    }

    const bubbleEl=$('#speech-bubble');
    if(bubbleEl){
      bubbleEl.addEventListener('click',e=>{
        e.stopPropagation();
        hideVisionQuote();
      });
    }

    content.addEventListener('click',e=>{
      if(!e.target.closest('#character-vision')&&!e.target.closest('#speech-bubble')){
        hideVisionQuote();
      }
    });

    if(!initialIntroShown&&powered){
      initialIntroShown=true;
      setTimeout(()=>{
        if(channel===0&&powered){
          showVisionQuote("HEY!\nI'M VISION.", 4000);
        }
      }, 500);
    }
  }else{
    hideVisionQuote();
    content.innerHTML = channelTemplates[channel] || `
      <div class="channel-placeholder" aria-live="polite" aria-atomic="true">
        <span class="eyebrow">NOW TUNED TO · CH ${pad(channel+1)}</span>
        <h1 id="channel-title">${channels[channel]}</h1>
        <span class="channel-rule"></span>
        <p class="placeholder-desc">Broadcast transmission arriving soon.</p>
        <button type="button" class="btn-back-home" data-select-channel="0">◀ Return to CH 01 (Home)</button>
      </div>`;
    content.querySelectorAll('[data-select-channel]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetCh = parseInt(btn.getAttribute('data-select-channel'), 10);
        select(targetCh);
      });
    });
  }
}

function select(next){
  next=((next%7)+7)%7;
  if(next===channel)return;
  channel=next;
  render();
  $('#screen-content').scrollTop=0;
  if(powered){
    clickSound();
    if(!reduced.matches){
      const t=$('#tuning');
      t.classList.remove('active');
      void t.offsetWidth;
      t.classList.add('active');
      clearTimeout(tuneTimer);
      tuneTimer=setTimeout(()=>t.classList.remove('active'),250);
    }
  }
}
window.select=select;

$('#power').addEventListener('click',()=>{
  powered=!powered;
  $('#tuning').classList.remove('active');
  clearTimeout(tuneTimer);
  clickSound(true);
  render();
});

$('#blank-toggle').addEventListener('click',()=>{
  const blank=tv.classList.toggle('is-blank');
  $('#blank-toggle').setAttribute('aria-pressed',blank);
  $('#blank-toggle').textContent=blank?'SHOW CHANNEL':'BLANK SCREEN';
});

function setVolume(value){
  volume=Math.max(0,Math.min(100,Math.round(value)));
  $('#volume').value=volume;
  $('#volume-label').textContent=volume?`${volume}%`:'OFF';
  knob.style.transform=`rotate(${-135+volume*2.7}deg)`;
  knob.setAttribute('aria-valuenow',volume);
  knob.setAttribute('aria-valuetext',volume?`${volume} percent`:'Muted');
  $('#volume-value').textContent=pad(volume);
  document.querySelectorAll('.volume-bars i').forEach((b,i)=>b.classList.toggle('on',i<Math.round(volume/100*15)));
  if(powered){
    $('#volume-osd').classList.add('visible');
    clearTimeout(volumeTimer);
    volumeTimer=setTimeout(()=>$('#volume-osd').classList.remove('visible'),1200);
  }
}

$('#volume').addEventListener('input',e=>{setVolume(e.target.value);clickSound()});

function keys(element,get,set,min,max,step=1){
  element.addEventListener('keydown',e=>{
    let value=get();
    if(['ArrowRight','ArrowUp'].includes(e.key))value+=step;
    else if(['ArrowLeft','ArrowDown'].includes(e.key))value-=step;
    else if(e.key==='Home')value=min;
    else if(e.key==='End')value=max;
    else return;
    e.preventDefault();
    set(value);
  });
}
keys(dial,()=>channel,select,0,6);
keys(knob,()=>volume,v=>{setVolume(v);clickSound()},0,100,5);

let wheelAt=0;
dial.addEventListener('wheel',e=>{
  e.preventDefault();
  if(Date.now()-wheelAt<130)return;
  wheelAt=Date.now();
  select(channel+(e.deltaY>0?1:-1));
},{passive:false});

knob.addEventListener('wheel',e=>{
  e.preventDefault();
  setVolume(volume+(e.deltaY>0?-5:5));
  clickSound();
},{passive:false});

function rotary(element,get,set,anglePerUnit){
  let drag=null;
  element.addEventListener('pointerdown',e=>{
    if(e.button!==0)return;
    const rect=element.getBoundingClientRect();
    const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
    drag={x,y,angle:Math.atan2(e.clientY-y,e.clientX-x)*180/Math.PI,value:get(),travel:0};
    element.setPointerCapture(e.pointerId);
    element.focus();
    e.preventDefault();
  });
  element.addEventListener('pointermove',e=>{
    if(!drag)return;
    const angle=Math.atan2(e.clientY-drag.y,e.clientX-drag.x)*180/Math.PI;
    let delta=angle-drag.angle;
    if(delta>180)delta-=360;
    if(delta<-180)delta+=360;
    drag.travel+=delta;
    drag.angle=angle;
    set(Math.round(drag.value+drag.travel/anglePerUnit));
  });
  const stop=()=>{drag=null};
  element.addEventListener('pointerup',stop);
  element.addEventListener('pointercancel',stop);
  element.addEventListener('lostpointercapture',stop);
}
rotary(dial,()=>channel,select,45);
rotary(knob,()=>volume,setVolume,2.7);

/* --- AUTHENTIC CRT RENDERING ENGINE & QUALITY PRESETS --- */
const crtPresets = ['authentic', 'performance', 'off'];
let currentCrtPreset = 'authentic';

function generateCrtBarrelMap() {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Bayer 4x4 matrix for ordered dither to prevent 8-bit quantization banding
  const bayer = [
    [  0/16,  8/16,  2/16, 10/16 ],
    [ 12/16,  4/16, 14/16,  6/16 ],
    [  3/16, 11/16,  1/16,  9/16 ],
    [ 15/16,  7/16, 13/16,  5/16 ]
  ];

  // Separable CRT-Lottes Warp Model:
  // dx depends on ny^2, dy depends on nx^2.
  // This guarantees characters along the same row share identical vertical displacement.
  const warpX = 0.065;
  const warpY = 0.080;
  const maxDisp = 0.10;

  for (let y = 0; y < size; y++) {
    const ny = (y / (size - 1)) * 2 - 1;
    const ny2 = ny * ny;
    const bRow = bayer[y & 3];

    for (let x = 0; x < size; x++) {
      const nx = (x / (size - 1)) * 2 - 1;
      const nx2 = nx * nx;

      const dx = nx * ny2 * warpX;
      const dy = ny * nx2 * warpY;

      const dither = (bRow[x & 3] - 0.5);
      const rVal = Math.round(128 + (dx / maxDisp) * 127 + dither);
      const gVal = Math.round(128 + (dy / maxDisp) * 127 + dither);

      const idx = (y * size + x) * 4;
      data[idx]     = Math.max(0, Math.min(255, rVal)); // Red = X displacement
      data[idx + 1] = Math.max(0, Math.min(255, gVal)); // Green = Y displacement
      data[idx + 2] = 128;                              // Blue = neutral
      data[idx + 3] = 255;                              // Alpha
    }
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

function updateCrtScale() {
  const feDisp = document.getElementById('fe-crt-disp');
  if (feDisp) {
    const isMobile = window.innerWidth <= 760;
    feDisp.setAttribute('scale', isMobile ? '8' : '14');
  }
}

function applyCrtPreset(preset, save = true) {
  if (!crtPresets.includes(preset)) preset = 'authentic';
  currentCrtPreset = preset;
  if (save) {
    try { localStorage.setItem('khalil_crt_preset', preset); } catch {}
  }

  tv.classList.remove('tv-crt-authentic', 'tv-crt-performance', 'tv-crt-off');
  tv.classList.add(`tv-crt-${preset}`);

  const label = $('#crt-preset-label');
  if (label) label.textContent = preset.toUpperCase();

  const btn = $('#crt-preset-toggle');
  if (btn) btn.setAttribute('aria-label', `CRT Quality Preset: ${preset}`);

  updateCrtScale();
}

function cycleCrtPreset() {
  const nextIdx = (crtPresets.indexOf(currentCrtPreset) + 1) % crtPresets.length;
  applyCrtPreset(crtPresets[nextIdx]);
  clickSound();
}

function initCrtRenderer() {
  try {
    const mapUri = generateCrtBarrelMap();
    const feImg = document.getElementById('fe-crt-barrel-map');
    if (feImg) {
      feImg.setAttribute('href', mapUri);
      feImg.setAttribute('preserveAspectRatio', 'none');
    }
  } catch (err) {
    console.warn('CRT barrel map generation error:', err);
  }

  let savedPreset = 'authentic';
  const urlParam = new URLSearchParams(window.location.search).get('preset');
  if (urlParam && crtPresets.includes(urlParam.toLowerCase())) {
    savedPreset = urlParam.toLowerCase();
  } else {
    try {
      const stored = localStorage.getItem('khalil_crt_preset');
      if (stored && crtPresets.includes(stored)) savedPreset = stored;
    } catch {}
  }

  // Honor reduced motion if set
  if (reduced.matches && savedPreset === 'authentic') {
    savedPreset = 'performance';
  }

  applyCrtPreset(savedPreset, false);

  $('#crt-preset-toggle')?.addEventListener('click', cycleCrtPreset);
  window.addEventListener('resize', updateCrtScale);
}

initCrtRenderer();
render();
setVolume(0);
$('#volume-osd').classList.remove('visible');
