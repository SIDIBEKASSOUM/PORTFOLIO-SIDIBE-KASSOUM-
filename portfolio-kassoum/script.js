(() => {
  const langButton = document.querySelector('.language-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const dialog = document.querySelector('.gallery-dialog');
  const dialogImage = dialog.querySelector('figure img');
  const caption = dialog.querySelector('figcaption');
  const count = dialog.querySelector('.gallery-count');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const galleries = {
    cabinet: [
      { src: 'assets/projects/cabinet-pilote-06.png', fr: 'Cabinet Pilote — saisie des déclarations', en: 'Cabinet Pilote — filing entry' }
    ],
    finances: [
      { src: 'assets/projects/finances-cmci-08.png', fr: 'Finances CMCI — tableau de bord', en: 'Finances CMCI — dashboard' },
      { src: 'assets/projects/finances-cmci-09.png', fr: 'Finances CMCI — navigation de l’application', en: 'Finances CMCI — app navigation' }
    ]
  };
  let activeGallery = [];
  let activeIndex = 0;

  function setLanguage(language) {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-fr][data-en]').forEach((element) => {
      const icon = element.querySelector(':scope > [aria-hidden="true"]');
      element.textContent = element.dataset[language];
      if (icon) element.append(' ', icon);
    });
    document.querySelectorAll('[data-label-fr][data-label-en]').forEach((element) => {
      element.setAttribute('aria-label', element.dataset[`label${language[0].toUpperCase()}${language.slice(1)}`]);
    });
    langButton.innerHTML = language === 'fr' ? 'EN <span aria-hidden="true">↗</span>' : 'FR <span aria-hidden="true">↗</span>';
    langButton.setAttribute('aria-label', language === 'fr' ? 'Switch to English' : 'Passer en français');
    menuButton.setAttribute('aria-label', language === 'fr' ? 'Ouvrir le menu' : 'Open menu');
    dialog.querySelector('.dialog-close').setAttribute('aria-label', language === 'fr' ? 'Fermer' : 'Close');
    dialog.querySelector('.gallery-prev').setAttribute('aria-label', language === 'fr' ? 'Capture précédente' : 'Previous screenshot');
    dialog.querySelector('.gallery-next').setAttribute('aria-label', language === 'fr' ? 'Capture suivante' : 'Next screenshot');
    dialog.setAttribute('aria-label', language === 'fr' ? 'Galerie des captures du projet' : 'Project screenshot gallery');
    document.title = language === 'fr' ? 'Kassoum Sidibé — Développeur d’applications' : 'Kassoum Sidibé — Application developer';
    if (dialog.open) renderGalleryItem();
  }

  function renderGalleryItem() {
    const item = activeGallery[activeIndex];
    dialogImage.src = item.src;
    dialogImage.alt = item[document.documentElement.lang];
    caption.textContent = item[document.documentElement.lang];
    count.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(activeGallery.length).padStart(2, '0')}`;
    const multiple = activeGallery.length > 1;
    dialog.querySelector('.gallery-prev').hidden = !multiple;
    dialog.querySelector('.gallery-next').hidden = !multiple;
  }

  langButton.addEventListener('click', () => setLanguage(document.documentElement.lang === 'fr' ? 'en' : 'fr'));

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    const language = document.documentElement.lang;
    menuButton.setAttribute('aria-label', isOpen ? (language === 'fr' ? 'Ouvrir le menu' : 'Open menu') : (language === 'fr' ? 'Fermer le menu' : 'Close menu'));
    mobileNav.hidden = isOpen;
  });

  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', document.documentElement.lang === 'fr' ? 'Ouvrir le menu' : 'Open menu');
  }));

  document.querySelectorAll('[data-gallery]').forEach((button) => button.addEventListener('click', () => {
    activeGallery = galleries[button.dataset.gallery];
    activeIndex = 0;
    renderGalleryItem();
    dialog.showModal();
  }));

  document.querySelectorAll('[data-door]').forEach((door) => door.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reducedMotion.matches) return;
    const destination = document.querySelector(door.getAttribute('href'));
    if (!destination) return;
    event.preventDefault();
    door.classList.add('door-opening');
    window.setTimeout(() => {
      window.history.pushState(null, '', door.getAttribute('href'));
      destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => door.classList.remove('door-opening'), 900);
    }, 440);
  }));

  dialog.querySelector('.gallery-prev').addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + activeGallery.length) % activeGallery.length;
    renderGalleryItem();
  });
  dialog.querySelector('.gallery-next').addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % activeGallery.length;
    renderGalleryItem();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft' && activeGallery.length > 1) dialog.querySelector('.gallery-prev').click();
    if (event.key === 'ArrowRight' && activeGallery.length > 1) dialog.querySelector('.gallery-next').click();
  });

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.body.classList.add('motion-ready');
    const revealTargets = document.querySelectorAll('#about .section-heading, .about-copy, .skill-group, .projects-section .section-heading, .projects-intro, .project-card, .contact-copy, .contact-details');
    const sectionDelays = new Map();
    revealTargets.forEach((target) => {
      const group = target.parentElement;
      const index = sectionDelays.get(group) || 0;
      sectionDelays.set(group, index + 1);
      target.classList.add('reveal');
      target.style.setProperty('--reveal-delay', `${Math.min(index * 75, 300)}ms`);
    });
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  const navLinks = document.querySelectorAll('.main-nav a, .mobile-nav a');
  const pageSections = document.querySelectorAll('main section[id]');
  const pageIndex = document.querySelector('.visual-index');
  const sectionIndex = { top: 1, about: 1, skills: 2, projects: 3, contact: 4 };
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        pageIndex.textContent = `${String(sectionIndex[entry.target.id] || 1).padStart(2, '0')} / 04`;
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
    pageSections.forEach((section) => navObserver.observe(section));
  }

  let progressFrame = 0;
  window.addEventListener('scroll', () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      const range = document.documentElement.scrollHeight - window.innerHeight;
      document.body.style.setProperty('--page-progress', range > 0 ? String(window.scrollY / range) : '0');
      progressFrame = 0;
    });
  }, { passive: true });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
