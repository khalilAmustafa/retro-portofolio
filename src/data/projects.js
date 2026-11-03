export const VALID_PROJECT_STATUSES = [
  'delivered',
  'active',
  'in-development',
  'r-and-d',
  'prototype',
  'experimental',
  'archived'
];

export const PROJECT_FILTERS = [
  { id: 'All', label: 'ALL WORK' },
  { id: 'Shipped', label: 'SHIPPED' },
  { id: 'Systems', label: 'SYSTEMS' },
  { id: 'Applied AI', label: 'APPLIED AI' },
  { id: 'Experiments', label: 'EXPERIMENTS' }
];

export const projects = [
  {
    id: 'rooms',
    title: 'ROOMS by VISION',
    tagline: 'Multiplayer study challenges and AI-assisted peer learning rooms.',
    categories: ['Shipped', 'Applied AI'],
    status: 'active',
    statusLabel: '3RD PLACE · REPLIT AI HACKATHON',
    statusTone: 'award',
    featured: true,
    summary:
      'Turns solitary revision into shared multiplayer study challenges, timed quiz rounds, and AI-guided feedback between friends.',
    problem:
      'Studying alone with static notes or passive Q&A bots often loses momentum because learners lack pacing, friendly competition, and immediate structured practice.',
    personalRole:
      'Designed and implemented interactive challenge state transitions, structured AI prompt/feedback integration, and round progression logic.',
    teamOrEventContext:
      'Built collaboratively with the ROOMS by VISION hackathon team; awarded 3rd Place in the Replit AI Hackathon (2026). Gameplay video and pitch captures are shared team artifacts.',
    architecture: {
      title: 'Session & Challenge Flow',
      nodes: [
        { stage: 'Study Topic Input', detail: 'Host selects subject & round format' },
        { stage: 'Structured AI Generator', detail: 'Schema-validated quiz & hint prompts' },
        { stage: 'Shared Room State', detail: 'Synchronized round timer & answers' },
        { stage: 'Scoreboard & Review', detail: 'Live ranking + targeted explanation' }
      ],
      summary:
        'Separates question generation from deterministic round state so live quiz pacing stays predictable.'
    },
    engineeringDecision: {
      challenge:
        'Free-form LLM generation inside a timed multiplayer round risks malformed responses or slow turns between questions.',
      options:
        'Stream raw chat completions on every turn vs. pre-generate structured JSON challenge batches per round.',
      decision:
        'Used strict structured prompt schemas to prepare validated question/explanation payloads before starting the round timer.',
      outcome:
        'Kept round transitions snappy during live hackathon judging and prevented broken question cards.'
    },
    outcomes: [
      {
        text: 'Awarded 3rd Place — Replit AI Hackathon (2026) as part of the ROOMS by VISION team.',
        scope: 'Team award',
        evidenceId: 'replit-award-2026'
      }
    ],
    tech: ['TypeScript', 'Multiplayer Sessions', 'LLM Structured Outputs', 'Gamified EdTech'],
    media: [
      {
        src: 'assets/projects/rooms/gameplay-lobby-01.webp',
        alt: 'ROOMS by VISION Battle Arena live multiplayer match',
        caption: 'Battle Arena live match — fast correct answers earn combat loadouts',
        ready: true
      },
      {
        type: 'video',
        src: 'assets/projects/rooms/rooms-demo.mp4',
        poster: 'assets/projects/rooms/gameplay-lobby-01.webp',
        alt: 'ROOMS by VISION team gameplay demonstration video',
        caption: 'ROOMS team gameplay walkthrough',
        creditHref: 'https://rka14406.github.io/RKAs_portfolio/',
        creditLabel: 'Media source: Raed Khalil’s portfolio ↗',
        ready: true
      },
      {
        src: 'assets/projects/rooms/room-create-02.webp',
        alt: 'ROOMS room creation and game mode selector showing Classic Quiz, Battle Arena, Race, and Defense',
        caption: 'Actual capture · Room setup and 4 multiplayer study modes',
        ready: true
      },
      {
        src: 'assets/projects/rooms/arena-question-03.webp',
        alt: 'ROOMS by VISION Battle Arena timed quiz prompt',
        caption: 'Project presentation · Timed quiz card inside Battle Arena',
        ready: true
      },
      {
        src: 'assets/projects/rooms/invite-flow-04.webp',
        alt: 'ROOMS join code and invite link card',
        caption: 'Actual capture · Room code and instant peer invite link',
        ready: true
      }
    ],
    links: [
      {
        label: 'TEAM SHOWCASE ↗',
        href: 'https://rka14406.github.io/RKAs_portfolio/',
        type: 'demo'
      }
    ]
  },
  {
    id: 'nasa-space-apps',
    title: 'NASA Space Apps Event Platform',
    tagline: 'Regional hackathon website, MENA Space hub, and participant registration system.',
    categories: ['Shipped', 'Systems'],
    status: 'delivered',
    statusLabel: 'DELIVERED · LIVE SITE',
    statusTone: 'live',
    featured: true,
    summary:
      'Delivered the public event platform and registration workflow supporting NASA Space Apps Jordan (85+ teams, 380+ participants) alongside the MENA Space Organization web portal.',
    problem:
      'Regional organizers needed a dependable web hub to publish event tracks, validate team registrations on mobile and desktop, and coordinate bilingual announcements.',
    personalRole:
      'Personally built and deployed the NASA Space Apps Jordan event website and contributed to the MENA Space Organization web platform (`menaWebsite`).',
    teamOrEventContext:
      '85+ teams and 380+ participants represent the regional NASA Space Apps Jordan event scale served by the platform alongside local organizing staff.',
    architecture: {
      title: 'Registration & Event Hub Flow',
      nodes: [
        { stage: 'Public Event Portal', detail: 'Tracks, schedule & archive editions' },
        { stage: 'Validated Team Form', detail: 'Client + server field checks' },
        { stage: 'Registration Store', detail: 'Structured team & member records' },
        { stage: 'Organizer Roster', detail: 'Clean export & check-in readiness' }
      ],
      summary:
        'Prioritized fast mobile load times and strict input validation ahead of registration deadlines.'
    },
    engineeringDecision: {
      challenge:
        'Hackathon registrations cluster heavily in the final hours before deadlines, primarily from mobile links shared on social channels.',
      options:
        'Multi-page account portal with heavy client state vs. streamlined single-flow validated submission.',
      decision:
        'Implemented a concise, mobile-first registration workflow backed by server-side schema validation to reject malformed entries cleanly.',
      outcome:
        'Supported live participant registration and event communications across 85+ teams and 380+ participants.'
    },
    outcomes: [
      {
        text: 'Supported live registration workflow for NASA Space Apps Jordan (85+ teams, 380+ participants).',
        scope: 'Event scale',
        evidenceId: 'nasa-space-apps-event'
      },
      {
        text: 'Shipped bilingual MENA Space Organization web experience on Vercel with public source repository.',
        scope: 'Live platform',
        evidenceId: 'mena-org-platform'
      }
    ],
    tech: ['React / TypeScript', 'Form Validation', 'Bilingual Web', 'Vercel Deployment'],
    media: [
      {
        src: 'assets/projects/nasa-space-apps/landing-registration-01.webp',
        alt: 'NASA Space Apps Challenge Jordan live website hero section',
        caption: 'Live deployment (spaceapp-front.vercel.app) · Amman & Aqaba portal',
        ready: true
      },
      {
        src: 'assets/projects/nasa-space-apps/event-tracks-02.webp',
        alt: 'NASA Space Apps Jordan mission overview and local leadership section',
        caption: 'Live deployment · Mission briefing and regional event overview',
        ready: true
      },
      {
        src: 'assets/projects/nasa-space-apps/mena-platform-03.webp',
        alt: 'MENA Space Organization live website hero section',
        caption: 'Live deployment (mena-website.vercel.app) · MENA Space Organization hub',
        ready: true
      }
    ],
    links: [
      {
        label: 'LIVE EVENT SITE ↗',
        href: 'https://spaceapp-front.vercel.app/',
        type: 'demo'
      },
      {
        label: 'MENA ORG LIVE ↗',
        href: 'https://mena-website.vercel.app/',
        type: 'demo'
      },
      {
        label: 'MENA GITHUB ↗',
        href: 'https://github.com/khalilAmustafa/menaWebsite',
        type: 'github'
      }
    ]
  },
  {
    id: 'space-day',
    title: 'Space Day Digital Passport',
    tagline: 'Bilingual student passport, rotating QR station approvals, and PDF certificates.',
    categories: ['Shipped', 'Systems'],
    status: 'delivered',
    statusLabel: 'DELIVERED · WORKFLOW APP',
    statusTone: 'live',
    featured: true,
    summary:
      'Operational Next.js + Neon PostgreSQL web application tracking bilingual student sessions, 30-second rotating QR station approvals, and automated PDF completion certificates.',
    problem:
      'Tracking hundreds of attendees across physical activity stations with paper checklists creates bottlenecks for instructors and manual errors when issuing certificates.',
    personalRole:
      'Personally architected and built the end-to-end TypeScript & Next.js application, PostgreSQL schema with Drizzle ORM, signed rotating QR trainer console, and bilingual PDF certificate generator.',
    teamOrEventContext:
      'Delivered for live Space Day event operations and used by organizers, station trainers, and student participants.',
    architecture: {
      title: 'Digital Passport Lifecycle',
      nodes: [
        { stage: 'Student Session', detail: 'English & Arabic RTL passport launch' },
        { stage: 'Rotating Signed QR', detail: '30s trainer-controlled station codes' },
        { stage: 'PostgreSQL + Drizzle', detail: 'Idempotent station completion rows' },
        { stage: 'PDF Certificate Engine', detail: 'Server-gated bilingual certificate' }
      ],
      summary:
        'Models every station sign-off as a cryptographically signed, duplicate-safe relational record.'
    },
    engineeringDecision: {
      challenge:
        'Students scanning station QR codes on venue Wi-Fi could share static QR photos or accidentally submit duplicate scans.',
      options:
        'Static printed station URLs with client-side counters vs. trainer-controlled 30-second rotating signed QR tokens with composite-unique DB rows.',
      decision:
        'Validated QR signature, generation window, and trainer enablement on the server while enforcing composite uniqueness in PostgreSQL via Drizzle ORM.',
      outcome:
        'Prevented duplicate or shared station stamps and issued bilingual PDF certificates strictly from verified completions.'
    },
    outcomes: [
      {
        text: 'Delivered live bilingual digital passport, rotating QR trainer console, and automated PDF certificate system.',
        scope: 'Personal delivery',
        evidenceId: 'space-day-delivery'
      }
    ],
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'Drizzle ORM', 'Signed QR & PDF'],
    media: [
      {
        src: 'assets/projects/space-day/station-passport-01.webp',
        alt: 'Space Day Digital Passport English welcome and mission launch screen',
        caption: 'Application capture · Student Digital Passport launch (English)',
        ready: true
      },
      {
        src: 'assets/projects/space-day/station-passport-ar-02.webp',
        alt: 'Space Day Digital Passport Arabic RTL welcome and mission launch screen',
        caption: 'Application capture · Full RTL Arabic student passport interface',
        ready: true
      }
    ],
    links: []
  },
  {
    id: 'bandup',
    title: 'BandUp',
    tagline: 'IELTS Academic platform with Learning Graph R&D.',
    categories: ['Applied AI', 'Experiments'],
    status: 'r-and-d',
    statusLabel: 'LIVE PLATFORM + R&D',
    statusTone: 'research',
    featured: true,
    summary:
      'IELTS Academic preparation platform at bandup.khalils.codes combining structured lessons and interactive practice previews with ongoing R&D into graph-guided adaptive tutoring.',
    problem:
      'Standard chatbot tutors answer isolated IELTS questions without modeling prerequisite skill gaps or returning the student to the original objective after remediation.',
    personalRole:
      'Creator and developer of the deployed BandUp web platform and author of the proposed Learning Graph architecture for prerequisite branching.',
    teamOrEventContext:
      'Independent product and applied-AI research project. Deployed web platform is live; dynamic misconception-graph branching is clearly scoped as active R&D.',
    architecture: {
      title: 'Platform + Proposed Learning Graph (R&D)',
      nodes: [
        { stage: 'IELTS Lesson & Task', detail: 'Live guided practice modules' },
        { stage: 'Skill Assessment', detail: 'Evaluates learner response quality' },
        { stage: 'Learning Graph (R&D)', detail: 'Proposed prerequisite branching' },
        { stage: 'Grounded Feedback', detail: 'Returns learner to target skill' }
      ],
      summary:
        'Keeps current IELTS practice modules usable today while evaluating graph-driven prerequisite detours.'
    },
    engineeringDecision: {
      challenge:
        'Unconstrained conversational tutoring can drift off-syllabus and hallucinate scoring advice in high-stakes exam prep.',
      options:
        'Pure open-ended chat interface vs. structured lesson stages with explicit curriculum nodes.',
      decision:
        'Built structured lesson and exercise flows first, then designed the Learning Graph R&D layer around explicit concept/prerequisite edges.',
      outcome:
        'Shipped a usable public platform (`bandup.khalils.codes`) with a clear, testable roadmap for adaptive branching.'
    },
    outcomes: [
      {
        text: 'Live web platform deployed at bandup.khalils.codes alongside active Learning Graph R&D.',
        scope: 'Personal project',
        evidenceId: 'bandup-live'
      }
    ],
    tech: ['Applied AI', 'Learning Graphs (R&D)', 'Source-Grounded Tutoring', 'Web Platform'],
    media: [
      {
        src: 'assets/projects/bandup/lesson-workspace-01.webp',
        alt: 'BandUp live landing page and interactive IELTS lesson preview',
        caption: 'Live deployment (bandup.khalils.codes) · Guided IELTS Academic lesson workspace',
        ready: true
      },
      {
        src: 'assets/projects/bandup/lesson-feedback-02.webp',
        alt: 'BandUp interactive practice answer validation and source-grounded feedback',
        caption: 'Live deployment · Practice response validation & grounded rule explanation',
        ready: true
      },
      {
        src: 'assets/projects/bandup/roadmap-preview-03.webp',
        alt: 'BandUp structured step-by-step IELTS learning path overview',
        caption: 'Live deployment · Step-by-step IELTS foundation progression',
        ready: true
      }
    ],
    links: [
      {
        label: 'LIVE PLATFORM ↗',
        href: 'https://bandup.khalils.codes',
        type: 'demo'
      }
    ]
  },
  {
    id: 'makan',
    title: 'Makan',
    tagline: 'Handheld smartphone video to 3D Gaussian Splatting & spatial SLAM trade-off R&D.',
    categories: ['Experiments'],
    status: 'experimental',
    statusLabel: 'EXPERIMENTAL · 3D VISION',
    statusTone: 'neutral',
    featured: true,
    summary:
      'Experimental computer-vision workflow converting ordinary smartphone footage into navigable 3D Gaussian Splatting interiors, paired with an interactive ORB-SLAM3 vs. LingBot-Map architecture study.',
    problem:
      'Spatial walkthroughs of indoor rooms typically require specialized 360° cameras or LiDAR scanners rather than accessible phone video.',
    personalRole:
      'Configured frame sampling, blur filtering, COLMAP Structure-from-Motion pose estimation, 3D Gaussian Splatting optimization, and authored the companion SLAM vs. LingBot-Map operating-stress analysis.',
    teamOrEventContext:
      'Independent computer-vision experiment; registration metrics below reflect camera-pose estimation on one tested indoor video sequence.',
    architecture: {
      title: 'SfM + Neural Rendering Pipeline',
      nodes: [
        { stage: 'Phone Video Capture', detail: 'Frame extraction & blur filtering' },
        { stage: 'COLMAP SfM', detail: 'Feature matching & camera poses' },
        { stage: 'Sparse Point Cloud', detail: '318/318 poses in test sequence' },
        { stage: '3D Gaussian Splatting', detail: 'Real-time neural radiance view' }
      ],
      summary:
        'Couples geometric COLMAP pose recovery with 3D Gaussian Splatting for interactive interior inspection.'
    },
    engineeringDecision: {
      challenge:
        'Low-texture indoor walls and handheld motion blur frequently break camera track continuity during Structure from Motion.',
      options:
        'Uniform high-FPS frame dump vs. curated keyframe sampling with tuned feature-matching overlap and foundation-model comparison.',
      decision:
        'Filtered motion-blurred frames and tuned sequential/overlap matching in COLMAP while benchmarking classical VI-SLAM against LingBot-Map priors.',
      outcome:
        'Registered 318/318 frames at 0.88 px mean reprojection error on the benchmarked indoor sequence (pose registration metric, not a claim of artifact-free surfaces).'
    },
    outcomes: [
      {
        text: '318 / 318 frames registered with 0.88 px mean reprojection error in single-sequence COLMAP test.',
        scope: 'Single-sequence benchmark',
        evidenceId: 'makan-colmap-seq01'
      }
    ],
    tech: ['COLMAP', '3D Gaussian Splatting', 'Structure from Motion', 'Python'],
    media: [
      {
        src: 'assets/projects/makan/colmap-splat-comparison-01.webp',
        alt: 'Makan indoor 3D Gaussian Splatting reconstruction walkthrough frame',
        caption: 'Local reconstruction output · Indoor walkthrough rendered frame',
        ready: true
      },
      {
        src: 'assets/projects/makan/slam-lingbot-study-02.webp',
        alt: 'Interactive engineering trade-off study comparing ORB-SLAM3 and LingBot-Map under operating stress',
        caption: 'Published companion study · ORB-SLAM3 vs. LingBot-Map under operating stress',
        ready: true
      },
      {
        src: 'assets/projects/makan/courthouse-sequence-03.webp',
        alt: 'Separate multi-view test sequence source frame of courthouse exterior',
        caption: 'Separate SfM test sequence · Source footage frame (not rendered output)',
        ready: true
      }
    ],
    links: [
      {
        label: 'SLAM VS LINGBOT STUDY ↗',
        href: 'https://khalilamustafa.github.io/Classical-SLAM-vs.-LingBot-Map-under-operating-stress/',
        type: 'demo'
      },
      {
        label: 'STUDY SOURCE ↗',
        href: 'https://github.com/khalilAmustafa/Classical-SLAM-vs.-LingBot-Map-under-operating-stress',
        type: 'github'
      }
    ]
  },
  {
    id: 'happensbefore',
    title: 'HappensBefore',
    tagline: 'Causal event-ordering & concurrency invariant verification prototype.',
    categories: ['Systems', 'Experiments'],
    status: 'in-development',
    statusLabel: 'IN DEVELOPMENT · SYSTEMS',
    statusTone: 'research',
    featured: true,
    summary:
      'Systems engineering tool in active development for modeling execution traces, happens-before partial orders, and concurrency invariant violations in Java.',
    problem:
      'Concurrent and distributed workflows fail under rare thread or message interleavings that standard pass/fail unit logs fail to explain.',
    personalRole:
      'Solo author defining the formal SRS, container & Java execution-core architecture, event-trace schema, and happens-before graph verification model.',
    teamOrEventContext:
      'Independent systems project (`concur/happens-before`); marked transparently as In Development while the Java execution core and CLI runner are built.',
    architecture: {
      title: 'Trace Verification Pipeline (In Development)',
      nodes: [
        { stage: 'Execution Trace Log', detail: 'Thread/process events & sync ops' },
        { stage: 'HB Partial-Order DAG', detail: 'Program order + sync edges' },
        { stage: 'Invariant / Race Check', detail: 'Concurrent conflicting access scan' },
        { stage: 'Counterexample Slice', detail: 'Minimal causal witness path' }
      ],
      summary:
        'Verifies structured execution traces against causal ordering rules before attempting full schedule exploration.'
    },
    engineeringDecision: {
      challenge:
        'Full stateless model checking explodes combinatorially even on modest multi-threaded programs.',
      options:
        'Build a bytecode interleaving scheduler first vs. start with deterministic trace capture and DAG causal analysis.',
      decision:
        'Scoped Milestone 1 to explicit execution trace ingestion and happens-before graph verification so invariant diagnostics are rock-solid first.',
      outcome:
        'Requirements specification and Java Gradle architecture scaffolded; terminal trace captures will be added once the CLI runner lands.'
    },
    outcomes: [
      {
        text: 'Active Java/Gradle systems project — requirements & causal trace architecture specified.',
        scope: 'In development',
        evidenceId: null
      }
    ],
    tech: ['Java', 'Gradle', 'Happens-Before Graphs', 'Concurrency Verification'],
    media: [
      {
        src: 'assets/projects/happensbefore/trace-check-01.webp',
        alt: 'HappensBefore CLI trace verification output',
        caption: 'Milestone 1 target: CLI happens-before invariant trace output',
        ready: false
      }
    ],
    links: []
  },
  {
    id: 'futureing',
    title: 'Futureing',
    tagline: 'Local-first mobile personal organization prototype with Gemini tool routing.',
    categories: ['Applied AI', 'Experiments'],
    status: 'prototype',
    statusLabel: 'PRIVATE PROTOTYPE',
    statusTone: 'neutral',
    featured: false,
    summary:
      'Private Expo + SQLite mobile prototype exploring how a conversational assistant can trigger controlled, undoable, local-first personal organization actions.',
    problem:
      'Chat-based productivity assistants often store personal notes exclusively in cloud threads or mutate user tasks without deterministic action boundaries.',
    personalRole:
      'Built the Expo mobile client, local SQLite persistence layer, editable proposal cards, and shared action router mapping Gemini tool calls to explicit CRUD operations.',
    teamOrEventContext: 'Solo private prototype; captures below contain synthetic demo entries only.',
    architecture: {
      title: 'Local-First Tool Action Layer',
      nodes: [
        { stage: 'Expo Mobile UI', detail: 'Direct views + assistant prompt' },
        { stage: 'Gemini Tool Router', detail: 'Maps intent to typed actions' },
        { stage: 'Shared Action Layer', detail: 'Validates parameters & undo state' },
        { stage: 'Local SQLite DB', detail: 'On-device tasks, courses & logs' }
      ],
      summary:
        'Routes both manual UI taps and assistant tool calls through one validated local SQLite action layer.'
    },
    engineeringDecision: {
      challenge:
        'Allowing an LLM to write arbitrary SQL or unstructured state breaks reliability in a personal task manager.',
      options:
        'Direct LLM state mutation vs. restricted tool catalog sharing the exact service functions used by the UI.',
      decision:
        'Routed assistant intents exclusively through a typed shared action layer with explicit proposal/undo cards backed by local SQLite transactions.',
      outcome:
        'Demonstrated predictable tool execution while keeping personal data local-first on device.'
    },
    outcomes: [
      {
        text: 'Working private mobile prototype validating shared UI + Gemini tool-execution architecture.',
        scope: 'Prototype',
        evidenceId: null
      }
    ],
    tech: ['Expo', 'React Native', 'SQLite', 'Gemini API', 'Tool Routing'],
    media: [
      {
        src: 'assets/projects/futureing/landing-overview-01.webp',
        alt: 'Futureing product overview showing Android app screens and local-first assistant cards',
        caption: 'Product showcase · Local-first Android prototype overview',
        ready: true
      },
      {
        src: 'assets/projects/futureing/vision-runtime-02.webp',
        alt: 'Futureing Vision local runtime screen showing undoable action cards',
        caption: 'App capture · Local runtime action execution with instant Undo Action',
        isPortrait: true,
        ready: true
      },
      {
        src: 'assets/projects/futureing/syllabus-proposal-04.webp',
        alt: 'Futureing editable syllabus and course deliverables proposal screen',
        caption: 'App capture · Editable course & syllabus deliverable proposal before commit',
        isPortrait: true,
        ready: true
      },
      {
        src: 'assets/projects/futureing/today-capture-03.webp',
        alt: 'Futureing Today view and quick Inbox capture screen',
        caption: 'App capture · Today focus & quick Inbox capture',
        isPortrait: true,
        ready: true
      }
    ],
    links: []
  },
  {
    id: 'asad-math',
    title: 'Asad Math',
    tagline: 'Arabic-language Grade 12 mathematics learning platform for Oman.',
    categories: ['Shipped', 'Systems'],
    status: 'delivered',
    statusLabel: 'BUILT · FULL-STACK EDTECH',
    statusTone: 'live',
    featured: false,
    summary:
      'Full-stack Arabic educational web platform built for Grade 12 mathematics students in Oman featuring enrollment, payment approval workflows, protected lessons, quizzes, and PDFs.',
    problem:
      'Independent regional educators needed an Arabic-first platform supporting local bank-transfer enrollment verification alongside structured video lessons and assessments.',
    personalRole:
      'Built the Next.js RTL Arabic web interface, Express.js + Prisma + PostgreSQL backend, student enrollment & admin payment-approval workflow, and protected lesson modules.',
    teamOrEventContext: 'Full-stack EdTech build (`asad-web` + `asad-api`).',
    architecture: {
      title: 'Enrollment & Protected Content Flow',
      nodes: [
        { stage: 'Next.js RTL Portal', detail: 'Arabic course catalog & sign-up' },
        { stage: 'Express + Prisma API', detail: 'JWT/CSRF auth & payment queue' },
        { stage: 'Protected Lessons', detail: 'Gated video, PDFs & quizzes' },
        { stage: 'Instructor Panel', detail: 'Payment approvals & analytics' }
      ],
      summary:
        'Tailored enrollment and access control to regional payment habits rather than forcing international card-only checkout.'
    },
    engineeringDecision: {
      challenge:
        'Many students pay via local bank transfer rather than international cards, requiring reliable manual/assisted verification.',
      options:
        'External card-only gateway vs. built-in receipt/enrollment approval queue in the instructor dashboard.',
      decision:
        'Implemented an administrative enrollment-approval state machine in Express + Prisma gating lesson videos and downloadable PDFs.',
      outcome:
        'Enabled smooth Arabic-first onboarding for Grade 12 students and straightforward roster control for the instructor.'
    },
    outcomes: [
      {
        text: 'Built full-stack Next.js, Express, Prisma, and PostgreSQL Arabic learning platform with gated lessons.',
        scope: 'Personal delivery',
        evidenceId: null
      }
    ],
    tech: ['Next.js', 'Express.js', 'Prisma', 'PostgreSQL', 'Arabic RTL UI'],
    media: [
      {
        src: 'assets/projects/asad-math/arabic-home-01.webp',
        alt: 'Asad Math Arabic RTL landing page for Grade 12 mathematics in Oman',
        caption: 'Application capture · Arabic RTL homepage for Grade 12 mathematics',
        ready: true
      },
      {
        src: 'assets/projects/asad-math/student-login-02.webp',
        alt: 'Asad Math student portal sign-in interface',
        caption: 'Application capture · Student authentication & protected course entry',
        ready: true
      }
    ],
    links: []
  },
  {
    id: 'abyss-of-the-loss',
    title: 'Abyss of the Loss',
    tagline: '2D psychological horror game built with Godot Engine and GDScript.',
    categories: ['Experiments'],
    status: 'active',
    statusLabel: 'PLAYABLE WEB BUILD',
    statusTone: 'neutral',
    featured: false,
    summary:
      'Atmospheric 2D psychological horror experience exploring state-driven character animations, interactive doors, dynamic 2D lighting, and environmental storytelling.',
    problem:
      'Building tension in a compact 2D browser game requires responsive state transitions, lighting cues, and clean scene persistence.',
    personalRole:
      'Developed gameplay state scripts in GDScript, interactive door/room transitions, lighting triggers, and HTML5 web export.',
    teamOrEventContext: 'Open-source game development project with public web build and source repository.',
    architecture: {
      title: 'Godot Scene & Trigger Loop',
      nodes: [
        { stage: 'Player State Machine', detail: 'Movement, interaction & animation' },
        { stage: 'Room & Door Triggers', detail: 'Scene transitions & progression' },
        { stage: '2D Lighting & Audio', detail: 'Atmospheric cues & events' },
        { stage: 'HTML5 Web Export', detail: 'Playable directly in browser' }
      ],
      summary:
        'Modular Godot scene composition exported to GitHub Pages for zero-install browser play.'
    },
    engineeringDecision: {
      challenge:
        'Keeping browser load times reasonable while preserving atmospheric lighting and room transitions.',
      options:
        'Desktop-only binary download vs. lightweight 2D asset pipeline targeting Godot HTML5 export.',
      decision:
        'Structured compact 2D scenes and state scripts compatible with WebGL/HTML5 export on GitHub Pages.',
      outcome:
        'Published playable web build alongside full GDScript source on GitHub.'
    },
    outcomes: [
      {
        text: 'Public playable HTML5 build and open-source Godot repository.',
        scope: 'Open source',
        evidenceId: 'abyss-web-build'
      }
    ],
    tech: ['Godot Engine', 'GDScript', '2D State Machines', 'HTML5 Export'],
    media: [
      {
        src: 'assets/projects/abyss-of-the-loss/forest-gameplay-01.webp',
        alt: 'Abyss of the Loss 2D pixel-art dark forest gameplay in browser',
        caption: 'Live HTML5 build · Atmospheric dark-forest exploration',
        ready: true
      },
      {
        src: 'assets/projects/abyss-of-the-loss/title-screen-02.webp',
        alt: 'Abyss of the Loss title screen with character and companion cat',
        caption: 'Live HTML5 build · Main menu and pixel-art character silhouettes',
        ready: true
      }
    ],
    links: [
      {
        label: 'PLAY WEB BUILD ↗',
        href: 'https://khalilamustafa.github.io/Abyss-of-the-Loss/',
        type: 'demo'
      },
      {
        label: 'VIEW SOURCE ↗',
        href: 'https://github.com/khalilAmustafa/Abyss-of-the-Loss',
        type: 'github'
      }
    ]
  },
  {
    id: 'vision-career',
    title: 'Vision Career (Masar)',
    tagline: 'Flutter & AI-guided academic specialization and career roadmap mobile app.',
    categories: ['Applied AI', 'Experiments'],
    status: 'prototype',
    statusLabel: 'OPEN-SOURCE MOBILE APP',
    statusTone: 'neutral',
    featured: false,
    summary:
      'Flutter mobile application and Node.js backend helping university students choose specializations, follow prerequisite-gated study paths, and prepare for target software roles.',
    problem:
      'University students often pick electives or career tracks without clear visibility into subject prerequisites or structured readiness checkpoints.',
    personalRole:
      'Built controlled progression logic in Flutter/Dart, quiz-gated subject unlocks, ranked learning-resource retrieval, and the companion Node.js dataset API.',
    teamOrEventContext: 'Collaborative mobile engineering project with public GitHub source repository.',
    architecture: {
      title: 'Prerequisite Career Progression',
      nodes: [
        { stage: 'Track Assessment', detail: 'Evaluates student goals & background' },
        { stage: 'Prerequisite Roadmap', detail: 'Ordered subject & skill milestones' },
        { stage: 'AI Quiz Checkpoints', detail: 'Validates mastery before advancing' },
        { stage: 'Resource Vault', detail: 'Curated study links & role readiness' }
      ],
      summary:
        'Pairs AI guidance with deterministic local progression rules so students advance through verified checkpoints.'
    },
    engineeringDecision: {
      challenge:
        'Purely conversational career advice gives generic encouragement without actionable curriculum structure.',
      options:
        'Unstructured chat advisor vs. structured master dataset of specializations, prerequisites, and quiz-gated stages.',
      decision:
        'Modeled explicit specialization graphs in JSON backed by Flutter progression state and AI quiz generation.',
      outcome:
        'Published full Flutter mobile client and Node.js backend dataset repository on GitHub.'
    },
    outcomes: [
      {
        text: 'Open-source Flutter & Node.js career-guidance codebase published on GitHub.',
        scope: 'Open source',
        evidenceId: null
      }
    ],
    tech: ['Flutter', 'Dart', 'Node.js', 'AI Quiz Flows', 'Mobile Architecture'],
    media: [],
    links: [
      {
        label: 'VIEW SOURCE ↗',
        href: 'https://github.com/khalilAmustafa/Vision-Career',
        type: 'github'
      }
    ]
  },
  {
    id: 'vision-pulse',
    title: 'VisionPulse AI',
    tagline: 'Macroeconomic event-to-asset decision-support prototype with Gemini reasoning.',
    categories: ['Applied AI', 'Experiments'],
    status: 'prototype',
    statusLabel: 'OPEN-SOURCE PROTOTYPE',
    statusTone: 'neutral',
    featured: false,
    summary:
      'Educational market-intelligence prototype mapping macroeconomic calendar events and financial news into structured, explainable asset-reaction cards with post-event accuracy reviews.',
    problem:
      'Beginner analysts struggle to connect scheduled macro announcements (CPI, FOMC, OPEC) to historical asset sensitivities and post-event accountability.',
    personalRole:
      'Co-developed the Node.js + Express event-to-asset prediction pipeline, rule-based impact mapping, Gemini reasoning prompts, and seeded offline fallback mode.',
    teamOrEventContext: 'Co-authored hackathon/prototype repository (`RKA14406/Vision_Pulse`).',
    architecture: {
      title: 'Event-to-Asset Reasoning Flow',
      nodes: [
        { stage: 'Macro Event Feed', detail: 'CPI, FOMC, earnings & watchlists' },
        { stage: 'Rule Impact Mapper', detail: 'Asset sensitivity & fallback priors' },
        { stage: 'Gemini Reasoning', detail: 'Structured directional thesis card' },
        { stage: 'Post-Event Review', detail: 'Predicted vs. actual accuracy log' }
      ],
      summary:
        'Includes deterministic seeded fallback data so the full workflow runs reliably even without external API keys.'
    },
    engineeringDecision: {
      challenge:
        'Live market and LLM APIs can rate-limit during demos or fail when keys are absent.',
      options:
        'Hard dependency on live API keys vs. graceful fallback layer with seeded macro scenarios.',
      decision:
        'Built a rule-based fallback and seeded market dataset underneath the Express + Gemini prediction service.',
      outcome:
        'Guaranteed reproducible local demos and transparent post-event review cards.'
    },
    outcomes: [
      {
        text: 'Published open-source Node.js + Express + Gemini prototype on GitHub.',
        scope: 'Team prototype',
        evidenceId: null
      }
    ],
    tech: ['Node.js', 'Express.js', 'Google Gemini', 'Market APIs', 'Fallback Systems'],
    media: [],
    links: [
      {
        label: 'VIEW SOURCE ↗',
        href: 'https://github.com/RKA14406/Vision_Pulse',
        type: 'github'
      }
    ]
  }
];

export const projectsById = Object.freeze(
  Object.fromEntries(projects.map((project) => [project.id, project]))
);
