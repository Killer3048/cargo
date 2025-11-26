const observer = new IntersectionObserver(
  entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')),
  { threshold: 0.15 }
);
document.querySelectorAll('.fade').forEach(el => observer.observe(el));

const topBtn = document.querySelector('.top-btn');
if (topBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 320) topBtn.classList.add('show');
    else topBtn.classList.remove('show');
  });
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const burger = document.querySelector('.burger');
const mobileNav = document.querySelector('.mobile-nav');
const header = document.querySelector('header');
const toggleMenu = () => {
  burger?.classList.toggle('open');
  mobileNav?.classList.toggle('show');
};
if (burger && mobileNav) {
  burger.addEventListener('click', toggleMenu);
  burger.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileNav.classList.remove('show');
    });
  });
}

// Hide header on deep scroll, show when back
if (header) {
  let ticking = false;
  const hideThreshold = 0.55; // 55% страницы
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      if (progress > hideThreshold) header.classList.add('header-hidden');
      else header.classList.remove('header-hidden');
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
const savedTheme = localStorage.getItem('theme');
const appliedTheme = savedTheme || (prefersLight ? 'light' : 'dark');
const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
  localStorage.setItem('theme', theme);
  document.querySelectorAll('[data-toggle-theme]').forEach(btn => {
    const isLight = theme === 'light';
    btn.setAttribute('aria-pressed', isLight);
    btn.setAttribute('aria-label', isLight ? 'Переключить на тёмную тему' : 'Переключить на светлую тему');
    const icon = btn.querySelector('.theme-icon');
    if (icon) icon.textContent = isLight ? '🌞' : '🌙';
    const label = btn.querySelector('.theme-label');
    if (label) label.textContent = isLight ? 'Светлая тема' : 'Тёмная тема';
  });
};
setTheme(appliedTheme);

document.querySelectorAll('[data-toggle-theme]').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  });
});
