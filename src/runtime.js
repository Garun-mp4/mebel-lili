export const BODY_CLASS = "home mebel-lili-site";

let runtimeController;
const runtimeCleanups = [];
function listen(target, event, callback, options = {}) {
  target.addEventListener(event, callback, { ...options, signal: runtimeController.signal });
}

function installHeader() {
  const header = document.querySelector('.cb-site-header');
  const burger = document.querySelector('.cb-site-header__burger');
  const menu = header?.querySelector('.cb-site-header__menu-wrapper');
  if (!header || !burger) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const small = matchMedia('(max-width: 1024px)');
  const main = document.querySelector('main');
  const footer = document.querySelector('footer');
  const links = [...header.querySelectorAll('.cb-site-header__menu a')];
  const syncScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
    let current = '#top';
    const targets = links.map(link => ({ link, target: document.querySelector(link.getAttribute('href')) })).filter(item => item.target).sort((a, b) => a.target.offsetTop - b.target.offsetTop);
    targets.forEach(({ link, target }) => { if (target.getBoundingClientRect().top <= header.offsetHeight + 100) current = link.getAttribute('href'); });
    links.forEach(link => {
      const active = link.getAttribute('href') === current;
      link.closest('li').classList.toggle('current-menu-item', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
  };
  const close = (restoreFocus = false) => {
    header.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    main.inert = false;
    footer.inert = false;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    menu.setAttribute('aria-hidden', String(small.matches));
    if (restoreFocus) burger.focus({ preventScroll: true });
  };
  const open = () => {
    header.classList.add('is-open');
    document.body.classList.add('menu-open');
    main.inert = true;
    footer.inert = true;
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню');
    links[0].focus({ preventScroll: true });
  };
  listen(burger, 'click', () => header.classList.contains('is-open') ? close(true) : open());
  listen(document, 'keydown', (event) => {
    if (!header.classList.contains('is-open')) return;
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
    if (event.key === 'Tab') {
      const focusable = [...header.querySelectorAll('a,button')].filter(el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  listen(small, 'change', () => { close(); syncScroll(); });
  listen(window, 'scroll', syncScroll, { passive: true });
  close();
  syncScroll();
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    listen(link, 'click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      close();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 20;
      const keyboard = event.detail === 0;
      window.scrollTo({ top, behavior: reduced.matches || keyboard ? 'instant' : 'smooth' });
      if (keyboard) {
        const focusTarget = target.querySelector('h1,h2,h3') || target;
        focusTarget.tabIndex = -1;
        focusTarget.focus({ preventScroll: true });
      }
      history.replaceState(null, '', href === '#top' ? location.pathname : href);
    });
  });
  runtimeCleanups.push(() => { main.inert = false; footer.inert = false; document.body.classList.remove('menu-open'); });
}

function installForms() {
  document.querySelectorAll('.lead-form').forEach((form) => {
    if (form.dataset.localBound) return;
    form.dataset.localBound = '1';
    let submitting = false;
    const phone = form.querySelector('input[type="tel"]');
    listen(phone, 'input', () => phone.setCustomValidity(''));
    listen(form, 'submit', async (event) => {
      event.preventDefault();
      if (submitting) return;
      const digits = phone.value.replace(/\D/g, '');
      phone.setCustomValidity(digits.length >= 10 && digits.length <= 15 && /^[+\d\s().-]+$/.test(phone.value) ? '' : 'Введите телефон: от 10 до 15 цифр.');
      if (!form.reportValidity()) return;
      const status = form.querySelector('.lead-form__status');
      const button = form.querySelector('button[type="submit"]');
      const fields = new FormData(form);
      const payload = {
        source: form.dataset.formName,
        name: fields.get('name') || fields.get('contact_name') || '',
        phone: fields.get('phone') || fields.get('contact_phone') || '',
        project: fields.get('project') || form.dataset.project || '',
        message: fields.get('contact_message') || '',
        website: fields.get('website') || ''
      };
      submitting = true;
      button.disabled = true;
      form.setAttribute('aria-busy', 'true');
      status.classList.remove('is-error', 'is-success');
      status.textContent = 'Отправляем заявку…';
      try {
        const response = await fetch('/api/leads', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload), signal: AbortSignal.timeout(20_000)
        });
        const data = await response.json().catch(() => null);
        if (!response.ok || data?.ok !== true) {
          status.classList.add('is-error');
          status.textContent = typeof data?.message === 'string' ? data.message : 'Заявка не отправлена. Попробуйте позже или позвоните: +7 (917) 037-25-63.';
          return;
        }
        status.classList.add('is-success');
        status.textContent = data.message;
        form.reset();
        delete form.dataset.project;
      } catch (error) {
        status.classList.add('is-error');
        status.textContent = error.name === 'TimeoutError' || error.name === 'AbortError'
          ? 'Не удалось подтвердить отправку. Позвоните: +7 (917) 037-25-63 или попробуйте позже.'
          : 'Нет связи с сервером. Проверьте интернет или позвоните: +7 (917) 037-25-63.';
      } finally {
        submitting = false;
        button.disabled = false;
        form.removeAttribute('aria-busy');
      }
    });
  });
}

function installBusinessAreas() {
  const section = document.querySelector('.business-areas--snap');
  if (!section || section.dataset.localBound) return;
  section.dataset.localBound = '1';
  const cards = [...section.querySelectorAll('.business-areas__card')];
  if (!cards.length) return;

  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = () => window.innerWidth <= 767 || motionPreference.matches;
  const updateHeight = () => {
    if (mobile()) {
      section.style.height = '';
      cards.forEach((card) => { card.style.transform = ''; card.style.zIndex = ''; });
      return;
    }
    const viewport = Math.max(520, window.innerHeight - (parseFloat(getComputedStyle(section).getPropertyValue("--header-height")) || 50));
    section.style.height = `${viewport * cards.length}px`;
    update();
  };

  const update = () => {
    if (mobile()) return;
    const rect = section.getBoundingClientRect();
    const total = Math.max(1, section.offsetHeight - window.innerHeight + (parseFloat(getComputedStyle(section).getPropertyValue("--header-height")) || 50));
    const scrolled = Math.min(total, Math.max(0, -rect.top + (parseFloat(getComputedStyle(section).getPropertyValue("--header-height")) || 50)));
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
  listen(window, 'scroll', onScroll, { passive: true });
  listen(window, 'resize', updateHeight);
  listen(motionPreference, 'change', updateHeight);
  listen(section, 'focusin', (event) => {
    if (mobile()) return;
    const index = cards.findIndex((card) => card.contains(event.target));
    if (index < 0) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top - 50 + index * (window.innerHeight - 50), behavior: 'instant' });
    update();
  });
  section.querySelectorAll('[data-project]').forEach((link) => {
    listen(link, 'click', () => {
      const contact = document.querySelector('[data-form-name="contact"]');
      if (contact) contact.dataset.project = link.dataset.project;
    });
  });
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
    const content = section.querySelector('.text-animation__content');
    const sticky = section.querySelector('.text-animation__sticky');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pinned = window.innerWidth > 1024 && !reduced;
    content.style.minHeight = pinned ? `${vh * (1.5 + items.length * .4)}px` : '0px';
    const top = parseFloat(getComputedStyle(sticky).top) || 120;
    const distance = Math.max(1, content.offsetHeight - sticky.offsetHeight);
    const progress = pinned ? Math.min(1, Math.max(0, (top - rect.top) / distance)) : 1;
    if (heading) heading.style.setProperty('--fill', `${Math.round(progress * 100)}%`);
    items.forEach((item, i) => item.classList.toggle('is-visible', progress >= i / items.length));
  };
  listen(window, 'scroll', update, { passive: true });
  listen(window, 'resize', update);
  listen(matchMedia('(prefers-reduced-motion: reduce)'), 'change', update);
  update();
}

function installGallery() {
  const section = document.querySelector('.lili-projects');
  const scroller = section?.querySelector('.swiper');
  if (!scroller || scroller.dataset.localBound) return;
  scroller.dataset.localBound = '1';
  const wrapper = scroller.querySelector('.swiper-wrapper');
  [...wrapper.children].forEach((card) => {
    const clone = card.cloneNode(true);
    clone.classList.add('gallery-clone');
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a').forEach((link) => link.tabIndex = -1);
    wrapper.append(clone);
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767px)');
  const pauseButton = section.querySelector('[data-gallery="pause"]');
  let userPaused = false;
  let hovered = false;
  let focused = false;
  let pressed = false;
  let visible = false;
  let raf = 0;
  let last = 0;
  let position = 0;
  const canRun = () => !userPaused && !hovered && !focused && !pressed && visible && !document.hidden && !reduced.matches && !mobile.matches;
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    scroller.classList.remove('is-running');
  };
  const tick = (now) => {
    if (!canRun()) { stop(); return; }
    const distance = wrapper.scrollWidth / 2;
    position += Math.min(50, now - last) * .025;
    if (position >= distance) position -= distance;
    scroller.scrollLeft = position;
    last = now;
    raf = requestAnimationFrame(tick);
  };
  const sync = () => {
    if (!canRun()) { stop(); return; }
    if (raf) return;
    position = scroller.scrollLeft;
    last = performance.now();
    scroller.classList.add('is-running');
    raf = requestAnimationFrame(tick);
  };
  const setUserPaused = (value) => {
    userPaused = value;
    pauseButton.setAttribute('aria-pressed', String(value));
    pauseButton.textContent = value ? 'Продолжить' : 'Пауза';
    sync();
  };
  const move = (direction, instant = false) => {
    setUserPaused(true);
    const width = wrapper.firstElementChild.getBoundingClientRect().width;
    scroller.scrollBy({ left: direction * width, behavior: instant || reduced.matches ? 'instant' : 'smooth' });
  };
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(scroller);
  listen(scroller, 'mouseenter', () => { hovered = true; sync(); });
  listen(scroller, 'mouseleave', () => { hovered = false; sync(); });
  listen(scroller, 'pointerdown', () => { pressed = true; sync(); });
  listen(window, 'pointerup', () => { pressed = false; sync(); });
  listen(window, 'pointercancel', () => { pressed = false; sync(); });
  listen(scroller, 'focusin', () => { focused = true; sync(); });
  listen(scroller, 'focusout', (event) => { focused = scroller.contains(event.relatedTarget); sync(); });
  listen(scroller, 'wheel', () => setUserPaused(true), { passive: true });
  listen(scroller, 'keydown', (event) => {
    if (event.target !== scroller) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1, true);
    }
  });
  listen(section.querySelector('[data-gallery="previous"]'), 'click', (event) => move(-1, event.detail === 0));
  listen(section.querySelector('[data-gallery="next"]'), 'click', (event) => move(1, event.detail === 0));
  listen(pauseButton, 'click', () => setUserPaused(!userPaused));
  listen(document, 'visibilitychange', sync);
  listen(reduced, 'change', sync);
  listen(mobile, 'change', sync);
  listen(window, 'pagehide', stop);
  listen(window, 'pageshow', sync);
  runtimeCleanups.push(() => { stop(); observer.disconnect(); wrapper.querySelectorAll('.gallery-clone').forEach(clone => clone.remove()); });
}

export function bootOriginalRuntime() {
  runtimeController?.abort();
  runtimeCleanups.splice(0).forEach(cleanup => cleanup());
  runtimeController = new AbortController();
  document.querySelectorAll('[data-local-bound],[data-local-reveal]').forEach(el => { delete el.dataset.localBound; delete el.dataset.localReveal; });
  document.body.className = BODY_CLASS;
  installHeader();
  installForms();
  installBusinessAreas();
  installTextReveal();
  installGallery();
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('scroll'));
  const controller = runtimeController;
  return () => {
    if (controller !== runtimeController) return;
    controller.abort();
    runtimeCleanups.splice(0).forEach(cleanup => cleanup());
  };
}
