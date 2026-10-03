import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { saveLead, readLead, listLeads, deleteLead, purgeExpired, storageConfig } from '../server/lead-store.mjs';

test('encrypted records round trip, authenticate, expire and can be deleted by an operator', async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'lili-store-test-'));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  const env = { LEADS_DATA_DIR: directory, LEADS_ENCRYPTION_KEY: randomBytes(32).toString('hex') };
  const data = { name: 'TEST PRIVATE NAME', phone: '+7 000 0000000', consent: { accepted: true, version: 'test' } };
  const { id } = await saveLead(data, env);
  const raw = await fs.readFile(path.join(directory, (await fs.readdir(directory))[0]), 'utf8');
  assert.ok(!raw.includes(data.name));
  assert.ok(!raw.includes(data.phone));
  const restored = await readLead(id, env);
  assert.equal(restored.name, data.name);
  assert.equal(restored.consent.accepted, true);
  assert.equal(Date.parse(restored.expiresAt) - Date.parse(restored.receivedAt), 30 * 86_400_000);
  assert.equal((await listLeads(env))[0].id, id);
  await assert.rejects(readLead(id, { ...env, LEADS_ENCRYPTION_KEY: randomBytes(32).toString('hex') }));
  await assert.rejects(readLead('../../secret', env));
  await deleteLead(id, env);
  await assert.rejects(readLead(id, env));
  await saveLead(data, env, Date.now() - 31 * 86_400_000);
  assert.equal(await purgeExpired(env), 1);
  assert.deepEqual(await listLeads(env), []);
  await saveLead(data, env, Date.now() - 31 * 86_400_000);
  const expired = (await fs.readdir(directory))[0];
  await fs.rename(path.join(directory, expired), path.join(directory, `${expired}.tmp`));
  assert.equal(await purgeExpired(env), 1);
});

test('storage rejects invalid keys, relative paths and application directories', () => {
  for (const env of [{}, { LEADS_DATA_DIR: 'relative', LEADS_ENCRYPTION_KEY: 'a'.repeat(64) }, { LEADS_DATA_DIR: process.cwd(), LEADS_ENCRYPTION_KEY: 'a'.repeat(64) }, { LEADS_DATA_DIR: os.tmpdir(), LEADS_ENCRYPTION_KEY: 'short' }]) assert.throws(() => storageConfig(env));
});
