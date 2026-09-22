# Constitution of India — parse report

Source: uploaded PDF, *The Constitution of India* (pocket edition, Legislative Department, "as on 1st May, 2026", 402 pages; text current to the 106th Amendment Act, 2023). English text only — Hindi appears only on the cover page.
Everything below was produced from the PDF text layer alone; no outside text was mixed in.

## What was built
| Item | Count |
|---|---|
| Sections in `constitutionData.js` | 570 |
| Article slots | 506 (471 in force + 35 omitted stubs) |
| Part slots | 26 (25 in force; Part VII omitted) |
| Constitution Chapters (inside Parts V, VI, XI, XII, XIV, XVII) | 23 |
| Schedules / Appendices | 12 / 3 |
| Text | 95,435 words |

## How it was parsed (short)
1. Contents pages → the authoritative list of 506 article numbers with Part / Chapter / cross-heading, and omitted flags.
2. Body pages read span-by-span (font size, footnote-separator line, superscript markers). Running headers, page numbers and footnote zones separated by geometry, not by guessing.
3. Articles located one by one in Contents order; paragraphs rebuilt from line-wrap geometry; amendment brackets `n[ ... ]` removed with a nesting-aware stack that carries across articles and pages.
4. Footnotes resolved marker → footnote **page by page** (numbering restarts every page); star notes (`*`, `**`…) resolved by star count.
5. Schedules and Appendices parsed with per-schedule rules (two-column rows for the First Schedule, dot-leader rows for the Fourth, numbered items for the lists).

## Checks run
* **Contents ↔ body:** all 506 article numbers found in order; Part / Chapter / cross-heading of every article agrees with the Contents (Parts VII and VIII have no PART heading in the body, so they follow the Contents).
* **Letter-for-letter cross-check against an independent extractor (poppler `pdftotext`)**, page by page for pages 33–402 (370 pages): 341 pages identical; 26 pages contain the same letters in a different reading order (table/column layouts: pages 158, 163, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 296, 297, 364, 387, 390, 391, 392, 393, 394, 395, 397, 398, 399, 400); pages 34, 36 differ only because poppler's crop includes the running header; page(s) 396 (888 vs 886 letters, an "No" in a table header).
* **Letter conservation:** 388,353 letters in article body lines = 388,353 letters in the cleaned article texts (cleaning removed only markers, brackets and digits).
* `verify-constitution.mjs` passes on the delivered file (fixture built from the Contents pages; also checks numbering of every list schedule, Ninth Schedule 1–284, Fourth Schedule seats adding up to the printed total 233, anchors, and a content fingerprint).

## Source-PDF gaps — do NOT fill from memory
Footnote text is **missing in the PDF** for these markers (the amendment note is simply absent from `amendments`):
168 (p.107: marker 1), 250 (p.178: marker 1), 254 (p.179: marker 1), 255 (p.179: marker 1), 315 (p.208: marker 1), 316 (p.209: marker 3), 317 (p.210: marker 1), 318 (p.210: marker 1), 320 (p.212: marker 2), 323 (p.213: marker 2).
Schedules: sch5-6 (pp. 309, 310); sch6-2 (pp. 313, 314); sch6-20B (pp. 337); sch6-20C (pp. 340); sch7-I (pp. 344, 345); sch7-II (pp. 349, 350, 352); sch7-III (pp. 353); sch9 (pp. 369, 370, 373, 374).
Check these against India Code before adding anything.

## Source quirks kept verbatim
* Article 334A heading reads "Reservation of seats for women take effect"; Article 371J heading omits "the" (Contents has "the State of Karnataka"); Appendix III heading is spelt "DECLRATION" in the PDF (the `title` field is normalised, the body is untouched).
* Article 368(4) and 371D contain square brackets that are part of the printed text. Second Schedule Part D and Appendix I also contain plain brackets. Second Schedule Part D has one `[` with no closing bracket in the PDF.
* `***` / `* * *` omission marks are kept in `text` (they show where words were omitted). Star-only lines (Articles 30, 216, 276, 352) are kept.
* Nine amendment brackets are unbalanced in the PDF itself (Articles 81, 170 (two), 194, 226, 286, 352, 370 and the Part IX heading). Only the bracket was dropped; no text was lost.
* Ninth Schedule entry 284 ends with an Explanation about the Rajasthan Tenancy Act; it is kept inside that entry (on its own line). The PDF itself prints "entent" for "extent" there; left as printed.
* Article 232 appears in the PDF as a stub reading "Articles 230, 231 and 232 subs. by articles 230 and 231…" and is stored as omitted with that note.
* Article 238 has no stub of its own in the body (only the Part VII omission note on p. 142). It is stored as an omitted article with that note.
* The 106th Amendment provisions (Articles 330A, 332A, 334A) are included as printed; they take effect only after the delimitation described in 334A.

## Decisions taken
* Article text: footnote numbers and amendment brackets stripped; page-bottom footnotes kept verbatim in `amendments` (exact duplicates inside one article removed).
* Any note saying "date to be notified", "shall stand …" etc. is stored in `notInForce` instead: 10 sections (22×5, 100×1, 102×1, 105×1, 118×1, 168×1, 189×1, 191×1, 194×1, 208×1).
* First Schedule star rows (omitted entries) are kept as rows with `omitted: true`. Row names/territories are split by column position.
* Third Schedule (oath forms): the alternative wording "solemnly affirm" is printed in the PDF as a stacked alternative under "swear in the name of God"; the text layer places it where the PDF puts it, so in a few forms it appears slightly out of reading order. Worth a visual check against the PDF before the explanation pass.
* Appendix I (the 100th Amendment Act) contains tables; they are flattened to text lines.
* Not done on purpose: inline positions of footnote markers are not preserved. `cases` is empty until the candidate list is verified (see the section below).


## Explanation pass (September 2026)
* **Two data fixes.** Tenth Schedule para 7 had a stray `*` in front of its text and an empty title; it is now titled "Bar of jurisdiction of courts" and carries the star note (paragraph declared invalid in Kihoto Hollohon, A.I.R. 1993 SC 412, as printed). Second Schedule Part E had a stray `*` before "four thousand rupees"; the star note (Comptroller and Auditor-General's salary equals a Supreme Court judge's) is now attached. The verifier gained a stray-star check on statute text (footnote text is exempt) and was tested against the original bug. The content fingerprint changed only because of these two fixes.
* **Explanations.** 532 plain-English explanations: the Preamble, 471 in-force articles, and every in-force schedule paragraph, list and appendix. Written against the parsed text (short and numeric provisions were re-read from the data). Not fact-checked against India Code commentary. Provisions that describe court rulings are listed in CLAUDE_CODE_INSTRUCTIONS.md, section B.
* **Printed text that does not operate.** Articles 124A–124C and the 99th-Amendment wording in Articles 124, 217, 222 and 224A are printed in the source PDF with a note that the Supreme Court struck the amendment down; the data keeps the text as printed, and the explanations say it does not operate. Articles 331 and 333 are also printed in full; the explanations note that Anglo-Indian nomination ended under Article 334.
* **Case law.** Seven landmark cases are verified and merged (24 entries across 19 sections): Kesavananda Bharati, Maneka Gandhi, Puttaswamy (privacy), S.R. Bommai, Indra Sawhney, Minerva Mills and Kihoto Hollohon. `constitutionCases.pending.json` holds about 170 more candidates without URLs; each must be verified against Indian Kanoon before it is added.
