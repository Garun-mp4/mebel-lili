export const BODY_CLASS = "home wp-singular page-template-default page page-id-284 wp-custom-logo wp-theme-cbra-devkit wp-child-theme-cbra-devkit-child";
export const ORIGINAL_SCRIPTS = [
  "/__gertix/wp-content/themes/cbra-devkit-child/assets/js/site-header.js?ver=7.1.2",
  "/__gertix/wp-content/themes/cbra-devkit-child/assets/js/site-footer.js?ver=7.1.2",
  "/__gertix/wp-content/themes/cbra-devkit-child/assets/js/lottie.min.js?ver=7.1.2",
  "/__gertix/wp-content/themes/cbra-devkit-child/assets/js/text-animation.js?ver=7.1.2",
  "/__gertix/wp-content/themes/cbra-devkit-child/assets/js/business-areas.js?ver=7.1.2",
  "/__gertix/wp-content/themes/cbra-devkit-child/assets/js/swiper-bundle.min.js?ver=7.1.2",
  "/__gertix/wp-content/themes/cbra-devkit-child/blocks/hero-frontpage/hero-frontpage.js?ver=7.1.2",
  "/__gertix/wp-content/themes/cbra-devkit-child/blocks/post-gallery/post-gallery.js?ver=7.1.2"
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-clone-src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.dataset.cloneSrc = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
}

function installForms() {
  document.querySelectorAll('.sib_signup_form').forEach((form) => {
    if (form.dataset.cloneBound) return;
    form.dataset.cloneBound = '1';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const msg = form.querySelector('.sib_msg_disp');
      if (!form.reportValidity()) return;
      if (msg) {
        msg.textContent = 'Thank you!';
        msg.style.display = 'block';
      }
    });
  });

  document.querySelectorAll('.contact__form').forEach((form) => {
    if (form.dataset.cloneBound) return;
    form.dataset.cloneBound = '1';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const status = form.querySelector('.contact__form-status');
      if (status) {
        status.classList.remove('is-error');
        status.classList.add('is-success');
        status.textContent = 'Thank you. Your message has been received.';
      }
      form.reset();
    });
  });
}

function installNavigationGuard() {
  if (window.__gertixNavGuardInstalled) return;
  window.__gertixNavGuardInstalled = true;
  document.addEventListener('click', (event) => {
    const a = event.target.closest('a');
    if (!a) return;
    // Keep the homepage link inside the clone; deeper pages still lead to the source site.
    if (a.href === 'https://gertix.studio/' || a.getAttribute('href') === 'https://gertix.studio/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

export async function bootOriginalRuntime() {
  document.body.className = BODY_CLASS;
  window.CBRA_TEXT_ANIMATION = {
    lottieUrl: '/__gertix/wp-content/themes/cbra-devkit-child/assets/lottie/GTX-Dot_Spiral_v01.json'
  };

  // Native video autoplay can be interrupted when markup is injected dynamically.
  document.querySelectorAll('video[autoplay]').forEach((video) => {
    video.muted = true;
    const play = video.play();
    if (play && typeof play.catch === 'function') play.catch(() => {});
  });

  for (const src of ORIGINAL_SCRIPTS) {
    if (document.querySelector(`script[data-clone-src=\"${src}\"]`)) continue;
    try { await loadScript(src); } catch (err) { console.warn(err); }
  }
  installForms();
  installNavigationGuard();
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('scroll'));
}
