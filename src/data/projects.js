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
      'Built collaboratively with the ROOMS by VISION hackathon team; awarded 3rd Place in the Replit AI Hackathon (2026). Visual assets and product pitch were shared across the team.',
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
        alt: 'ROOMS by VISION multiplayer study lobby and challenge setup',
        caption: 'Drop-in slot: Real ROOMS lobby & multiplayer challenge round capture',
        ready: false
      }
    ],
    links: []
  },
  {
    id: 'nasa-space-apps',
    title: 'NASA Space Apps Event Platform',
    tagline: 'Regional hackathon website and participant registration system.',
    categories: ['Shipped', 'Systems'],
    status: 'delivered',
    statusLabel: 'DELIVERED · LIVE EVENT',
    statusTone: 'live',
    featured: true,
    summary:
      'Delivered the public event platform and registration workflow supporting a regional NASA Space Apps cohort of 85+ teams and 380+ participants.',
    problem:
      'Regional organizers needed a dependable web hub to publish event tracks, validate team registrations on mobile and desktop, and coordinate announcements.',
    personalRole:
      'Personally built and deployed the event website, registration forms, field validation, data persistence, and live event-day schedule updates.',
    teamOrEventContext:
      '85+ teams and 380+ participants represent the regional NASA Space Apps event scale served by the platform alongside local organizing staff.',
    architecture: {
      title: 'Registration & Event Hub Flow',
      nodes: [
        { stage: 'Public Event Portal', detail: 'Tracks, schedule & bilingual info' },
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
        text: 'Supported live registration workflow for a regional event with 85+ teams and 380+ participants.',
        scope: 'Event scale',
        evidenceId: 'nasa-space-apps-event'
      }
    ],
    tech: ['Web Platform', 'Form Validation', 'Backend API', 'Production Deployment'],
    media: [
      {
        src: 'assets/projects/nasa-space-apps/landing-registration-01.webp',
        alt: 'NASA Space Apps regional event website and registration interface',
        caption: 'Drop-in slot: Approved event portal & registration workflow screenshot',
        ready: false
      }
    ],
    links: []
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
      'Systems engineering tool in active development for modeling execution traces, happens-before partial orders, and concurrency invariant violations.',
    problem:
      'Concurrent and distributed workflows fail under rare thread or message interleavings that standard pass/fail unit logs fail to explain.',
    personalRole:
      'Solo author designing the event-trace schema, causal happens-before graph construction, and counterexample reporting model (CLI runner currently in active development).',
    teamOrEventContext:
      'Independent systems project; marked transparently as In Development until the standalone CLI and benchmark suite are tagged for release.',
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
        'Core graph model and invariant specification design underway; real terminal trace captures will be added once the CLI runner lands.'
    },
    outcomes: [
      {
        text: 'Active systems prototype — causal trace DAG & invariant checker currently in development.',
        scope: 'In development',
        evidenceId: null
      }
    ],
    tech: ['Java', 'Concurrency', 'Happens-Before Graphs', 'Systems Verification'],
    media: [
      {
        src: 'assets/projects/happensbefore/trace-check-01.webp',
        alt: 'HappensBefore CLI trace verification output',
        caption: 'Drop-in slot: Real CLI invariant-violation trace capture (coming during development)',
        ready: false
      }
    ],
    links: []
  },
  {
    id: 'space-day',
    title: 'Space Day Digital Passport',
    tagline: 'Multi-station event progression, instructor approvals, and PDF certificates.',
    categories: ['Shipped', 'Systems'],
    status: 'delivered',
    statusLabel: 'DELIVERED · WORKFLOW APP',
    statusTone: 'live',
    featured: true,
    summary:
      'Operational web application tracking participant registration, group assignment, station approvals, and automated PDF completion certificates.',
    problem:
      'Tracking hundreds of attendees across physical activity stations with paper checklists creates bottlenecks for instructors and manual errors when issuing certificates.',
    personalRole:
      'Personally architected and built the end-to-end TypeScript application, PostgreSQL schema with Drizzle ORM, instructor station-approval interface, admin dashboard, and PDF certificate generator.',
    teamOrEventContext:
      'Delivered for live Space Day event operations and used by organizers, station instructors, and participants.',
    architecture: {
      title: 'Digital Passport Lifecycle',
      nodes: [
        { stage: 'Participant Check-In', detail: 'Registration & group assignment' },
        { stage: 'Station Approval', detail: 'Instructor verifies station completion' },
        { stage: 'PostgreSQL + Drizzle', detail: 'Idempotent progress persistence' },
        { stage: 'PDF Certificate Engine', detail: 'Auto-issued upon required stamps' }
      ],
      summary:
        'Models every station sign-off as an explicit relational record driving real-time completion eligibility.'
    },
    engineeringDecision: {
      challenge:
        'Instructors approving groups on mobile browsers over venue Wi-Fi can accidentally double-submit or refresh mid-request.',
      options:
        'Increment an integer counter on the participant row vs. store composite-unique `(participant_id, station_id)` approval rows.',
      decision:
        'Enforced composite uniqueness in PostgreSQL via Drizzle ORM and derived completion status from verified station records.',
      outcome:
        'Prevented duplicate station stamps and ensured completion certificates were generated only from consistent progress records.'
    },
    outcomes: [
      {
        text: 'Delivered live registration, station approval, and automated PDF certificate system.',
        scope: 'Personal delivery',
        evidenceId: 'space-day-delivery'
      }
    ],
    tech: ['TypeScript', 'PostgreSQL', 'Drizzle ORM', 'PDF Generation', 'Admin Workflows'],
    media: [
      {
        src: 'assets/projects/space-day/station-passport-01.webp',
        alt: 'Space Day digital passport station progress and approval dashboard',
        caption: 'Drop-in slot: Privacy-redacted digital passport & station approval screen',
        ready: false
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
      'IELTS Academic preparation platform at bandup.khalils.codes combining structured lessons and skill exercises with ongoing R&D into graph-guided adaptive tutoring.',
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
        alt: 'BandUp IELTS Academic guided lesson workspace',
        caption: 'Drop-in slot: Real BandUp lesson screen & proposed learning-graph diagram',
        ready: false
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
    tagline: 'Handheld smartphone video to 3D Gaussian Splatting interior pipeline.',
    categories: ['Experiments'],
    status: 'experimental',
    statusLabel: 'EXPERIMENTAL · 3D VISION',
    statusTone: 'neutral',
    featured: true,
    summary:
      'Experimental computer-vision workflow converting ordinary smartphone walkthrough footage of interior rooms into navigable 3D Gaussian Splatting scenes.',
    problem:
      'Spatial walkthroughs of indoor rooms typically require specialized 360° cameras or LiDAR scanners rather than accessible phone video.',
    personalRole:
      'Configured frame sampling, blur filtering, COLMAP Structure-from-Motion camera pose estimation, and 3D Gaussian Splatting scene optimization.',
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
        'Uniform high-FPS frame dump vs. curated keyframe sampling with tuned feature-matching overlap.',
      decision:
        'Filtered motion-blurred frames and tuned sequential/overlap matching in COLMAP before launching Gaussian Splatting optimization.',
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
        alt: 'Makan input frame compared with COLMAP camera poses and 3D Gaussian Splatting render',
        caption: 'Drop-in slot: Input frame vs. COLMAP sparse poses & 3DGS reconstruction',
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
      'Private Expo + SQLite mobile prototype exploring how a conversational assistant can trigger controlled, local-first personal organization actions.',
    problem:
      'Chat-based productivity assistants often store personal notes exclusively in cloud threads or mutate user tasks without deterministic action boundaries.',
    personalRole:
      'Built the Expo mobile client, local SQLite persistence layer, and shared action router mapping Gemini tool calls to explicit CRUD operations.',
    teamOrEventContext: 'Solo private prototype.',
    architecture: {
      title: 'Local-First Tool Action Layer',
      nodes: [
        { stage: 'Expo Mobile UI', detail: 'Direct views + assistant prompt' },
        { stage: 'Gemini Tool Router', detail: 'Maps intent to typed actions' },
        { stage: 'Shared Action Layer', detail: 'Validates parameters & rules' },
        { stage: 'Local SQLite DB', detail: 'On-device tasks & notes' }
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
        'Routed assistant intents exclusively through a typed shared action layer backed by local SQLite transactions.',
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
    media: [],
    links: []
  },
  {
    id: 'asad-math',
    title: 'Asad Math',
    tagline: 'Arabic-language Grade 12 mathematics learning platform for Oman.',
    categories: ['Shipped', 'Systems'],
    status: 'delivered',
    statusLabel: 'DELIVERED · EDTECH',
    statusTone: 'live',
    featured: false,
    summary:
      'Arabic educational web platform built for Grade 12 mathematics students in Oman featuring enrollment, payment approval workflows, protected lessons, quizzes, and PDFs.',
    problem:
      'Independent regional educators needed an Arabic-first platform supporting local enrollment verification alongside structured video lessons and assessments.',
    personalRole:
      'Built the full-stack RTL Arabic web interface, student enrollment and admin payment-approval workflow, protected lesson access, and quiz modules.',
    teamOrEventContext: 'Client/contract EdTech delivery.',
    architecture: {
      title: 'Enrollment & Protected Content Flow',
      nodes: [
        { stage: 'Arabic RTL Portal', detail: 'Course catalog & student sign-up' },
        { stage: 'Admin Approval', detail: 'Verifies local payment & access' },
        { stage: 'Protected Lessons', detail: 'Gated video, PDFs & quizzes' },
        { stage: 'Instructor Panel', detail: 'Content & student management' }
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
        'Implemented an administrative enrollment-approval state machine gating lesson videos and downloadable PDFs.',
      outcome:
        'Enabled smooth Arabic-first onboarding for Grade 12 students and straightforward roster control for the instructor.'
    },
    outcomes: [
      {
        text: 'Delivered full-stack Arabic mathematics learning platform with gated lessons and admin approvals.',
        scope: 'Personal delivery',
        evidenceId: null
      }
    ],
    tech: ['Full-Stack Web', 'Arabic RTL UI', 'Access Control', 'Video & Quiz Modules'],
    media: [],
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
    media: [],
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
  }
];

export const projectsById = Object.freeze(
  Object.fromEntries(projects.map((project) => [project.id, project]))
);
