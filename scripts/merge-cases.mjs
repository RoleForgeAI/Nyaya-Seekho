#!/usr/bin/env node
/* Nyaya-Seekho — merges newly-verified Constitution case-law entries into constitutionData.js.
 * Reads a verified-cases JSON array [{id, sections, name, cite, year, url, ratio}, ...] and,
 * for each section id listed, appends {name, cite, year, ratio, url} to that section's `cases`
 * array (deduped by name, sorted by year ascending), rewriting ONLY the matching lines in
 * constitutionData.js -- the file is one section object per line, so this is a targeted,
 * line-level rewrite that leaves every other line byte-identical.
 * Usage: node scripts/merge-cases.mjs <verified.json> <constitutionData.js> */
import fs from 'node:fs';

const [verifiedFile, dataFile] = process.argv.slice(2);
if (!verifiedFile || !dataFile) {
  console.error('usage: merge-cases.mjs <verified.json> <constitutionData.js>');
  process.exit(2);
}

const verified = JSON.parse(fs.readFileSync(verifiedFile, 'utf8'));
const bySection = new Map();
for (const c of verified) {
  for (const sid of c.sections) {
    if (!bySection.has(sid)) bySection.set(sid, []);
    bySection.get(sid).push({ name: c.name, cite: c.cite, year: c.year, ratio: c.ratio, url: c.url });
  }
}

const lines = fs.readFileSync(dataFile, 'utf8').split('\n');
let touched = 0;
const seenIds = new Set();
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!line.startsWith('{"id":')) continue;
  let obj;
  try { obj = JSON.parse(line.replace(/,$/, '')); } catch { continue; }
  if (!obj.id || !bySection.has(obj.id)) continue;
  seenIds.add(obj.id);
  const existing = Array.isArray(obj.cases) ? obj.cases : [];
  const byName = new Map(existing.map((k) => [k.name, k]));
  for (const k of bySection.get(obj.id)) byName.set(k.name, k);
  obj.cases = [...byName.values()].sort((a, b) => a.year - b.year);
  const trailingComma = line.endsWith(',') ? ',' : '';
  lines[i] = JSON.stringify(obj) + trailingComma;
  touched++;
}

fs.writeFileSync(dataFile, lines.join('\n'));
console.log(`Merged ${verified.length} case(s) into ${touched} section line(s).`);
const missing = [...bySection.keys()].filter((id) => !seenIds.has(id));
if (missing.length) console.warn('WARN: section ids not found in data file:', missing.join(', '));
