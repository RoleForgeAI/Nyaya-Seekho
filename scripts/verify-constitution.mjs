#!/usr/bin/env node
/* Nyaya-Seekho — Constitution of India integrity check (no dependencies).
 * Usage: node scripts/verify-constitution.mjs <constitutionData.js> <constitution.expected.json> [--no-hash]
 * Exit code 1 on any failure, so it can run as `prebuild`. */
import fs from 'node:fs';
import crypto from 'node:crypto';
const [dataFile, fixFile, ...flags] = process.argv.slice(2);
if (!dataFile || !fixFile) { console.error('usage: verify-constitution.mjs <data.js> <expected.json> [--no-hash]'); process.exit(2); }
const fails = []; const warns = []; const fail = (m) => fails.push(m); const warn = (m) => warns.push(m);
function loadData(file) {
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/^export const /gm, 'const ').replace(/^export default .*$/gm, '');
  return new Function(src + '\nreturn { CONSTITUTION_META, CONSTITUTION_CHAPTERS, CONSTITUTION_SECTIONS };')();
}
const { CONSTITUTION_META: meta, CONSTITUTION_CHAPTERS: chapters, CONSTITUTION_SECTIONS: sections } = loadData(dataFile);
const fx = JSON.parse(fs.readFileSync(fixFile, 'utf8'));
const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const byId = new Map();

// 1. shape + unique ids
const KINDS = new Set(['preamble', 'article', 'schedule', 'appendix']);
for (const s of sections) {
  if (byId.has(s.id)) fail(`duplicate section id ${s.id}`);
  byId.set(s.id, s);
  if (!KINDS.has(s.kind)) fail(`${s.id}: bad kind ${s.kind}`);
  for (const k of ['id', 'label', 'title', 'text', 'status', 'chapterId', 'amendments', 'notInForce'])
    if (s[k] === undefined) fail(`${s.id}: missing field ${k}`);
  if (!['in-force', 'omitted'].includes(s.status)) fail(`${s.id}: bad status`);
}
const chapIds = new Set(chapters.map((c) => c.id));
for (const s of sections) if (!chapIds.has(s.chapterId)) fail(`${s.id}: unknown chapterId ${s.chapterId}`);

// 2. Articles vs Contents (independent list read from the PDF Contents pages)
const arts = sections.filter((s) => s.kind === 'article');
const expIds = fx.articles.map((a) => a.id);
if (!eq(arts.map((a) => a.id), expIds)) {
  const have = new Set(arts.map((a) => a.id));
  fail(`article id list differs from Contents (missing: ${expIds.filter((i) => !have.has(i)).join(',') || '-'}; extra/out-of-order present)`);
}
for (const e of fx.articles) {
  const a = byId.get(e.id); if (!a) continue;
  if ((a.status === 'omitted') !== e.omitted) fail(`${e.id}: omitted flag differs from Contents`);
  if (a.part !== e.part) fail(`${e.id}: part ${a.part} != Contents ${e.part}`);
  if ((a.chapter ?? null) !== (e.chapter ?? null)) fail(`${e.id}: chapter ${a.chapter} != Contents ${e.chapter}`);
  if ((a.group ?? null) !== (e.group ?? null)) fail(`${e.id}: group differs from Contents`);
  if (a.status === 'in-force') {
    if (!a.title) fail(`${e.id}: empty title`);
    else if (norm(a.title) !== norm(e.contentsTitle) && norm(a.title + '.') !== norm(e.contentsTitle) && !fx.titleExceptions.includes(e.id))
      fail(`${e.id}: title "${a.title}" != Contents "${e.contentsTitle}"`);
  }
}
// hard facts read off the Contents pages
const c = { slots: arts.length, omitted: arts.filter((a) => a.status === 'omitted').length };
if (c.slots !== 506) fail(`expected 506 article slots, got ${c.slots}`);
if (c.omitted !== 35) fail(`expected 35 omitted articles, got ${c.omitted}`);

// 3. Parts / constitution chapters
const parts = chapters.filter((x) => x.kind === 'part');
if (!eq(parts.map((p) => ({ number: p.number, title: p.title, omitted: p.status === 'omitted' })), fx.parts)) fail('parts differ from Contents');
if (parts.length !== 26 || parts.filter((p) => p.status === 'in-force').length !== 25) fail('expected 26 part slots / 25 in force');
const subs = parts.flatMap((p) => p.subChapters.map((s) => ({ part: p.number, number: s.number, title: s.title })));
if (!eq(subs, fx.constitutionChapters)) fail('constitution chapters differ from Contents');
if (subs.length !== 23) fail(`expected 23 chapters, got ${subs.length}`);
for (const a of arts) if (a.chapterId !== 'part-' + a.part) fail(`${a.id}: chapterId/part mismatch`);
for (const id of ['preamble', 'schedules', 'appendices']) if (!chapIds.has(id)) fail(`missing chapter ${id}`);

// 4. text hygiene
const strings = (s) => [s.text, s.omission, ...(s.entries || []).map((e) => e.text), ...(s.rows || []).flatMap((r) => Object.values(r).filter((v) => typeof v === 'string')), ...s.amendments, ...s.notInForce].filter((x) => typeof x === 'string');
const BAD = [[/[\u27e6\u27e7\u0001\u0005]/, 'leftover marker char'], [/THE CONSTITUTION OF INDIA/, 'page header remnant'], [/^\s*\(Part [IVXLA]+\.—/m, 'running header remnant'], [/(^|\s)\d{1,2}\[/, 'footnote marker + bracket'], [/\t/, 'tab'], [/ {2,}/, 'double space'], [/ +$/m, 'trailing space']];
const plain = new Set(fx.plainBracketSections);
for (const s of sections) {
  for (const t of strings(s)) {
    for (const [re, why] of BAD) if (re.test(t)) { fail(`${s.id}: ${why}: "${(t.match(re) || [''])[0].slice(0, 20)}"`); break; }
    if (t !== t.trim()) fail(`${s.id}: untrimmed string`);
  }
  const body = [s.text, ...(s.entries || []).map((e) => e.text)].join('\n');
  const o = (body.match(/\[/g) || []).length, cl = (body.match(/\]/g) || []).length;
  if (!plain.has(s.id) && (o || cl)) fail(`${s.id}: unexpected square brackets`);
  if (plain.has(s.id) && o !== cl) warn(`${s.id}: unbalanced plain brackets (${o} vs ${cl})`);
  if (s.amendments.some((x) => !x) || s.notInForce.some((x) => !x)) fail(`${s.id}: empty amendment string`);
  const dup = new Set(s.amendments); if (dup.size !== s.amendments.length) fail(`${s.id}: duplicate amendment entries`);
  const hasBody = s.text || (s.entries && s.entries.length) || (s.rows && s.rows.length);
  if (s.status === 'in-force' && !hasBody) fail(`${s.id}: in force but empty`);
  if (s.status === 'omitted' && (s.text || !s.omission)) fail(`${s.id}: omitted section must have empty text and an omission note`);
  const ac = fx.amendmentCounts[s.id];
  if (!ac) fail(`${s.id}: not in fixture`); else if (ac[0] !== s.amendments.length || ac[1] !== s.notInForce.length) fail(`${s.id}: amendment/notInForce counts changed (${ac} -> ${[s.amendments.length, s.notInForce.length]})`);
}
// a footnote star glued to statute text (e.g. "*7. Bar of jurisdiction") means a star note was not linked
const STRAY_STAR = /(?:^|\n)\*(?=[A-Za-z0-9(“"])|(?<=[\s(])\*(?=[A-Za-z0-9(“"])/;
for (const s of sections) {
  const body = [s.text, ...(s.entries || []).map((e) => e.text), ...(s.rows || []).flatMap((r) => Object.values(r).filter((x) => typeof x === 'string'))];
  for (const t of body) if (t && STRAY_STAR.test(t)) { fail(`${s.id}: stray footnote star in statute text: "${t.match(STRAY_STAR).input.slice(Math.max(0, t.search(STRAY_STAR) - 15), t.search(STRAY_STAR) + 25).replace(/\n/g, ' ')}"`); break; }
}
for (const id of Object.keys(fx.amendmentCounts)) if (!byId.has(id)) fail(`fixture section ${id} missing in data`);

// 5. schedules & appendices
const GROUPS = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth'].map((x) => x + ' Schedule');
for (const g of GROUPS) if (!sections.some((s) => s.kind === 'schedule' && s.group === g)) fail(`no section for ${g}`);
for (const id of ['app1', 'app2', 'app3']) if (!byId.has(id)) fail(`missing ${id}`);
for (const [id, seq] of Object.entries(fx.sequences)) {
  const s = byId.get(id); if (!s) { fail(`sequence section ${id} missing`); continue; }
  const got = s.entries ? s.entries.map((e) => e.no) : s.rows.map((r) => r.no || '');
  if (!eq(got, seq)) fail(`${id}: entry/row numbering differs from fixture`);
}
for (const [k, ids] of Object.entries(fx.paragraphSchedules)) {
  const got = sections.filter((s) => s.id.startsWith(k + '-')).map((s) => s.id);
  if (!eq(got, ids)) fail(`${k}: paragraph ids differ from fixture`);
}
const numOf = (n) => parseInt(n, 10);
const seqOK = (list, name) => { let prev = 0; for (const n of list.filter((x) => x)) { const v = numOf(n); if (v < prev) fail(`${name}: numbering goes backwards at ${n}`); prev = v; } };
for (const id of ['sch7-I', 'sch7-II', 'sch7-III', 'sch8', 'sch9', 'sch11', 'sch12']) seqOK(byId.get(id).entries.map((e) => e.no), id);
const cnt = (id) => byId.get(id).entries.length;
if (cnt('sch8') !== 22) fail('Eighth Schedule must list 22 languages');
if (cnt('sch11') !== 29) fail('Eleventh Schedule must list 29 matters');
if (cnt('sch12') !== 18) fail('Twelfth Schedule must list 18 matters');
{ const nums = new Set(byId.get('sch9').entries.map((e) => numOf(e.no))); for (let i = 1; i <= 284; i++) if (!nums.has(i)) fail(`Ninth Schedule: entry ${i} missing`); }
{ const rows = byId.get('sch1-I').rows.filter((r) => r.no); const n = rows.map((r) => numOf(r.no)); for (let i = 1; i <= 28; i++) if (!n.includes(i)) fail(`First Schedule Part I: state ${i} missing`); if (rows.some((r) => !r.name || !r.territories)) fail('First Schedule: row with empty name/territories'); }
{ const rows = byId.get('sch4').rows; const seats = rows.filter((r) => r.no).map((r) => Number(r.seats)); const tot = rows.find((r) => r.name === 'Total');
  if (seats.length !== 31 || seats.some(Number.isNaN)) fail('Fourth Schedule: expected 31 numbered rows'); else { const sum = seats.reduce((a, b) => a + b, 0); if (!tot || Number(tot.seats) !== sum) fail(`Fourth Schedule: seats sum ${sum} != Total ${tot && tot.seats}`); } }

// 6. spot-check anchors (verbatim substrings)
for (const a of fx.anchors) { const s = byId.get(a.id); if (!s || !s.text.replace(/\n/g, ' ').includes(a.contains)) fail(`anchor missing in ${a.id}: "${a.contains.slice(0, 50)}"`); }

// 7. content fingerprint (text, titles, entries, rows, amendments; not explanation/cases)
if (!flags.includes('--no-hash')) {
  const h = crypto.createHash('sha256');
  for (const s of sections) h.update([s.id, s.title || '', s.text || '', s.omission || '', JSON.stringify(s.entries || []), JSON.stringify(s.rows || []), JSON.stringify(s.amendments), JSON.stringify(s.notInForce)].join('\x1f') + '\x1e', 'utf8');
  const got = h.digest('hex');
  if (got !== fx.textHash) fail(`content fingerprint changed (${got.slice(0, 12)} != ${fx.textHash.slice(0, 12)}). Statute text must not be edited; if a correction is intentional, regenerate the fixture.`);
}

// 8. explanations (every in-force section) and cases (schema + Indian Kanoon link) — added in the explanation pass
const hasContent = (s) => (s.text || '').trim() || (s.entries || []).length || (s.rows || []).length;
let explained = 0, caseCount = 0;
for (const s of sections) {
  const ex = s.explanation;
  if (typeof ex !== 'string') { fail(`${s.id}: explanation must be a string`); continue; }
  if (s.status === 'omitted') { if (ex) fail(`${s.id}: an omitted section must not carry an explanation`); }
  else if (hasContent(s)) {
    const words = ex.trim().split(/\s+/).filter(Boolean).length;
    if (words < 4) fail(`${s.id}: explanation missing or too short`); else explained++;
    if (words > 200) fail(`${s.id}: explanation too long (${words} words)`);
    if (/^\s|\s$|\s{2,}|\*{2,}|\uFFFD|https?:\/\//.test(ex)) fail(`${s.id}: explanation has stray spaces, stars or a URL`);
  }
}
const KANOON = /^https:\/\/indiankanoon\.org\/doc\/\d+\/?$/;
for (const s of sections) {
  if (!Array.isArray(s.cases)) { fail(`${s.id}: cases must be an array`); continue; }
  if (s.cases.length && s.status === 'omitted') fail(`${s.id}: omitted section must not carry cases`);
  const seen = new Set();
  for (const k of s.cases) {
    for (const f of ['name', 'cite', 'year', 'ratio', 'url']) if (k[f] === undefined || k[f] === '' || k[f] === null) fail(`${s.id}: case "${k.name || '?'}" is missing ${f}`);
    if (k.url && !KANOON.test(k.url)) fail(`${s.id}: case "${k.name}" url must be an Indian Kanoon document link (https://indiankanoon.org/doc/<id>/)`);
    if (!Number.isInteger(k.year) || k.year < 1947 || k.year > 2030) fail(`${s.id}: case "${k.name}" has an invalid year`);
    if (seen.has(k.name)) fail(`${s.id}: duplicate case "${k.name}"`);
    seen.add(k.name); caseCount++;
  }
}
const chars = sections.reduce((n, s) => n + (s.text || '').length, 0);
console.log(`Constitution data: ${sections.length} sections (${arts.length} article slots: ${c.slots - c.omitted} in force, ${c.omitted} omitted), ${parts.length} part slots, ${chars} chars of text`);
console.log(`Explanations: ${explained} sections explained; cases: ${caseCount} verified case entries`);
for (const w of warns) console.warn('WARN ', w);
if (fails.length) { console.error(`\nFAILED — ${fails.length} problem(s):`); for (const f of fails.slice(0, 60)) console.error('  ✗ ' + f); process.exit(1); }
console.log('✓ all Constitution integrity checks passed');
