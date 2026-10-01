import Fuse from "fuse.js";
import { SECTION_SYNONYMS } from "./sectionSynonyms.js";
import { ACT_ALIASES, ACT_ALIAS_KEYS_BY_LENGTH } from "./actAliases.js";

/**
 * Turns this app's section data into one flat, searchable index.
 *
 * Two shapes exist in this app: the Constitution keeps its own data model
 * (CONSTITUTION_SECTIONS, field names `explanation` and `status`), while
 * every other Act lives in the shared SECTIONS array in App.jsx (field
 * names `simpleExplanation` and a boolean `repealed` flag). This
 * normalizer reads whichever pair of fields a given section actually has.
 *
 * Usage (see App.jsx, where the index is built once at module scope):
 *
 *   const searchIndex = buildLegalSearchIndex([
 *     { actId: "BNS", actName: "Bharatiya Nyaya Sanhita, 2023", sections: bnsSections },
 *     { actId: "HAMA", actName: "The Hindu Adoptions and Maintenance Act, 1956", sections: hamaSections },
 *     { actId: "CONSTITUTION", actName: "Constitution of India", sections: CONSTITUTION_SECTIONS },
 *     // ...one entry per act -- actId here must match the ids used in
 *     // sectionSynonyms.js and actAliases.js.
 *   ]);
 *
 * Pass `searchIndex` into <LegalSearch index={searchIndex} onSelect={...} />.
 */
export function buildLegalSearchIndex(acts) {
  const items = [];

  for (const act of acts) {
    for (const section of act.sections) {
      // Skip repealed/omitted/struck-off sections -- nothing useful to
      // search for there, and they'd otherwise clutter results with
      // "[Repealed]" placeholder text.
      const notInForce = section.repealed === true || (section.status && section.status !== "in-force");
      if (notInForce) continue;

      const caseNames = (section.cases || []).map((c) => c.name).filter(Boolean).join(". ");
      // Most acts' own ids are already act-prefixed (e.g. "RA-17", "HAMA-18"),
      // unlike BNS ("103", bare) and the Constitution ("21", bare) -- so
      // naively prepending actId again would double it ("RA-RA-17"). Only
      // prepend when the id doesn't already carry that prefix.
      const rawId = String(section.id);
      const synonymKey = rawId.startsWith(`${act.actId}-`) ? rawId : `${act.actId}-${rawId}`;
      const tags = (SECTION_SYNONYMS[synonymKey] || []).join(". ");
      const explanationText = section.simpleExplanation || section.explanation || "";

      items.push({
        // Unique key across the whole index, e.g. "HAMA-17" or "CONSTITUTION-21A"
        key: synonymKey,
        actId: act.actId,
        actName: act.actName,
        sectionId: section.id,
        title: section.title || section.label || "",
        label: section.label || null, // Constitution sections carry a display-ready label ("Article 21"); other acts don't
        text: section.text || "",
        explanation: explanationText,
        caseNames,
        tags,
      });
    }
  }

  const fuse = new Fuse(items, {
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true, // match anywhere in the field, not just near the start
    threshold: 0.35, // lower = stricter; 0.35 tolerates a fair amount of fuzziness/typos
    keys: [
      { name: "tags", weight: 0.5 }, // hand-picked student phrasings -- outrank everything else when present
      { name: "explanation", weight: 0.3 }, // plain English -- closest to how students phrase questions
      { name: "title", weight: 0.15 },
      { name: "caseNames", weight: 0.1 },
      { name: "text", weight: 0.1 }, // the formal statute text -- lower weight, but still catches exact legal terms
    ],
  });

  // Index items by their BARE section number for instant lookup -- used by
  // the "section 138" / bare-number shortcut in searchLegal() below. Most
  // acts' own ids are already act-prefixed ("RA-17", "ITA-66"), unlike BNS
  // ("103") and the Constitution ("21"), which are bare. Indexing by the
  // raw sectionId alone would mean a bare query like "66" only ever finds
  // BNS/Constitution-style acts -- every prefixed-id act would be invisible
  // to a plain number search with no act hint. Stripping each item's own
  // act prefix before indexing fixes that uniformly, with or without a hint.
  const byExactId = new Map();
  for (const item of items) {
    const rawId = String(item.sectionId);
    const bareId = rawId.startsWith(`${item.actId}-`) ? rawId.slice(item.actId.length + 1) : rawId;
    const idKey = bareId.toLowerCase();
    if (!byExactId.has(idKey)) byExactId.set(idKey, []);
    byExactId.get(idKey).push(item);
  }

  return { fuse, items, byExactId };
}

// Recognises "section 138", "sec. 138", "s 138", "article 21", "art. 21",
// "§138", "rule 11", or a query that IS just a bare id ("138", "21A"), and
// pulls out the candidate section id. Returns null if nothing matches.
const SECTION_REF_PATTERN = /\b(?:section|sec\.?|s\.?|article|art\.?|rule|order)\s*[-:.]?\s*([0-9]+[A-Za-z]*)\b|§\s*([0-9]+[A-Za-z]*)/i;
const BARE_ID_PATTERN = /^[0-9]+[A-Za-z]*$/;

// Recognises the CPC's "Order X, Rule Y" citation style -- "order 39 rule 1",
// "o 39 r 1", "o.39 r.1", "order xxxix rule 1", "o 13a r 3", "o.13a r.3",
// "order xi (commercial) rule 4" -- and resolves it to a candidate bare rule
// id ("O39R1", "O13AR3", "O11CR4"). The order number may be arabic or roman,
// optionally with a lettered/commercial suffix; this is independent of the
// plain SECTION_REF_PATTERN above (which also recognises a bare "order"/
// "rule" keyword, but only for a single number -- not this two-part form).
const ORDER_RULE_PATTERN = /\b(?:order|o)\.?\s*([a-z0-9][a-z0-9\s\-().]*?)\s*,?\s*(?:rule|r)\.?\s*(\d+[a-z]*)\b/i;

function romanToArabic(s) {
  const vals = { I: 1, V: 5, X: 10, L: 50 };
  let num = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = vals[s[i]];
    if (!cur) return null;
    const next = vals[s[i + 1]];
    num += next && cur < next ? -cur : cur;
  }
  return num > 0 ? num : null;
}

// Normalises an order-number token -- arabic ("13a", "11c") or roman
// ("xiii-a", "xi (commercial)", "xxxix") -- into the bare form used in this
// app's rule ids ("13A", "11C", "39").
function normalizeOrderToken(raw) {
  const cleaned = raw.replace(/\s+/g, " ").trim().toUpperCase();
  const arabicMatch = /^(\d+)[\s-]*\(?([A-Z]*)\)?$/.exec(cleaned);
  if (arabicMatch) {
    const suffix = arabicMatch[2] === "COMMERCIAL" ? "C" : arabicMatch[2];
    return arabicMatch[1] + suffix;
  }
  const romanMatch = /^([IVXL]+)[\s-]*\(?([A-Z]*)\)?$/.exec(cleaned);
  if (romanMatch) {
    const num = romanToArabic(romanMatch[1]);
    if (num == null) return null;
    const suffix = romanMatch[2] === "COMMERCIAL" ? "C" : romanMatch[2];
    return String(num) + suffix;
  }
  return null;
}

function extractOrderRuleRef(query) {
  const m = ORDER_RULE_PATTERN.exec(query);
  if (!m) return null;
  const orderToken = normalizeOrderToken(m[1]);
  if (!orderToken) return null;
  return `O${orderToken}R${m[2].toUpperCase()}`;
}

// Looks for an act nickname anywhere in the query ("21 bns", "138 ni act",
// "article 21 of the constitution") and returns { actId, matchedText }, or
// null if none of the known aliases appear. Checked longest-alias-first so
// multi-word names like "transfer of property" aren't shadowed by a
// shorter fragment.
function extractActHint(query) {
  const lower = query.toLowerCase();
  for (const alias of ACT_ALIAS_KEYS_BY_LENGTH) {
    // \b...\b so "ni" doesn't match inside "constitution" etc.
    const pattern = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    const m = pattern.exec(lower);
    if (m) return { actId: ACT_ALIASES[alias], matchedText: m[0] };
  }
  return null;
}

function extractSectionRef(query) {
  const trimmed = query.trim();
  if (BARE_ID_PATTERN.test(trimmed)) return trimmed;
  const m = SECTION_REF_PATTERN.exec(trimmed);
  if (m) return m[1] || m[2];

  // No "section"/"article"/etc. keyword -- but if an act nickname is present
  // ("21 bns", "138 ni act"), strip it out and see if what's left is just
  // a bare number. This is a very natural way to type a lookup, so it's
  // worth handling even without the formal "section" word.
  const hint = extractActHint(trimmed);
  if (hint) {
    const withoutAlias = trimmed
      .toLowerCase()
      .replace(new RegExp(`\\b${hint.matchedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`), "")
      .replace(/\bof\b|\bthe\b/g, "")
      .trim();
    if (BARE_ID_PATTERN.test(withoutAlias)) return withoutAlias;
  }
  return null;
}

/**
 * Runs a search and returns a clean array of results, already sorted by
 * relevance. Exact section-number matches (if the query names or is a
 * section/article/rule number) are pinned first as a separate group,
 * ahead of the fuzzy results -- this is how most students actually search
 * ("section 138"), not by describing the concept in words.
 *
 * If the query also names an act ("21 bns", "article 21 constitution",
 * "138 ni act"), the exact match is narrowed to that one act.
 *
 *   const results = searchLegal(searchIndex, "21 bns");
 *   // [{ actId: "BNS", actName: "...", sectionId: "21", ..., exact: true }]
 */
export function searchLegal(index, query, { limit = 15 } = {}) {
  const trimmed = (query || "").trim();
  if (trimmed.length < 2) return [];

  const results = [];
  const seenKeys = new Set();

  // The Order/Rule form ("order 39 rule 1") is checked first since it's more
  // specific than the plain section/rule-number pattern extractSectionRef
  // also recognises (which would otherwise grab just "order"'s number and
  // silently ignore the "rule N" part).
  const ref = extractOrderRuleRef(trimmed) || extractSectionRef(trimmed);
  const actHint = ref ? extractActHint(trimmed) : null;
  if (ref) {
    // byExactId is keyed by each item's BARE section number (its own act
    // prefix already stripped at index-build time), so this finds matches
    // across every act uniformly -- no hint needed. An act hint, when
    // present, just narrows the (possibly multi-act) result down to one.
    let exactMatches = index.byExactId.get(ref.toLowerCase()) || [];
    if (actHint) exactMatches = exactMatches.filter((item) => item.actId === actHint.actId);
    for (const item of exactMatches) {
      results.push({
        actId: item.actId,
        actName: item.actName,
        sectionId: item.sectionId,
        title: item.title,
        label: item.label,
        snippet: buildSnippet({ item, matches: [] }),
        score: 0,
        exact: true,
      });
      seenKeys.add(item.key);
    }
  }

  // Skip the fuzzy fallback once we already have real exact matches.
  // Without this, a query like "art 47" (which correctly finds Article 47
  // as an exact match) would ALSO run "art 47" through fuzzy search as
  // free text -- and since "art" is a literal substring of "part", that
  // fuzzy-matches things like "part performance" or "part delivery",
  // polluting good exact results with unrelated noise underneath them.
  // If a ref was recognised but nothing actually matched it (e.g. "section
  // 999 bns" for a section that doesn't exist), we still fall back to
  // fuzzy search so the person isn't left with zero results.
  const haveExactMatches = results.length > 0;
  if (!haveExactMatches && trimmed.length >= 3) {
    const fuzzy = index.fuse.search(trimmed, { limit: limit + results.length });
    for (const r of fuzzy) {
      if (seenKeys.has(r.item.key)) continue;
      results.push({
        actId: r.item.actId,
        actName: r.item.actName,
        sectionId: r.item.sectionId,
        title: r.item.title,
        label: r.item.label,
        snippet: buildSnippet(r),
        score: r.score,
        exact: false,
      });
      seenKeys.add(r.item.key);
    }
  }

  return results.slice(0, limit);
}

// Builds a snippet centred on the matched text (when Fuse reports a match
// span), with the matched substring positions included so the UI can
// highlight them. Falls back to a plain leading truncation when there's
// no match-span info (e.g. exact-id results, which have no fuzzy matches).
function buildSnippet(result, maxLen = 220) {
  const item = result.item;
  const explanationMatch = (result.matches || []).find((m) => m.key === "explanation");
  const source = item.explanation || item.text || "";

  if (!explanationMatch || !explanationMatch.indices || !explanationMatch.indices.length) {
    const truncated = source.length <= maxLen ? source : source.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
    return { text: truncated, highlights: [] };
  }

  const [start, end] = explanationMatch.indices[0];
  const half = Math.floor((maxLen - (end - start)) / 2);
  const windowStart = Math.max(0, start - half);
  const windowEnd = Math.min(source.length, windowStart + maxLen);

  const prefix = windowStart > 0 ? "…" : "";
  const suffix = windowEnd < source.length ? "…" : "";
  const offset = windowStart - prefix.length;

  const highlights = explanationMatch.indices
    .filter(([s, e]) => s >= windowStart && e < windowEnd)
    .map(([s, e]) => [s - offset, e - offset + 1]); // +1: Fuse's end index is inclusive

  return { text: prefix + source.slice(windowStart, windowEnd) + suffix, highlights };
}
