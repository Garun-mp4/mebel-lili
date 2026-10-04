import { PAGE_HTML } from './pageMarkup.js';
import { SERVICES, BUSINESS } from '../seo/site.mjs';
import { escapeHtml as e } from '../seo/metadata.mjs';

export function serviceLinks(currentPath = '/') {
  return SERVICES.filter(page => page.path !== currentPath).map(page => `<a href="${page.path}">${e(page.shortName)}</a>`).join('');
}

export function servicePage(page) {
  // Reuse the actual navigation, form and footer to preserve consent and contact behavior.
  const header = PAGE_HTML.slice(0, PAGE_HTML.indexOf('<main id="content">'))
    .replace(/href="#([^"]+)"/g, (match, anchor) => anchor === 'content' ? match : anchor === 'request' ? match : `href="/#${anchor}"`)
    .replace(/ aria-current="page"/g, '').replace('menu-item current-menu-item', 'menu-item');
  const contact = PAGE_HTML.slice(PAGE_HTML.indexOf('<section id="request"'), PAGE_HTML.indexOf('</main>'))
    .replace('data-form-name="contact"', `data-form-name="contact" data-project="${e(page.project)}"`);
  const footer = PAGE_HTML.slice(PAGE_HTML.indexOf('<footer'))
    .replace(/href="#([^"]+)"/g, (match, anchor) => anchor === 'request' ? match : `href="/#${anchor}"`);
  return `${header}<main id="content" class="service-page">
  <section class="service-intro cb-block" id="top">
    <div class="service-intro__copy">
      <nav class="service-breadcrumbs" aria-label="Хлебные крошки"><a href="/">Главная</a><span aria-hidden="true">/</span><span aria-current="page">${e(page.shortName)}</span></nav>
      <h1>${e(page.name)}</h1>
      <p class="service-intro__text">${e(page.intro)}</p>
      <a class="cb-button cb-btn--primary" href="#request"><span class="cb-button__title">Обсудить проект</span><span class="cb-button__arrow" aria-hidden="true"></span></a>
    </div>
    <figure class="service-intro__photo"><img src="${page.image}" alt="${e(page.imageAlt)}" width="${page.imageWidth}" height="${page.imageHeight}" fetchpriority="high" /><figcaption>Фотография из <a href="${BUSINESS.maps}/photos/" target="_blank" rel="noopener noreferrer">карточки Mebel Lili на Яндекс Картах</a>.</figcaption></figure>
  </section>
  <div class="service-content cb-block">
    ${page.sections.map(([heading, ...paragraphs]) => `<section class="service-section"><h2>${e(heading)}</h2><div>${paragraphs.map(text => `<p>${e(text)}</p>`).join('')}</div></section>`).join('')}
    <section class="service-section"><h2>Вопросы о проекте</h2><div class="service-faq">${page.faq.map(([question, answer]) => `<details><summary>${e(question)}</summary><p>${e(answer)}</p></details>`).join('')}</div></section>
    <section class="service-section"><h2>Другие направления</h2><nav class="service-links" aria-label="Другие услуги">${serviceLinks(page.path)}<a href="/#projects">Фотографии и проекты</a><a href="/#reviews">Отзывы клиентов</a></nav></section>
  </div>
  ${contact}</main>${footer}`;
}
