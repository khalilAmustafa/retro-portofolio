export const skillGroups = [
  {
    id: 'backend-systems',
    title: 'Backend & Systems',
    shortLabel: 'Backend & Systems',
    statement:
      'Designing typed web backends, relational data models, idempotent operational workflows, and concurrency-verification prototypes.',
    tools: ['TypeScript', 'PostgreSQL', 'MySQL', 'SQLite', 'Drizzle ORM', 'REST APIs', 'Java'],
    capabilities: [
      {
        name: 'Operational Event Workflows',
        stage: 'used in live events',
        detail: 'Registration, multi-station instructor approvals, and automated PDF certificate pipelines.',
        proofRoute: '#projects/space-day',
        proofLabel: 'Space Day Case Study →'
      },
      {
        name: 'Concurrency & Causal Ordering',
        stage: 'in development',
        detail: 'Execution trace modeling, happens-before partial-order graphs, and invariant checking in Java.',
        proofRoute: '#projects/happensbefore',
        proofLabel: 'HappensBefore Case Study →'
      },
      {
        name: 'Registration & Roster APIs',
        stage: 'used in live events',
        detail: 'Validated team onboarding and administrative data flows for regional tech events.',
        proofRoute: '#projects/nasa-space-apps',
        proofLabel: 'NASA Space Apps Case Study →'
      },
      {
        name: 'C# & ASP.NET Core',
        stage: 'currently learning',
        detail: 'Expanding backend architecture practice into .NET service patterns.',
        proofRoute: '#experience',
        proofLabel: 'Engineering Journey →'
      }
    ],
    projectIds: ['space-day', 'happensbefore', 'nasa-space-apps', 'asad-math']
  },
  {
    id: 'cloud-infra',
    title: 'Cloud & Infrastructure',
    shortLabel: 'Cloud & Infra',
    statement:
      'Foundational AWS cloud architecture, web deployment configuration, custom domains/edge routing, and Linux development workflows.',
    tools: ['AWS Fundamentals', 'Cloudflare', 'Vercel', 'Linux / WSL', 'Git & GitHub', 'Docker (Learning)'],
    capabilities: [
      {
        name: 'AWS Cloud Architecture Fundamentals',
        stage: 'certified',
        detail: 'IAM security, core compute/storage/networking services, billing, and shared-responsibility principles.',
        proofRoute: '#certifications',
        proofLabel: 'AWS CCP Credential →'
      },
      {
        name: 'Cloud & Web Deployments',
        stage: 'used in live events',
        detail: 'Production hosting, DNS/TLS setup, and live release support for public platforms.',
        proofRoute: '#projects/bandup',
        proofLabel: 'BandUp Live Platform →'
      },
      {
        name: 'Event-Day Release Operations',
        stage: 'used in live events',
        detail: 'Pre-event verification and live operational support for 380+ participant registration.',
        proofRoute: '#projects/nasa-space-apps',
        proofLabel: 'NASA Space Apps Case Study →'
      },
      {
        name: 'Containerized Dev Workflows (Docker)',
        stage: 'currently learning',
        detail: 'Local service environments and reproducible tooling setups.',
        proofRoute: '#projects/happensbefore',
        proofLabel: 'HappensBefore Case Study →'
      }
    ],
    projectIds: ['bandup', 'nasa-space-apps', 'space-day']
  },
  {
    id: 'applied-ai',
    title: 'Applied AI & Intelligent Workflows',
    shortLabel: 'Applied AI',
    statement:
      'Integrating language models through structured schemas, tool-routing layers, source-grounded tutoring, and prerequisite learning graphs.',
    tools: ['Python', 'LLM / Gemini API', 'Structured Outputs', 'Tool Routing', 'Learning Graphs'],
    capabilities: [
      {
        name: 'AI Tutoring & Learning Graphs',
        stage: 'active + r&d',
        detail: 'Guided IELTS lessons paired with ongoing R&D on prerequisite misconception branching.',
        proofRoute: '#projects/bandup',
        proofLabel: 'BandUp Case Study →'
      },
      {
        name: 'Multiplayer & AI Study Challenges',
        stage: 'project experience',
        detail: 'Structured quiz generation and educational feedback loops inside social study rooms.',
        proofRoute: '#projects/rooms',
        proofLabel: 'ROOMS Case Study →'
      },
      {
        name: 'Controlled Agent Tool Routing',
        stage: 'prototype',
        detail: 'Mapping natural-language commands to local SQLite actions in an Expo mobile prototype.',
        proofRoute: '#projects/futureing',
        proofLabel: 'Futureing Case Study →'
      }
    ],
    projectIds: ['bandup', 'rooms', 'futureing']
  },
  {
    id: 'programming-foundations',
    title: 'Programming Foundations',
    shortLabel: 'Foundations',
    statement:
      'Algorithmic problem solving, data structures, object-oriented software engineering, and collegiate competitive programming.',
    tools: ['C++', 'Java OOP', 'Python', 'SQL', 'Algorithms', 'Data Structures'],
    capabilities: [
      {
        name: 'Competitive Programming (C++ / Java)',
        stage: 'contest experience',
        detail: 'Collegiate contestant in Amman CPC 2025 and 24-hour IEEEXtreme 19.0.',
        proofRoute: '#certifications',
        proofLabel: 'Contest Record →'
      },
      {
        name: 'Graph & Partial-Order Modeling',
        stage: 'in development',
        detail: 'Applying directed graph traversal to causal event histories and prerequisite maps.',
        proofRoute: '#projects/happensbefore',
        proofLabel: 'HappensBefore Case Study →'
      },
      {
        name: 'Relational Schema Design (SQL)',
        stage: 'used in live events',
        detail: 'Normalized tables and constraints for multi-step participant tracking.',
        proofRoute: '#projects/space-day',
        proofLabel: 'Space Day Case Study →'
      }
    ],
    projectIds: ['happensbefore', 'space-day', 'bandup']
  },
  {
    id: 'vision-interactive',
    title: '3D Vision & Interactive Media',
    shortLabel: '3D & Interactive',
    statement:
      'Experimental Structure-from-Motion pipelines, neural 3D scene reconstruction, and 2D interactive game state systems.',
    tools: ['COLMAP', 'Structure from Motion', '3D Gaussian Splatting', 'Godot Engine', 'GDScript'],
    capabilities: [
      {
        name: 'Camera Pose Estimation & 3DGS',
        stage: 'experimental',
        detail: 'Phone-video frame extraction, COLMAP SfM registration, and Gaussian Splatting.',
        proofRoute: '#projects/makan',
        proofLabel: 'Makan Case Study →'
      },
      {
        name: 'Realtime / Multiplayer Study Loops',
        stage: 'project experience',
        detail: 'Competitive rounds, scoreboards, and shared study quests.',
        proofRoute: '#projects/rooms',
        proofLabel: 'ROOMS Case Study →'
      },
      {
        name: '2D Game State & Scene Scripting',
        stage: 'project experience',
        detail: 'Character state machines, lighting transitions, and web export in Godot.',
        proofRoute: '#projects/abyss-of-the-loss',
        proofLabel: 'Abyss of the Loss →'
      }
    ],
    projectIds: ['makan', 'rooms', 'abyss-of-the-loss']
  }
];
