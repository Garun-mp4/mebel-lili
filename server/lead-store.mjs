import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCipheriv, createDecipheriv, randomBytes, randomUUID } from 'node:crypto';
import { retentionDays } from '../legal/operator.mjs';

const projectRoot = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const recordPattern = /^(\d{13})_([0-9a-f-]{36})\.json$/;
function inside(root, target) {
  const relative = path.relative(root, target);
  return relative === '' || (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}
export function storageConfig(env) {
  const keyText = env.LEADS_ENCRYPTION_KEY || '';
  const directory = env.LEADS_DATA_DIR || '';
  if (!/^[0-9a-f]{64}$/i.test(keyText) || !path.isAbsolute(directory) || inside(projectRoot, path.resolve(directory))) {
    throw new Error('Private absolute storage directory outside the project and a 32-byte hex key are required');
  }
  return { directory: path.resolve(directory), key: Buffer.from(keyText, 'hex') };
}
async function privateDirectory(env) {
  const config = storageConfig(env);
  await fs.mkdir(config.directory, { recursive: true, mode: 0o700 });
  const actual = await fs.realpath(config.directory);
  const root = await fs.realpath(projectRoot);
  if (inside(root, actual)) throw new Error('Storage must not resolve inside the application');
  return { ...config, directory: actual };
}
export async function purgeExpired(env, now = Date.now()) {
  const { directory } = await privateDirectory(env);
  let removed = 0;
  for (const name of await fs.readdir(directory)) {
    // A crash before atomic rename can leave an encrypted temporary record; expire it too.
    const match = recordPattern.exec(name.endsWith('.tmp') ? name.slice(0, -4) : name);
    if (match && Number(match[1]) <= now) {
      try { await fs.unlink(path.join(directory, name)); removed++; }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
  }
  return removed;
}
export async function saveLead(data, env, now = Date.now()) {
  const { directory, key } = await privateDirectory(env);
  await purgeExpired(env, now);
  const id = randomUUID();
  const expiresAt = now + retentionDays * 86_400_000;
  const record = { id, receivedAt: new Date(now).toISOString(), expiresAt: new Date(expiresAt).toISOString(), ...data };
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const aad = `${id}:${expiresAt}`;
  cipher.setAAD(Buffer.from(aad));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(record), 'utf8'), cipher.final()]);
  const envelope = JSON.stringify({ format: 1, id, expiresAt, iv: iv.toString('hex'), tag: cipher.getAuthTag().toString('hex'), ciphertext: ciphertext.toString('base64') });
  const target = path.join(directory, `${expiresAt}_${id}.json`);
  const temporary = `${target}.tmp`;
  try {
    const file = await fs.open(temporary, 'wx', 0o600);
    try { await file.writeFile(envelope, 'utf8'); await file.sync(); } finally { await file.close(); }
    await fs.rename(temporary, target);
  } catch (error) {
    await fs.unlink(temporary).catch(() => {});
    throw error;
  }
  return { id };
}
export async function listLeads(env) {
  await purgeExpired(env);
  const { directory } = await privateDirectory(env);
  return (await fs.readdir(directory)).filter(name => recordPattern.test(name)).map(name => ({ id: recordPattern.exec(name)[2], expiresAt: new Date(Number(recordPattern.exec(name)[1])).toISOString() }));
}
export async function readLead(id, env) {
  if (!/^[0-9a-f-]{36}$/.test(id)) throw new Error('Invalid lead ID');
  await purgeExpired(env);
  const { directory, key } = await privateDirectory(env);
  const name = (await fs.readdir(directory)).find(value => recordPattern.test(value) && recordPattern.exec(value)[2] === id);
  if (!name) throw new Error('Lead not found or expired');
  const envelope = JSON.parse(await fs.readFile(path.join(directory, name), 'utf8'));
  if (envelope.format !== 1 || envelope.id !== id || Number(recordPattern.exec(name)[1]) !== envelope.expiresAt) throw new Error('Invalid record');
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(envelope.iv, 'hex'));
  decipher.setAAD(Buffer.from(`${id}:${envelope.expiresAt}`));
  decipher.setAuthTag(Buffer.from(envelope.tag, 'hex'));
  const record = JSON.parse(Buffer.concat([decipher.update(Buffer.from(envelope.ciphertext, 'base64')), decipher.final()]).toString('utf8'));
  if (record.id !== id) throw new Error('Invalid record identity');
  return record;
}
export async function deleteLead(id, env) {
  if (!/^[0-9a-f-]{36}$/.test(id)) throw new Error('Invalid lead ID');
  const { directory } = await privateDirectory(env);
  const name = (await fs.readdir(directory)).find(value => recordPattern.test(value) && recordPattern.exec(value)[2] === id);
  if (!name) throw new Error('Lead not found');
  await fs.unlink(path.join(directory, name));
}
