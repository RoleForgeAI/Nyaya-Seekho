#!/usr/bin/env node
/* Post-build smoke test: proves the Constitution data was actually bundled into the production build.
 * Usage: node scripts/smoke-constitution-build.mjs [distDir=dist]   (run after `npm run build`) */
import fs from 'node:fs';
import path from 'node:path';
const dist = process.argv[2] || 'dist';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
if (!fs.existsSync(dist)) { console.error(`dist folder "${dist}" not found — run the build first`); process.exit(1); }
const blob = walk(dist).filter((f) => /\.(js|mjs|json|html)$/.test(f)).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
const needles = [
  'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
  'India, that is Bharat, shall be a Union of States.',
  'Any other matter not enumerated in List II or List III including any tax not mentioned in either of those Lists.',
  'Parliament may in exercise of its constituent power amend by way of addition, variation or repeal',
];
const missing = needles.filter((n) => !blob.includes(n));
if (missing.length) { console.error('✗ Constitution text not found in build output:\n  - ' + missing.join('\n  - ')); process.exit(1); }
console.log(`✓ Constitution text is present in the ${dist}/ bundle (${needles.length}/${needles.length} probes)`);
