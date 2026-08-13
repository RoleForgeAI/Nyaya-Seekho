# Bare Act & Statute Navigator — Project Handoff (Updated)

## What this is
An interactive, cross-referenced study tool for Indian law students, starting with the
Bharatiya Nyaya Sanhita (BNS), 2023. Built for a solo, non-engineer law student builder.
Every session so far has been done conversationally in Claude chat — no code written by hand.

## Current status: 298 of 358 BNS sections — 13 of 20 chapters complete
- Chapter I — Preliminary (§§1–3)
- Chapter II — Of Punishments (§§4–13)
- Chapter III — General Exceptions (§§14–44)
- Chapter IV — Abetment, Criminal Conspiracy and Attempt (§§45–62)
- Chapter V — Offences Against Woman and Child (§§63–99)
- Chapter VI — Offences Affecting the Human Body (§§100–146)
- Chapter VII — Offences Against the State (§§147–158)
- Chapter XI — Offences Against Public Tranquillity (§§189–197)
- Chapter XIII — Contempts of the Lawful Authority of Public Servants (§§206–226)
- Chapter XIV — False Evidence and Offences Against Public Justice (§§227–269)
- Chapter XV — Public Health, Safety, Convenience, Decency and Morals (§§270–297)
- Chapter XVII — Offences Against Property (§§303–334)
- Chapter XIX — Criminal Intimidation, Insult, Annoyance, Defamation (§§351–357)

**Landmark cases curated (verified citations only — a deliberately small, high-value set,
not exhaustive):** Sections 22, 35, 38, 45, 61, 63, 85, 100, 101, 303, 356.

**Remaining BNS chapters (~60 sections):**
- Chapter VIII — Army/Navy/Air Force offences (~159–168, unverified exact range)
- Chapter IX — Election offences (~169–177, unverified exact range)
- Chapter X — Coin, Currency-Notes, Bank-Notes & Govt. Stamps (178–188, confirmed)
- Chapter XII — Offences by/Relating to Public Servants (198–205, confirmed)
- Chapter XVI — Offences Relating to Religion (~298–302, confirmed range, short)
- Chapter XVIII — Documents & Property Marks (~335–350, confirmed range)
- Chapter XX — Repeal and Savings (§358 — essentially a single closing section)

**After BNS is complete:** BNSS (Bharatiya Nagarik Suraksha Sanhita — criminal *procedure*,
not yet started, likely 500+ sections), BSA (Bharatiya Sakshya Adhiniyam — evidence law),
and eventually Indian Contract Act / Constitution, per the ACTS structure already built in.

## Files
- `bare-act-navigator.jsx` — the source React component. Edit this one.
- `bare-act-navigator-laptop.html` — a fully self-contained, pre-bundled standalone build
  (React + ReactDOM + app code all inlined via esbuild, zero external dependencies).
  This was a manual workaround built in a chat sandbox with no real dev environment.
  **Replace this entire workflow with a real Vite project + npm build** now that you're
  in an actual dev environment. Don't keep manually re-bundling with esbuild by hand.

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

## Build process used so far (manual chat-sandbox workaround — replace this)
1. Strip `import` lines, replace lucide-react icons with plain text/unicode
2. Bundle with esbuild (`--bundle --minify --format=iife`) against local react/react-dom
3. Inline the bundle into a minimal HTML shell — zero external network dependencies

**In Claude Code:** set up a real Vite (or similar) project with `npm run build`,
push to GitHub, deploy via Netlify/Vercel. This removes the manual bundling entirely
and enables incremental builds instead of full-file regeneration on every change.

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
- Notes persistence uses `localStorage` in the standalone build — personal/per-browser,
  not synced across devices. A real backend is intentionally deferred until real usage
  justifies building one.
- Chapters VIII and IX section ranges above are estimates — verify against a reliable
  source (devgan.in or similar) before building them out, the same way every other
  chapter here was verified before being added.
