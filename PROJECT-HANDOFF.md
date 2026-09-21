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

## Indian Contract Act, 1872 (ICA) — COMPLETE: all 190 of 190 active sections, 10 chapters
Act code `"ICA"` in `ACTS` — this replaces the old `"CONTRACT"` placeholder id (renamed in
place, `status` flipped `"soon"` → `"active"`; there's only ever one Contract Act entry,
never both ids). Chapters/categories/sections all follow the same conventions as SRA/BSA:
`"ICA-<n>"` string-prefixed section ids (`SECTION_MAP` is keyed globally, so plain numeric
ids would collide with BNS/BSA's own 1–190), chapter ids scoped as `"ICA-Prelim"`,
`"ICA-I"`, `"ICA-II"`, etc. **The Act is now fully done end to end**: Part I (§§1–75,
Preliminary through Chapter VI), Chapter VIII — Indemnity and Guarantee (§§124–147),
Chapter IX — Bailment (§§148–181, incl. §178A), and Chapter X — Agency (§§182–238, the
final chapter, merged across three source files delivered separately: Ss.182–200,
Ss.201–221, Ss.222–238). The header/footer now correctly read "191 of 191 sections across
10 of 10 chapters" for the Contract Act — the "191" (not the nominal 190) is honest, not a
bug: `actStats()` takes `Math.max(registeredSectionCount, liveSectionCount)`, and §178A is
one genuine section beyond the base 1–75/124–238 numbering, so the live count legitimately
exceeds the span-sum by exactly one. `CONTENT_LAST_VERIFIED` states the headline figure as
"190 of 190 active sections (§§1–75 and §§124–238)" to match the Act's own official
numbering (the same framing the source files themselves used), with §178A documented
separately as the noted exception rather than folded into a "191" headline that would need
its own explanation every time someone reads it.

**Two permanent gaps, two matching repealed-chapter placeholders.** §§76–123 (Sale of
Goods, moved to the Sale of Goods Act, 1930) already had `ICA-VII-repealed`; this batch
added the second and final one, `ICA-XI-repealed`, for §§239–266 (Partnership, moved to
the Indian Partnership Act, 1932) — same `repealed: true` / `repealedNote` pattern, same
CSS classes, no code changes needed (this is exactly the generalization the original
Part I batch's `PROJECT-HANDOFF.md` note anticipated). It renders correctly positioned
right after §238 in the sidebar — verified via Playwright, both placeholders show side by
side in order (`ICA-VII-repealed` after Chapter VI, `ICA-XI-repealed` after Chapter X) with
distinct, correct label/note text for each.

**Correction from an earlier batch:** Chapter IV's range was first registered as "37–75",
inferred (wrongly) from the Act-wide note that the active block runs 1–75 before the
repealed gap. The Ss.46–70 batch's own header revealed Chapter V actually opens at §68,
meaning Chapter IV really ends at **§67** — fixed in `CHAPTERS` (`ICA-IV` range corrected
to `"37–67"`) and a new `ICA-V` chapter added for §§68–72. Lesson: an Act-wide "active
block ends at N" note is not the same claim as "this specific chapter ends at N" — this
mattered again for Chapter VI, but this time the Ss.71–75 batch's header stated its range
explicitly ("chapter 6 -> 'breach-of-contract' (Ss.73-75, complete...)"), so `"73–75"` was
used directly rather than inferred — no repeat of the earlier mistake.

**Structural quirk specific to this Act — read before writing any future integrity
check for it:** the original 1872 Act had 266 sections, but §§76–123 (Sale of Goods) and
§§239–266 (Partnership) were later repealed out into their own Acts (the Sale of Goods
Act, 1930 and the Indian Partnership Act, 1932). Those 76 section numbers are gone
**permanently** — they are not missing data to chase down, and a "no gaps" integrity
check must explicitly exclude both ranges rather than flag them. The active Act is
1–75, then 124–238, then 267 onward doesn't exist either (Act ends at 266) — so the
true total of currently-existing sections is 266 − 76 = **190**, not 266. Chapters so far:
- Preliminary (§§1–2) — **done**
- Chapter I — Of the Communication, Acceptance and Revocation of Proposals (§§3–9) — **done**
- Chapter II — Of Contracts, Voidable Contracts and Void Agreements (§§10–30) — **done**
  (2 categories: Contract Validity, Capacity & Free Consent §§10–22; Void Agreements §§23–30)
- Chapter III — Of Contingent Contracts (§§31–36) — **done**
- Chapter IV — Of the Performance of Contracts (§§37–67) — **done** (6 categories: Contracts
  Which Must Be Performed §§37–39, By Whom Contracts Must Be Performed §§40–45, Time and
  Place for Performance §§46–50, Performance of Reciprocal Promises §§51–58, Appropriation
  of Payments §§59–61, Contracts Which Need Not Be Performed §§62–67)
- Chapter V — Of Certain Relations Resembling Those Created by Contract (§§68–72) — **done**
  (category `quasi-contract`, §§68–72 in full)
- Chapter VI — Of the Consequences of Breach of Contract (§§73–75) — **done** (new category
  `breach-of-contract`, §§73–75 in full) — **this completes Part I: General Principles**
- *(gap: §§76–123 permanently repealed, not part of the active Act — see the repealed-chapter
  placeholder below)*
- **Part II: Special Contracts begins here.** Chapter VIII — Of Indemnity and Guarantee
  (§§124–147) — **done** (6 categories: Indemnity §§124–125, Guarantee — General
  Provisions §§126–132, Discharge of Surety §§133–139, Rights of Surety §§140–141,
  Invalid Guarantees §§142–144, Co-Sureties §§145–147). Chapter id `"ICA-VIII"`, matching
  the official "CHAPTER VIII" numbering (chapter 7 was intentionally left for the repealed
  placeholder, not registered as a real content chapter). Case law: a later case-law-only
  update added cases to §125 (indemnity) and §141 (surety-rights) — §140's
  right-of-subrogation doctrine still has no case attached and remains a good future
  enrichment candidate.
- Chapter IX — Of Bailment (§§148–181, including §178A) — **done** (5 categories: Bailment
  — General Provisions §§148–167, Finder of Goods §§168–169, Bailee's Lien §§170–171,
  Bailments of Pledges §§172–179, Suits by Bailees or Bailors Against Wrong-Doers
  §§180–181). Chapter id `"ICA-IX"`, range `"148–181"`. §148 carries verified case law
  (*Ram Gulam v. Government of Uttar Pradesh*, AIR 1950 All 206 — bailment requires an
  actual contract; goods that come into someone's possession without one, e.g. stolen
  property recovered by police, are never held under a bailment). §171 (general lien) and
  §178/§178A (pledge by mercantile agent / voidable-contract possessor) are flagged as
  future case-law enrichment candidates.
- Chapter X — Of Agency (§§182–238) — **done, the Act's final chapter** (7 categories,
  matching the Act's own official sub-headings: Appointment and Authority of Agents
  §§182–189, Sub-Agents §§190–195, Ratification §§196–200, Revocation of Authority
  §§201–210, Agent's Duty to Principal §§211–221, Principal's Duty to Agent §§222–225,
  Effect of Agency on Contracts with Third Persons §§226–238). Chapter id `"ICA-X"`, range
  `"182–238"`, merged from three source files (Ss.182–200, Ss.201–221, Ss.222–238)
  delivered separately but treated as one batch — 57 sections in total, the largest single
  ICA merge so far. No case law in this batch; §196 (ratification), §215/§216 (agent
  dealing on own account), and §237 (ostensible/apparent authority — one of the most
  significant doctrines in all of agency law) are flagged as strong future enrichment
  candidates, all with substantial real Indian case law available.
- *(gap: §§239–266 permanently repealed — Chapter XI, Of Partnership, moved to the Indian
  Partnership Act, 1932 — see the second repealed-chapter placeholder, `ICA-XI-repealed`,
  above)*

**This completes the Indian Contract Act, 1872, end to end** — every currently-active
section (1–75 and 124–238, plus §178A) is merged and verified, both repealed gaps have
matching sidebar placeholders, and the header reads a clean "191 of 191 sections across
10 of 10 chapters" with no `remainingChapters` text. Any future ICA work would be pure
enrichment (case law, illustrations-splitting parity with other Acts) rather than new
section content.

**§178A — the Act's first lettered-suffix section id.** Section 178A was a genuine later
insertion into the 1872 Act (added by Act 4 of 1930, alongside an amendment to §178) — it
sits between §178 and §179 in the official Act, not a numbering error to "fix." Stored as
the quoted string id `"ICA-178A"` (i.e. `id: "178A"` in the source batch, prefixed the
usual way), sorted correctly between `ICA-178` and `ICA-179` purely by its position in the
`SECTIONS` array — nothing in the app relies on numeric ordering of ids, so no special
sort logic was needed. Worth noting for the record: BNS doesn't actually have its own
precedent for a lettered-suffix *section id* — its `ipc` field (e.g. `"108A"`, `"376A"`)
stores the old IPC cross-reference number, which does carry letter suffixes, but BNS's own
section numbering is a plain, unbroken 1–358 with no lettered ids of its own. §178A is the
first time any Act in this app has actually needed a lettered-suffix *id*, and the existing
string-id convention (every id is already a string like `"ICA-141"`) handled it with zero
code changes — the gap-aware integrity check just needed to separate numeric ids from
lettered ones when doing its "no missing numbers" scan, rather than assume every id parses
as an integer.

**New feature: non-clickable "repealed chapter" sidebar placeholder.** Added specifically
for the §§76–123 gap so a reader browsing the sidebar sees the gap is deliberate, not
missing content. A `CHAPTERS` entry can now carry `repealed: true` plus a `repealedNote`
string (see `ICA-VII-repealed`, range `"76–123"`, label "Chapter VII — Of the Sale of
Goods (§§76–123)"). This is a *chapter-level* flag only — it is never given any
`CATEGORIES` pointing at it, so it carries zero sections and is invisible to every
category/section-resolution integrity check. `SidebarContents`'s `chapterGroups` builder
special-cases `ch.repealed`: it skips the normal categories/items derivation entirely and
is kept in the list even with empty `cats` (the old filter was `.filter(ch => ch.cats.length
> 0)`, now `.filter(ch => ch.repealed || ch.cats.length > 0)`). The render loop branches on
`ch.repealed` to draw a visually distinct, non-interactive block (a plain `<div>`, no
`<button>`s anywhere inside it — confirmed via Playwright) instead of the normal
chapter-heading-plus-categories tree: dashed top border, muted "REPEALED" badge
(`.repealed-badge`, oxblood-outlined text on transparent background — deliberately *not*
`.soon-badge`'s parchment-filled pill, so a "this chapter is gone forever" placeholder
never looks like a "this whole Act isn't live yet" placeholder), and an italic note line
(`.chapter-repealed-note`) rendering `repealedNote`. New CSS classes: `.chapter-repealed`,
`.chapter-repealed-heading`, `.repealed-badge`, `.chapter-repealed-note`.

**`actStats()` — two fixes stacked here, both required for an Act with a permanent gap
in its numbering.** (1) Registering a chapter with a wide numeric `range` like `"76–123"`
would inflate the "of N sections" denominator and make the placeholder show up in
`remainingChapters` (the "Remaining: Chapters …" footer text) as if it were genuine
pending content — exactly the opposite of the intended "this is settled, not missing"
signal. Fixed by excluding `repealed` chapters at the very first line of `actStats()`:
`CHAPTERS.filter(c => c.act === actId && !c.repealed)`. (2) That fix alone wasn't enough
once a *real* chapter started on the far side of the gap: the old denominator logic took
the single highest number across every live chapter's `range` (`numericMax`), which
worked fine when chapters were contiguous 1..N, but once Chapter VIII's own range
(`"124–147"`) sits well past the excluded 76–123 gap, that same "highest number seen"
approach silently re-introduced the gap into the total — it read "99 of 147" instead of
"99 of 99", implying ~48 sections were missing between Part I and Part II when in fact
every currently-registered chapter is fully live. Fixed by replacing the raw max with a
**sum of each live chapter's own span** (`Math.max(...nums) - Math.min(...nums) + 1`,
summed across chapters) — this is mathematically identical to the old max-based approach
for any Act whose chapters are contiguous with no gaps (BNS, SRA, BSA, and ICA's own Part
I), and only diverges — correctly — once a repealed chapter creates a real gap between two
live chapters. Verified via Playwright across all four Acts: BNS still reads "358 of 358",
SRA "46 of 46", BSA "170 of 170" (all unchanged), and ICA now correctly reads "99 of 99
Contract Act sections" / "8 of 8 chapters", with no "Remaining: Chapters…" text. If a
second repealed-chapter placeholder is added (e.g. for the §§239–266 Partnership Act gap
once the rest of Part II is built out), no further code changes are needed — both fixes
already generalize to any number of gaps.

The category id `"preliminary"` was already taken by BSA's own Chapter I category, so
ICA's equivalent is `"ica-preliminary"` — check for id collisions against every other
act's `CATEGORIES` before reusing a short/generic category slug for a new Act; a silent
duplicate id means `CATEGORIES.find(c => c.id === section.category)` resolves to whichever
one appears first in the array, misassigning the second act's sections to the first act's
chapter.

**Landmark cases (15 sections, 19 case objects — cases have been added in separate passes
onto sections already live, not always in the same batch as the section text itself):**
§§2, 4, 8 (2 cases), 11, 23, 25, 27 (2 cases), 28, 56 (2 cases), 65, 70, 74 (2 cases), 125,
141, 148. Unlike BSA, this Act has never been replaced, so its cases don't use
`decidedUnder`/`continuityNote` — they're simply current good law. One case is a
deliberate exception to "Indian cases only": *Carlill v. Carbolic Smoke Ball Co.* [1893] 1
QB 256 (England, cited under §8 alongside the Indian *Lalman Shukla*) is foreign,
non-binding persuasive authority, flagged with two different fields — `jurisdiction` and
`persuasiveNote` — rendered as a visually distinct blue-accented "Persuasive authority
only — {jurisdiction} (not binding in India)" line with the `persuasiveNote` behind a
"why it's cited here" `<details>` toggle (`.case-jurisdiction` in the CSS, deliberately
styled differently from `.case-continuity`'s oxblood so the two patterns — "pre-BSA
inference" vs. "foreign persuasive authority" — are never visually confused). §56 (the
frustration doctrine, India's Section 56 vs. imported English common law) carries two
cases together — *Satyabrata Ghose v. Mugneeram Bangur & Co.* (1954, the foundational
case) and *Energy Watchdog v. CERC* (2017, the modern case narrowing its scope) — read
together they tell the doctrine's full arc, not a duplicate citation. §27 (restraint of
trade) similarly carries two cases together — *Madhub Chunder v. Rajcoomar Doss* (1874,
the foundational case establishing partial restraints are void too, not just total ones)
and *Gujarat Bottling Co. v. Coca Cola Co.* (1995, the companion principle that a
restraint operating only within the life of a subsisting contract isn't a "restraint of
trade" at all). §74 (penalty vs. liquidated damages) carries *Fateh Chand v. Balkishan
Dass* (1963, the foundational case abolishing the English penalty/liquidated-damages
distinction) plus, added in a later case-law-only update, *ONGC Ltd. v. Saw Pipes Ltd.*
(2003, refining Fateh Chand: where the named sum is a genuine pre-estimate of loss, the
claimant need not separately prove actual loss). A case-law-only update batch (no section
text or illustrations touched, `cases` fields added or appended only) also added §4
(*Bhagwandas Kedia v. Girdharilal Parshottamdas*, 1966, instantaneous-communication
contracts form where/when the acceptance is heard, not the postal rule), §28
(*Hakam Singh v. Gammon (India) Ltd.*, 1971, exclusive-jurisdiction clauses among
courts that already have jurisdiction are enforceable), §125 (*Gajanan Moreshwar Parelkar
v. Moreshwar Madan Mantri*, 1942, an indemnity-holder can compel the indemnifier to make
good an absolute liability even before personally paying), and §141 (*Amrit Lal Goverdhan
Lalan v. State Bank of Travancore*, 1968, a surety is discharged even where the creditor's
loss of security was merely negligent, not deliberate). When appending a case to a
section that already has one (as with §74's ONGC addition), splice into the existing
`cases` array as an additional object rather than replacing it — verified via a full-diff
check that Fateh Chand's entry was untouched. The Chapter IX (Bailment) batch added §148
(*Ram Gulam v. Government of Uttar Pradesh*, 1949/AIR 1950 All 206 — bailment is a
contractual obligation and cannot arise independently of a contract, so goods that come
into someone's possession without one are never held under a bailment).

Sourced from the official India Code PDF (indiacode.nic.in), Act No. 9 of 1872, Ministry
of Law & Justice consolidated text.

## Indian Partnership Act, 1932 (IPA) — COMPLETE: all 74 of 74 sections, 8 chapters
A brand-new Act, added whole in a single batch (all 74 sections delivered in one file,
having previously been drafted as three separate batches — Ss.1–30, Ss.31–55, Ss.56–74 —
and combined by the user before merging). Act code `"IPA"`, `"IPA-<n>"` string-prefixed
section ids following the same convention as every other Act. This Act completes the story
of the Contract Act's own repealed Chapter XI (§§239–266, "Of Partnership") — that chapter
was repealed by this very Act's own §73 and replaced with this dedicated, far more
detailed 74-section Act. §3 of this Act expressly preserves the Contract Act's general
principles as still applicable to partnerships wherever this Act's own rules don't differ,
so the two Acts are genuinely cross-referenced (several `simpleExplanation`s across this
batch point back to specific ICA sections — e.g. §16's fiduciary duty mirrors ICA §§215–216,
§28's "holding out" doctrine echoes ICA §237's ostensible authority).

Chapters (8, matching the Act's official structure exactly):
- Chapter I — Preliminary (§§1–3), category `ipa-preliminary`
- Chapter II — The Nature of Partnership (§§4–8), category `nature-of-partnership`
- Chapter III — Relations of Partners to One Another (§§9–17), category
  `partners-relations-to-one-another`
- Chapter IV — Relations of Partners to Third Parties (§§18–30), category
  `partners-relations-to-third-parties`
- Chapter V — Incoming and Outgoing Partners (§§31–38), category
  `incoming-outgoing-partners`
- Chapter VI — Dissolution of a Firm (§§39–55), category `dissolution-of-firm`
- Chapter VII — Registration of Firms (§§56–71), category `registration-of-firms`
- Chapter VIII — Supplemental (§§72–74), category `supplemental`

**Category id collision handled the same way as ICA's own "preliminary" problem.** The
source file's own category name for Chapter I was `"preliminary"` — already taken by
BSA's Chapter I category (`{ id: "preliminary", chapter: "BSA-I", ... }`). Followed the
exact precedent already set for ICA (`"ica-preliminary"`): remapped to `"ipa-preliminary"`
in the merge transform script rather than merging the collision in verbatim. Always check
every new Act's category ids against every existing Act's `CATEGORIES` before merging —
this is now the second time a generically-named "preliminary" category has needed this
treatment, and it will very likely happen again for the Constitution or BNSS.

**§73 — a genuinely contentless section, rendered distinctly rather than as normal
statutory text.** §73 is itself a spent repeal provision ("Rep. by the Repealing Act, 1938
(1 of 1938), s. 2 and Sch."), included in the source purely so the Act reads as whole from
§1 through §74 rather than jumping from §72 to §74. Flagged with a new `repealed: true`
field on the section object itself (distinct from the *chapter*-level `repealed` flag
already used for the ICA repealed-chapter placeholders — this is a first, a single
*section* being flagged, not a whole chapter). The content-pane render (`App.jsx`, the
main section-detail block right after the "Export section as text" button) now branches
on `section.repealed`: instead of the normal "Official Bare Act Text" label + `.body-text`
block, a repealed section renders inside a new `.section-repealed-note` box (dashed
border, parchment-deep background) with a `.repealed-badge` pill (reusing the exact same
oxblood-outlined badge styling already established for the ICA chapter placeholders) and
its text shown in italic, muted `.ink-soft` color. A second `.repealed-badge` also appears
in the meta-chips row up top, so it's visible even before scrolling to the body. In the
sidebar, `SidebarContents`'s section-button loop adds a `sec-btn-repealed` modifier class
when `s.repealed` is true (`opacity: 0.6` and an italic title, suppressed whenever the
button is also `.active` so selecting it still shows the normal highlighted state) — unlike
the chapter-level placeholders, §73 stays a real, clickable section (it has genuine,
if brief, informative content explaining why it's empty), not a non-interactive block.

**Landmark cases (5 sections, 6 case objects) added in a later case-law-only update.**
The Act had zero verified cases at first merge; a subsequent batch (no section text or
illustrations touched) added: §4 — two cases together, *K.D. Kamath & Co. v. CIT* (1971,
mutual agency survives even where one partner holds overriding day-to-day managerial
control, so long as that control is exercised for the collective benefit) and *Dulichand
Laxminarayan v. CIT* (1956, a firm has no separate legal personality from its partners,
so a firm cannot itself become a partner in another firm); §6 — *Champaran Cane Concern
v. State of Bihar* (1964, draws the line between partnership and mere co-ownership with
shared profits); §30 — *CIT v. Dwarkadas Khetan & Co.* (1960, a minor can only be
admitted to the benefits of partnership, never made a full contracting partner); §48 —
*Addanki Narayanappa v. Bhaskara Krishtappa* (1966, a partner's interest in firm property
is itself movable property, regardless of the firm's underlying assets); §69 — *Haldiram
Bhujiawala v. Anand Kumar Deepak Kumar* (2000, Section 69(2)'s bar only reaches rights
arising from a contract the unregistered firm itself entered into — not a separate tort
or statutory claim like trademark passing-off). Some of the source file's earlier-flagged
margin-note citations (e.g. Sita Ram v. Radha Rai, Mandyala Govindu v. CIT) were not part
of this particular verified batch and remain open candidates for further enrichment.

Sourced from the official India Code PDF (indiacode.nic.in/bitstream/123456789/12849/1/
the_indian_partnership_act_1932.pdf), cross-checked against the Act's official table of
contents for chapter/section structure.

## The Sale of Goods Act, 1930 (SGA) — COMPLETE: all 66 of 66 sections (67 objects incl. §64A), 7 chapters
Another brand-new Act, added whole in a single batch (all 66 sections + the inserted §64A,
previously drafted as three batches — §§1–30, §§31–54, §§55–66 — combined by the user
before merging). Act code `"SGA"`, `"SGA-<n>"` string-prefixed section ids. This Act
completes the story of the Contract Act's *other* repealed gap: §§76–123 ("Of the Sale of
Goods") were repealed and replaced by this dedicated 66-section Act (in force 1 July
1930). §3 preserves the Contract Act's general principles as still applicable to
sale-of-goods contracts — the identical bridging structure already used in IPA's own §3.

Chapters (7, matching the Act's official structure):
- Chapter I — Preliminary (§§1–3), category `sga-preliminary`
- Chapter II — Formation of the Contract (§§4–17), category `formation-of-contract`
- Chapter III — Effects of the Contract (§§18–30), category `effects-of-the-contract`
- Chapter IV — Performance of the Contract (§§31–44), category `performance-of-contract`
- Chapter V — Rights of Unpaid Seller Against the Goods (§§45–54), category
  `rights-of-unpaid-seller`
- Chapter VI — Suits for Breach of the Contract (§§55–61), category `suits-for-breach`
- Chapter VII — Miscellaneous (§§62–66, including §64A), category `miscellaneous`

**`"preliminary"` collision — third time now.** Same treatment as ICA (`ica-preliminary`)
and IPA (`ipa-preliminary`): remapped to `"sga-preliminary"`. This is now a recurring,
predictable pattern for every new Act's Chapter I — check `CATEGORIES` for a bare
`"preliminary"` id before merging any future Act, and prefix with that Act's own code.

**§64A — a second lettered-suffix insertion, same pattern as ICA's §178A.** A later
insertion (tax pass-through provision) sitting between §64 and §65 in the official Act.
Stored as `"SGA-64A"`, no code changes needed — the id is just another string, and the
splice landed it in the correct array position by construction. Total live SGA section
count is 67 (66 numbered + 1 lettered), same "actual count exceeds nominal count by
exactly the number of lettered insertions" situation already seen for ICA (191 vs. 190).

**§65 — a second section-level `repealed: true`, identical treatment to IPA's §73.** Also
a spent 1938 repeal provision with no substantive content. Reused the exact same
`.section-repealed-note` / `.repealed-badge` / `sec-btn-repealed` rendering built for IPA
§73 — no new code needed, confirming that feature was built generally enough to cover the
next Act's identical situation without modification.

**New: the app's first genuine cross-Act `crossRefs` link, plus a real bug it surfaced
and fixed.** §58 (specific performance) refers, in its own original 1930 statutory text,
to "Chapter II of the Specific Relief Act, 1877" — a real historical reference to the
long-repealed predecessor of the Specific Relief Act, 1963 (already fully built in this
app as `SRA`). Left the original text untouched (it's not an error), but added
`crossRefs: ["SRA-10"]` pointing to SRA's own general specific-performance section. Every
prior `crossRefs` usage in the app (all in SRA, referencing other SRA sections) stayed
within one Act, so `SECTION_MAP[rid]` resolution technically already worked for a
cross-Act id — but two real UI bugs would have surfaced the first time anyone actually
used one:
1. `goTo(id)` only ever set `selectedId`, never `selectedAct` — clicking through to a
   cross-Act section left the Library sidebar showing the *previous* Act's chapter tree
   (and highlighting the wrong Act button) while the content pane showed the new Act's
   section. Fixed by having `goTo` look up the target section's actual act via
   `chapterOf(SECTION_MAP[id])?.act` and call `setSelectedAct` first if it differs from
   the current one — a no-op for every existing same-act crossRef, so nothing else
   changed behaviour.
2. The "Related Sections" chip and the "Quick Preview" drawer both showed only `§{number}`
   with no Act name — harmless when linking within one Act, but genuinely ambiguous
   cross-Act (SGA has its own unrelated §10, "Agreement to sell at valuation"). Fixed by
   showing the target Act's `short` name in the chip (only when it differs from the
   current section's Act, to avoid clutter on the far more common same-act case) and
   always in the drawer's "Quick Preview" label. Verified via Playwright end to end:
   chip reads "SRA §10 · Specific performance in respect of…", drawer reads "Quick
   Preview · SRA", and clicking "Open full section →" correctly lands on SRA §10 with the
   Library sidebar now showing SRA's own chapters and highlighting the SRA button.

**Landmark cases (3 sections, 3 case objects) added in a later case-law-only update,
including the app's second use of the foreign-persuasive-authority pattern.** §14
(implied undertaking as to title) got *Rowland v. Divall* [1923] 2 KB 500 — English Court
of Appeal, a seller with no title breaches the implied title condition and the buyer can
recover the entire price with no deduction for use, given as total failure of
consideration. §16 (implied conditions as to quality/fitness) got *Grant v. Australian
Knitting Mills* [1936] AC 85 — a Privy Council decision (on appeal from Australia) on
what "merchantable quality" means, still treated as leading Indian authority since the
Privy Council was India's own final court of appeal until 1949–50. Both carry
`jurisdiction` and `persuasiveNote` fields — the exact same pattern first built for
*Carlill v. Carbolic Smoke Ball* in the Contract Act's case law — rendered via the
existing `.case-jurisdiction` block (a distinct "Persuasive authority only — {jurisdiction}
(not binding in India)" line with the `persuasiveNote` behind a collapsible "why it's
cited here" `<details>`) with no code changes needed; verified via Playwright that both
render the jurisdiction block and that §30's case (below) correctly does not. §30 (seller
or buyer in possession after sale) got *Central National Bank Ltd. v. United Industrial
Bank Ltd.*, AIR 1954 SC 181 — a genuine Indian Supreme Court case, no jurisdiction/
persuasiveNote fields, confirming Section 30(2)'s good-faith-transferee protection
requires possession genuinely obtained "with the consent" of the seller, not merely
physical opportunity to take it. §27 (mercantile agent exception) and §64 (auction sales)
remain open candidates for further case-law enrichment.

Sourced from two independently cross-checked sources: the Uttar Pradesh Commercial Tax
Department's official PDF (comtax.up.nic.in) and advocatekhoj.com's bare-act pages.

## The Negotiable Instruments Act, 1881 (NIA) — COMPLETE: all 148 of 148 sections (155 objects incl. 7 lettered insertions), 17 chapters
A fifth brand-new Act, delivered as a single combined file (`NIA_SECTIONS_1_148_FULL.js`)
and merged whole in one batch. Act code `"NIA"`, `"NIA-<n>"` string-prefixed section ids.
By far the largest single-file Act merge so far: 17 chapters, 17 categories, 155 section
objects (148 numbered §§1–148 plus 7 later-amendment lettered insertions: §45A, §75A,
§85A, §104A, §131A, §142A, §143A).

**Worth flagging: the source file's own header comment contradicted its actual data, and
the actual data was trusted over the header, per this project's standing rule.** The
file's opening ~35 lines describe it as covering only "SECTIONS 1-122... THIS FILE covers
Chapters I-XIII (Ss.1-122) in full. Chapters XIV-XVII (Ss.123-148) will complete the Act
in a following batch" — language clearly left over from an earlier "part 1" draft that
was never updated. But the file's own `export const NIA_SECTIONS_1_148` array, when
actually inspected, contains all 155 objects, ids 1 through 148 with no gaps, including
every lettered insertion through Chapter XVII — and a second, later header block (lines
62–97) correctly lists all 17 chapters, adds the missing categories for Chapters XIV–XVII,
and explicitly states "THIS IS THE COMPLETE NEGOTIABLE INSTRUMENTS ACT, 1881, START TO
FINISH -- ALL 17 CHAPTERS, 147 ACTIVE SECTIONS," matching what the user's own request
described. Also worth noting for the repo's own git history: unlike ICA/IPA/SGA, there
are no earlier NIA batches anywhere in this project's commit history — the user's request
referred to "earlier batches" and previously-merged sections (45A/75A/85A/104A) as though
they already existed in the app, but this was in fact the Act's first and only merge.
Verified this by grepping the codebase for any prior "NIA" trace before starting (none
found) and by directly inspecting the uploaded file's actual array contents rather than
trusting either the stale header or the request's framing — the data itself was complete
and internally consistent, so the merge proceeded on that basis rather than blocking to
ask, but this discrepancy is recorded here in case the user meant a different session or
a different app instance.

Chapters (17, matching the Act's official structure):
- Chapter I — Preliminary (§§1–3), category `nia-preliminary`
- Chapter II — Of Notes, Bills and Cheques (§§4–25), category `notes-bills-cheques`
- Chapter III — Parties to Notes, Bills and Cheques (§§26–45, incl. §45A), category
  `parties-to-instruments`
- Chapter IV — Of Negotiation (§§46–60), category `negotiation`
- Chapter V — Of Presentment (§§61–77, incl. §75A), category `presentment`
- Chapter VI — Of Payment and Interest (§§78–81), category `payment-and-interest`
- Chapter VII — Of Discharge from Liability on Notes, Bills and Cheques (§§82–90, incl.
  §85A), category `discharge-from-liability`
- Chapter VIII — Of Notice of Dishonour (§§91–98), category `notice-of-dishonour`
- Chapter IX — Of Noting and Protest (§§99–104, incl. §104A), category
  `noting-and-protest`
- Chapter X — Of Reasonable Time (§§105–107), category `reasonable-time`
- Chapter XI — Of Acceptance and Payment for Honour and Reference in Case of Need
  (§§108–116), category `acceptance-payment-for-honour`
- Chapter XII — Of Compensation (§117 only — the Act's only single-section chapter),
  category `compensation`
- Chapter XIII — Special Rules of Evidence (§§118–122), category `special-rules-of-evidence`
- Chapter XIV — Of Crossed Cheques (§§123–131, incl. §131A), category `crossed-cheques`
- Chapter XV — Of Bills in Sets (§§132–133), category `bills-in-sets`
- Chapter XVI — Of International Law (§§134–137), category `international-law`
- Chapter XVII — Of Penalties in Case of Dishonour of Certain Cheques for Insufficiency
  of Funds (§§138–148, incl. §142A, §143A), category `cheque-dishonour-penalties`

**`"preliminary"` collision — fourth occurrence now**, same treatment: remapped to
`"nia-preliminary"`. This pattern is now firmly established for every new Act.

**Lettered-range chapters need a numeric-only `range` field.** Chapters III and IX are
officially described as "Ss.26-45A" and "Ss.99-104A" respectively, but `CHAPTERS.range`
was deliberately set to the pure numeric span (`"26–45"`, `"99–104"`) rather than
including the trailing letter. This matters for `actStats()`: its span-sum computation
(`c.range.split(/[–-]/).map(Number)...`) would silently drop a non-numeric endpoint like
`"45A"` entirely, undercounting that chapter's span by treating it as a single-section
chapter. Using the pure-numeric range (with the lettered insertion counted the same way
ICA's §178A and SGA's §64A already are — as one extra live section beyond the nominal
span) keeps the "X of Y sections" math honest without needing any further code change.

**§2 — a third section-level `repealed: true`**, identical treatment to IPA's §73 and
SGA's §65: a spent provision (repealed by the Repealing and Amending Act, 1891), rendered
via the same `.section-repealed-note` / `.repealed-badge` / `sec-btn-repealed` styling
built for those two, again with zero new code needed.

**Landmark cases (6 sections, 8 case objects) added in a later case-law-only update.**
§87 (material alteration) — *Veera Exports v. T. Kalavathy* (2001, a drawer may
voluntarily revalidate a stale cheque by altering the date; whether an alteration was
consented to is a question of fact). §118 (presumptions) — *Kumar Exports v. Sharma
Carpets* (2009, explains how the Section 118(a)/139 presumptions actually operate: not
evidence itself, only a prima facie device, rebuttable on preponderance of probabilities
using even the complainant's own evidence). §138 (cheque dishonour) — *MSR Leathers v. S.
Palaniappan* (2013, a payee can present a dishonoured cheque multiple times within its
validity, each fresh dishonour giving a fresh right to prosecute, provided an earlier
notice's 15-day window wasn't already let lapse). §139 (presumption in favour of holder)
— two cases together: *Rangappa v. Sri Mohan* (2010, the presumption is one of law, not
fact, rebuttable only on preponderance of probabilities) and *Bir Singh v. Mukesh Kumar*
(2019, a validly signed blank cheque later filled in still attracts the full presumption).
§141 (offences by companies) — *SMS Pharmaceuticals Ltd. v. Neeta Bhalla* (2005, merely
holding the title "director" isn't enough for vicarious liability; the complaint itself
must specifically aver the person was in charge of and responsible for the company's
business at the time). §142 (cognizance of offences) — two cases together: *Dashrath
Rupsingh Rathod v. State of Maharashtra* (2014, the case that prompted the 2015
Section 142(2) jurisdiction amendment) and *Yogendra Pratap Singh v. Savitri Pandey*
(2014, a complaint filed even one day before the 15-day notice period expires is invalid
and cannot be cured by later delay). §9's holder-in-due-course doctrine remains an open
candidate for further case-law enrichment.

Sourced from Drishti Judiciary's official-text bare-act PDF (vault.drishtijudiciary.com).

## The Arbitration and Conciliation Act, 1996 (ACA) — COMPLETE: all numbered sections (86 objects), 15 chapters, 5 Parts
A sixth brand-new Act, delivered as a single combined file and merged whole in one batch.
Act code `"ACA"`, `"ACA-<n>"` string-prefixed section ids. This is the first Act in the
project organized into named **Parts** rather than a flat chapter sequence — Part I
(Arbitration, §§1–43, 10 chapters), Part IA (Arbitration Council of India, §§43A–43M, a
single chapter, inserted whole by the 2019 Amendment), Part II (Enforcement of Certain
Foreign Awards, §§44–60, 2 chapters), Part III (Conciliation, §§61–62), and Part IV
(Supplementary Provisions, §§82–87). Followed the exact labeling convention already
established for SRA (`"Part II, Chapter II — Specific Performance of Contracts"`, etc.) —
no schema change needed, the Part/Chapter structure lives entirely in each `CHAPTERS`
entry's `label` string.

**Structural note — Part III is genuinely just 2 sections, not an incomplete build.** As
originally enacted, Part III was a detailed 21-section conciliation procedure code
(§§61–81). The Mediation Act, 2023 repealed and substituted the entirety of old §§61–81
with just two short sections (also numbered 61 and 62), which now simply redirect all
conciliation activity to the separate Mediation Act, 2023 instead. Old §§63–81 no longer
exist in current law. The gap-aware integrity check treats numbers 63–81 (19 numbers) as
a permanent restructuring gap, the same pattern already used for ICA's two repealed
ranges — confirmed the count matches exactly: 87 nominal numbers − 19 restructured = 68
numeric ids actually present, plus 18 lettered insertions (29A, 29B, 31A, 42A, 42B, and
the 13-section run 43A–43M) = 86 total section objects, matching the source's own count.

**Chapter 11 (Part IA) is the first chapter whose entire official range is lettered on
both ends — `"43A–43M"`, not a mix with numeric endpoints like every prior lettered-suffix
chapter (ICA's `"26–45"` softened from `"26–45A"`, SGA's `"99–104"` softened from
`"99–104A"`).** Rather than fudging a numeric placeholder, this was kept as the literal
official range, because `actStats()`'s span-sum reducer already has a guard for exactly
this case: `c.range.split(/[–-]/).map(Number).filter(n => !isNaN(n))` on `"43A–43M"`
produces an empty array after filtering, and the reducer's `if (nums.length === 0) return
sum` line means that chapter contributes 0 to the registered-span total rather than
corrupting it to `-Infinity` — verified this is safe by reading the exact guard clause
before relying on it, not by assumption. The existing `Math.max(registeredSectionCount,
liveSectionCount)` fallback then makes the Act-wide total come out exactly right anyway
(verified via Playwright: header reads "86 of 86 Arbitration Act sections across 15 of 15
chapters"). No code changes were needed — this is a case where the two-Act-old fix already
generalized correctly to a scenario its original authors hadn't specifically anticipated.

**§87 — a new kind of distinct rendering, deliberately NOT the existing `repealed: true`
pattern.** §87 remains textually part of the Act (inserted by the 2019 Amendment) but was
struck down as unconstitutional by the Supreme Court in *Hindustan Construction Co. Ltd.
v. Union of India* (2019 SCC OnLine SC 1520) — restoring the earlier position in *BCCI v.
Kochi Cricket Pvt. Ltd.* (2018). This is a genuinely different legal status from IPA §73 /
SGA §65 / NIA §2's spent repeal provisions: §87's text is real, substantive, operative-
looking statutory language that a reader must actually be able to read to understand what
was struck down and why — unlike a repealed section's text, which is deliberately replaced
by a short explanatory note since there's no real content left to show. Reusing
`repealed: true` would have hidden §87's actual text behind the dashed "this section has
no content" treatment, which would be actively wrong here. Instead, added a new,
independent pair of fields — `struckDown: true` and a `struckDownNote` string — and a
render treatment that *adds* a distinct warning callout (`.struck-down-note`, amber-bordered,
`#a5622a` accent, deliberately a different color from both `.repealed-badge`'s oxblood and
`.case-jurisdiction`'s blue, so none of the three "this needs special reading" patterns in
the app are visually confused with each other) directly above the section's completely
normal "Official Bare Act Text" block, rather than replacing it. A matching
`.struck-down-badge` also appears in the meta-chips row for at-a-glance visibility. §87's
own `cases` array (the *Hindustan Construction* case) still renders via the ordinary
"Landmark Precedent" mechanism below, so the full chain — warning callout → real statutory
text → plain-English explanation → the case that struck it down — reads in one continuous,
correctly-ordered pass. Verified via Playwright: the callout, badge, full original text,
and case card all render together on §87.

**Category id `"miscellaneous"` collided with SGA's own category — remapped to
`"aca-miscellaneous"`,** the same treatment as every prior generically-named category
collision this project has hit (`preliminary` four times now, `miscellaneous` once).

**No case law beyond §87.** The source itself flags §34 (setting aside an award) as the
single strongest candidate for a much larger future case-law pass — it carries an
enormous body of Supreme Court authority defining "public policy of India" and "patent
illegality" that would genuinely benefit students, but adding even a representative
sample would need its own dedicated, carefully-scoped batch given how much authority
exists on that one section alone.

**Eight Schedules exist but are not included** (New York Convention text, Geneva
Protocol/Convention texts, the Model Fee schedule, arbitrator-qualification/disclosure
schedules) — a different content type from numbered sections, consistent with how
Schedules have been handled for every other Act in this project (none have ever been
built out as separate content).

Sourced from arbitrationindia.com's consolidated bare-act PDF (reflecting all amendments
through the Mediation Act, 2023), cross-checked against Drishti Judiciary's official-text
PDF for earlier sections.

## The Hindu Succession Act, 1956 (HSA) — COMPLETE: all 31 of 31 sections, 4 chapters
A seventh brand-new Act, delivered whole in one batch. Act code `"HSA"`, `"HSA-<n>"`
string-prefixed section ids. Genuinely small and structurally simple compared to the last
few Acts (31 sections, 4 chapters, no lettered insertions, no Parts) — but content-wise
demanding in a different way: this Act was heavily rewritten by the Hindu Succession
(Amendment) Act, 2005, and the base source (predating that amendment) needed several
sections independently re-verified and corrected against the 2005 Amendment's own official
text before merging, not just transcribed as-is.

Chapters (4):
- Chapter I — Preliminary (§§1–4), category `hsa-preliminary` (remapped from the source's
  own `"preliminary"` — the fifth time this exact collision, always with BSA's own
  Chapter I category, has come up; every new Act's Chapter I needs this check now)
- Chapter II — Intestate Succession (§§5–29), category `intestate-succession`
- Chapter III — Testamentary Succession (§30 only), category `testamentary-succession`
- Chapter IV — Repeals (§31 only), category `repeals`

**Current, post-2005 text verified section by section — this Act is a real test case for
the "never invent, never paraphrase, verify against the actual current law" discipline.**
Four specific corrections the source flagged and I did not merge blindly:
- §4(2) — omitted by the 2005 Amendment; only sub-section (1) is operative today.
- §6 — completely replaced by 2005, not merely amended. The old text (survivorship
  excluding daughters from the coparcenary) is obsolete and would have been actively
  dangerous to present as current law. The merged text is the actual post-2005 version:
  a daughter becomes a coparcener by birth, on equal footing with a son, effective from
  20 December 2004 for protecting already-completed transactions. This is the single most
  significant provision in the Act — confirmed the merged text matches the "daughter...
  shall... by birth become a coparcener" language exactly, and confirmed via Playwright
  it renders correctly with the sub-section (1)-(5) structure and the pious-obligation
  abolition in sub-section (4) intact.
- §30 — the small but real 2005 wording fix ("disposed of by him" → "disposed of by him
  or by her") is present in the merged text, verified directly (`text.includes("by him or
  by her")`).
- §§23 and 24 — omitted entirely by 2005 (the dwelling-house partition restriction and the
  remarried-widow disqualification, respectively) — both correctly absent as substantive
  content, present only as the distinct repealed placeholder described below.

**Three sections flagged `repealed: true`, not two — a discrepancy caught and resolved
by trusting the actual delivered content over the request's literal count.** The user's
message named only §23 and §24 as "omitted provisions... please render them distinctly."
But §31 ("Repeals") has the identical shape: title indicating a repeal, and body text
that is purely `"[Repealed by the Repealing and Amending Act, 1960 (58 of 1960).]"` — no
substantive content whatsoever, exactly the pattern the app's `repealed: true` / distinct-
rendering feature (built for IPA §73, SGA §65, NIA §2) exists to handle. The source file's
own `simpleExplanation` for §31 even draws the comparison explicitly: "the same kind of
self-consuming provision already seen in other Acts in this project." Flagged all three
(§23, §24, §31) as `repealed: true` rather than only the two named in the request, since
the underlying content — not the request's count — is what the existing convention is
keyed to. Verified via Playwright that all three render with the same distinct treatment,
including §31 sitting correctly at the very end of the Act as its own single-section
Chapter IV.

**No case law yet.** §6 (coparcenary rights, especially the retrospective-vs-prospective
question ultimately settled in *Vineeta Sharma v. Rakesh Sharma*, 2020) and §14 (a female
Hindu's absolute ownership) are both flagged by the source as strong, well-documented
candidates for a future case-law pass.

Sourced from the Punjab Revenue Department's bare-act page (plrs.org.in) as a base text,
with §4(2), §6, §23, §24, and §30 independently re-verified against the official Hindu
Succession (Amendment) Act, 2005 (39 of 2005) text (prsindia.org) before merging.

## The Limitation Act, 1963 (LA) — COMPLETE: all 32 of 32 sections, 5 chapters (Parts I–V)
An eighth brand-new Act, delivered whole in one batch. Act code `"LA"`, `"LA-<n>"`
string-prefixed section ids. Structurally simple (32 sections, 5 chapters/Parts, no
lettered insertions), and unlike the previous two Acts this batch needed no independent
verification against a later amendment and no discrepancy-flagging — the source file's
own claims matched its actual delivered content exactly.

Chapters (5, following the Act's own Part structure):
- Part I — Preliminary (§§1–2), category `la-preliminary` (remapped from the source's
  own `"preliminary"` — the sixth time this exact collision, always with BSA's own
  Chapter I category, has come up)
- Part II — Limitation of Suits, Appeals and Applications (§§3–11), category
  `limitation-of-suits-appeals-applications`
- Part III — Computation of Period of Limitation (§§12–24), category
  `computation-of-period`
- Part IV — Acquisition of Ownership by Possession (§§25–27), category
  `acquisition-by-possession`
- Part V — Miscellaneous (§§28–32), category `la-miscellaneous` (remapped from the
  source's own `"miscellaneous"` — collides with SGA's category of the same name,
  same pattern ACA hit with `aca-miscellaneous`)

**Two sections flagged `repealed: true` — exactly as the user's request named, no
discrepancy this time.** §28 (originally "Amendment of certain Acts") and §32
(originally "Repeal") were both repealed by the Repealing and Amending Act, 1974 (56 of
1974), section 2 and the First Schedule, and carry no substantive content today — only a
repeal citation, the same shape already handled for IPA §73, SGA §65, NIA §2, and HSA
§23/§24/§31. Unlike the HSA batch, I checked §§29–31 individually (all three genuinely
substantive: "Savings", "Provision for suits, etc., in respect of pre-Act rights", and
"Provisions as to barred or pending suits, etc." respectively) and confirmed no third
undisclosed repealed section exists here — the user's count of "two sections" is accurate
as given. Verified via Playwright that both §28 and §32 render with the same distinct
`.section-repealed-note` / `.repealed-badge` treatment used elsewhere, and that §28 sits
correctly under the "Part V — Miscellaneous" breadcrumb.

**The Schedule of 137 limitation-period Articles is intentionally not included.** The
Act's substantive time-limits live in a tabular Schedule (Articles 1–137, each mapping a
suit/appeal/application type to its limitation period and the date from which time runs),
not in numbered sections — a fundamentally different data shape than this project's
`SECTIONS` schema (`{id, category, title, text}`) is built for. Force-fitting it in would
either lose the tabular structure or require a parallel schema; flagging this as a
distinct future feature candidate rather than merging it awkwardly now.

**No case law yet.** §5 (condonation of delay on "sufficient cause") is the single most
litigated provision in the Act and the strongest candidate for a future case-law pass;
§18 (effect of acknowledgment in writing) and §14 (exclusion of time in bona fide
proceedings in a wrong court) are secondary candidates.

Sourced from Drishti Judiciary's official-text bare-act PDF.

## The Transfer of Property Act, 1882 (TPA) — COMPLETE: all 137 numbered sections plus 11 lettered insertions (148 objects total), 8 chapters, 17 categories
A ninth brand-new Act, delivered whole in one file, and the largest and structurally
richest Act added to this project to date. Act code `"TPA"`, `"TPA-<n>"` string-prefixed
section ids (including lettered ones, e.g. `"TPA-53A"`). Unlike LA, this source used a
numeric `chapter` field (1–8) directly on each section object rather than only a
category string, which made mapping straightforward — chapter numbers map 1:1 to the
Act's own 8 chapters.

Chapters (8) and their categories (17 total):
- Chapter I — Preliminary (§§1–4), category `tpa-preliminary` (remapped from the
  source's own `"preliminary"` — the seventh time this exact collision, always with
  BSA's own Chapter I category, has come up)
- Chapter II — Of Transfers of Property by Act of Parties (§§5–53A), split into two
  categories matching the Act's own internal Part (A)/(B) split: `transfer-general-
  principles` (§§5–37, moveable or immoveable) and `transfer-immoveable-property`
  (§§38–53A, immoveable only, incl. §53A's part-performance doctrine)
- Chapter III — Of Sales of Immoveable Property (§§54–57), category
  `sales-of-immoveable-property`
- Chapter IV — Of Mortgages of Immoveable Property and Charges (§§58–104), by far the
  densest chapter, split into 9 categories: `mortgages-definitions` (§§58–59A),
  `mortgagor-rights-liabilities` (§§60–66), `mortgagee-rights-liabilities` (§§67–73),
  `mortgagee-liabilities-priority` (§§74–80), `marshalling-contribution-deposit`
  (§§81–84), `suits-foreclosure-sale-redemption` (§§85–90, entirely repealed — see
  below), `redemption-subrogation` (§§91–97), `anomalous-mortgages-charges` (§§98–101),
  `notice-and-tender` (§§102–104)
- Chapter V — Of Leases of Immoveable Property (§§105–117), category
  `leases-of-immoveable-property`
- Chapter VI — Of Exchanges (§§118–121), category `exchanges`
- Chapter VII — Of Gifts (§§122–129), category `gifts`
- Chapter VIII — Of Transfers of Actionable Claims (§§130–137), category
  `actionable-claims`

**13 sections flagged `repealed: true`, not 11 — a discrepancy caught in the source
file's own header, not just the user's request.** The source file's header comment
explicitly claimed "REPEALED SECTIONS (11 total)" but then itemised §74, §75, §80,
§§85–90 (six sections), §97, §99, §130A and §135A — which sums to 13, not 11, an
internal inconsistency in the header's own count. The user's chat message repeated the
same "11 sections" figure. Rather than trust either stated number, I verified against
the actual delivered content: exactly 13 entries carry the title `"[Repealed]"` and a
body consisting only of a repeal citation, matching this project's established
`repealed: true` pattern (IPA §73, SGA §65, NIA §2, HSA §23/§24/§31, LA §28/§32) exactly.
All 13 (§74, §75, §80, §85, §86, §87, §88, §89, §90, §97, §99, §130A, §135A) were flagged
and verified via Playwright to render with the same distinct treatment. Six of these
(§§85–90) form a single coordinated block — the entire mortgage foreclosure/sale/
redemption procedure was moved out of this Act by the Code of Civil Procedure, 1908 and
now lives in CPC Order XXXIV — confirmed via the rendered §85 page, which correctly notes
this is "the first of a large, deliberate block of six consecutive repeals... moved to
the CPC's Order XXXIV in a single 1908 legislative act."

**No case law yet.** This Act carries an especially large body of case law — §14 (rule
against perpetuity), §53A (part performance doctrine), §58 (mortgage classifications),
and virtually all of Chapter IV on mortgages are flagged by the source as especially
heavily litigated and strong candidates for a substantial future case-law pass.

Sourced from the official India Code text (indiacode.nic.in), including full
amendment-history footnotes (the Transfer of Property (Amendment) Act, 1929 being the
single largest amending Act, substantially reshaping much of this Act).

## The Hindu Marriage Act, 1955 (HMA) — COMPLETE: all 30 numbered sections plus 7 lettered insertions (37 objects total), 6 chapters, 6 categories
A tenth brand-new Act, delivered whole in one file. Act code `"HMA"`, `"HMA-<n>"`
string-prefixed section ids (including lettered ones, e.g. `"HMA-13B"`). Like TPA, this
source used a numeric `chapter` field (1–6) directly on each section object, making the
chapter mapping straightforward.

Chapters (6) and their categories:
- Chapter I — Preliminary (§§1–4), category `hma-preliminary` (remapped from the
  source's own `"preliminary"` — the eighth time this exact collision, always with
  BSA's own Chapter I category, has come up)
- Chapter II — Hindu Marriages (§§5–8), category `hindu-marriages` (includes §6, repealed)
- Chapter III — Restitution of Conjugal Rights and Judicial Separation (§§9–10),
  category `restitution-judicial-separation`
- Chapter IV — Nullity of Marriage and Divorce (§§11–18, incl. §13A and §13B),
  category `nullity-and-divorce`
- Chapter V — Jurisdiction and Procedure (§§19–28, incl. §21A–C, §23A, §28A),
  category `jurisdiction-and-procedure`
- Chapter VI — Savings and Repeal (§§29–30), category `savings-and-repeal` (includes
  §30, repealed)

**Two sections flagged `repealed: true` — exactly as the user's request named, no
discrepancy this time.** §6 (originally "Guardianship in marriage") was repealed by the
Child Marriage Restraint (Amendment) Act, 1978; §30 (originally "Repeals") was repealed
by the Repealing and Amending Act, 1960. Both carry no substantive content beyond a
repeal citation, matching this project's established pattern, and both were verified via
Playwright to render with the same distinct treatment. Unlike the earlier TPA and HSA
batches, the source file's own header count and the actual delivered content agreed
exactly — no independent re-count was needed to catch a discrepancy.

**Independently re-verified current-text corrections, caught before merge (per the
source file's own account, itself cross-checked against the structure of the delivered
sections):** §13(1)(iv)'s leprosy ground for divorce was omitted by the 2019 Amendment
and correctly absent from the merged text; §18(a)'s penalty for underage marriage
reflects the substantially increased 2007 penalty (up to two years' rigorous imprisonment
or a ₹1 lakh fine), not the original, far milder 1955 penalty. Also current: §19(iiia)'s
pro-petitioner-wife forum option (2003), and the 60-day disposal provisos in §24 and §26
(2001).

**No case law yet.** §5 (particularly the bigamy condition) and §13 (especially
"cruelty" and "desertion," terms this Act deliberately leaves to case-law elaboration)
both carry an enormous body of Supreme Court authority and are strong candidates for a
future case-law pass.

Sourced from a latestlaws.com/punjabrevenue.nic.in base text, with §13 onward
independently re-verified against the official India Code text (Act No. 25 of 1955)
before merging.

## Case-law pass: LA, HSA, HMA, TPA — 11 landmark case objects across 8 sections
A case-law-only update batch across four Acts, delivered as four separate files, each
targeting sections that previously had zero cases. No section text, illustrations, or
any other field changed anywhere — only `cases` arrays were added.

- **The Limitation Act, 1963 (LA)** — 4 cases across 3 sections: §3 (*Narne Rama Murthy
  v. Ravula Somasundaram*, 2005, on limitation as a mixed question of fact and law),
  §5 (*Collector, Land Acquisition, Anantnag v. Mst. Katiji*, 1987, and *N. Balakrishnan
  v. M. Krishnamurthy*, 1998, both on the "sufficient cause" condonation-of-delay
  standard), §27 (*Bombay Dyeing & Manufacturing Co. Ltd. v. State of Bombay*, 1957, on
  the remedy-vs-right distinction this section departs from). The source file's own
  header transparently documented three cases it considered but excluded: one that
  couldn't be independently verified, one that concerns a Schedule Article rather than a
  numbered section (the Schedule remains a not-yet-built content type for this Act), and
  three that are genuinely HSA/coparcenary cases misfiled against this Act in an earlier
  source list — all left out rather than force-fit, consistent with this project's
  verification discipline.
- **The Hindu Succession Act, 1956 (HSA)** — 3 cases, all on §6 (coparcenary property),
  the single most litigated provision in the Act: *Vineeta Sharma v. Rakesh Sharma*
  (2020, the landmark ruling that daughters' coparcenary rights are retroactive by birth,
  already referenced in §6's own `simpleExplanation` from the original HSA merge),
  *K.C. Laxmana v. K.C. Chandrappa Gowda* (2022, on a Karta's limited power to gift
  coparcenary property), and *Madhegowda v. Ankegowda* (2001, on a coparcener's
  birthright interest versus the Karta's management authority).
- **The Hindu Marriage Act, 1955 (HMA)** — 2 cases: §13 (*Samar Ghosh v. Jaya Ghosh*,
  2007, on mental cruelty as a divorce ground) and §17 (*Gopal Lal v. State of
  Rajasthan*, 1979, on bigamy prosecutions requiring proof of valid ceremonies for the
  second marriage despite its civil voidness).
- **The Transfer of Property Act, 1882 (TPA)** — 2 cases, the Act's first-ever case-law
  pass: §14 (*Ram Baran Prasad v. Ram Mohit Hazra*, 1966, on the rule against perpetuity
  not applying to purely personal contractual rights) and §53A (*Nathulal v. Phoolchand*,
  1969, laying down the four conditions for the part-performance defence).

All 11 case objects verified against the existing `{name, cite, year, ratio, url}`
schema (no new fields needed — none of this batch's cases carry the foreign-jurisdiction
`jurisdiction`/`persuasiveNote` fields used for SGA's earlier cases). Verified via
Playwright that both multi-case sections in this batch (LA §5 with 2 cases, HSA §6 with
3 cases) render all case cards correctly under the "Landmark case available" chip.

## The Hindu Minority and Guardianship Act, 1956 (HMGA) — COMPLETE: all 13 of 13 sections, 1 chapter, 1 category
An eleventh brand-new Act, and by far the smallest and structurally simplest so far.
Act code `"HMGA"`, `"HMGA-<n>"` string-prefixed section ids. The third of the four "Hindu
Code Bills" now built in this project (alongside HMA and HSA) — only the Hindu Adoptions
and Maintenance Act, 1956 remains to complete the full quartet.

**Genuinely flat structure — no chapter divisions in the source Act itself.** Unlike
every other Act merged so far, this one is a single, undivided list of 13 sections with
no internal Part or Chapter headings at all. Per the user's explicit instruction, this
was set up as a single chapter (`HMGA-I`, labelled simply "The Act", range 1–13) and a
single category (`guardianship`, same range) rather than forcing an artificial multi-
chapter structure onto content that genuinely has none. This is the first Act in the
project built this way — worth remembering as the pattern for any future single-category
Act, rather than assuming every new Act needs the usual chapter/category split.

No category remap was needed — `guardianship` did not collide with any existing
category id, unlike almost every other Act merged into this project so far (this is the
first batch where no id collision check turned anything up).

**No repealed sections, no case law yet.** Every one of the 13 sections carries genuine
substantive text. §6 (natural guardians — the Act's single most litigated provision) and
§13 (the "welfare of the minor" paramountcy principle, which can override even §6's own
ordered priority rules) are both flagged by the source as strong candidates for a future
case-law pass — §6 in particular for *Githa Hariharan v. Reserve Bank of India*, the
Supreme Court decision establishing that the phrase "after him" in §6(a) means "in the
absence of," not literally "after death."

Sourced from the official India Code text (indiacode.nic.in), cross-checked against
multiple independent bare-act sources for exact wording.

## Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) — COMPLETE: all 531 of 531 sections, 39 chapters, 56 categories
By far the largest single merge in this project's history, and the Act that had been
sitting as `status: "soon"` since the very start (it was already scaffolded in `ACTS`
before any of its content existed). This batch delivered the entire Act in one file and
flipped its status to `"active"`.

**Delivered pre-formatted, unlike every previous batch.** The source file
(`BNSS_SECTIONS_1_531_FULL.js`) came with its own `BNSS_CLAUDE_CODE_INSTRUCTIONS.md`
companion file, and both the `BNSS_CHAPTERS`, `BNSS_CATEGORIES`, and
`BNSS_SECTIONS_1_531` exports were already written in this project's exact `App.jsx`
object style (all 56 category ids already prefixed `bnss-`, avoiding the recurring
`preliminary` collision with BSA without needing a remap step). This meant no transform
script was needed this time — the three arrays were extracted verbatim from the source
and appended directly to the end of `CHAPTERS`, `CATEGORIES`, and `SECTIONS`
respectively, per the instructions file's own directive, rather than being spliced in
alongside a related Act's entries the way every prior batch was.

**Structure:** 39 chapters mirroring the Act's own Chapter I–XXXIX numbering; 56
categories, with a chapter split into multiple categories only where the Act itself uses
lettered A./B./C. parts (Chapters VI, VII, XI, XVIII, XX, XXV, and XXXIV), one category
per chapter otherwise.

**8 sections carry the Act's own illustrations** (§§234, 236, 238, 241, 243, 244, 245,
337), split out of `text` into a separate `illustrations` array per this project's
established text/illustrations convention (first built for BNS). §243 is the most
complex, with three illustration groups, each keeping the Act's own group heading
("Illustrations to sub-section (1)," etc.) as its own lead-in item. No sections are
repealed, struck down, or lettered — a genuinely clean, uninterrupted 1–531 run.

**Deliberately deferred in this pass:** no `simpleExplanation`, `cases`, or `crossRefs`
were added anywhere — the instructions file was explicit that this merge is statute text
only, with explanatory and case-law enrichment left as separate future passes. The First
Schedule (classification of offences) and Second Schedule (forms) are likewise not
included, consistent with how this project has treated other Acts' non-section Schedule
content (e.g. LA's 137-Article Schedule).

**Source integrity, per the instructions file's own account:** sourced from the Gazette
of India Extraordinary, Part II Sec. 1, No. 54 (25 Dec 2023) — the enacted Act, not the
withdrawn Bill No. 122 of 2023 — with every non-space character in the Gazette body text
accounted for (difference 0), three Gazette typesetting quirks corrected (§114(2), §260,
§480(2)), one marginal-note spelling choice noted (§479 "undertrial" per the Gazette,
differing from India Code's "under-trial," title only), and an explicit warning that the
India Code PDF's text for §53(3) and §58 is garbled and was not used as a source.

Independently verified via a scratch-run inspection script before merge: exact section/
chapter/category counts, no gaps or duplicates in 1–531, every category's `chapter`
resolves, every section's `category` resolves, every category `range` matches the actual
min–max of its sections, every chapter `range` matches the actual min–max of its
categories' sections, and the illustrated-section list matches exactly. All checks
passed cleanly before the splice, and the full-dataset integrity check passed again
after it.

## BNSS enrichment batch 1 — simpleExplanation + 6 landmark cases across 5 sections
The first enrichment pass on BNSS since its full-text merge, and the first BNSS batch to
add `simpleExplanation` or `cases` anywhere in the Act. Added to 5 existing section
objects (no new sections created, no `text`/`title`/`category` touched): §35 (arrest
without warrant), §47 (grounds of arrest and right to bail), §187 (procedure when
investigation exceeds 24 hours / default bail), §479 (maximum undertrial detention
period), and §482 (anticipatory bail) — 6 case objects total (§482 carries two).

**Pre-BNSS continuity cases.** Four of the six cases were decided before BNSS existed,
under the old CrPC's corresponding provisions, and carry `decidedUnder` +
`continuityNote` fields — the same pattern already established for BSA's pre-BSA
Evidence Act cases (e.g. *Arnesh Kumar v. State of Bihar* under CrPC §§41/41A for BNSS
§35; *Gurbaksh Singh Sibbia* and *Sushila Aggarwal* under CrPC §438 for BNSS §482). One
case (*In Re: Inhuman Conditions in 1382 Prisons*, on §479) is itself a BNSS-era order —
an ongoing matter with no reporter citation, cited by writ petition number and the date
of the 23 August 2024 order — and correctly carries neither field, since it doesn't
straddle a code transition the way the other five do.

**REQUIRED code fix, found while checking the case-card rendering for this batch:**
the case card and the "Export section as text" output both hard-coded the label
"(pre-BSA)" for any case carrying `decidedUnder` — correct for every Act enriched so far
(all pre-BSA continuity cases), but wrong for BNSS, whose pre-code cases are properly
"pre-BNSS," not "pre-BSA." Fixed in two places to key off the section's own id instead of
a fixed string:
- Case card JSX: `Decided under {c.decidedUnder} (pre-BSA)` → `Decided under
  {c.decidedUnder} (pre-{String(section.id).startsWith("BNSS-") ? "BNSS" : "BSA"})`
- Export-to-text: the `lines.push` for `c.decidedUnder` now builds the same
  BNSS-vs-BSA label via `String(s.id).startsWith("BNSS-")` instead of the fixed
  `pre-BSA)` suffix.

Verified via Playwright that BNSS-35's case card now correctly reads "pre-BNSS," and
that BSA-8's existing pre-BSA case (*Badri Rai v. State of Bihar*) still correctly reads
"pre-BSA" — confirming the fix is scoped correctly with no regression on any of the
existing BSA continuity cases.

All six case links verified as Indian Kanoon judgment/order pages. *Vihaan Kumar v.
State of Haryana* carries a neutral citation only (2025 INSC 162, no reporter citation
yet available). *M. Ravindran*'s `year` field is the 2020 decision year, distinct from
its 2021 SCC reporter volume.

## The Constitution of India — COMPLETE: all 570 of 570 sections, 26 Part slots (25 in force), 12 Schedules, 3 Appendices
The largest single addition to this project, and structurally the most different: the
Constitution was delivered as a finished, independently-verified data file plus its own
integrity checker and fixture, with instructions that this batch was wiring/rendering/
testing only — "do not re-parse, re-type, or improve any statute text." No statute text
was touched anywhere in this batch; every edit was to `App.jsx` (new rendering code) or
`package.json` (new scripts).

**Why the Constitution is NOT in the flat ACTS/CHAPTERS/CATEGORIES/SECTIONS arrays every
other Act uses.** Two structural incompatibilities, caught before writing any wiring
code:
1. Constitution section ids are bare article/schedule numbers with no act-namespace
   prefix (`"21"`, `"21A"`, `"sch7-I"`), unlike every other Act's `"ACT-<n>"` convention.
   BNS is the one Act in this project that *also* uses unprefixed ids (raw integers
   `1`-`358`). Since `SECTION_MAP` is `Object.fromEntries(SECTIONS.map(s => [s.id, s]))`
   and `Object.fromEntries` coerces every key to a string, BNS's numeric id `1` and a
   Constitution article id `"1"` would collide in a shared map — whichever was inserted
   last would silently overwrite the other. Confirmed this is a real, not theoretical,
   risk: BNS actually has all 358 of ids 1-358 with no gaps, directly overlapping the
   Constitution's own 1-395 article-number range.
2. The Constitution's own data shape carries fields the shared section-rendering pipe has
   no way to represent: `status: 'omitted'` articles with no body text (35 of them),
   `entries`/`rows` in place of `text` for 8 of the 12 Schedules, Part-level
   `subChapters`/`headingNotes`, and per-article `chapterTitle`/`group` cross-headings.
   Force-fitting these into the existing `{id, category, title, text, ...}` section shape
   would have meant either losing structure (flattening tables into prose) or bending the
   generic renderer with Constitution-only special cases scattered through code that every
   other Act also runs.

Kept fully parallel instead: `CONSTITUTION_SECTION_MAP` / `CONSTITUTION_CHAPTER_MAP` are
separate module-level maps, never merged with `SECTION_MAP`/`CHAPTERS`/`CATEGORIES`, and
`selectedAct === "CONSTITUTION"` is the sole discriminator the whole UI branches on — in
`BareActNavigator`'s state (`constitutionSection` computed alongside, never instead of,
`section`), in a dedicated `goToConstitution()` (mirrors `goTo()` but never touches the
shared, ambiguous `SECTION_MAP`), in a Constitution-only `switchAct` branch (seeds
`selectedId` to `"preamble"` instead of searching flat `SECTIONS`), and in the sidebar
(`SidebarContents` branches to a new `ConstitutionSidebarTree` instead of its usual
chapter/category tree). Even the "your notes" `localStorage` key is namespaced
(`constitution-note-<id>` vs. the legacy `bns-note-<id>`) for the same collision reason —
a Constitution Article 21 note and a BNS §21 note would otherwise have overwritten each
other under the pre-existing shared key scheme.

**New files added** (this project's first move beyond a single `App.jsx` data file):
`src/data/constitutionData.js` (the delivered data, copied byte-for-byte verbatim — diffed
identical after every edit in this batch to confirm), `scripts/verify-constitution.mjs` +
`scripts/constitution.expected.json` (the delivered dependency-free integrity checker and
its Contents-page-derived fixture, copied as-is), `scripts/smoke-constitution-build.mjs`
(post-build check that four verbatim strings actually made it into `dist/`), and
`docs/PARSE_REPORT.md` (parsing methodology, cross-checks, and the source-PDF gaps —
footnotes missing in the PDF itself for 10 articles and parts of 8 schedules — that must
not be filled in from memory). `package.json` gained `verify:constitution`,
`smoke:constitution`, and a `prebuild` hook chaining into `verify:constitution`, so a
`npm run build` can never silently ship a corrupted Constitution data file.

**New rendering components**, built because the existing ones have no way to represent
this content: `ConstitutionSectionView` (the main content pane — omitted-article note,
amendment-history `<details>`, a "Not Yet in Force" callout reusing the amber
struck-down-note visual language already established for ACA §87, `ConstitutionEntries`
for numbered schedule lists, `ConstitutionRows` for the First/Fourth Schedule tables) and
`ConstitutionSidebarTree` (Preamble → Parts, with per-article chapter/group sub-headings
inserted only when they change from the previous article in the Contents-page order,
never re-sorted → Schedules grouped by their own `group` field → Appendices).

**Verified exactly per the delivered instructions' Step 5, in order:** `npm run
verify:constitution` (570 sections, 506 article slots: 471 in force/35 omitted, 26 part
slots, one expected `WARN sch2-D: unbalanced plain brackets` — all matching the
instructions' stated expectations exactly) → `npm run build` (exit 0, `prebuild` correctly
auto-ran the verifier first) → `npm run smoke:constitution` (4/4 probe strings found in
`dist/`) → eyeball checks via Playwright covering every item the instructions named:
Article 21 (title + text), Article 21A, Article 22 (shows all 5 "Not yet in force" notes),
Article 238 (shows Omitted, with Part VII itself also visibly marked omitted in both the
breadcrumb and the sidebar), Article 371J (confirms the documented "omits 'the'" title
quirk), Seventh Schedule List I entry 97 (matches the smoke test's own probe string
verbatim), First Schedule Part II showing Delhi (row 1) and Ladakh (row 9) with omitted
rows correctly interspersed, Fourth Schedule's bold "Total 233" row, the Ninth Schedule
ending at entry 284 (preserving the documented PDF typo "entent" for "extent" verbatim),
and the existing BNSS view confirmed to still work with zero regression → the required
negative test (changed one word in Article 21's text, confirmed `verify:constitution`
failed on both the anchor check and the content fingerprint with exit code 1, reverted,
confirmed the reverted file is byte-identical to the originally delivered one and the
verifier passes clean again).

**Not done in this batch, matching the instructions' explicit scope:** `explanation` and
`cases` are empty on every section — reserved for a future enrichment pass, same framing
as every other Act's "no case law yet" note. The First Schedule's starred/omitted rows,
the Second Schedule Part D's one genuinely unbalanced bracket (a PDF artifact, not a
parsing bug — the `WARN` line is expected, not a failure), and the ten articles/eight
schedules with footnotes missing from the PDF itself are all left exactly as the source
data delivered them; per `PARSE_REPORT.md`'s own instruction, none of these gaps are to be
filled in from memory.

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
