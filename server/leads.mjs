const MAX_BODY_BYTES = 16_384;
const sources = { hero: 'Первый экран', mid: 'Фото и размеры', contact: 'Контакты' };
const projects = new Set(['', 'Кухня', 'Шкаф', 'Корпусная мебель', 'Другая мебель на заказ', 'Стеклянная мебель']);
const limits = new Map();

function reply(status, message, extra = {}) {
  return Response.json({ ok: status === 200, message, ...extra }, {
    status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
  });
}

async function readBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) throw new RangeError();
  if (!request.body) throw new SyntaxError();
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new RangeError(); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function allowRequest(request) {
  // Best-effort per-instance limit. Vercel Firewall can enforce a global limit.
  const now = Date.now();
  for (const [key, item] of limits) if (item.until <= now) limits.delete(key);
  const key = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  const current = limits.get(key) || { count: 0, until: now + 60_000 };
  if (current.count >= 5 || (!limits.has(key) && limits.size >= 2000)) return false;
  current.count++;
  limits.set(key, current);
  return true;
}

export async function handleLeadRequest(request, { env = process.env, fetchImpl = fetch } = {}) {
  if (request.method !== 'POST') {
    const response = reply(405, 'Используйте форму на сайте.');
    response.headers.set('allow', 'POST');
    return response;
  }
  const origin = request.headers.get('origin');
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('sec-fetch-site') === 'cross-site') {
    return reply(403, 'Отправьте заявку с сайта Mebel Lili.');
  }
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return reply(415, 'Неверный формат запроса.');
  }
  let data;
  try { data = await readBody(request); }
  catch (error) { return reply(error instanceof RangeError ? 413 : 400, 'Не удалось прочитать заявку. Проверьте поля.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, 'Проверьте поля заявки.');
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const phone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const project = typeof data.project === 'string' ? data.project.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  const digits = phone.replace(/\D/g, '');
  if (!name || name.length > 80 || /[\x00-\x1f]/.test(name)) return reply(400, 'Укажите имя до 80 символов.');
  if (!/^[+\d\s().-]+$/.test(phone) || phone.length > 32 || digits.length < 10 || digits.length > 15) {
    return reply(400, 'Проверьте телефон: от 10 до 15 цифр.');
  }
  if (!Object.hasOwn(sources, data.source) || !projects.has(project) || message.length > 1500 || data.website) {
    return reply(400, 'Проверьте тип проекта и комментарий (до 1500 символов).');
  }
  if (!env.TELEGRAM_BOT_TOKEN?.trim() || !env.TELEGRAM_CHAT_ID?.trim()) {
    return reply(503, 'Отправка заявок пока недоступна. Позвоните: +7 (917) 037-25-63.');
  }
  if (!allowRequest(request)) return reply(429, 'Слишком много заявок. Подождите минуту или позвоните нам.');
  const text = [
    'Новая заявка · Mebel Lili', `Форма: ${sources[data.source]}`, `Имя: ${name}`,
    `Телефон: ${phone}`, project && `Мебель: ${project}`, message && `Комментарий:\n${message}`
  ].filter(Boolean).join('\n');
  try {
    const response = await fetchImpl(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN.trim()}/sendMessage`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID.trim(), text, link_preview_options: { is_disabled: true } }),
      signal: AbortSignal.timeout(12_000)
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true || !Number.isInteger(result.result?.message_id)) {
      return reply(502, 'Заявка не доставлена. Попробуйте позже или позвоните: +7 (917) 037-25-63.');
    }
    return reply(200, 'Заявка отправлена. Свяжемся с вами по указанному телефону.');
  } catch {
    // Never log the upstream URL: it contains the bot token.
    return reply(504, 'Не удалось подтвердить отправку. Позвоните: +7 (917) 037-25-63 или попробуйте позже.');
  }
}
