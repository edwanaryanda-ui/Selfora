/* Efek landing page: animasi fade, teks terungkap saat scroll, video HLS, navbar */
(function () {
  const $$ = (s) => [...document.querySelectorAll(s)];
  // 1. fade-up saat masuk layar
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -100px 0px' });
  $$('.fade').forEach(el => io.observe(el));

  // 2. teks terungkap kata demi kata mengikuti scroll
  function wrap(node, hl) {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(w => { if (!w.trim()) return f.append(w); const s = document.createElement('span'); s.textContent = w; if (hl) s.className = 'hl'; f.append(s, ' '); });
        n.replaceWith(f);
      } else if (n.nodeType === 1) wrap(n, true);
    });
  }
  $$('.rv').forEach(el => { wrap(el, false); el._w = [...el.querySelectorAll('span')]; });
  function reveal() {
    const h = innerHeight;
    $$('.rv').forEach(el => {
      const r = el.getBoundingClientRect(); if (!r.height) return;
      const p = Math.min(1, Math.max(0, (h * .85 - r.top) / (r.height + h * .3)));
      el._w.forEach((s, i) => { s.style.opacity = .15 + .85 * Math.min(1, Math.max(0, (p * 1.15 - i / el._w.length) * 6)); });
    });
  }

  // 3. navbar: transparan di beranda paling atas, solid saat scroll / di halaman lain
  const nav = document.querySelector('.nav');
  function navState() {
    const home = !location.hash || /^#\/home$/.test(location.hash);
    nav.classList.toggle('scrolled', scrollY > 20 || !home);
    reveal();
  }
  addEventListener('scroll', navState, { passive: true });
  addEventListener('hashchange', () => setTimeout(navState, 50));
  addEventListener('resize', reveal);

  // 4. video HLS untuk bagian CTA
  const v = document.getElementById('ctaVideo'), src = 'https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8';
  if (v) {
    if (window.Hls && Hls.isSupported()) { const hls = new Hls(); hls.loadSource(src); hls.attachMedia(v); }
    else if (v.canPlayType('application/vnd.apple.mpegurl')) v.src = src;
  }
  navState();
})();
