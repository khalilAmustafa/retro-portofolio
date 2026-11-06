export const educationData = {
  intro:
    'Undergraduate Computer Science degree in Amman paired with a European Informatics Engineering exchange semester in Valencia.',
  institutions: [
    {
      id: 'asu',
      code: 'PASSPORT // 01 · DEGREE INSTITUTION',
      name: 'Applied Science Private University (ASU)',
      degreeOrProgram: 'B.Sc. in Computer Science',
      statusBadge: 'IN PROGRESS · EXPECTED 2027',
      badgeTone: 'live',
      location: 'Amman, Jordan',
      periodLabel: 'Expected Graduation: 2027',
      summary:
        'Core undergraduate training in computer science fundamentals, object-oriented software design, relational databases, and applied artificial intelligence.',
      coursework: [
        'Algorithms',
        'Data Structures',
        'Object-Oriented Programming (Java)',
        'Database Systems',
        'Software Engineering',
        'Artificial Intelligence'
      ],
      activities: [
        'Active member of ASU Coding Club (algorithmic practice & peer problem solving)',
        'Collegiate contestant in Amman CPC 2025 and IEEEXtreme 19.0'
      ],
      media: {
        src: 'assets/education/asu.webp',
        alt: 'Applied Science Private University official emblem',
        caption: 'Applied Science Private University · Faculty of Information Technology, Amman',
        ready: true,
        fallbackStamp: 'ASU · AMMAN, JORDAN // FACULTY OF IT'
      },
      evidenceId: null
    },
    {
      id: 'upv',
      code: 'PASSPORT // 02 · INTERNATIONAL EXCHANGE',
      name: 'Universitat Politècnica de València (UPV)',
      degreeOrProgram: 'Erasmus+ Exchange · Informatics Engineering (ETSINF)',
      statusBadge: 'ERASMUS+ · SPRING 2026',
      badgeTone: 'award',
      location: 'Valencia, Spain',
      periodLabel: 'Spring Semester 2026',
      summary:
        'Selected for a one-semester European Union Erasmus+ academic exchange at UPV’s School of Informatics (ETSINF), studying in an international engineering environment.',
      coursework: [
        'Quantum Computing Labs (QCO)',
        'Informatics Engineering Coursework (ETSINF)',
        'Collaborative Software Engineering',
        'Technical Communication in International Teams'
      ],
      activities: [
        'Published cleaned Quantum Computing (QCO) Jupyter laboratory notebooks from UPV coursework',
        'Completed exchange semester in Valencia while advancing cloud certification and systems R&D'
      ],
      media: {
        src: 'assets/education/upv.webp',
        alt: 'Universitat Politècnica de València official emblem',
        caption: 'ETSINF · Universitat Politècnica de València, Spain (Spring 2026)',
        ready: true,
        fallbackStamp: 'UPV · VALENCIA, SPAIN // ETSINF EXCHANGE'
      },
      evidenceId: 'erasmus-upv-2026'
    }
  ],
  languages: [
    {
      id: 'lang-ar',
      language: 'Arabic',
      proficiency: 'Native Proficiency',
      detail: 'Used daily across stakeholder requirements and bilingual Arabic/English web interfaces.',
      evidenceId: null
    },
    {
      id: 'lang-en',
      language: 'English',
      proficiency: 'B2 Upper-Intermediate (EF SET)',
      detail: 'Technical documentation, international coursework at UPV, and software engineering collaboration.',
      evidenceId: 'efset-b2'
    }
  ]
};
