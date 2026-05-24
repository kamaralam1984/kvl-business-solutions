// ============ THEME TOGGLE ============
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('kvl-theme') || 'dark';
root.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('kvl-theme', next);
});

// ============ MOBILE NAV ============
const hamburger = document.getElementById('hamburger');
const primaryNav = document.getElementById('primaryNav');
hamburger.addEventListener('click', () => primaryNav.classList.toggle('open'));

// ============ HEADER ON SCROLL ============
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) header.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,.25)';
  else header.style.boxShadow = 'none';
});

// ============ STAT COUNTER ============
const counters = document.querySelectorAll('[data-count]');
const animateCounter = (el) => {
  const target = +el.dataset.count;
  let current = 0;
  const step = Math.max(1, Math.floor(target / 60));
  const tick = () => {
    current += step;
    if (current >= target) {
      el.textContent = target + '+';
    } else {
      el.textContent = current + '+';
      requestAnimationFrame(tick);
    }
  };
  tick();
};
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
  });
}, { threshold: .5 });
counters.forEach(c => io.observe(c));

// ============ FOOTER YEAR ============
document.getElementById('year').textContent = new Date().getFullYear();
