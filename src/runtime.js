export const BODY_CLASS = "home mebel-lili-site";

function installHeader() {
  const header = document.querySelector('.cb-site-header');
  const burger = document.querySelector('.cb-site-header__burger');
  if (!header || !burger || header.dataset.localBound) return;
  header.dataset.localBound = '1';

  const syncScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  const close = () => {
    header.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', burger.dataset.labelOpen || 'Открыть меню');
  };
  const open = () => {
    header.classList.add('is-open');
    document.body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', burger.dataset.labelClose || 'Закрыть меню');
  };

  burger.addEventListener('click', () => header.classList.contains('is-open') ? close() : open());
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  window.addEventListener('scroll', syncScroll, { passive: true });
  syncScroll();

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      close();
      const top = target.getBoundingClientRect().top + window.scrollY - (window.innerWidth <= 767 ? 54 : 76);
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', href === '#top' ? location.pathname : href);
    });
  });
}

function installForms() {
  document.querySelectorAll('.lead-form').forEach((form) => {
    if (form.dataset.localBound) return;
    form.dataset.localBound = '1';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const status = form.querySelector('.lead-form__status, .contact__form-status');
      if (status) {
        status.classList.remove('is-error');
        status.classList.add('is-success');
        status.textContent = 'Спасибо! Это демонстрация формы — заявка сейчас не отправляется.';
      }
      form.reset();
    });
  });
}

function installBusinessAreas() {
  const section = document.querySelector('.business-areas--snap');
  if (!section || section.dataset.localBound) return;
  section.dataset.localBound = '1';
  const cards = [...section.querySelectorAll('.business-areas__card')];
  if (!cards.length) return;

  const mobile = () => window.innerWidth <= 767;
  const updateHeight = () => {
    if (mobile()) {
      section.style.height = '';
      cards.forEach((card) => { card.style.transform = ''; card.style.zIndex = ''; });
      return;
    }
    const viewport = Math.max(520, window.innerHeight - 76);
    section.style.height = `${viewport * cards.length}px`;
    update();
  };

  const update = () => {
    if (mobile()) return;
    const rect = section.getBoundingClientRect();
    const total = Math.max(1, section.offsetHeight - window.innerHeight + 76);
    const scrolled = Math.min(total, Math.max(0, -rect.top + 76));
    const progress = scrolled / total;
    const step = progress * (cards.length - 1);
    cards.forEach((card, i) => {
      card.style.zIndex = String(i + 1);
      if (i === 0) {
        card.style.transform = 'translateY(0%)';
      } else {
        const y = Math.min(100, Math.max(0, (i - step) * 100));
        card.style.transform = `translateY(${y}%)`;
      }
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; update(); });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateHeight);
  updateHeight();
}

function installTextReveal() {
  const section = document.querySelector('.lili-process');
  if (!section || section.dataset.localReveal) return;
  section.dataset.localReveal = '1';
  const heading = section.querySelector('.text-animation__heading');
  const items = [...section.querySelectorAll('.text-animation__text-item')];
  if (!items.length) return;

  const update = () => {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const progress = Math.min(1, Math.max(0, (vh * .8 - rect.top) / Math.max(vh, rect.height * .65)));
    if (heading) heading.style.setProperty('--fill', `${Math.round(progress * 100)}%`);
    items.forEach((item, i) => item.classList.toggle('is-visible', progress >= (i + .25) / (items.length + .25)));
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function installGallery() {
  const scroller = document.querySelector('.lili-projects .swiper');
  if (!scroller || scroller.dataset.localBound) return;
  scroller.dataset.localBound = '1';
  let paused = false;
  let raf = 0;
  let last = performance.now();

  const tick = (now) => {
    const dt = Math.min(40, now - last);
    last = now;
    if (!paused && window.innerWidth > 767 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scroller.scrollLeft += dt * 0.025;
      if (scroller.scrollLeft >= scroller.scrollWidth / 2) scroller.scrollLeft -= scroller.scrollWidth / 2;
    }
    raf = requestAnimationFrame(tick);
  };
  const pause = () => { paused = true; };
  const resume = () => { paused = false; };
  scroller.addEventListener('mouseenter', pause);
  scroller.addEventListener('mouseleave', resume);
  scroller.addEventListener('pointerdown', pause);
  scroller.addEventListener('pointerup', resume);
  scroller.addEventListener('focusin', pause);
  scroller.addEventListener('focusout', resume);
  raf = requestAnimationFrame(tick);

  window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once: true });
}

export function bootOriginalRuntime() {
  document.body.className = BODY_CLASS;
  installHeader();
  installForms();
  installBusinessAreas();
  installTextReveal();
  installGallery();
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('scroll'));
}
