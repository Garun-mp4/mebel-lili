// Execute only in an authorized SSH session on the Russian server, never in a public HTTP route.
import { listLeads, readLead, deleteLead, purgeExpired } from '../server/lead-store.mjs';
const [command, id] = process.argv.slice(2);
try {
  if (command === 'list') console.log(JSON.stringify(await listLeads(process.env), null, 2));
  else if (command === 'read' && id) console.log(JSON.stringify(await readLead(id, process.env), null, 2));
  else if (command === 'delete' && id) { await deleteLead(id, process.env); console.log('Deleted'); }
  else if (command === 'purge') console.log(`Expired records removed: ${await purgeExpired(process.env)}`);
  else { console.error('Usage: leads-admin.mjs list | read ID | delete ID | purge'); process.exitCode = 1; }
} catch {
  console.error('Operation failed. Check the ID, private storage, key and permissions.');
  process.exitCode = 1;
}
