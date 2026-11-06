export const experienceMilestones = [
  {
    id: 'contract-mena',
    dateIso: '2026-05',
    periodLabel: 'May 2026 – Present',
    title: 'Software & IT/AI Engineering Contributions',
    organization: 'MENA Space Organization & Regional Practice',
    location: 'Amman, Jordan / Remote',
    badge: 'ACTIVE PRACTICE',
    badgeTone: 'live',
    oneLineResult:
      'Delivering bilingual Arabic/English web platforms, registration workflows, and operational tools for regional space/tech events and educators.',
    context:
      'Organizations and educational initiatives needed reliable web software scoped, built, and supported through real launch days rather than static landing pages.',
    responsibility:
      'Translated stakeholder requirements into relational schemas, backend APIs, authentication flows, bilingual interfaces, and live event-day operational support.',
    technicalDecisions:
      'Standardized on typed web stacks (TypeScript, React/Next.js, PostgreSQL, Drizzle ORM) and clear server-side validation so administrative rosters and check-in states remained consistent.',
    result:
      'Delivered operational web systems across NASA Space Apps Jordan, MENA Space Organization, Space Day, and Arabic EdTech.',
    relatedProjectIds: ['space-day', 'nasa-space-apps', 'asad-math'],
    evidenceIds: ['nasa-space-apps-event', 'mena-org-platform', 'space-day-delivery']
  },
  {
    id: 'erasmus-upv-systems',
    dateIso: '2026-02',
    periodLabel: 'Spring 2026',
    title: 'Erasmus+ Exchange & Systems Engineering Projects',
    organization: 'Universitat Politècnica de València (ETSINF)',
    location: 'Valencia, Spain',
    badge: 'ACADEMIC EXCHANGE',
    badgeTone: 'award',
    oneLineResult:
      'Completed an international Informatics Engineering exchange while prototyping concurrency verification and adaptive AI tools.',
    context:
      'Selected through the EU Erasmus+ program to study Informatics Engineering in Spain while advancing longer-horizon backend, cloud, and applied AI projects.',
    responsibility:
      'Balanced European engineering coursework (including Quantum Computing labs) with independent work on HappensBefore, BandUp, and AWS Cloud Practitioner preparation.',
    technicalDecisions:
      'Focused portfolio R&D on structured engineering problems—happens-before trace graphs and prerequisite learning graphs—rather than thin prompt wrappers.',
    result:
      'Earned AWS Certified Cloud Practitioner (May 2026) and shipped iterative updates to BandUp while completing the Valencia exchange semester.',
    relatedProjectIds: ['happensbefore', 'bandup'],
    evidenceIds: ['erasmus-upv-2026', 'aws-ccp-2026', 'bandup-live']
  },
  {
    id: 'space-day-workflow',
    dateIso: '2026',
    periodLabel: '2026',
    title: 'Space Day Digital Passport Engineering',
    organization: 'Space Day Event Operations',
    location: 'Jordan',
    badge: 'DELIVERED SYSTEM',
    badgeTone: 'live',
    oneLineResult:
      'Replaced paper station cards with a Next.js + PostgreSQL digital passport, rotating signed QR approvals, and automated PDF certificates.',
    context:
      'Multi-station educational events needed fast bilingual student registration, station trainer approvals, and verified completion certificates.',
    responsibility:
      'Designed and built the bilingual student passport flow, rotating 30-second QR trainer console, and server-gated PDF completion certificate pipeline.',
    technicalDecisions:
      'Modeled participant-station approvals with cryptographically signed QR tokens and idempotent relational constraints in PostgreSQL via Drizzle ORM.',
    result:
      'Supported end-to-end event progression from check-in through verified digital certificate issuance.',
    relatedProjectIds: ['space-day'],
    evidenceIds: ['space-day-delivery']
  },
  {
    id: 'nasa-space-apps-delivery',
    dateIso: '2025',
    periodLabel: '2025 – 2026',
    title: 'NASA Space Apps Jordan Registration & Event Platform',
    organization: 'NASA Space Apps Regional Event (MENA ORG)',
    location: 'Amman & Aqaba, Jordan',
    badge: 'LIVE EVENT',
    badgeTone: 'live',
    oneLineResult:
      'Built and supported the public event website and registration workflow serving 85+ teams and 380+ participants.',
    context:
      'Organizers required a dedicated web hub to onboard teams, validate participant registrations, and communicate schedules across Jordan.',
    responsibility:
      'Implemented the public event website (`spaceapp-front.vercel.app`), registration workflow, validation rules, deployment configuration, and archive views.',
    technicalDecisions:
      'Kept registration forms lightweight on mobile viewports with strict server/client field validation to reduce incomplete team submissions near deadline peaks.',
    result:
      'Supported live participant registration and event operations for an event scale of 85+ teams and 380+ participants.',
    relatedProjectIds: ['nasa-space-apps'],
    evidenceIds: ['nasa-space-apps-event']
  },
  {
    id: 'competitive-programming',
    dateIso: '2025',
    periodLabel: '2025 – Present',
    title: 'Competitive Programming & Algorithmic Foundations',
    organization: 'ASU Coding Club · Amman CPC · IEEEXtreme',
    location: 'Amman, Jordan',
    badge: 'ALGORITHMS',
    badgeTone: 'neutral',
    oneLineResult:
      'Competed in Amman CPC 2025, 24-hour IEEEXtreme 19.0, and regional AI/engineering hackathons.',
    context:
      'Strengthened algorithmic problem solving, graph/search techniques, and debugging speed under timed contest constraints.',
    responsibility:
      'Participated as a collegiate contestant in Amman CPC 2025 and IEEEXtreme 19.0, practiced in ASU Coding Club, and collaborated in Replit, AI Week, Hack Ramadan, and UNI Agents hackathons.',
    technicalDecisions:
      'Practiced primarily in C++ and Java for predictable memory/time complexity during timed algorithmic rounds.',
    result:
      'Built strong DSA foundations and contributed to the 3rd-place ROOMS by VISION team in the 2026 Replit AI Hackathon.',
    relatedProjectIds: ['rooms', 'happensbefore'],
    evidenceIds: ['replit-award-2026']
  }
];
