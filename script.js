/* =====================================================
   TIMELINE DATA
===================================================== */
const timelineData = {
  '2024': {
    year: '2024',
    title: 'Started Learning Programming',
    tags: ['Python', 'GitHub', 'Problem Solving', 'Console Apps']
  },
  '2025': {
    year: '2025',
    title: 'Built Websites',
    tags: ['Learned Flask', 'Frontend', 'Backend', 'SQLite']
  },
  '2026': {
    year: '2026',
    title: 'Internship & Campus Transport Management System',
    tags: ['Portfolio', 'GitHub', 'DSA']
  },
  'future': {
    year: 'Next',
    title: 'Software Engineer',
    tags: ['Open Source', 'Backend', 'AI', 'Cloud']
  }
};

/* =====================================================
   TIMELINE RENDER + SWITCH
===================================================== */
function renderTimeline(key) {
  const panel = document.getElementById('timelinePanel');
  const data = timelineData[key];
  if (!panel || !data) return;

  panel.style.opacity = '0';

  setTimeout(() => {
    panel.innerHTML = `
      <div class="timeline-year">${data.year}</div>
      <div>
        <h3 class="timeline-content-title">${data.title}</h3>
        <div class="timeline-tags">
          ${data.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
    panel.style.opacity = '1';
  }, 200);
}

function initTimeline() {
  const buttons = document.querySelectorAll('.timeline-btn');
  if (!buttons.length) return;

  renderTimeline('2024');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderTimeline(btn.dataset.year);
    });
  });
}

/* =====================================================
   NAVBAR SCROLL EFFECT
===================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* =====================================================
   SCROLL PROGRESS BAR
===================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* =====================================================
   MOBILE NAV TOGGLE
===================================================== */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* =====================================================
   ACTIVE NAVIGATION (SCROLLSPY)
===================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

/* =====================================================
   SCROLL REVEAL
===================================================== */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
}

/* =====================================================
   BACK TO TOP
===================================================== */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =====================================================
   SMOOTH SCROLL FOR IN-PAGE LINKS
===================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* =====================================================
   INIT
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTimeline();
  initNavbarScroll();
  initScrollProgress();
  initMobileNav();
  initScrollSpy();
  initScrollReveal();
  initBackToTop();
  initSmoothScroll();
});