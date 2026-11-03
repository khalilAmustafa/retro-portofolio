export const evidenceRegistry = [
  {
    id: 'aws-ccp-2026',
    title: 'AWS Certified Cloud Practitioner',
    type: 'certification',
    date: '2026-05',
    attribution: 'personal',
    issuer: 'Amazon Web Services (AWS)',
    summary: 'Earned foundational AWS certification covering cloud architecture, IAM security, core compute/storage/networking services, and billing models.',
    href: null,
    verificationNote: 'Issued May 2026. Official badge/certificate verification link slot ready in src/data/evidence.js.'
  },
  {
    id: 'replit-award-2026',
    title: '3rd Place — Replit AI Hackathon',
    type: 'award',
    date: '2026',
    attribution: 'team',
    issuer: 'Replit AI Hackathon',
    summary: 'Awarded 3rd place as part of the ROOMS by VISION team for interactive multiplayer and AI-assisted study challenges.',
    href: null,
    verificationNote: 'Team competition placement (2026). Public announcement link can be attached when desired.'
  },
  {
    id: 'nasa-space-apps-event',
    title: 'NASA Space Apps Regional Event Registration Platform',
    type: 'delivery',
    date: '2025',
    attribution: 'event-scale',
    issuer: 'NASA Space Apps Regional Event',
    summary: 'Registration and event communications platform supporting a regional hackathon cohort of 85+ teams and 380+ participants.',
    href: null,
    verificationNote: '85+ teams and 380+ participants reflect regional event attendance supported by the web platform.'
  },
  {
    id: 'space-day-delivery',
    title: 'Space Day Digital Passport System',
    type: 'delivery',
    date: '2026',
    attribution: 'personal',
    issuer: 'Space Day Event Operations',
    summary: 'Delivered full-stack TypeScript, PostgreSQL, and Drizzle ORM web workflow managing registrations, station approvals, and automated PDF completion certificates.',
    href: null,
    verificationNote: 'Production event operations application.'
  },
  {
    id: 'erasmus-upv-2026',
    title: 'Erasmus+ International Academic Exchange',
    type: 'academic',
    date: '2026-02',
    attribution: 'personal',
    issuer: 'Universitat Politècnica de València (ETSINF)',
    summary: 'Selected for European Union Erasmus+ exchange semester in Informatics Engineering in Valencia, Spain (Spring 2026).',
    href: null,
    verificationNote: 'Exchange semester at ETSINF, UPV Valencia.'
  },
  {
    id: 'bandup-live',
    title: 'BandUp IELTS Academic Web Platform',
    type: 'live-product',
    date: '2026',
    attribution: 'personal',
    issuer: 'BandUp',
    summary: 'Publicly accessible IELTS Academic learning platform featuring structured lessons, exercises, and ongoing Learning Graph R&D.',
    href: 'https://bandup.khalils.codes',
    verificationNote: 'Live web deployment.'
  },
  {
    id: 'makan-colmap-seq01',
    title: 'Makan Single-Sequence COLMAP Registration Benchmark',
    type: 'experiment-log',
    date: '2026',
    attribution: 'personal',
    issuer: 'Makan Reconstruction Experiment',
    summary: 'Registered 318/318 extracted indoor smartphone frames with 0.88-pixel mean reprojection error in COLMAP Structure-from-Motion.',
    href: null,
    verificationNote: 'Camera-pose registration metric on one tested indoor video sequence; does not claim artifact-free dense mesh.'
  },
  {
    id: 'efset-b2',
    title: 'EF SET English Certificate (B2 Upper-Intermediate)',
    type: 'language',
    date: '2025',
    attribution: 'personal',
    issuer: 'EF Standard English Test (EF SET)',
    summary: 'Assessed at CEFR B2 Upper-Intermediate proficiency in English.',
    href: null,
    verificationNote: 'EF SET certification.'
  },
  {
    id: 'abyss-web-build',
    title: 'Abyss of the Loss — Playable Web Build & Source',
    type: 'open-source',
    date: '2025',
    attribution: 'personal',
    issuer: 'GitHub Pages / Open Source',
    summary: 'Playable HTML5 export and GDScript source repository for a 2D atmospheric horror game built with Godot Engine.',
    href: 'https://github.com/khalilAmustafa/Abyss-of-the-Loss',
    verificationNote: 'Public GitHub repository and playable GitHub Pages build.'
  }
];

export const evidenceById = Object.freeze(
  Object.fromEntries(evidenceRegistry.map((item) => [item.id, item]))
);
