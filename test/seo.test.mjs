import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { HOME, SERVICES, SITE_URL } from '../seo/site.mjs';
import { seoHead, structuredData } from '../seo/metadata.mjs';
import { PAGE_HTML } from '../src/pageMarkup.js';
import { servicePage } from '../src/servicePages.mjs';

test('every commercial page has unique metadata and a self canonical', () => {
  const pages = [HOME, ...SERVICES];
  assert.equal(new Set(pages.map(page => page.title)).size, pages.length);
  assert.equal(new Set(pages.map(page => page.description)).size, pages.length);
  for (const page of pages) {
    const head = seoHead(page);
    assert.ok(head.includes(`href="${SITE_URL}${page.path}"`));
    assert.ok(head.includes('property="og:image"'));
    assert.ok(!head.includes('noindex'));
    assert.ok(seoHead(page, { preview: true }).includes('noindex, nofollow'));
    const data = JSON.parse(head.match(/application\/ld\+json">(.*?)<\/script>/s)[1]);
    assert.equal(data['@context'], 'https://schema.org');
  }
});

test('metadata escapes HTML attribute delimiters', () => {
  const head = seoHead({ ...HOME, title: '<script>"unsafe"</script>', description: '" onload="unsafe' });
  assert.ok(!head.includes('<script>"unsafe"</script>'));
  assert.ok(head.includes('&lt;script&gt;&quot;unsafe&quot;'));
  assert.ok(head.includes('content="&quot; onload=&quot;unsafe"'));
});

test('structured data contains verified contact data without invented prices or reviews', () => {
  for (const page of [HOME, ...SERVICES]) {
    const graph = structuredData(page)['@graph'];
    const business = graph.find(node => node['@type'] === 'LocalBusiness');
    assert.equal(business.telephone, '+79170372563');
    assert.equal(business.address.addressLocality, 'Самара');
    assert.ok(!business.aggregateRating && !business.review && !business.openingHours && !business.priceRange);
    if (page.path !== '/') {
      assert.ok(graph.some(node => node['@type'] === 'Service'));
      const crumbs = graph.find(node => node['@type'] === 'BreadcrumbList');
      assert.equal(crumbs.itemListElement[1].item, `${SITE_URL}${page.path}`);
    }
  }
});

test('service HTML contains content, correct navigation and the original protected form', () => {
  for (const page of SERVICES) {
    const html = servicePage(page);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(page.name));
    assert.ok(html.includes('href="/#furniture"'));
    assert.ok(html.includes('data-form-name="contact"'));
    assert.ok(html.includes('name="consent"'));
    assert.ok(!html.includes('checked'));
    assert.ok(html.includes('data-collection-available="false"'));
    assert.ok(html.includes('/privacy.html'));
    for (const service of SERVICES) assert.ok(html.includes(`href="${service.path}"`));
  }
  assert.equal((PAGE_HTML.match(/class="[^\"]*lead-form\b/g) || []).length, 3);
  for (const page of SERVICES) assert.ok(PAGE_HTML.includes(`href="${page.path}"`));
});

test('production artifact contains searchable HTML and an exact commercial sitemap', async () => {
  const root = new URL('../dist/', import.meta.url);
  const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
  const robots = await readFile(new URL('robots.txt', root), 'utf8');
  assert.ok(robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
  assert.equal((sitemap.match(/<loc>/g) || []).length, 4);
  assert.ok(!sitemap.includes('privacy.html'));
  assert.ok(!sitemap.includes('<lastmod>'));
  for (const page of [HOME, ...SERVICES]) {
    const html = await readFile(new URL(`${page.path.slice(1)}index.html`, root), 'utf8');
    assert.ok(html.includes(seoHead(page)));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(sitemap.includes(`<loc>${SITE_URL}${page.path}</loc>`));
  }
  const files = await import('node:fs/promises').then(fs => fs.readdir(root));
  const runtime = await readFile(new URL(files.find(file => /^app\..*\.js$/.test(file)), root), 'utf8');
  assert.ok(!runtime.includes("document.getElementById('root').innerHTML"));
});
