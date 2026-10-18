(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  // mobile menu
  const btn = document.getElementById('menuBtn'), menu = document.getElementById('menu');
  btn.addEventListener('click', () => { const o = menu.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') { menu.classList.remove('open'); btn.setAttribute('aria-expanded', false); } });
  // scroll progress
  const bar = document.getElementById('progress');
  addEventListener('scroll', () => { bar.style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%'; }, { passive: true });
  // boot line
  const boot = document.getElementById('boot');
  const msg = '> profile loaded: student, builder, still learning';
  if (reduce) boot.textContent = msg; else { let i = 0; const t = setInterval(() => { boot.textContent = msg.slice(0, ++i); if (i >= msg.length) clearInterval(t); }, 28); }
  // ambient background: the mood follows the section in view, with light parallax and a few dust motes
  const amb = document.getElementById('ambient'), words = amb.querySelectorAll('.w');
  const setMood = m => { amb.dataset.mood = m; words.forEach(w => w.classList.toggle('on', w.dataset.show.split(' ').includes(m))); };
  setMood('hero');
  const moods = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setMood(e.target.dataset.mood); }), { rootMargin: '-45% 0px -45% 0px' });
  document.querySelectorAll('[data-mood]').forEach(s => moods.observe(s));
  addEventListener('scroll', () => { if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) setMood('contact'); }, { passive: true });
  if (!reduce) {
    if (fine) addEventListener('pointermove', e => { amb.style.setProperty('--mx', (e.clientX / innerWidth * 2 - 1).toFixed(2)); amb.style.setProperty('--my', (e.clientY / innerHeight * 2 - 1).toFixed(2)); }, { passive: true });
    for (let i = 0; i < (innerWidth < 820 ? 3 : 8); i++) {
      const d = document.createElement('i'), s = 1 + Math.random() * 1.5;
      d.className = 'dust';
      d.style.cssText = `left:${Math.random() * 100}%;width:${s}px;height:${s}px;opacity:${.2 + Math.random() * .4};animation-duration:${30 + Math.random() * 30}s;animation-delay:-${Math.random() * 40}s`;
      amb.appendChild(d);
    }
  }
  // hero orbit: rotation is tied to scroll position (no free-spinning), and the hero eases back as you leave it
  const heroEl = document.querySelector('.hero'), rings = document.querySelectorAll('.ring');
  if (!reduce) {
    const speeds = [0.1, 0.18, -0.12];
    let ticking = false;
    const frame = () => {
      ticking = false;
      const y = scrollY;
      rings.forEach((r, i) => { r.style.transform = `rotate(${(y * speeds[i]).toFixed(2)}deg)`; });
      heroEl.style.setProperty('--p', Math.min(y / (innerHeight * .9), 1).toFixed(3));
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
    frame();
  }
  // magnetic buttons and project tilt (desktop only)
  if (fine && !reduce) {
    document.querySelectorAll('.mag').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px,${(e.clientY - r.top - r.height / 2) * .25}px)`; });
      b.addEventListener('pointerleave', () => b.style.transform = '');
    });
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => { const r = card.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5; card.style.transform = `perspective(900px) rotateY(${px * 1.5}deg) rotateX(${-py * 1.5}deg)`; });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });
  }
  // gentle reveal for the timeline only
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2 });
  document.querySelectorAll('.tl li').forEach(el => { el.classList.add('rv'); io.observe(el); });
})();