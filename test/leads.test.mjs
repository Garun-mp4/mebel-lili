import test from 'node:test';
import assert from 'node:assert/strict';
import { handleLeadRequest } from '../server/leads.mjs';

const env = { TELEGRAM_BOT_TOKEN: 'test-token-not-real', TELEGRAM_CHAT_ID: '-1000000000000' };
const lead = { source: 'mid', name: 'Проверка формы', phone: '+7 (000) 000-00-00', project: 'Кухня', message: 'Тест без реальной отправки', website: '' };
let client = 0;
function request(data = lead, options = {}) {
  return new Request('https://example.test/api/leads', {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://example.test', 'x-forwarded-for': `test-${++client}`, ...options.headers },
    body: JSON.stringify(data), ...options
  });
}

test('all three forms deliver plain text and require the Telegram message acknowledgement', async () => {
  for (const source of ['hero', 'mid', 'contact']) {
    let sent;
    const response = await handleLeadRequest(request({ ...lead, source }), { env, fetchImpl: async (url, options) => {
      sent = { url, ...JSON.parse(options.body) };
      return Response.json({ ok: true, result: { message_id: 42 } });
    } });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).ok, true);
    assert.equal(sent.chat_id, env.TELEGRAM_CHAT_ID);
    assert.match(sent.text, /Проверка формы/);
    assert.match(sent.text, /Телефон: \+7 \(000\) 000-00-00/);
    assert.match(sent.text, /Мебель: Кухня/);
    assert.equal(sent.parse_mode, undefined);
  }
});

test('unconfigured bot returns an honest error without calling an upstream service', async () => {
  const response = await handleLeadRequest(request(), { env: {}, fetchImpl: () => assert.fail('Must not send') });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).ok, false);
});

test('Telegram failures and absent acknowledgements never confirm success or expose token', async () => {
  for (const upstream of [Response.json({ ok: false, description: 'Forbidden' }, { status: 403 }), Response.json({ ok: true, result: {} })]) {
    const response = await handleLeadRequest(request(), { env, fetchImpl: async () => upstream });
    assert.equal(response.status, 502);
    const text = await response.text();
    assert.ok(!text.includes(env.TELEGRAM_BOT_TOKEN));
    assert.equal(JSON.parse(text).ok, false);
  }
});

test('network exceptions return delivery uncertainty without leaking upstream credentials', async () => {
  const response = await handleLeadRequest(request(), { env, fetchImpl: async () => { throw new Error(env.TELEGRAM_BOT_TOKEN); } });
  assert.equal(response.status, 504);
  assert.ok(!(await response.text()).includes(env.TELEGRAM_BOT_TOKEN));
});

test('invalid phone, source, project, name, comment and honeypot are rejected before sending', async () => {
  for (const patch of [{ phone: 'abc123' }, { source: 'invalid' }, { project: 'made up' }, { name: ' ' }, { name: 'name\nspoof' }, { message: 'a'.repeat(1501) }, { website: 'spam.test' }]) {
    const response = await handleLeadRequest(request({ ...lead, ...patch }), { env, fetchImpl: () => assert.fail('Must not send') });
    assert.equal(response.status, 400);
  }
});

test('method, content type, cross-origin requests and oversized bodies are rejected', async () => {
  const cases = [
    [new Request('https://example.test/api/leads'), 405],
    [new Request('https://example.test/api/leads', { method: 'POST', body: 'x' }), 415],
    [request(lead, { headers: { 'content-type': 'application/json', origin: 'https://other.test' } }), 403],
    [request({ ...lead, message: 'a'.repeat(17000) }), 413],
    [new Request('https://example.test/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' }), 400]
  ];
  for (const [req, expected] of cases) assert.equal((await handleLeadRequest(req, { env, fetchImpl: () => assert.fail('Must not send') })).status, expected);
});

test('the sixth request from one instance client is rate limited', async () => {
  for (let i = 0; i < 6; i++) {
    const req = request(lead, { headers: { 'content-type': 'application/json', 'x-forwarded-for': 'rate-limit-check' } });
    const response = await handleLeadRequest(req, { env, fetchImpl: async () => Response.json({ ok: true, result: { message_id: i + 1 } }) });
    assert.equal(response.status, i < 5 ? 200 : 429);
  }
});
