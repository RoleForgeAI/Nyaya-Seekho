/* Maps common nicknames/abbreviations to the actId a student means, so a
   search like "21 bns" or "138 ni act" can narrow straight to that one
   act's section instead of returning every act that happens to have a
   section with that number.

   actId values match this app's real ACTS ids (see the ACTS array in
   App.jsx) exactly -- not a lowercase guess. */
export const ACT_ALIASES = {
  constitution: "CONSTITUTION",
  "the constitution": "CONSTITUTION",
  "indian constitution": "CONSTITUTION",

  registration: "RA",
  "registration act": "RA",

  hama: "HAMA",
  "adoption act": "HAMA",
  "adoptions act": "HAMA",
  "hindu adoptions": "HAMA",

  bns: "BNS",
  "bharatiya nyaya sanhita": "BNS",
  ipc: "BNS", // students still search the old name constantly -- route it to the current law
  "penal code": "BNS",

  bnss: "BNSS",
  "bharatiya nagarik suraksha sanhita": "BNSS",
  crpc: "BNSS",
  "criminal procedure": "BNSS",

  bsa: "BSA",
  "bharatiya sakshya adhiniyam": "BSA",
  "evidence act": "BSA",

  ni: "NIA",
  "ni act": "NIA",
  "negotiable instruments": "NIA",
  "negotiable instruments act": "NIA",

  contract: "ICA",
  "contract act": "ICA",

  sra: "SRA",
  "specific relief": "SRA",
  "specific relief act": "SRA",

  tpa: "TPA",
  "tp act": "TPA",
  "transfer of property": "TPA",
  "transfer of property act": "TPA",

  "hindu succession": "HSA",
  "succession act": "HSA",

  limitation: "LA",
  "limitation act": "LA",

  partnership: "IPA",
  "partnership act": "IPA",

  "sale of goods": "SGA",
  "goods act": "SGA",

  arbitration: "ACA",
  "arbitration act": "ACA",

  "hindu marriage": "HMA",
  "marriage act": "HMA",
  hma: "HMA",

  "hindu minority": "HMGA",
  guardianship: "HMGA",
  "guardianship act": "HMGA",
};

// Longer phrases first, so "ni act" is tried before a bare "ni" would
// accidentally swallow part of a longer word, and so multi-word aliases
// like "transfer of property" match before their shorter fragments would.
export const ACT_ALIAS_KEYS_BY_LENGTH = Object.keys(ACT_ALIASES).sort((a, b) => b.length - a.length);
