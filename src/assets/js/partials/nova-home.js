/* ═══════════════════════════════════════════
   NOVA homepage interactions
   Ported from nova-eyewear-site/src/main.js.
   Bundled through the theme's webpack `home` entry
   (imported by src/assets/js/home.js) — no CDN tags.
   Only runs when a `.nova-home` wrapper is present,
   so Raed's other pages are unaffected.
   ═══════════════════════════════════════════ */
import Lenis from 'lenis';
import AOS from 'aos';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import Alpine from 'alpinejs';
// NOTE: AOS + Swiper CSS are imported via app.scss (the theme's SCSS pipeline),
// not here — Raed's webpack JS entry has no css-loader for JS-imported .css.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function initNova() {
  const root = document.querySelector('.nova-home');
  if (!root) return; // not the NOVA homepage — bail

  /* 1. Bundle + start Alpine (available for any x-data in the theme) */
  if (!window.Alpine) {
    window.Alpine = Alpine;
    try { Alpine.start(); } catch (e) { /* already started */ }
  }

  /* 2. Smooth scroll — Lenis */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  /* 3. GSAP + ScrollTrigger wired to Lenis */
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  /* 4. AOS — drop the no-JS fallback class first, then animate on scroll */
  root.classList.remove('no-aos');
  AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });

  /* 5. Hero entrance */
  gsap.from('.hero-title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  gsap.from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 });
  gsap.from('.hero-cta', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out', delay: 0.8 });

  /* 6. Hero background — drifting orbs, rotating rings, floating glasses */
  gsap.to('.hero-orb-core',  { x: 80,  y: -60, duration: 12, ease: 'sine.inOut', repeat: -1, yoyo: true });
  gsap.to('.hero-orb-day',   { x: -70, y: 50,  duration: 14, ease: 'sine.inOut', repeat: -1, yoyo: true });
  gsap.to('.hero-orb-night', { x: 60,  y: -40, duration: 16, ease: 'sine.inOut', repeat: -1, yoyo: true });
  gsap.to('.hero-ring',   { rotation: 360,  duration: 60, ease: 'none', repeat: -1, transformOrigin: 'center center' });
  gsap.to('.hero-ring-2', { rotation: -360, duration: 45, ease: 'none', repeat: -1, transformOrigin: 'center center' });
  gsap.to('.hero-glasses', { y: -15, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true });

  /* 7. Cross-fade the 3 hero lens images */
  const heroGlasses = document.querySelectorAll('.hero-glass-img');
  if (heroGlasses.length === 3) {
    let current = 0;
    setInterval(() => {
      const next = (current + 1) % 3;
      gsap.to(heroGlasses[current], { opacity: 0, duration: 1.5, ease: 'power2.inOut' });
      gsap.to(heroGlasses[next],    { opacity: 1, duration: 1.5, ease: 'power2.inOut' });
      current = next;
    }, 4000);
  }

  /* 8. Section heading reveals */
  gsap.utils.toArray('.section-heading').forEach((el) => {
    gsap.from(el, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' } });
  });

  /* 9. FAQ accordion (vanilla — robust, no framework dependency) */
  root.querySelectorAll('.nova-faq-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.nova-faq-item');
      const isOpen = item.classList.contains('is-open');
      root.querySelectorAll('.nova-faq-item.is-open').forEach((el) => el.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });

  /* 10. Init any Swiper carousels present (product pages / future use) */
  root.querySelectorAll('.swiper').forEach((el) => {
    new Swiper(el, { modules: [Pagination], pagination: { el: '.swiper-pagination', clickable: true } });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNova);
} else {
  initNova();
}
