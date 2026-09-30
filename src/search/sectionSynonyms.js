/* Hand-curated search tags: phrases a student might actually type, mapped to
   the specific section they should land on. Plain fuzzy matching (Fuse.js)
   can't bridge a genuine vocabulary gap -- "cheque bounce" and "dishonour
   of cheque" don't share enough characters to fuzzy-match, no matter how
   the threshold is tuned.

   Keys are `${actId}-${sectionId}`, using this app's real ACTS ids (see
   actAliases.js) and this app's real section ids exactly as they appear in
   SECTIONS/CONSTITUTION_SECTIONS -- e.g. "BNS-103" (bare numeric BNS id),
   "RA-17" (act-prefixed id), "CONSTITUTION-21" (Constitution article
   number, not the "sch"/"preamble" style ids Schedules and the Preamble
   use). Every mapping below was checked against the actual section title
   in this app's own data before being added. */
export const SECTION_SYNONYMS = {
  // --- Negotiable Instruments Act, 1881 ---
  // Section 138 is, by a wide margin, the most litigated section in Indian
  // law (cheque dishonour for insufficient funds).
  "NIA-138": ["cheque bounce", "bounced cheque", "dishonour of cheque", "insufficient funds cheque", "cheque return"],

  // --- Bharatiya Nyaya Sanhita, 2023 (replaced the IPC on 1 July 2024) ---
  "BNS-103": ["murder", "punishment for murder", "IPC 302", "section 302 IPC", "302 murder"],
  "BNS-109": ["attempt to murder", "IPC 307", "section 307 IPC"],
  "BNS-63": ["rape", "IPC 375", "section 375 IPC"],
  "BNS-70": ["gang rape", "IPC 376D"],
  "BNS-303": ["theft", "stealing", "IPC 378", "IPC 379", "section 378 IPC", "section 379 IPC"],
  "BNS-318": ["cheating", "IPC 420", "section 420 IPC", "420 cheating", "fraud inducement"],
  "BNS-356": ["defamation", "IPC 499", "section 499 IPC"],
  "BNS-85": ["cruelty by husband", "498A", "IPC 498A", "dowry harassment", "domestic cruelty"],
  "BNS-80": ["dowry death", "IPC 304B", "section 304B IPC"],
  "BNS-351": ["criminal intimidation", "IPC 503", "threatening someone"],
  "BNS-61": ["criminal conspiracy", "IPC 120A"],
  "BNS-152": ["sedition", "IPC 124A", "acts against sovereignty of India"],

  // --- The Registration Act, 1908 ---
  "RA-17": [
    "which documents must be registered",
    "compulsory registration",
    "sale deed registration",
    "GPA sale",
    "power of attorney sale",
    "gift deed registration",
  ],
  "RA-49": [
    "effect of not registering a document",
    "unregistered sale deed",
    "what if I don't register a sale deed",
    "consequences of non-registration",
  ],
  "RA-60": ["is a registered document proof", "presumption registered document", "certificate of registration"],

  // --- Hindu Adoptions and Maintenance Act, 1956 ---
  "HAMA-18": ["wife maintenance", "alimony", "can a wife claim maintenance", "separate residence wife"],
  "HAMA-20": ["maintenance of children", "child maintenance", "maintenance of parents"],

  // --- The Constitution of India ---
  "CONSTITUTION-21": ["right to life", "personal liberty", "fundamental right to life"],
  "CONSTITUTION-19": ["freedom of speech", "freedom of expression", "right to assemble", "six freedoms"],
  "CONSTITUTION-32": ["writ petition", "fundamental rights enforcement", "right to constitutional remedies", "habeas corpus"],
  "CONSTITUTION-368": ["constitutional amendment", "how to amend the constitution", "amending power"],
  "CONSTITUTION-356": ["president's rule", "state emergency", "dismissal of state government"],

  // --- Specific Relief Act, 1963 ---
  "SRA-10": ["specific performance", "can I force someone to complete a contract"],
  "SRA-38": ["permanent injunction", "perpetual injunction"],
};
