import { escapeHtml, resolveAsset } from '../core/dom.js';
import { educationData } from '../data/education.js';
import { renderChannelHeader, renderChannelFooter } from '../components/channel-header.js';
import { badgeClassForTone } from '../components/retro-card.js';
import { renderEvidenceBadge } from '../components/evidence-link.js';
import { renderVisionDock, pulseVisionDock } from '../components/vision-dock.js';

let activeCampusMode = 'both';
let bilingualSampleLang = 'en';
const stampedIds = new Set();
const selectedCourses = new Map([
  ['asu', 'Database Systems'],
  ['upv', 'Quantum Computing Labs (QCO)']
]);

const COURSE_PROOF_MAP = {
  Algorithms: {
    appliedIn: 'Applied in Amman CPC 2025, 24-hour IEEEXtreme 19.0, and graph traversal logic.',
    route: '#certifications',
    cta: 'View Contest Record →'
  },
  'Data Structures': {
    appliedIn: 'Used to model directed partial-order execution graphs in HappensBefore and prerequisite trees in BandUp.',
    route: '#projects/happensbefore',
    cta: 'Inspect HappensBefore →'
  },
  'Object-Oriented Programming (Java)': {
    appliedIn: 'Core foundation for HappensBefore — modular Java/Gradle trace verifier & causal graph engine.',
    route: '#projects/happensbefore',
    cta: 'Open Java Case Study →'
  },
  'Database Systems': {
    appliedIn: 'Directly powers Space Day Digital Passport (PostgreSQL + Drizzle ORM relational constraints & QR approvals).',
    route: '#projects/space-day',
    cta: 'Inspect Space Day DB →'
  },
  'Software Engineering': {
    appliedIn: 'Practiced across multi-stakeholder event launches for NASA Space Apps Jordan & MENA Space Organization.',
    route: '#projects/nasa-space-apps',
    cta: 'Inspect NASA Platform →'
  },
  'Artificial Intelligence': {
    appliedIn: 'Applied to structured LLM rubric feedback in BandUp, ROOMS multiplayer quizzes, and Futureing tool routing.',
    route: '#projects/bandup',
    cta: 'Inspect BandUp AI →'
  },
  'Quantum Computing Labs (QCO)': {
    appliedIn: 'Published cleaned Quantum Computing Jupyter laboratory notebooks completed at ETSINF, UPV Valencia.',
    href: 'https://github.com/khalilAmustafa/quantum-computing-UPV',
    cta: 'Open UPV QCO Repo ↗'
  },
  'Informatics Engineering Coursework (ETSINF)': {
    appliedIn: 'European Informatics Engineering curriculum completed during the Spring 2026 Erasmus+ semester in Spain.',
    route: '#experience',
    cta: 'See Exchange Milestone →'
  },
  'Collaborative Software Engineering': {
    appliedIn: 'Applied in cross-functional sprint collaboration — including 3rd Place in the 2026 Replit AI Hackathon.',
    route: '#projects/rooms',
    cta: 'Inspect ROOMS Team Build →'
  },
  'Technical Communication in International Teams': {
    appliedIn: 'Daily English engineering collaboration in Valencia paired with bilingual Arabic/English product delivery.',
    route: '#projects/space-day',
    cta: 'See Bilingual Passport →'
  }
};

const EDU_TIPS = [
  'Tap any Coursework pill to see the exact project or repository where Khalil applied it!',
  'Hit "💮 Stamp Passport" on ASU or UPV, or test the live English/Arabic RTL switcher below!',
  'Filter between Amman (ASU), Valencia (UPV), or Side-by-Side Dual Passport view.'
];
let eduTipIdx = 0;

function renderPassportVisual(inst, isStamped) {
  const media = inst.media;
  return `
    <div class="passport-visual-wrap">
      ${
        media?.ready && media.src
          ? `
        <figure class="passport-photo-frame">
          <img
            src="${escapeHtml(resolveAsset(media.src))}"
            alt="${escapeHtml(media.alt)}"
            loading="lazy"
            class="passport-photo-img"
          >
          ${media.caption ? `<figcaption class="passport-photo-caption">${escapeHtml(media.caption)}</figcaption>` : ''}
        </figure>
      `
          : `
        <div class="passport-stamp-banner">
          <span class="passport-stamp-mark">${escapeHtml(media?.fallbackStamp || 'ACADEMIC RECORD')}</span>
        </div>
      `
      }
      <div class="passport-ink-seal ${isStamped ? 'is-stamped' : ''}" aria-hidden="true">
        <span>VERIFIED</span>
        <small>${inst.id === 'upv' ? 'ETSINF · VLC' : 'ASU · AMMAN'}</small>
      </div>
    </div>
  `;
}

function renderEducationBody() {
  const { institutions, languages } = educationData;
  const visibleInstitutions =
    activeCampusMode === 'both'
      ? institutions
      : institutions.filter((inst) => inst.id === activeCampusMode);

  return `
    <div class="edu-flight-bar">
      <div class="skill-filter-bar edu-mode-pills" role="toolbar" aria-label="Select campus passport view">
        <button type="button" class="filter-chip ${activeCampusMode === 'both' ? 'is-active' : ''}" data-campus-mode="both" aria-pressed="${activeCampusMode === 'both' ? 'true' : 'false'}">
          ⇄ DUAL PASSPORT (2)
        </button>
        <button type="button" class="filter-chip ${activeCampusMode === 'asu' ? 'is-active' : ''}" data-campus-mode="asu" aria-pressed="${activeCampusMode === 'asu' ? 'true' : 'false'}">
          AMMAN · ASU
        </button>
        <button type="button" class="filter-chip ${activeCampusMode === 'upv' ? 'is-active' : ''}" data-campus-mode="upv" aria-pressed="${activeCampusMode === 'upv' ? 'true' : 'false'}">
          VALENCIA · UPV
        </button>
      </div>

      <div class="flight-telemetry" aria-hidden="true">
        <span class="flight-code">AMM</span>
        <span class="flight-track"><i class="flight-plane">✈</i></span>
        <span class="flight-code">VLC · ERASMUS+</span>
      </div>
    </div>

    <div class="passport-grid ${activeCampusMode !== 'both' ? 'is-single-campus' : ''}">
      ${visibleInstitutions
        .map((inst, idx) => {
          const activeCourse = selectedCourses.get(inst.id) || inst.coursework[0];
          const proof = COURSE_PROOF_MAP[activeCourse];
          const isStamped = stampedIds.has(inst.id);

          return `
          <section class="retro-card passport-card stagger-item stagger-${idx + 1}" aria-label="${escapeHtml(inst.name)}">
            ${renderPassportVisual(inst, isStamped)}

            <div class="passport-top-actions">
              <span class="passport-code">${escapeHtml(inst.code)}</span>
              <button
                type="button"
                class="stamp-trigger-btn ${isStamped ? 'is-stamped' : ''}"
                data-stamp-passport="${escapeHtml(inst.id)}"
                aria-pressed="${isStamped ? 'true' : 'false'}"
              >
                ${isStamped ? '✓ RECORD STAMPED' : '💮 STAMP PASSPORT'}
              </button>
            </div>

            <div class="card-header-row">
              <h2 class="card-title">${escapeHtml(inst.name)}</h2>
              <span class="${badgeClassForTone(inst.badgeTone)}">${escapeHtml(inst.statusBadge)}</span>
            </div>
            <div class="card-meta">${escapeHtml(inst.degreeOrProgram)} · ${escapeHtml(inst.location)} · ${escapeHtml(inst.periodLabel)}</div>
            <p class="card-desc">${escapeHtml(inst.summary)}</p>

            <div class="passport-subblock">
              <span class="passport-subhead">TAP A COURSE TO SEE REAL PROJECT APPLICATION:</span>
              <div class="interactive-course-cloud" role="group" aria-label="${escapeHtml(inst.name)} coursework">
                ${inst.coursework
                  .map((course) => {
                    const isSelected = course === activeCourse;
                    return `
                    <button
                      type="button"
                      class="course-pill ${isSelected ? 'is-active' : ''}"
                      data-course-inst="${escapeHtml(inst.id)}"
                      data-course-name="${escapeHtml(course)}"
                      aria-pressed="${isSelected ? 'true' : 'false'}"
                    >
                      ${escapeHtml(course)}
                    </button>
                  `;
                  })
                  .join('')}
              </div>

              ${
                proof
                  ? `
                <div class="course-proof-drawer">
                  <div class="course-proof-title">APPLIED IN PRACTICE // ${escapeHtml(activeCourse.toUpperCase())}</div>
                  <p class="course-proof-text">${escapeHtml(proof.appliedIn)}</p>
                  ${
                    proof.href
                      ? `<a href="${escapeHtml(proof.href)}" target="_blank" rel="noopener noreferrer" class="btn-card-link primary btn-compact">${escapeHtml(proof.cta)}</a>`
                      : `<a href="${escapeHtml(proof.route)}" class="btn-card-link secondary btn-compact" data-route="${escapeHtml(proof.route)}">${escapeHtml(proof.cta)}</a>`
                  }
                </div>
              `
                  : ''
              }
            </div>

            ${
              inst.activities && inst.activities.length
                ? `
              <ul class="card-bullets passport-bullets">
                ${inst.activities.map((act) => `<li>${escapeHtml(act)}</li>`).join('')}
              </ul>
            `
                : ''
            }

            ${inst.evidenceId ? `<div class="passport-evidence">${renderEvidenceBadge(inst.evidenceId)}</div>` : ''}
          </section>
        `;
        })
        .join('')}
    </div>

    <section class="retro-card stagger-item stagger-3" aria-label="Spoken languages and bilingual interface engineering">
      <div class="card-header-row">
        <div>
          <h2 class="card-title">SPOKEN LANGUAGES &amp; BILINGUAL ENGINEERING</h2>
          <div class="card-meta">Real Arabic (RTL) &amp; English (LTR) software delivery</div>
        </div>
        <div class="bilingual-toggle-group" role="group" aria-label="Preview bilingual UI direction">
          <button
            type="button"
            class="filter-chip ${bilingualSampleLang === 'en' ? 'is-active' : ''}"
            data-bilingual-lang="en"
            aria-pressed="${bilingualSampleLang === 'en' ? 'true' : 'false'}"
          >
            EN · LTR
          </button>
          <button
            type="button"
            class="filter-chip ${bilingualSampleLang === 'ar' ? 'is-active' : ''}"
            data-bilingual-lang="ar"
            aria-pressed="${bilingualSampleLang === 'ar' ? 'true' : 'false'}"
          >
            AR · العربية RTL
          </button>
        </div>
      </div>

      <div class="language-grid">
        ${languages
          .map(
            (lang) => `
          <div class="language-tile">
            <div class="language-tile-top">
              <strong class="language-name">${escapeHtml(lang.language.toUpperCase())}</strong>
              <span class="language-level">${escapeHtml(lang.proficiency)}</span>
            </div>
            <p class="language-detail">${escapeHtml(lang.detail)}</p>
            ${lang.evidenceId ? renderEvidenceBadge(lang.evidenceId) : ''}
          </div>
        `
          )
          .join('')}
      </div>

      <div class="bilingual-live-preview" dir="${bilingualSampleLang === 'ar' ? 'rtl' : 'ltr'}">
        <span class="bilingual-preview-tag">${bilingualSampleLang === 'ar' ? 'معاينة واجهة عربية (RTL)' : 'LIVE BILINGUAL COMPONENT PREVIEW (LTR)'}</span>
        <p class="bilingual-preview-copy">
          ${
            bilingualSampleLang === 'ar'
              ? 'مرحباً! أبني أنظمة ويب ومنصات فعاليات ثنائية اللغة (عربي / إنجليزي) مثل جواز يوم الفضاء ومنصة أسد للرياضيات.'
              : 'Hello! Khalil builds production bilingual English/Arabic web systems — including the Space Day Digital Passport and Asad Math portal.'
          }
        </p>
      </div>
    </section>
  `;
}

export function renderEducationChannel() {
  return `
    <article class="channel-view" aria-label="Education and languages transmission">
      ${renderChannelHeader({
        eyebrow: 'CH 03 // TRANSMISSION: ACADEMIC PASSPORT',
        title: 'ACADEMIC FOUNDATIONS',
        subtitle: educationData.intro
      })}

      ${renderVisionDock({
        message: EDU_TIPS[0],
        actions: [
          { id: 'edu-stamp-all', label: '💮 Stamp Both Passports' },
          { id: 'edu-upv-qco', label: '⚛ Highlight Quantum Lab' },
          { id: 'edu-flip-rtl', label: '🌐 Flip EN / العربية RTL' }
        ]
      })}

      <div id="education-interactive-mount">
        ${renderEducationBody()}
      </div>

      ${renderChannelFooter({
        nextRoute: '#skills',
        nextLabel: 'Next: CH 04 Skills →'
      })}
    </article>
  `;
}

export function bindEducationEvents(screenContent, { sound } = {}) {
  screenContent.addEventListener('click', (event) => {
    if (!document.getElementById('education-interactive-mount')) return;

    if (event.target.closest('[data-dock-avatar]')) {
      eduTipIdx = (eduTipIdx + 1) % EDU_TIPS.length;
      pulseVisionDock(EDU_TIPS[eduTipIdx]);
      return;
    }

    const dockBtn = event.target.closest('[data-dock-action]');
    if (dockBtn) {
      const act = dockBtn.getAttribute('data-dock-action');
      if (act === 'edu-stamp-all') {
        activeCampusMode = 'both';
        stampedIds.add('asu');
        stampedIds.add('upv');
        sound?.successChime?.();
        pulseVisionDock('Stamped both Amman (ASU) & Valencia (UPV) academic passports!');
      } else if (act === 'edu-upv-qco') {
        activeCampusMode = 'upv';
        selectedCourses.set('upv', 'Quantum Computing Labs (QCO)');
        pulseVisionDock('Focused UPV Valencia — Quantum Computing (QCO) Jupyter labs ready below!');
      } else if (act === 'edu-flip-rtl') {
        bilingualSampleLang = bilingualSampleLang === 'en' ? 'ar' : 'en';
        pulseVisionDock(
          bilingualSampleLang === 'ar'
            ? 'Switched live preview to Arabic RTL layout!'
            : 'Switched live preview to English LTR layout!'
        );
      }
      const mount = document.getElementById('education-interactive-mount');
      if (mount) mount.innerHTML = renderEducationBody();
      return;
    }

    const modeBtn = event.target.closest('[data-campus-mode]');
    if (modeBtn) {
      activeCampusMode = modeBtn.getAttribute('data-campus-mode') || 'both';
      const mount = document.getElementById('education-interactive-mount');
      if (mount) mount.innerHTML = renderEducationBody();
      return;
    }

    const stampBtn = event.target.closest('[data-stamp-passport]');
    if (stampBtn) {
      const id = stampBtn.getAttribute('data-stamp-passport');
      if (!id) return;
      if (stampedIds.has(id)) {
        stampedIds.delete(id);
      } else {
        stampedIds.add(id);
        sound?.successChime?.();
      }
      const mount = document.getElementById('education-interactive-mount');
      if (mount) mount.innerHTML = renderEducationBody();
      return;
    }

    const courseBtn = event.target.closest('[data-course-inst]');
    if (courseBtn) {
      const instId = courseBtn.getAttribute('data-course-inst');
      const courseName = courseBtn.getAttribute('data-course-name');
      if (!instId || !courseName) return;
      selectedCourses.set(instId, courseName);
      const mount = document.getElementById('education-interactive-mount');
      if (mount) mount.innerHTML = renderEducationBody();
      return;
    }

    const langBtn = event.target.closest('[data-bilingual-lang]');
    if (langBtn) {
      bilingualSampleLang = langBtn.getAttribute('data-bilingual-lang') || 'en';
      const mount = document.getElementById('education-interactive-mount');
      if (mount) mount.innerHTML = renderEducationBody();
    }
  });
}
