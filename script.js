/* ==========================================================================
   SCRIPT.JS - Application Logic, Interactivity & Accessibility
   Author: Shivam Mishra
   Dependencies: data.js (Must be loaded before script.js)
   ========================================================================== */

(function () {
  'use strict';

  // Ensure data.js is loaded
  if (typeof CONTACT === 'undefined' || typeof PRICING === 'undefined') {
    console.error('Critical Error: data.js is missing or not loaded.');
    return;
  }

  /* --------------------------------------------------------------------------
     1. Hydrate Static Content & Contacts from data.js
     -------------------------------------------------------------------------- */
  function initContactAndStats() {
    // Reply time and location
    const replyTimeEl = document.getElementById('contact-reply-time');
    const locationEl = document.getElementById('contact-location');
    if (replyTimeEl) replyTimeEl.textContent = CONTACT.replyTime;
    if (locationEl) locationEl.textContent = CONTACT.location;

    // Contact CTA buttons
    const heroWaBtn = document.getElementById('hero-whatsapp-btn');
    const navWaBtn = document.getElementById('nav-whatsapp-btn');
    const contactWaBtn = document.getElementById('contact-whatsapp-btn');
    const contactEmailBtn = document.getElementById('contact-email-btn');
    const contactPhoneBtn = document.getElementById('contact-phone-btn');

    const defaultWaUrl = `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(CONTACT.defaultWaMessage)}`;
    const emailUrl = `mailto:${CONTACT.email}?subject=${encodeURIComponent(CONTACT.emailSubject)}`;
    const telUrl = `tel:${CONTACT.whatsappDigits}`;

    if (heroWaBtn) heroWaBtn.href = defaultWaUrl;
    if (navWaBtn) navWaBtn.href = defaultWaUrl;
    if (contactWaBtn) contactWaBtn.href = defaultWaUrl;
    if (contactEmailBtn) contactEmailBtn.href = emailUrl;
    if (contactPhoneBtn) contactPhoneBtn.href = telUrl;

    // Dynamic stats counters computed from arrays
    const statProjects = document.getElementById('stat-projects-count');
    const statProducts = document.getElementById('stat-products-count');
    const statServices = document.getElementById('stat-services-count');

    if (statProjects && Array.isArray(PROJECTS)) statProjects.textContent = PROJECTS.length.toString();
    if (statProducts && Array.isArray(PRODUCTS)) statProducts.textContent = PRODUCTS.length.toString();
    if (statServices && Array.isArray(SERVICES)) statServices.textContent = SERVICES.length.toString();

    // AI Assistant helper prompt line
    const assistantNote = document.getElementById('assistant-helper-note');
    if (assistantNote) {
      assistantNote.style.display = ASSISTANT_ENABLED ? 'inline-flex' : 'none';
    }
  }

  /* --------------------------------------------------------------------------
     2. Accessible Dialog & Focus Trap Utilities
     -------------------------------------------------------------------------- */
  let activeOpenerElement = null;

  function trapFocus(dialogEl, event) {
    if (event.key !== 'Tab') return;
    const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, iframe';
    const focusables = dialogEl.querySelectorAll(focusableSelectors);
    if (!focusables.length) return;

    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        event.preventDefault();
      }
    }
  }

  function lockPageScroll(locked) {
    if (locked) {
      document.body.style.overflow = 'hidden';
      if (window.lenisInstance) window.lenisInstance.stop();
    } else {
      document.body.style.overflow = '';
      if (window.lenisInstance) window.lenisInstance.start();
    }
  }

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Dialog
     -------------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const menuDialog = document.getElementById('mobile-menu-dialog');
    const closeBtn = document.getElementById('mobile-menu-close');
    const navLinks = menuDialog ? menuDialog.querySelectorAll('.mobile-nav-link') : [];

    if (!toggleBtn || !menuDialog || !closeBtn) return;

    function openMenu() {
      activeOpenerElement = toggleBtn;
      menuDialog.setAttribute('open', '');
      menuDialog.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      lockPageScroll(true);
      closeBtn.focus();
      document.addEventListener('keydown', onMenuKeydown);
    }

    function closeMenu() {
      menuDialog.removeAttribute('open');
      menuDialog.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      lockPageScroll(false);
      document.removeEventListener('keydown', onMenuKeydown);
      if (activeOpenerElement) {
        activeOpenerElement.focus();
        activeOpenerElement = null;
      }
    }

    function onMenuKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
      } else if (e.key === 'Tab') {
        trapFocus(menuDialog, e);
      }
    }

    toggleBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Hero Visual Crossfade (Auto rotation every 3.5s, Opacity only)
     -------------------------------------------------------------------------- */
  function initHeroCrossfade() {
    const laptopContainer = document.getElementById('hero-laptop-screen');
    const phoneContainer = document.getElementById('hero-phone-screen');
    if (!laptopContainer || !phoneContainer) return;

    const laptopSlides = laptopContainer.querySelectorAll('.crossfade-slide');
    const phoneSlides = phoneContainer.querySelectorAll('.crossfade-slide');
    const totalSlides = laptopSlides.length;
    if (totalSlides <= 1) return;

    let currentIndex = 0;
    let timer = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function advanceSlide() {
      // Pause if tab is hidden or user prefers reduced motion
      if (document.hidden || prefersReducedMotion) return;

      laptopSlides[currentIndex].classList.remove('crossfade-slide--active');
      phoneSlides[currentIndex].classList.remove('crossfade-slide--active');

      currentIndex = (currentIndex + 1) % totalSlides;

      laptopSlides[currentIndex].classList.add('crossfade-slide--active');
      phoneSlides[currentIndex].classList.add('crossfade-slide--active');
    }

    function startTimer() {
      if (!timer && !prefersReducedMotion) {
        timer = setInterval(advanceSlide, 3500);
      }
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    startTimer();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Live Staging Preview Modal (Scaled Sandboxed Iframe)
     -------------------------------------------------------------------------- */
  function initPreviewDialog() {
    const dialog = document.getElementById('preview-dialog');
    const closeBtn = document.getElementById('preview-dialog-close');
    const titleEl = document.getElementById('preview-dialog-title');
    const externalLink = document.getElementById('preview-external-link');
    const wrapper = document.getElementById('preview-frame-wrapper');
    const iframe = document.getElementById('preview-iframe');
    const btnDesktop = document.getElementById('preview-device-desktop');
    const btnPhone = document.getElementById('preview-device-phone');
    const openButtons = document.querySelectorAll('.preview-open-btn');

    if (!dialog || !iframe || !wrapper) return;

    let currentMode = 'desktop'; // 'desktop' or 'phone'

    function updateIframeScale() {
      const stage = dialog.querySelector('.preview-dialog-stage');
      if (!stage) return;

      const stageRect = stage.getBoundingClientRect();
      const stageW = Math.max(stageRect.width - 32, 280);
      const stageH = Math.max(stageRect.height - 32, 320);

      if (currentMode === 'desktop') {
        const nativeW = 1280;
        const nativeH = 800;
        const scale = Math.min(stageW / nativeW, stageH / nativeH, 1);
        
        wrapper.style.width = `${Math.round(nativeW * scale)}px`;
        wrapper.style.height = `${Math.round(nativeH * scale)}px`;
        iframe.style.width = `${nativeW}px`;
        iframe.style.height = `${nativeH}px`;
        iframe.style.transform = `scale(${scale})`;
        iframe.style.transformOrigin = '0 0';
      } else {
        const nativeW = 390;
        const nativeH = 844;
        const scale = Math.min(stageW / nativeW, stageH / nativeH, 1);

        wrapper.style.width = `${Math.round(nativeW * scale)}px`;
        wrapper.style.height = `${Math.round(nativeH * scale)}px`;
        iframe.style.width = `${nativeW}px`;
        iframe.style.height = `${nativeH}px`;
        iframe.style.transform = `scale(${scale})`;
        iframe.style.transformOrigin = '0 0';
      }
    }

    function openPreview(projectId, triggerBtn) {
      activeOpenerElement = triggerBtn;
      const project = PROJECTS.find(p => p.id === projectId);
      if (!project) return;

      // Set accessible title & external link
      titleEl.textContent = `${project.name} (Live Preview)`;
      externalLink.href = project.liveUrl;

      // Reset to desktop view
      setMode('desktop');

      // Set iframe src ONLY on open
      iframe.src = project.liveUrl;

      dialog.setAttribute('open', '');
      dialog.classList.add('is-open');
      lockPageScroll(true);

      // Recalculate dimensions once layout paints
      requestAnimationFrame(updateIframeScale);

      closeBtn.focus();
      document.addEventListener('keydown', onDialogKeydown);
      window.addEventListener('resize', updateIframeScale);
    }

    function closePreview() {
      dialog.removeAttribute('open');
      dialog.classList.remove('is-open');
      lockPageScroll(false);

      // Immediate iframe teardown for memory and privacy
      iframe.src = 'about:blank';

      document.removeEventListener('keydown', onDialogKeydown);
      window.removeEventListener('resize', updateIframeScale);

      if (activeOpenerElement) {
        activeOpenerElement.focus();
        activeOpenerElement = null;
      }
    }

    function setMode(mode) {
      currentMode = mode;
      if (mode === 'desktop') {
        btnDesktop.classList.add('is-active');
        btnPhone.classList.remove('is-active');
        wrapper.className = 'preview-mode-desktop';
      } else {
        btnPhone.classList.add('is-active');
        btnDesktop.classList.remove('is-active');
        wrapper.className = 'preview-mode-phone';
      }
      updateIframeScale();
    }

    function onDialogKeydown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePreview();
      } else if (e.key === 'Tab') {
        trapFocus(dialog, e);
      }
    }

    openButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-project-id');
        openPreview(id, btn);
      });
    });

    closeBtn.addEventListener('click', closePreview);
    btnDesktop.addEventListener('click', () => setMode('desktop'));
    btnPhone.addEventListener('click', () => setMode('phone'));
  }

  /* --------------------------------------------------------------------------
     6. Instant Quote Builder (Single Source of Truth Math)
     -------------------------------------------------------------------------- */
  function initQuoteBuilder() {
    const builder = document.getElementById('quote-builder');
    if (!builder) return;

    const typeRadios = document.querySelectorAll('input[name="projectType"]');
    const extraCheckboxes = document.querySelectorAll('input[name="extraOption"]');
    const decBtn = document.getElementById('quote-pages-dec');
    const incBtn = document.getElementById('quote-pages-inc');
    const pagesCountEl = document.getElementById('quote-pages-count');
    const priceMinEl = document.getElementById('quote-price-min');
    const priceMaxEl = document.getElementById('quote-price-max');
    const timelineEl = document.getElementById('quote-timeline');
    const whatsappBtn = document.getElementById('quote-whatsapp-btn');

    let extraPages = 0;
    const maxPages = PRICING.maxExtraPages || 5;
    const pagePrice = PRICING.extraPagePrice || 80;

    let animatedMin = 400;
    let animatedMax = 640;

    function tweenValue(from, to, duration, callback) {
      const start = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
        const current = Math.round(from + (to - from) * ease);
        callback(current);
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      requestAnimationFrame(update);
    }

    function calculateQuote() {
      // 1. Get Selected Project Type
      let selectedType = PRICING.projectTypes[0];
      typeRadios.forEach(radio => {
        if (radio.checked) {
          const found = PRICING.projectTypes.find(t => t.id === radio.value);
          if (found) selectedType = found;
        }
      });

      // 2. Sum Extras
      let extrasTotal = 0;
      const selectedExtrasList = [];
      extraCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const extra = PRICING.extras.find(e => e.id === checkbox.value);
          if (extra) {
            extrasTotal += extra.price;
            selectedExtrasList.push(extra.label);
          }
        }
      });

      // 3. Extra Pages
      const pagesTotal = extraPages * pagePrice;

      // 4. Totals and Range Math
      const baseTotal = selectedType.basePrice + extrasTotal + pagesTotal;
      const minPrice = baseTotal;
      // Range runs from total up to total x 1.6, rounded to the nearest $10
      const maxPrice = Math.round((baseTotal * PRICING.rangeMultiplier) / 10) * 10;

      // Smooth number tween
      const prevMin = animatedMin;
      const prevMax = animatedMax;
      animatedMin = minPrice;
      animatedMax = maxPrice;

      tweenValue(prevMin, minPrice, 400, (val) => {
        priceMinEl.textContent = val.toLocaleString();
      });
      tweenValue(prevMax, maxPrice, 400, (val) => {
        priceMaxEl.textContent = val.toLocaleString();
      });

      timelineEl.textContent = selectedType.timeline;

      // 5. Generate Prefilled WhatsApp Message
      const waMessage = 
`Hi Shivam, I used your website quote calculator:
• Project: ${selectedType.label} (Base $${selectedType.basePrice})
• Extras: ${selectedExtrasList.length ? selectedExtrasList.join(', ') : 'None'}
• Additional Pages: ${extraPages} (+$${pagesTotal})
• Estimated Range: $${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}
• Estimated Timeline: ${selectedType.timeline}

I'd like to discuss building this for my business.`;

      whatsappBtn.href = `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(waMessage)}`;
    }

    // Stepper controls
    decBtn.addEventListener('click', () => {
      if (extraPages > 0) {
        extraPages--;
        pagesCountEl.textContent = extraPages.toString();
        decBtn.disabled = extraPages === 0;
        incBtn.disabled = false;
        calculateQuote();
      }
    });

    incBtn.addEventListener('click', () => {
      if (extraPages < maxPages) {
        extraPages++;
        pagesCountEl.textContent = extraPages.toString();
        incBtn.disabled = extraPages === maxPages;
        decBtn.disabled = false;
        calculateQuote();
      }
    });

    typeRadios.forEach(radio => radio.addEventListener('change', calculateQuote));
    extraCheckboxes.forEach(checkbox => checkbox.addEventListener('change', calculateQuote));

    // Initial calculation on load
    calculateQuote();
  }

  /* --------------------------------------------------------------------------
     7. Accessible FAQ Accordion (Single-open, Grid Animation)
     -------------------------------------------------------------------------- */
  function initFaqAccordion() {
    const triggers = document.querySelectorAll('.faq-trigger');
    if (!triggers.length) return;

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        // Close all other accordion items for clean focus
        triggers.forEach(other => {
          if (other !== trigger) {
            other.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        trigger.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. Video Hover Preview for Project Cards (Optional field support)
     -------------------------------------------------------------------------- */
  function initProjectVideos() {
    PROJECTS.forEach(project => {
      if (!project.video) return;
      const card = document.querySelector(`.project-card[data-project-id="${project.id}"]`);
      if (!card) return;

      const previewContainer = card.querySelector('.project-card-preview');
      if (!previewContainer) return;

      const videoEl = document.createElement('video');
      videoEl.src = project.video;
      videoEl.muted = true;
      videoEl.loop = true;
      videoEl.playsInline = true;
      videoEl.preload = 'none';
      videoEl.className = 'project-preview-video';

      previewContainer.appendChild(videoEl);

      card.addEventListener('mouseenter', () => {
        videoEl.play().then(() => {
          videoEl.classList.add('is-playing');
        }).catch(() => {});
      });

      card.addEventListener('mouseleave', () => {
        videoEl.pause();
        videoEl.classList.remove('is-playing');
      });
    });
  }

  /* --------------------------------------------------------------------------
     9. Document Ready Bootstrap
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initContactAndStats();
    initMobileMenu();
    initHeroCrossfade();
    initPreviewDialog();
    initQuoteBuilder();
    initFaqAccordion();
    initProjectVideos();
  });

})();
