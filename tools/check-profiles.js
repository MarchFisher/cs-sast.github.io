const fs = require('node:fs');
const path = require('node:path');

const members = path.resolve(__dirname, '../site/members');
const errors = [];
for (const entry of fs.readdirSync(members, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  if (!/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/.test(entry.name)) errors.push(`${entry.name}: member directory must be a lowercase GitHub-style ID`);
  const page = path.join(members, entry.name, 'index.html');
  if (!fs.existsSync(page)) errors.push(`${entry.name}: missing index.html`);
  else {
    const html = fs.readFileSync(page, 'utf8');
    if (/<(?:iframe|script)\b/i.test(html)) errors.push(`${entry.name}: iframe and script elements require manual approval and are blocked by default`);
    if (!html.includes('../index.html')) errors.push(`${entry.name}: missing link back to member list`);
    if (!html.includes('../../index.html')) errors.push(`${entry.name}: missing link back to site home`);
  }
}
if (errors.length) { console.error(errors.map((error) => `- ${error}`).join('\n')); process.exit(1); }
console.log('Member profile checks passed.');
