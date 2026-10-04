import { SITE_URL, BUSINESS } from './site.mjs';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
export const absoluteUrl = pathname => new URL(pathname, `${SITE_URL}/`).href;

export function structuredData(page) {
  const url = absoluteUrl(page.path);
  const graph = [
    { '@type': 'LocalBusiness', '@id': `${SITE_URL}/#business`, name: BUSINESS.name, url: `${SITE_URL}/`, telephone: BUSINESS.telephone, address: BUSINESS.address, areaServed: { '@type': 'City', name: 'Самара' }, image: absoluteUrl('/assets/yandex-main-kitchen.webp'), logo: absoluteUrl('/assets/lili-logo.png'), sameAs: [BUSINESS.maps] },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: BUSINESS.name, inLanguage: 'ru', publisher: { '@id': `${SITE_URL}/#business` } },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: page.name, description: page.description, inLanguage: 'ru', isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': page.path === '/' ? `${SITE_URL}/#business` : `${url}#service` } },
  ];
  if (page.path !== '/') graph.push(
    { '@type': 'Service', '@id': `${url}#service`, name: page.name, serviceType: page.shortName, url, provider: { '@id': `${SITE_URL}/#business` }, areaServed: { '@type': 'City', name: 'Самара' } },
    { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: page.shortName, item: url },
    ] },
  );
  return { '@context': 'https://schema.org', '@graph': graph };
}

export function seoHead(page, { preview = false } = {}) {
  const e = escapeHtml;
  const url = absoluteUrl(page.path);
  return `<title>${e(page.title)}</title>
  <meta name="description" content="${e(page.description)}" />
  ${process.env.GOOGLE_SITE_VERIFICATION ? `<meta name="google-site-verification" content="${e(process.env.GOOGLE_SITE_VERIFICATION)}" />` : ''}
  ${process.env.YANDEX_SITE_VERIFICATION ? `<meta name="yandex-verification" content="${e(process.env.YANDEX_SITE_VERIFICATION)}" />` : ''}
  ${preview ? '<meta name="robots" content="noindex, nofollow" />' : ''}
  <link rel="canonical" href="${e(url)}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="ru_RU" />
  <meta property="og:site_name" content="Mebel Lili" />
  <meta property="og:title" content="${e(page.title)}" />
  <meta property="og:description" content="${e(page.description)}" />
  <meta property="og:url" content="${e(url)}" />
  <meta property="og:image" content="${absoluteUrl(page.image)}" />
  <meta property="og:image:type" content="image/webp" />
  <meta property="og:image:width" content="${page.imageWidth}" />
  <meta property="og:image:height" content="${page.imageHeight}" />
  <meta property="og:image:alt" content="${e(page.imageAlt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${e(page.title)}" />
  <meta name="twitter:description" content="${e(page.description)}" />
  <meta name="twitter:image" content="${absoluteUrl(page.image)}" />
  <meta name="twitter:image:alt" content="${e(page.imageAlt)}" />
  <script type="application/ld+json">${JSON.stringify(structuredData(page)).replace(/</g, '\\u003c')}</script>`;
}
