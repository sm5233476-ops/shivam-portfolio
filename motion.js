/* ==========================================================================
   MOTION.JS - Animation Architecture & Motion Choreography
   Author: Shivam Mishra
   Libraries: Lenis, GSAP, ScrollTrigger (cdnjs)
   ========================================================================== */

// Configuration Switch: "full" | "lite" | "none" (Line 8)
const IMAGE_MOTION = "full";

(function () {
  'use strict';

  // Check GSAP availability
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP or ScrollTrigger not loaded. Motion skipped.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  /* --------------------------------------------------------------------------
     1. Unified Smooth Scroll Engine (Lenis + GSAP Single Ticker Loop)
     -------------------------------------------------------------------------- */
  let lenis = null;

  if (!prefersReducedMotion && !isTouchDevice && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      autoRaf: false
    });

    // Expose globally so script.js modal scroll-lock can stop/start it
    window.lenisInstance = lenis;

    // Synchronize Lenis scroll position with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis strictly through GSAP's single ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  } else {
    window.lenisInstance = null;
  }

  /* --------------------------------------------------------------------------
     2. Top Horizontal Scroll Progress Bar
     -------------------------------------------------------------------------- */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Sticky Navbar Auto Hide/Show on Scroll Direction
     -------------------------------------------------------------------------- */
  const siteHeader = document.getElementById('site-header');
  if (siteHeader) {
    ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (self.scroll() > 100 && self.direction === 1) {
          siteHeader.classList.add('site-header--hidden');
        } else if (self.direction === -1) {
          siteHeader.classList.remove('site-header--hidden');
        }
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Anchor Link Offset Navigation
     -------------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -72 });
        } else {
          const targetY = targetEl.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. Hero Word-by-Word Masked Reveal
     -------------------------------------------------------------------------- */
  function initHeroTitleReveal() {
    const titleEl = document.querySelector('[data-animate="hero-words"]');
    if (!titleEl || prefersReducedMotion) return;

    // Target child nodes and wrap text tokens into masked wrappers
    const words = titleEl.innerText.split(' ');
    titleEl.innerHTML = '';

    words.forEach((word) => {
      const wrapper = document.createElement('span');
      wrapper.className = 'hero-word-wrapper';
      const inner = document.createElement('span');
      inner.className = 'hero-word';

      if (word.toLowerCase().includes('visitors')) {
        inner.className += ' font-serif-italic text-accent';
      }
      inner.textContent = word + ' ';
      wrapper.appendChild(inner);
      titleEl.appendChild(wrapper);
    });

    gsap.fromTo(
      titleEl.querySelectorAll('.hero-word'),
      {
        y: '115%',
        opacity: 0
      },
      {
        y: '0%',
        opacity: 1,
        duration: 1.0,
        stagger: 0.065,
        ease: 'power3.out',
        delay: 0.15
      }
    );
  }

  /* --------------------------------------------------------------------------
     6. Hero Device Frames Floating & Parallax
     -------------------------------------------------------------------------- */
  function initHeroDeviceMotion() {
    const heroVisual = document.getElementById('hero-devices');
    if (!heroVisual || prefersReducedMotion || IMAGE_MOTION === 'none') return;

    // Gentle float on CSS frames
    gsap.to(heroVisual, {
      y: -10,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Subtle parallax on scroll (Desktop only)
    if (!isTouchDevice && IMAGE_MOTION === 'full') {
      gsap.to(heroVisual, {
        y: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }

  /* --------------------------------------------------------------------------
     7. Work Section: Desktop Sticky Stacking Cards
     -------------------------------------------------------------------------- */
  function initStackingCards() {
    if (prefersReducedMotion) return;

    const cards = gsap.utils.toArray('.project-card--sticky');
    if (!cards.length) return;

    // Check desktop breakpoint
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    cards.forEach((card, index) => {
      // For all cards except the last one, scale down slightly as next one slides over
      if (index < cards.length - 1) {
        const nextCard = cards[index + 1];

        gsap.to(card, {
          scale: 0.94,
          opacity: 0.75,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top bottom-=80',
            end: 'top top+=96',
            scrub: true
          }
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. Section Content Reveals (Masked Headings & Staggered Cards)
     -------------------------------------------------------------------------- */
  function initSectionReveals() {
    if (prefersReducedMotion) return;

    // Reveal section headers
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.from(header, {
        opacity: 0,
        y: 28,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%'
        }
      });
    });

    // Stagger AI benefit cards
    const aiCards = gsap.utils.toArray('.ai-benefit-card');
    if (aiCards.length) {
      gsap.from(aiCards, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.ai-benefits-grid',
          start: 'top 82%'
        }
      });
    }

    // Stagger Process cards
    const processCards = gsap.utils.toArray('.process-card');
    if (processCards.length) {
      gsap.from(processCards, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process-grid',
          start: 'top 82%'
        }
      });
    }

    // Stagger Why cards
    const whyCards = gsap.utils.toArray('.why-card');
    if (whyCards.length) {
      gsap.from(whyCards, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.why-grid',
          start: 'top 82%'
        }
      });
    }

    // Stagger Product cards
    const productCards = gsap.utils.toArray('.product-card');
    if (productCards.length) {
      gsap.from(productCards, {
        opacity: 0,
        y: 28,
        duration: 0.8,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.products-grid',
          start: 'top 82%'
        }
      });
    }

    // Pop-in feature chips
    const chipGroups = gsap.utils.toArray('.project-chips-list');
    chipGroups.forEach((group) => {
      const chips = group.querySelectorAll('.project-chip');
      gsap.from(chips, {
        opacity: 0,
        scale: 0.92,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 88%'
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. Process Track Scroll Progress
     -------------------------------------------------------------------------- */
  function initProcessProgressBar() {
    const processSection = document.getElementById('process');
    const progressBar = document.getElementById('process-progress-bar');
    if (!processSection || !progressBar || prefersReducedMotion) return;

    gsap.to(progressBar, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: processSection,
        start: 'top 70%',
        end: 'bottom 70%',
        scrub: true
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. Magnetic Buttons & Custom Cursor Follower
     -------------------------------------------------------------------------- */
  function initCursorAndMagnetics() {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const follower = document.getElementById('cursor-follower');
    if (!follower) return;

    const quickX = gsap.quickTo(follower, 'x', { duration: 0.25, ease: 'power3.out' });
    const quickY = gsap.quickTo(follower, 'y', { duration: 0.25, ease: 'power3.out' });

    window.addEventListener('mousemove', (e) => {
      quickX(e.clientX);
      quickY(e.clientY);
    });

    // Expand cursor over interactive project cards
    const hoverViewTargets = document.querySelectorAll('[data-cursor="view"]');
    hoverViewTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => follower.classList.add('is-active'));
      target.addEventListener('mouseleave', () => follower.classList.remove('is-active'));
    });

    // Magnetic buttons attraction
    const magnetics = document.querySelectorAll('.magnetic');
    magnetics.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * 0.22;
        const deltaY = (e.clientY - centerY) * 0.22;

        gsap.to(el, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.45,
          ease: 'power3.out'
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     11. Initialize Choreography & ScrollTrigger Refresh
     -------------------------------------------------------------------------- */
  function init() {
    initHeroTitleReveal();
    initHeroDeviceMotion();
    initStackingCards();
    initSectionReveals();
    initProcessProgressBar();
    initCursorAndMagnetics();

    // Refresh triggers once fonts and resources are fully ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });

    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
