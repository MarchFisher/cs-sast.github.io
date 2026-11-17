const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const publicRoots = ['site', 'tools', 'docs', '.github'];
const excludedDirectories = new Set(['docs/archive', 'docs/private']);
const errors = [];
const textFiles = [];
const englishName = /^[A-Za-z0-9._-]+$/;

function walk(relativePath) {
  if (excludedDirectories.has(relativePath)) return;
  const absolutePath = path.join(root, relativePath);
  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    const child = path.join(relativePath, entry.name);
    if (!englishName.test(entry.name)) errors.push(`${child}: public file and directory names must use English characters`);
    if (entry.isDirectory()) walk(child);
    else textFiles.push(child);
  }
}

for (const publicRoot of publicRoots) if (fs.existsSync(path.join(root, publicRoot))) walk(publicRoot);

const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /ghp_[A-Za-z0-9]{30,}/,
  /github_pat_[A-Za-z0-9_]{30,}/,
  /AKIA[0-9A-Z]{16}/
];

for (const relativePath of textFiles) {
  const absolutePath = path.join(root, relativePath);
  if (fs.statSync(absolutePath).size > 2 * 1024 * 1024) {
    errors.push(`${relativePath}: file exceeds 2 MiB`);
    continue;
  }
  const extension = path.extname(relativePath).toLowerCase();
  if (!['.html', '.css', '.js', '.json', '.md', '.yml', '.yaml', ''].includes(extension)) continue;
  const content = fs.readFileSync(absolutePath, 'utf8');
  for (const pattern of secretPatterns) if (pattern.test(content)) errors.push(`${relativePath}: possible secret detected`);
  if (extension === '.json') {
    try { JSON.parse(content); } catch (error) { errors.push(`${relativePath}: invalid JSON (${error.message})`); }
  }
  if (extension === '.html') checkHtml(relativePath, content);
}

function checkHtml(relativePath, content) {
  if (!/<html\s[^>]*lang=/i.test(content)) errors.push(`${relativePath}: missing html lang attribute`);
  if (!/<meta\s[^>]*name=["']viewport["']/i.test(content)) errors.push(`${relativePath}: missing viewport metadata`);
  for (const image of content.matchAll(/<img\b[^>]*>/gi)) if (!/\salt=["'][^"']*["']/i.test(image[0])) errors.push(`${relativePath}: image is missing alt text`);
  for (const link of content.matchAll(/<(?:a|link|script)\b[^>]*(?:href|src)=["']([^"']+)["'][^>]*>/gi)) {
    const target = link[1];
    if (/^(?:https?:|mailto:|tel:|#|data:)/i.test(target)) continue;
    const cleanTarget = target.split(/[?#]/)[0];
    const resolved = path.resolve(path.dirname(path.join(root, relativePath)), cleanTarget);
    if (!resolved.startsWith(path.join(root, 'site'))) errors.push(`${relativePath}: local link escapes site directory (${target})`);
    else if (!fs.existsSync(resolved)) errors.push(`${relativePath}: broken local link (${target})`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}
console.log(`Content checks passed (${textFiles.length} files).`);
