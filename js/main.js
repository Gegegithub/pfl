const MOON = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const SUN  = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

const html     = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
const langBtns = document.querySelectorAll('.lang-btn');

// Theme
const savedTheme = localStorage.getItem('gb-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
themeBtn.innerHTML = savedTheme === 'dark' ? SUN : MOON;

themeBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('gb-theme', next);
  themeBtn.innerHTML = next === 'dark' ? SUN : MOON;
});

// Language
const savedLang = localStorage.getItem('gb-lang') || 'en';
html.setAttribute('data-lang', savedLang);
langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === savedLang));

langBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    html.setAttribute('data-lang', lang);
    localStorage.setItem('gb-lang', lang);
    langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  });
});

// Hero bg zoom
window.addEventListener('load', () => {
  document.querySelector('.hero-bg')?.classList.add('in');
});

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('[data-anim]').forEach(el => obs.observe(el));

// Portrait reveal
const pObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.2 });
document.querySelectorAll('.portrait').forEach(el => pObs.observe(el));

// Timeline tabs
document.querySelectorAll('.tl-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tl-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tl-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tl-' + tab.dataset.tab).classList.add('active');
  });
});

// Terminal animation
const termBody = document.getElementById('term-body');
if (termBody) {
  const steps = [
    { type: 'cmd', prompt: '❯ ', text: 'git clone github.com/Gegegithub/ResumeRadar' },
    { type: 'out', text: '  Cloning into \'ResumeRadar\'...' },
    { type: 'success', text: '  ✓ Done.' },
    { type: 'cmd', prompt: '❯ ', text: 'python main.py --model llama3.1 --top-k 5' },
    { type: 'out', text: '  Loading Ollama model...' },
    { type: 'out', text: '  Ranking 12 CVs...' },
    { type: 'out', text: '  #1  Alice M.    ████████░░  84.2%' },
    { type: 'out', text: '  #2  Jean P.     ███████░░░  71.8%' },
    { type: 'out', text: '  #3  Sofia K.    ██████░░░░  63.4%' },
    { type: 'success', text: '  ✓ Report saved → output/ranking.json' },
    { type: 'cmd', prompt: '❯ ', text: 'docker compose up kafka zookeeper' },
    { type: 'out', text: '  Starting broker on localhost:9092...' },
    { type: 'success', text: '  ✓ Kafka ready.' },
    { type: 'cmd', prompt: '❯ ', text: 'python stream.py --topic transactions' },
    { type: 'out', text: '  Consuming stream...' },
    { type: 'out', text: '  [284,807 events]  fraud: 0.17%' },
    { type: 'success', text: '  ✓ Predictions → PostgreSQL' },
  ];

  let stepIdx = 0, charIdx = 0;
  let currentEl = null;
  const cursor = document.createElement('span');
  cursor.className = 'term-cursor';

  function nextStep() {
    if (stepIdx >= steps.length) {
      setTimeout(() => {
        termBody.innerHTML = '';
        stepIdx = 0; charIdx = 0; currentEl = null;
        termBody.appendChild(cursor);
        typeChar();
      }, 2000);
      return;
    }
    const step = steps[stepIdx];
    const line = document.createElement('div');
    line.className = 'term-line';
    if (step.type === 'cmd') {
      line.innerHTML = `<span class="prompt">${step.prompt}</span><span class="cmd"></span>`;
      currentEl = line.querySelector('.cmd');
    } else if (step.type === 'success') {
      line.innerHTML = `<span class="success"></span>`;
      currentEl = line.querySelector('.success');
    } else {
      line.innerHTML = `<span class="out"></span>`;
      currentEl = line.querySelector('.out');
    }
    termBody.insertBefore(line, cursor);
    charIdx = 0;
    typeChar();
  }

  function typeChar() {
    const step = steps[stepIdx];
    const text = step.text;
    const delay = step.type === 'cmd' ? 55 : 18;
    if (charIdx < text.length) {
      currentEl.textContent += text[charIdx++];
      setTimeout(typeChar, delay);
    } else {
      stepIdx++;
      setTimeout(nextStep, step.type === 'cmd' ? 400 : 120);
    }
  }

  termBody.appendChild(cursor);
  setTimeout(nextStep, 800);
}

// Copy email
document.querySelectorAll('.copy-email').forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText('Ge.birangou.26@eigsica.ma');
    const lang = html.getAttribute('data-lang');
    const original = btn.innerHTML;
    btn.textContent = lang === 'fr' ? 'Copié !' : 'Copied!';
    setTimeout(() => btn.innerHTML = original, 2000);
  });
});
