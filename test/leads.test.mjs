import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleLeadRequest, collectionReady } from '../server/leads.mjs';
import { consentVersion, operator, operatorReady } from '../legal/operator.mjs';

const env = { TELEGRAM_BOT_TOKEN: 'test-token-not-real', TELEGRAM_CHAT_ID: '-1000000000000' };
const lead = { source: 'mid', name: 'Проверка формы', phone: '+7 (000) 000-00-00', project: 'Кухня', message: 'Тест без реальной отправки', website: '', consent: true, consentVersion };
const options = { env, ready: () => true, persist: async () => ({ id: '11111111-1111-4111-8111-111111111111' }) };
let client = 0;
function request(data = lead, custom = {}) {
  return new Request('https://example.test/api/leads', {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://example.test', 'x-forwarded-for': `test-${++client}` },
    body: JSON.stringify(data), ...custom
  });
}

test('all three forms persist consent and send only a random ID to Telegram', async () => {
  for (const source of ['hero', 'mid', 'contact']) {
    let stored, sent;
    const response = await handleLeadRequest(request({ ...lead, source }), { ...options,
      persist: async data => { stored = data; return { id: '11111111-1111-4111-8111-111111111111' }; },
      fetchImpl: async (url, init) => { sent = JSON.parse(init.body); return Response.json({ ok: true, result: { message_id: 42 } }); }
    });
    assert.equal(response.status, 200);
    assert.equal(stored.source, source);
    assert.equal(stored.phone, lead.phone);
    assert.equal(stored.consent.accepted, true);
    assert.equal(stored.consent.version, consentVersion);
    assert.equal(stored.consent.sha256.length, 64);
    assert.match(stored.consent.document, /Срок и отзыв/);
    assert.match(sent.text, /11111111-1111-4111-8111-111111111111/);
    for (const field of [lead.name, lead.phone, lead.project, lead.message]) assert.ok(!sent.text.includes(field));
    assert.equal(sent.parse_mode, undefined);
  }
});

test('operator placeholders, unconfirmed hosting and Vercel cannot enable collection', async () => {
  assert.equal(operatorReady(operator), false);
  assert.equal(collectionReady({ ...env, LEADS_RU_HOSTING_CONFIRMED: 'true', VERCEL: '1' }), false);
  assert.equal(collectionReady(env), false);
  const response = await handleLeadRequest(request(), { env, persist: () => assert.fail('Must not store'), fetchImpl: () => assert.fail('Must not send') });
  assert.equal(response.status, 503);
});

test('missing, false, string consent and stale versions are rejected before storage', async () => {
  for (const patch of [{ consent: undefined }, { consent: false }, { consent: 'true' }, { consentVersion: undefined }, { consentVersion: 'old' }]) {
    const response = await handleLeadRequest(request({ ...lead, ...patch }), { ...options, persist: () => assert.fail('Must not store'), fetchImpl: () => assert.fail('Must not send') });
    assert.equal(response.status, 400);
  }
});

test('successful storage acknowledges delivery without a configured bot', async () => {
  const response = await handleLeadRequest(request(), { ...options, env: {}, fetchImpl: () => assert.fail('Must not send') });
  assert.equal(response.status, 200);
});

test('optional Telegram errors do not lose a saved lead or expose credentials', async () => {
  for (const fetchImpl of [async () => Response.json({ ok: false }, { status: 403 }), async () => Response.json({ ok: true, result: {} }), async () => { throw new Error(env.TELEGRAM_BOT_TOKEN); }]) {
    const response = await handleLeadRequest(request(), { ...options, fetchImpl });
    assert.equal(response.status, 200);
    assert.ok(!(await response.text()).includes(env.TELEGRAM_BOT_TOKEN));
  }
});

test('storage failure never sends notification or confirms delivery', async () => {
  const response = await handleLeadRequest(request(), { ...options, persist: async () => { throw new Error('disk full'); }, fetchImpl: () => assert.fail('Must not send') });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});

test('invalid phone, source, project, name, comment and honeypot are rejected before storage', async () => {
  for (const patch of [{ phone: 'abc123' }, { source: 'invalid' }, { project: 'made up' }, { name: ' ' }, { name: 'name\nspoof' }, { message: 'a'.repeat(1501) }, { website: 'spam.test' }]) {
    const response = await handleLeadRequest(request({ ...lead, ...patch }), { ...options, persist: () => assert.fail('Must not store') });
    assert.equal(response.status, 400);
  }
});

test('method, content type, origin, malformed JSON and oversized bodies are rejected', async () => {
  const cases = [
    [new Request('https://example.test/api/leads', { method: 'PUT' }), 405],
    [new Request('https://example.test/api/leads', { method: 'POST', body: 'x' }), 415],
    [request(lead, { headers: { 'content-type': 'application/json', origin: 'https://other.test' } }), 403],
    [request({ ...lead, message: 'a'.repeat(17000) }), 413],
    [new Request('https://example.test/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' }), 400]
  ];
  for (const [req, expected] of cases) assert.equal((await handleLeadRequest(req, { ...options, persist: () => assert.fail('Must not store') })).status, expected);
});

test('public readiness check receives no personal data and does not enable an unconfigured host', async () => {
  const response = await handleLeadRequest(new Request('https://example.test/api/leads'), { env, persist: () => assert.fail('Must not store'), fetchImpl: () => assert.fail('Must not send') });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ready, false);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('the sixth request from one instance client is rate limited', async () => {
  for (let i = 0; i < 6; i++) {
    const req = request(lead, { headers: { 'content-type': 'application/json', 'x-forwarded-for': 'rate-limit-check' } });
    const response = await handleLeadRequest(req, { ...options, env: {} });
    assert.equal(response.status, i < 5 ? 200 : 429);
  }
});
