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
