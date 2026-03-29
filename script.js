/* ============================================================
   VARSHINI V — PORTFOLIO SCRIPT
   Particle system · Scroll animations · Nav · Interactions
   ============================================================ */

/* ══════════════════════
   PARTICLE CANVAS
══════════════════════ */
const canvas = document.getElementById("bg");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Mouse tracking for interactive attraction
const mouse = { x: null, y: null };
window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x    = Math.random() * canvas.width;
    this.y    = Math.random() * canvas.height;
    this.vx   = (Math.random() - 0.5) * 0.35;
    this.vy   = (Math.random() - 0.5) * 0.35;
    this.radius = Math.random() * 1.6 + 0.4;
    this.alpha  = Math.random() * 0.5 + 0.2;
    // Vary particle colours between violet, blue, cyan
    const palette = [
      "167, 139, 250",   // violet
      "96,  165, 250",   // blue
      "52,  211, 153",   // teal
      "196, 181, 253",   // lavender
    ];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    // Mouse attraction — gentle pull
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const force = (180 - dist) / 180 * 0.018;
        this.vx += dx / dist * force;
        this.vy += dy / dist * force;
      }
    }

    // Speed limit
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 1.1) {
      this.vx = (this.vx / speed) * 1.1;
      this.vy = (this.vy / speed) * 1.1;
    }

    // Wrap edges
    if (this.x < -10) this.x = canvas.width + 10;
    if (this.x > canvas.width + 10) this.x = -10;
    if (this.y < -10) this.y = canvas.height + 10;
    if (this.y > canvas.height + 10) this.y = -10;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fill();
  }
}

const particles = [];
for (let i = 0; i < 75; i++) particles.push(new Particle());

function connectParticles() {
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.18;
        ctx.strokeStyle = `rgba(167, 139, 250, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.move(); p.draw(); });
  connectParticles();
  requestAnimationFrame(animate);
}
animate();

/* ══════════════════════
   SCROLL-BASED FADE IN
══════════════════════ */
// Apply class to all section children we want to animate
const animTargets = [
  ".section__label",
  ".section__heading",
  ".about__grid",
  ".about__chips",
  ".skills__grid",
  ".skill-card",
  ".projects__grid",
  ".project-card",
  ".contact__wrap",
  ".contact-card",
  ".hero__inner",
];

function initScrollAnimations() {
  document.querySelectorAll(
    ".section__label, .section__heading, .about__grid, .about__chips, " +
    ".skill-card, .project-card, .contact__wrap, .contact-card"
  ).forEach((el, i) => {
    el.classList.add("fade-in");
    el.style.transitionDelay = `${(i % 5) * 0.07}s`;
  });

  // Hero fades in on load
  const heroInner = document.querySelector(".hero__inner");
  if (heroInner) {
    heroInner.style.opacity = "0";
    heroInner.style.transform = "translateY(24px)";
    heroInner.style.transition = "opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1)";
    setTimeout(() => {
      heroInner.style.opacity = "1";
      heroInner.style.transform = "translateY(0)";
    }, 120);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

/* ══════════════════════
   NAV — SCROLL & MOBILE
══════════════════════ */
const nav    = document.getElementById("nav");
const burger = document.getElementById("burger");
const drawer = document.getElementById("drawer");

// Scrolled class for nav bg
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 30);
  updateActiveNavLink();
}, { passive: true });

// Active nav link
const sections = document.querySelectorAll("section[id], header[id]");
function updateActiveNavLink() {
  const scrollPos = window.scrollY + 120;
  let currentId = "";
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollPos) currentId = sec.id;
  });
  document.querySelectorAll(".nav__links a").forEach(a => {
    const href = a.getAttribute("href").replace("#", "");
    a.classList.toggle("active-link", href === currentId);
  });
}

// Mobile burger toggle
burger.addEventListener("click", () => {
  const open = drawer.classList.toggle("open");
  burger.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
});

function closeDrawer() {
  drawer.classList.remove("open");
  burger.classList.remove("open");
  document.body.style.overflow = "";
}

/* ══════════════════════
   PROJECT CARD — TILT
══════════════════════ */
function initCardTilt() {
  document.querySelectorAll(".project-card, .skill-card, .contact-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   =  dy * -5;
      const rotY   =  dx *  5;

      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ══════════════════════
   CURSOR GLOW (subtle)
══════════════════════ */
function initCursorGlow() {
  const glow = document.createElement("div");
  glow.style.cssText = `
    position: fixed;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 1;
    transition: opacity 0.4s;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  let lx = -400, ly = -400;
  let targetX = -400, targetY = -400;

  window.addEventListener("mousemove", e => {
    targetX = e.clientX;
    targetY = e.clientY;
    glow.style.opacity = "1";
  });
  window.addEventListener("mouseleave", () => { glow.style.opacity = "0"; });

  (function loop() {
    lx += (targetX - lx) * 0.08;
    ly += (targetY - ly) * 0.08;
    glow.style.left = lx + "px";
    glow.style.top  = ly + "px";
    requestAnimationFrame(loop);
  })();
}

/* ══════════════════════
   NAV ACTIVE LINK STYLE
══════════════════════ */
const navLinkStyle = document.createElement("style");
navLinkStyle.textContent = `
  .nav__links a.active-link { color: #eef2ff; }
  .nav__links a.active-link::after { width: 100%; }
`;
document.head.appendChild(navLinkStyle);

/* ══════════════════════
   INIT
══════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initScrollAnimations();
  initCardTilt();
  initCursorGlow();
  updateActiveNavLink();
});
