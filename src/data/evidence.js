export const evidenceRegistry = [
  {
    id: 'aws-ccp-2026',
    title: 'AWS Certified Cloud Practitioner',
    type: 'certification',
    date: '2026-05',
    attribution: 'personal',
    issuer: 'Amazon Web Services (AWS)',
    summary:
      'Earned foundational AWS certification (Validation ID: 4268afe835cd4e5c990d98399b7847a1, issued May 8, 2026 — expires May 8, 2029) covering cloud architecture, IAM security, core compute/storage/networking services, and billing models.',
    href: 'assets/credentials/aws-cloud-practitioner.pdf',
    verificationNote:
      'Official AWS certificate PDF · Validation ID 4268afe835cd4e5c990d98399b7847a1 at aws.amazon.com/verification.'
  },
  {
    id: 'replit-award-2026',
    title: '3rd Place — Replit AI Hackathon',
    type: 'award',
    date: '2026',
    attribution: 'team',
    issuer: 'Replit AI Hackathon',
    summary:
      'Awarded 3rd place as part of the ROOMS by VISION team for interactive multiplayer and AI-assisted study challenges.',
    href: 'https://rka14406.github.io/RKAs_portfolio/',
    verificationNote: 'Team competition placement (2026) · Featured in the ROOMS team showcase.'
  },
  {
    id: 'nasa-space-apps-event',
    title: 'NASA Space Apps Jordan Live Platform',
    type: 'delivery',
    date: '2025',
    attribution: 'event-scale',
    issuer: 'NASA Space Apps Jordan (MENA ORG)',
    summary:
      'Public event website and registration workflow supporting NASA Space Apps Jordan across a cohort of 85+ teams and 380+ participants.',
    href: 'https://spaceapp-front.vercel.app/',
    verificationNote:
      'Live event site at spaceapp-front.vercel.app · 85+ teams and 380+ participants reflect regional event attendance.'
  },
  {
    id: 'mena-org-platform',
    title: 'MENA Space Organization Web Platform',
    type: 'delivery',
    date: '2026',
    attribution: 'personal',
    issuer: 'MENA Space Organization',
    summary:
      'Bilingual English/Arabic web platform showcasing Jordan analog Mars missions, STEM events, research programs, and Space Apps initiatives.',
    href: 'https://mena-website.vercel.app/',
    verificationNote: 'Live deployment at mena-website.vercel.app and public repository on GitHub.'
  },
  {
    id: 'space-day-delivery',
    title: 'Space Day Digital Passport System',
    type: 'delivery',
    date: '2026',
    attribution: 'personal',
    issuer: 'Space Day Event Operations',
    summary:
      'Delivered full-stack Next.js, TypeScript, PostgreSQL, and Drizzle ORM web workflow managing bilingual participant passports, rotating QR station approvals, and automated PDF completion certificates.',
    href: null,
    verificationNote: 'Production event operations application.'
  },
  {
    id: 'erasmus-upv-2026',
    title: 'Erasmus+ Exchange & UPV QCO Coursework',
    type: 'academic',
    date: '2026-02',
    attribution: 'personal',
    issuer: 'Universitat Politècnica de València (ETSINF)',
    summary:
      'Selected for European Union Erasmus+ exchange semester in Informatics Engineering in Valencia, Spain (Spring 2026), including Quantum Computing laboratory coursework.',
    href: 'https://github.com/khalilAmustafa/quantum-computing-UPV',
    verificationNote: 'Exchange semester at ETSINF, UPV Valencia · Public QCO lab notebooks on GitHub.'
  },
  {
    id: 'bandup-live',
    title: 'BandUp IELTS Academic Web Platform',
    type: 'live-product',
    date: '2026',
    attribution: 'personal',
    issuer: 'BandUp',
    summary:
      'Publicly accessible IELTS Academic learning platform featuring structured lessons, interactive practice previews, and ongoing Learning Graph R&D.',
    href: 'https://bandup.khalils.codes',
    verificationNote: 'Live web deployment at bandup.khalils.codes.'
  },
  {
    id: 'makan-colmap-seq01',
    title: 'Makan SfM Benchmark & SLAM vs. LingBot-Map Study',
    type: 'experiment-log',
    date: '2026',
    attribution: 'personal',
    issuer: 'Makan Reconstruction & Spatial Perception R&D',
    summary:
      'Registered 318/318 indoor smartphone frames at 0.88 px mean reprojection error in COLMAP SfM alongside an interactive ORB-SLAM3 vs. LingBot-Map trade-off study.',
    href: 'https://khalilamustafa.github.io/Classical-SLAM-vs.-LingBot-Map-under-operating-stress/',
    verificationNote:
      'Single-sequence COLMAP pose registration metric + live spatial perception architecture study.'
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
    summary:
      'Playable HTML5 export and GDScript source repository for a 2D atmospheric horror game built with Godot Engine.',
    href: 'https://khalilamustafa.github.io/Abyss-of-the-Loss/',
    verificationNote: 'Public playable GitHub Pages build and open-source Godot repository.'
  }
];

export const evidenceById = Object.freeze(
  Object.fromEntries(evidenceRegistry.map((item) => [item.id, item]))
);
