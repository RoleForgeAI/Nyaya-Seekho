# Bare Act & Statute Navigator — Project Handoff (Updated)

## What this is
An interactive, cross-referenced study tool for Indian law students, starting with the
Bharatiya Nyaya Sanhita (BNS), 2023. Built for a solo, non-engineer law student builder.
Every session so far has been done conversationally in Claude chat — no code written by hand.

## Current status: BNS complete — all 358 of 358 sections, all 20 chapters
- Chapter I — Preliminary (§§1–3)
- Chapter II — Of Punishments (§§4–13)
- Chapter III — General Exceptions (§§14–44)
- Chapter IV — Abetment, Criminal Conspiracy and Attempt (§§45–62)
- Chapter V — Offences Against Woman and Child (§§63–99)
- Chapter VI — Offences Affecting the Human Body (§§100–146)
- Chapter VII — Offences Against the State (§§147–158)
- Chapter VIII — Offences Relating to the Army, Navy and Air Force (§§159–168)
- Chapter IX — Offences Relating to Elections (§§169–177)
- Chapter X — Coin, Currency-Notes, Bank-Notes and Government Stamps (§§178–188)
- Chapter XI — Offences Against Public Tranquillity (§§189–197)
- Chapter XII — Offences By or Relating to Public Servants (§§198–205)
- Chapter XIII — Contempts of the Lawful Authority of Public Servants (§§206–226)
- Chapter XIV — False Evidence and Offences Against Public Justice (§§227–269)
- Chapter XV — Public Health, Safety, Convenience, Decency and Morals (§§270–297)
- Chapter XVI — Offences Relating to Religion (§§298–302)
- Chapter XVII — Offences Against Property (§§303–334)
- Chapter XVIII — Offences Relating to Documents and to Property Marks (§§335–350)
- Chapter XIX — Criminal Intimidation, Insult, Annoyance, Defamation (§§351–357)
- Chapter XX — Repeal and Savings (§358)

**Landmark cases curated (verified citations only — a deliberately small, high-value set,
not exhaustive):** Sections 22, 35, 38, 45, 61, 63 (2 cases), 85, 100, 101, 124, 303, 356.
No new case law was added in the final six-chapter batch — statute text took priority for
that batch; cases in Chapters VIII, IX, XII, XVI, XVIII, XX can be enriched later.

**Integrity check (run after the final batch):** exactly 358 section objects in `SECTIONS`,
ids 1–358 with no gaps and no duplicates; all 20 `CHAPTERS` entries present; every
`CATEGORIES` entry's `chapter` resolves to a real chapter and every section's `category`
resolves to a real category. `npm run build` succeeds.

**After BNS and BSA:** BNSS (Bharatiya Nagarik Suraksha Sanhita — criminal *procedure*, not
yet started, likely 500+ sections), and eventually Indian Contract Act / Constitution, per
the ACTS structure already built in.

## BSA complete — all 170 of 170 sections, all 12 chapters
Full 12-chapter scaffold registered in `CHAPTERS` (`BSA-I` … `BSA-XII`, act: `"BSA"`), per
the Act's official structure (Part I Preliminary, Part II Relevancy of Facts, Part III On
Proof, Part IV Production and Effect of Evidence):
- Chapter I — Preliminary (§§1–2)
- Chapter II — Relevancy of Facts (§§3–50)
- Chapter III — Facts Which Need Not Be Proved (§§51–53)
- Chapter IV — Of Oral Evidence (§§54–55)
- Chapter V — Of Documentary Evidence (§§56–93; 3 categories: General Rules §§56–73,
  Public Documents §§74–77, Presumptions as to Documents §§78–93)
- Chapter VI — Of the Exclusion of Oral by Documentary Evidence (§§94–103)
- Chapter VII — Of the Burden of Proof (§§104–120; 2 categories: general rules §§104–114,
  the 6 specific criminal-law presumptions §§115–120)
- Chapter VIII — Of Estoppel (§§121–123)
- Chapter IX — Of Witnesses (§§124–139)
- Chapter X — Of Examination of Witnesses (§§140–168)
- Chapter XI — Of Improper Admission and Rejection of Evidence (§169)
- Chapter XII — Repeal and Savings (§170)

BSA's `ACTS` status was flipped from `"soon"` to `"active"` as soon as real content existed
(after the §§1–50 batch) rather than waiting for full completion, since `actStats()` already
tracks and displays partial progress ("N of 170 sections across M of 12 chapters") — matching
how the sidebar naturally hides any chapter/category with zero live sections in the meantime
(see `SidebarContents`).

Section ids use the `"BSA-<n>"` string-prefix convention (matching `"SRA-<n>"`) — plain
numeric ids would collide with BNS's 1–358, since `SECTION_MAP` is keyed globally across
every act in `SECTIONS`. `sectionNumber()` strips the prefix for display.

**Landmark cases (10 sections, same small-set standard as BNS):** §§8, 23, 24, 26, 39, 63
(2 cases), 72, 95, 109, 122. Note §39 and §72 both cite *Murari Lal v. State of Madhya
Pradesh* (1980) 1 SCC 704 for two distinct holdings (expert-opinion reliability generally
vs. the court's own power to compare handwriting) — intentional, not a duplicate. All cases
except one were decided before the BSA existed (it came into force 1 July 2024) and carry
two extra fields flagging that — `decidedUnder` (the old Indian Evidence Act provision) and
`continuityNote` (a caveat that no BSA-era judgment has separately confirmed the holding
still applies) — shown in the case card as a muted "Decided under {decidedUnder} (pre-BSA)"
line with the full caveat behind a "why this still applies" `<details>` toggle, plus a
matching line in the "Export section as text" output. The one exception, §122's *Jyoti
Sharma v. Vishnu Goyal* (2025 INSC 1099), is a genuine BSA-era precedent decided after the
Act came into force — it deliberately omits both fields, and the rendering (card + export)
already gates on `decidedUnder` being present, so it correctly shows no pre-BSA caveat.

Sourced from the official Gazette text via India Code (indiacode.nic.in) for §§1–50, the
Gazette PDF via mha.gov.in cross-checked against India Code's Arrangement of Sections for
§§51–100, and the Gazette PDF cross-checked against onlinelawconnect.com and independent
per-section sources for §§101–170, Act No. 47 of 2023.

**Integrity check (run after the final batch):** exactly 170 section objects with ids
`BSA-1`…`BSA-170`, no gaps, no duplicates; all 12 `CHAPTERS` entries present and now all with
live sections; every `CATEGORIES` entry's `chapter` resolves to a real chapter and every
section's `category` resolves to a real category; no id collisions with BNS/SRA's own
numbering since BSA ids are string-prefixed. `npm run build` succeeds.

## Files
This is now a real Vite + React project — no more manual esbuild bundling.
- `src/App.jsx` — the source React component (all 309 sections + UI). Edit this one.
- `src/main.jsx` — Vite/React entrypoint, mounts `App.jsx` into `index.html`.
- `src/lib/storage.js` — thin wrapper over `window.localStorage` (async `get`/`set`,
  mirrors the `{ key, value, shared }` shape the component expects). This replaces the
  old `window.storage` calls that only worked inside a Claude-artifact sandbox — notes
  now persist via real browser `localStorage`, per-browser/per-device as before.
- `index.html` / `vite.config.js` / `package.json` — standard Vite scaffolding.

### Build commands
- `npm install` — install dependencies.
- `npm run dev` — local dev server with hot reload.
- `npm run build` — production build to `dist/` (static, deployable as-is to
  GitHub Pages / Netlify / Vercel — no backend required).
- `npm run preview` — serve the production build locally to sanity-check it.

## Text vs. illustrations split (done for BNS, SRA, BSA)
`section.text` holds only the operative provision; illustrations live in their own
`section.illustrations` array, rendered under a separate "Illustrations" heading below
"Official Bare Act Text" (`SidebarContents`'s sibling, the reading pane, around the
`.body-text` / `.illus-card` JSX). `.body-text` and `.illus-card` both use
`white-space: pre-line` so embedded `\n`/`\n\n` in the text render as real line breaks
(separate sub-clauses, not one run-on paragraph) without needing to split `text` into
multiple `<p>` elements.

BNS already had 71 sections with a proper `illustrations` array from earlier batches;
SRA's bare act has no illustrations at all (genuinely — it's not an omission). Only BSA
had illustrations embedded inline in `text` (57 of 170 sections), inherited from how that
data was originally transcribed. All 57 were mechanically split out and verified
word-for-word lossless against the pre-split text (word-multiset diff, not just a visual
check) — except **BSA-2** (Definitions), which needed an editorial judgment call: it has
three separate embedded illustration blocks, each attached to a different defined term
("document", "fact", "facts in issue"), with each block's own (i)/(ii)/... numbering
restarting from the top. Flattening those into one array with no way to tell them apart
would've been actively misleading, so each group got a short lead-in label ("As to the
definition of 'document' in clause (d):") that isn't itself from the bare act text —
the only place in the project where `illustrations` contains added editorial framing
rather than a verbatim excerpt. Flag this if it ever needs re-deriving from source.

SRA's 8 landmark cases (across §§10, 14, 16, 37, 42) were already stored as proper
`{ name, cite, year, ratio, url }` objects on `cases`, never merged into `section.text` —
confirmed, no changes needed there.

## Content standards — the most important thing to preserve
1. Statute text is sourced from a reliable bare-act reference (devgan.in has been used
   throughout) — never invented, never paraphrased from memory. Full text, no shortening
   of provisos, explanations, illustrations, sub-sections, or exceptions.
2. Landmark cases are added sparingly, only after verifying the actual citation via search
   (name, correct citation, and a real Indian Kanoon or similar public link). Never guess
   a citation. Most sections intentionally have no case attached.
3. "Ingredients" checklists and "Simple Explanation" / "Punishment" fields are added only
   where the law is genuinely unambiguous enough to summarize safely — not blanket-applied.
4. IPC section numbers with letter suffixes (e.g. "376A") must be quoted strings in the
   data (`ipc: "376A"`), not bare identifiers — the latter is invalid JS and breaks the build.
5. Before shipping any update: run a syntax check (tsc --jsx preserve --noEmit, or
   equivalent) AND a data-integrity check (no duplicate/missing section IDs within a
   chapter's expected range). This has caught real bugs multiple times already.
6. On copyright: statutory text is a government work and explicitly exempted under
   Section 52(1)(q) of the Copyright Act, 1957 — confirmed via Eastern Book Co. v. D.B.
   Modak, (2008) 1 SCC 1. Safe to reproduce verbatim. Don't copy a third-party site's own
   added commentary or exact formatting/layout — only the underlying legal text itself.

## Data schema (per section object)
```js
{
  id: 101,                      // section number (int)
  ipc: 300,                     // old IPC equivalent — number, quoted string (if letter
                                 // suffix), or null (no direct equivalent)
  category: "M",                // doctrinal sub-group id — see CATEGORIES
  title: "Murder",
  text: "...",                  // full official statutory text — never abridged
  simpleExplanation: "...",     // optional, plain-English, clearly separate from text
  punishment: "...",            // optional, punishment pulled out as its own field
  explanations: [...],          // optional
  provisos: [...],              // optional — exceptions/numbered sub-clauses
  illustrations: [...],         // optional — never trimmed if the source has them
  ingredients: [...],           // optional — only on unambiguous sections
  crossRefs: [101, 37],         // optional — section ids this section references
  cases: [{ name, cite, year, ratio, url }]  // optional, verified only
}
```
`ACTS` (top level — BNS active, others "soon"), `CHAPTERS` (each tagged with an `act`
field), and `CATEGORIES` (each tagged with a `chapter` field) drive the sidebar's
Library → Chapter → Category → Section grouping. See top of `bare-act-navigator.jsx`.

Also present: `DEFINITIONS` (click-to-define terms from Section 2, e.g. "good faith",
"dishonestly", "public servant" — expand this as new defined terms come up), and a
`CONTENT_LAST_VERIFIED` date constant shown in the UI footer — update this whenever a
real verification pass is done.

## Build process (Vite — replaces the old manual esbuild workaround)
Done: a real Vite project now lives at the repo root (`npm install && npm run dev` /
`npm run build`). `lucide-react` is a normal npm dependency again (no more manual
icon-to-unicode substitution), and the app builds incrementally instead of full-file
regeneration on every change. The previous `bare-act-navigator (1).jsx` /
`bare-act-navigator-laptop (1).html` standalone files have been removed — their
content lives on in git history if ever needed, but `src/App.jsx` is now the single
source of truth.

## Deployment status
Not yet live. Plan: GitHub Pages or Netlify, static hosting (no backend needed yet).
Deliberately free, no monetization — gathering real student usage first. Revisit
monetization (freemium / exam-season subscriptions / institutional licensing) once
there's real, returning usage — not before.

## Model guidance
Builder is on Claude Pro. For this kind of large-volume, structured/pattern-following
work (transcribing statute text, following the schema, syntax/integrity checks), Sonnet-
class models are the efficient default — they burn through Pro's shared usage allowance
much slower than Opus-class models for comparable quality on this kind of task. Reserve
Opus for genuinely hard judgment calls (tricky bugs, architectural decisions) rather than
routine chapter-building.

## Known limitations
- Notes persistence uses `localStorage` (via `src/lib/storage.js`) — personal/per-browser,
  not synced across devices. A real backend is intentionally deferred until real usage
  justifies building one.
