export const profile = {
  name: {
    first: 'KHALIL',
    middle: 'ASAD',
    last: 'MUSTAFA',
    full: 'Khalil Asad Mustafa'
  },
  channelBrand: 'KHALIL / PERSONAL CHANNEL',
  location: 'Amman, Jordan',
  locationUpper: 'AMMAN, JORDAN',
  timezone: 'GMT+3',
  descriptor: 'COMPUTER SCIENCE · BACKEND SYSTEMS · CLOUD · APPLIED AI',
  positioning:
    'Computer Science student and software engineer focused on backend systems, cloud infrastructure, and applied AI — building event platforms, operational workflows, and interactive learning software. Studying CS in Amman with an Erasmus+ exchange at UPV Valencia.',
  ctas: {
    primary: {
      label: 'EXPLORE MY WORK',
      route: '#projects'
    },
    secondary: {
      label: 'GET IN TOUCH',
      route: '#contact'
    }
  },
  highlights: [
    {
      id: 'hl-nasa',
      value: '380+ Participants',
      label: 'NASA Space Apps platform',
      scopeTag: 'Event scale · 85+ teams',
      route: '#projects/nasa-space-apps',
      evidenceId: 'nasa-space-apps-event'
    },
    {
      id: 'hl-replit',
      value: '3rd Place',
      label: 'Replit AI Hackathon 2026',
      scopeTag: 'Team award · ROOMS',
      route: '#projects/rooms',
      evidenceId: 'replit-award-2026'
    },
    {
      id: 'hl-erasmus',
      value: 'Erasmus+ 2026',
      label: 'UPV Valencia · ETSINF',
      scopeTag: 'Informatics exchange',
      route: '#education',
      evidenceId: 'erasmus-upv-2026'
    },
    {
      id: 'hl-aws',
      value: 'AWS Certified',
      label: 'Cloud Practitioner',
      scopeTag: 'Issued May 2026',
      route: '#certifications',
      evidenceId: 'aws-ccp-2026'
    }
  ],
  companion: {
    name: 'VISION',
    spriteSrc: 'assets/vision-animated-spritesheet.png',
    metaTitle: 'VISION // INTERACTIVE COMPANION',
    metaHint: 'CLICK FOR NOTE',
    ariaLabel: 'Vision, animated pixel-art interactive companion. Activate to cycle channel notes.',
    defaultGreeting: "HEY!\nI'M VISION.",
    quotesByChannel: {
      home: [
        "HEY!\nI'M VISION.",
        "OPEN CH 05\nFOR CASE STUDIES →",
        "TURN THE DIAL\nOR TAP A PROOF.",
        "BUILT IN\nAMMAN, JORDAN."
      ],
      projects: [
        "PICK A PROJECT\nFOR FULL DETAILS.",
        "REAL STACKS &\nTRADEOFFS INSIDE."
      ]
    }
  }
};
