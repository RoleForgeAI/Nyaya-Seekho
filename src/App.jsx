import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, X, ScrollText, Scale, StickyNote, Menu, BookMarked, Link2 } from "lucide-react";
import { storage } from "./lib/storage.js";

/* ------------------------------------------------------------------ */
/* DATA — Chapter III, General Exceptions, Bharatiya Nyaya Sanhita 2023 */
/* Statutory text drawn from the Sanhita. This prototype is a study    */
/* aid, not a substitute for the official Gazette text — verify        */
/* exact wording before quoting in an exam or brief.                   */
/* ------------------------------------------------------------------ */

const ACTS = [
  { id: "BNS", label: "Bharatiya Nyaya Sanhita, 2023", short: "BNS", status: "active" },
  { id: "SRA", label: "The Specific Relief Act, 1963", short: "SRA", status: "active" },
  { id: "BNSS", label: "Bharatiya Nagarik Suraksha Sanhita, 2023", short: "BNSS", status: "soon" },
  { id: "BSA", label: "Bharatiya Sakshya Adhiniyam, 2023", short: "BSA", status: "active" },
  { id: "CONTRACT", label: "Indian Contract Act, 1872", short: "Contract Act", status: "soon" },
  { id: "CONSTITUTION", label: "Constitution of India", short: "Constitution", status: "soon" },
];

const CONTENT_LAST_VERIFIED = "24 August 2026 — all 358 BNS sections + all 42 Specific Relief Act sections complete; BSA now complete — all 170 of 170 sections, all 12 chapters, verified against India Code Act No. 47 of 2023 / Gazette PDF via mha.gov.in";

const CHAPTERS = [
  { id: "I", act: "BNS", label: "Chapter I — Preliminary", range: "1–3" },
  { id: "II", act: "BNS", label: "Chapter II — Of Punishments", range: "4–13" },
  { id: "III", act: "BNS", label: "Chapter III — General Exceptions", range: "14–44" },
  { id: "IV", act: "BNS", label: "Chapter IV — Abetment, Criminal Conspiracy and Attempt", range: "45–62" },
  { id: "V", act: "BNS", label: "Chapter V — Offences Against Woman and Child", range: "63–99" },
  { id: "VI", act: "BNS", label: "Chapter VI — Offences Affecting the Human Body", range: "100–146" },
  { id: "VII", act: "BNS", label: "Chapter VII — Offences Against the State", range: "147–158" },
  { id: "VIII", act: "BNS", label: "Chapter VIII — Offences Relating to the Army, Navy and Air Force", range: "159–168" },
  { id: "IX", act: "BNS", label: "Chapter IX — Offences Relating to Elections", range: "169–177" },
  { id: "X", act: "BNS", label: "Chapter X — Of Coin, Currency-Notes, Bank-Notes and Government Stamps", range: "178–188" },
  { id: "XI", act: "BNS", label: "Chapter XI — Offences Against the Public Tranquillity", range: "189–197" },
  { id: "XII", act: "BNS", label: "Chapter XII — Offences By or Relating to Public Servants", range: "198–205" },
  { id: "XIII", act: "BNS", label: "Chapter XIII — Contempts of the Lawful Authority of Public Servants", range: "206–226" },
  { id: "XIV", act: "BNS", label: "Chapter XIV — False Evidence and Offences Against Public Justice", range: "227–269" },
  { id: "XV", act: "BNS", label: "Chapter XV — Offences Affecting Public Health, Safety, Convenience, Decency and Morals", range: "270–297" },
  { id: "XVI", act: "BNS", label: "Chapter XVI — Offences Relating to Religion", range: "298–302" },
  { id: "XVII", act: "BNS", label: "Chapter XVII — Offences Against Property", range: "303–334" },
  { id: "XVIII", act: "BNS", label: "Chapter XVIII — Offences Relating to Documents and to Property Marks", range: "335–350" },
  { id: "XIX", act: "BNS", label: "Chapter XIX — Criminal Intimidation, Insult, Annoyance, Defamation", range: "351–357" },
  { id: "XX", act: "BNS", label: "Chapter XX — Repeal and Savings", range: "358" },

  { id: "SR-I", act: "SRA", label: "Part I — Preliminary", range: "1-4" },
  { id: "SR-II-1", act: "SRA", label: "Part II, Chapter I — Recovering Possession of Property", range: "5-8" },
  { id: "SR-II-2", act: "SRA", label: "Part II, Chapter II — Specific Performance of Contracts", range: "9-25" },
  { id: "SR-II-3", act: "SRA", label: "Part II, Chapter III — Rectification of Instruments", range: "26" },
  { id: "SR-II-4", act: "SRA", label: "Part II, Chapter IV — Rescission of Contracts", range: "27-30" },
  { id: "SR-II-5", act: "SRA", label: "Part II, Chapter V — Cancellation of Instruments", range: "31-33" },
  { id: "SR-II-6", act: "SRA", label: "Part II, Chapter VI — Declaratory Decrees", range: "34-35" },
  { id: "SR-III-7", act: "SRA", label: "Part III, Chapter VII — Injunctions Generally", range: "36-37" },
  { id: "SR-III-8", act: "SRA", label: "Part III, Chapter VIII — Perpetual Injunctions", range: "38-42" },

  { id: "BSA-I", act: "BSA", label: "Chapter I — Preliminary", range: "1–2" },
  { id: "BSA-II", act: "BSA", label: "Chapter II — Relevancy of Facts", range: "3–50" },
  { id: "BSA-III", act: "BSA", label: "Chapter III — Facts Which Need Not Be Proved", range: "51–53" },
  { id: "BSA-IV", act: "BSA", label: "Chapter IV — Of Oral Evidence", range: "54–55" },
  { id: "BSA-V", act: "BSA", label: "Chapter V — Of Documentary Evidence", range: "56–93" },
  { id: "BSA-VI", act: "BSA", label: "Chapter VI — Of the Exclusion of Oral by Documentary Evidence", range: "94–103" },
  { id: "BSA-VII", act: "BSA", label: "Chapter VII — Of the Burden of Proof", range: "104–120" },
  { id: "BSA-VIII", act: "BSA", label: "Chapter VIII — Of Estoppel", range: "121–123" },
  { id: "BSA-IX", act: "BSA", label: "Chapter IX — Of Witnesses", range: "124–139" },
  { id: "BSA-X", act: "BSA", label: "Chapter X — Of Examination of Witnesses", range: "140–168" },
  { id: "BSA-XI", act: "BSA", label: "Chapter XI — Of Improper Admission and Rejection of Evidence", range: "169" },
  { id: "BSA-XII", act: "BSA", label: "Chapter XII — Repeal and Savings", range: "170" },
];

const CATEGORIES = [
  { id: "Y", chapter: "I", label: "Short Title, Commencement & Definitions", range: "1–3" },
  { id: "Z", chapter: "II", label: "Punishments & Sentencing Rules", range: "4–13" },
  { id: "A", chapter: "III", label: "Mistake of Law & Judicial Acts", range: "14–17" },
  { id: "B", chapter: "III", label: "Accident & Necessity", range: "18–19" },
  { id: "C", chapter: "III", label: "Incapacity — Children & Unsoundness of Mind", range: "20–22" },
  { id: "D", chapter: "III", label: "Intoxication", range: "23–24" },
  { id: "E", chapter: "III", label: "Consent-Based Defences", range: "25–31" },
  { id: "F", chapter: "III", label: "Compulsion & Trifling Acts", range: "32–33" },
  { id: "G", chapter: "III", label: "Right of Private Defence", range: "34–44" },
  { id: "H", chapter: "IV", label: "Abetment — Meaning & Scope", range: "45–48" },
  { id: "I", chapter: "IV", label: "Abettor's Liability", range: "49–54" },
  { id: "J", chapter: "IV", label: "Abetment of Grave Offences & Concealment", range: "55–60" },
  { id: "K", chapter: "IV", label: "Criminal Conspiracy", range: "61" },
  { id: "L", chapter: "IV", label: "Attempt", range: "62" },
  { id: "T", chapter: "V", label: "Sexual Offences", range: "63–73" },
  { id: "U", chapter: "V", label: "Criminal Force & Assault Against Women", range: "74–79" },
  { id: "V2", chapter: "V", label: "Offences Relating to Marriage", range: "80–87" },
  { id: "W", chapter: "V", label: "Causing Miscarriage, etc.", range: "88–92" },
  { id: "X", chapter: "V", label: "Offences Against Children", range: "93–99" },
  { id: "M", chapter: "VI", label: "Culpable Homicide & Murder", range: "100–105" },
  { id: "N", chapter: "VI", label: "Negligence, Suicide & Attempt", range: "106–110" },
  { id: "O", chapter: "VI", label: "Organised Crime & Terrorism", range: "111–113" },
  { id: "P", chapter: "VI", label: "Of Hurt", range: "114–125" },
  { id: "Q", chapter: "VI", label: "Wrongful Restraint & Confinement", range: "126–127" },
  { id: "R", chapter: "VI", label: "Criminal Force & Assault", range: "128–136" },
  { id: "S", chapter: "VI", label: "Kidnapping, Abduction, Slavery & Forced Labour", range: "137–146" },
  { id: "AA", chapter: "VII", label: "Offences Against the State", range: "147–158" },
  { id: "YY", chapter: "X", label: "Coin, Currency-Notes & Government Stamps", range: "178–188" },
  { id: "BB", chapter: "XI", label: "Unlawful Assembly, Rioting & Public Tranquillity", range: "189–197" },
  { id: "CC", chapter: "XIX", label: "Criminal Intimidation, Insult & Public Mischief", range: "351–355" },
  { id: "DD", chapter: "XIX", label: "Defamation & Breach of Duty to Helpless Person", range: "356–357" },
  { id: "EE", chapter: "XVII", label: "Of Theft", range: "303–307" },
  { id: "FF", chapter: "XVII", label: "Of Extortion", range: "308" },
  { id: "GG", chapter: "XVII", label: "Of Robbery and Dacoity", range: "309–313" },
  { id: "HH", chapter: "XVII", label: "Of Criminal Misappropriation of Property", range: "314–315" },
  { id: "II", chapter: "XVII", label: "Of Criminal Breach of Trust", range: "316" },
  { id: "JJ", chapter: "XVII", label: "Of Receiving Stolen Property", range: "317" },
  { id: "KK", chapter: "XVII", label: "Of Cheating", range: "318–319" },
  { id: "LL", chapter: "XVII", label: "Of Fraudulent Deeds and Dispositions of Property", range: "320–323" },
  { id: "MM", chapter: "XVII", label: "Of Mischief", range: "324–328" },
  { id: "NN", chapter: "XVII", label: "Of Criminal Trespass", range: "329–334" },
  { id: "OO", chapter: "XIII", label: "Summons, Information & Oaths", range: "206–217" },
  { id: "PP", chapter: "XIII", label: "Obstruction, Threats & Public Function Contempt", range: "218–226" },
  { id: "QQ", chapter: "XIV", label: "False Evidence", range: "227–237" },
  { id: "RR", chapter: "XIV", label: "Screening Offenders & Obstructing Justice", range: "238–254" },
  { id: "SS", chapter: "XIV", label: "Public Servants & Judicial Misconduct", range: "255–261" },
  { id: "TT", chapter: "XIV", label: "Escape, Apprehension & Court Attendance", range: "262–269" },
  { id: "UU", chapter: "XV", label: "Public Nuisance & Spread of Disease", range: "270–273" },
  { id: "VV", chapter: "XV", label: "Adulteration of Food & Drugs", range: "274–278" },
  { id: "WW", chapter: "XV", label: "Public Safety Negligence", range: "279–291" },
  { id: "XX", chapter: "XV", label: "Nuisance Penalties, Obscenity & Lottery", range: "292–297" },
  { id: "BBB", chapter: "VIII", label: "Offences Relating to the Army, Navy and Air Force", range: "159–168" },
  { id: "CCC", chapter: "IX", label: "Offences Relating to Elections", range: "169–177" },
  { id: "ZZ", chapter: "XII", label: "Offences By or Relating to Public Servants", range: "198–205" },
  { id: "AAA", chapter: "XVI", label: "Offences Relating to Religion", range: "298–302" },
  { id: "DDD", chapter: "XVIII", label: "Of Documents & Forgery", range: "335–344" },
  { id: "EEE", chapter: "XVIII", label: "Of Property Marks", range: "345–350" },
  { id: "FFF", chapter: "XX", label: "Repeal and Savings", range: "358" },

  { id: "SRC-A", chapter: "SR-I", label: "Preliminary", range: "1-4" },
  { id: "SRC-B", chapter: "SR-II-1", label: "Recovering Possession of Property", range: "5-8" },
  { id: "SRC-C", chapter: "SR-II-2", label: "Enforceable & Non-Enforceable Contracts", range: "9-14A" },
  { id: "SRC-D", chapter: "SR-II-2", label: "Persons For/Against Whom Contracts May Be Enforced", range: "15-19" },
  { id: "SRC-E", chapter: "SR-II-2", label: "Substituted Performance, Compensation & Awards", range: "20-25" },
  { id: "SRC-F", chapter: "SR-II-3", label: "Rectification of Instruments", range: "26" },
  { id: "SRC-G", chapter: "SR-II-4", label: "Rescission of Contracts", range: "27-30" },
  { id: "SRC-H", chapter: "SR-II-5", label: "Cancellation of Instruments", range: "31-33" },
  { id: "SRC-I", chapter: "SR-II-6", label: "Declaratory Decrees", range: "34-35" },
  { id: "SRC-J", chapter: "SR-III-7", label: "Injunctions Generally", range: "36-37" },
  { id: "SRC-K", chapter: "SR-III-8", label: "Perpetual Injunctions", range: "38-42" },

  { id: "preliminary", chapter: "BSA-I", label: "Short Title, Application & Definitions", range: "1–2" },
  { id: "relevancy-general", chapter: "BSA-II", label: "Evidence of Facts in Issue & Relevant Facts", range: "3" },
  { id: "closely-connected-facts", chapter: "BSA-II", label: "Closely Connected & Contextual Facts", range: "4–14" },
  { id: "admissions", chapter: "BSA-II", label: "Admissions", range: "15–25" },
  { id: "statements-unavailable-witnesses", chapter: "BSA-II", label: "Statements of Persons Who Cannot Be Called as Witnesses", range: "26–27" },
  { id: "special-circumstances-statements", chapter: "BSA-II", label: "Statements Made Under Special Circumstances", range: "28–32" },
  { id: "extent-of-statement", chapter: "BSA-II", label: "Extent to Which Statements Are Evidence", range: "33" },
  { id: "judgments-relevant", chapter: "BSA-II", label: "Relevancy of Judgments", range: "34–38" },
  { id: "expert-opinions", chapter: "BSA-II", label: "Opinions of Third Persons", range: "39–45" },
  { id: "character-relevant", chapter: "BSA-II", label: "Character When Relevant", range: "46–50" },
  { id: "facts-not-required-proof", chapter: "BSA-III", label: "Facts Which Need Not Be Proved", range: "51–53" },
  { id: "oral-evidence", chapter: "BSA-IV", label: "Of Oral Evidence", range: "54–55" },
  { id: "documentary-evidence-general", chapter: "BSA-V", label: "Documentary Evidence — General Rules", range: "56–73" },
  { id: "public-documents", chapter: "BSA-V", label: "Public Documents", range: "74–77" },
  { id: "presumptions-as-to-documents", chapter: "BSA-V", label: "Presumptions as to Documents", range: "78–93" },
  { id: "exclusion-oral-by-documentary", chapter: "BSA-VI", label: "Exclusion of Oral Evidence by Documentary Evidence", range: "94–103" },
  { id: "burden-of-proof", chapter: "BSA-VII", label: "Burden of Proof — General Rules", range: "104–114" },
  { id: "presumptions-criminal-offences", chapter: "BSA-VII", label: "Presumptions in Criminal Offences", range: "115–120" },
  { id: "estoppel", chapter: "BSA-VIII", label: "Estoppel", range: "121–123" },
  { id: "witnesses", chapter: "BSA-IX", label: "Of Witnesses", range: "124–139" },
  { id: "examination-of-witnesses", chapter: "BSA-X", label: "Examination of Witnesses", range: "140–168" },
  { id: "improper-admission-rejection", chapter: "BSA-XI", label: "Improper Admission and Rejection of Evidence", range: "169" },
  { id: "repeal-and-savings", chapter: "BSA-XII", label: "Repeal and Savings", range: "170" },
];

const SECTIONS = [
  /* ---- Chapter I — Preliminary ---- */
  { id: 1, ipc: null, category: "Y", title: "Short title, commencement and application",
    text: "(1) This Act may be called the Bharatiya Nyaya Sanhita, 2023. (2) It shall come into force on such date as the Central Government may, by notification, appoint — different dates may be appointed for different provisions. (3) Every person is liable to punishment under this Sanhita, and not otherwise, for every act or omission contrary to its provisions, of which they are guilty within India. (4) A person liable under Indian law to be tried for an offence committed beyond India shall be dealt with under this Sanhita as if the act were committed within India. (5) This Sanhita also applies to any offence committed by: any citizen of India outside India; any person on an Indian-registered ship or aircraft, wherever it may be; or any person outside India who commits an offence targeting a computer resource located in India. (6) Nothing in this Sanhita affects any Act punishing mutiny or desertion by armed-forces personnel, or any special or local law.",
    explanations: ["'Offence' in this section includes every act committed outside India which, if committed in India, would be punishable under this Sanhita."],
    illustrations: ["A, a citizen of India, commits a murder in a place outside India. He can be tried and convicted of murder in any place in India in which he may be found."],
    crossRefs: [] },
  { id: 2, ipc: null, category: "Y", title: "Definitions",
    text: "This section defines 39 terms used throughout the Sanhita, unless the context otherwise requires. The most frequently relevant ones for study are individually searchable and appear as clickable definitions throughout this app (e.g. 'good faith', 'dishonestly', 'voluntarily', 'public servant', 'document'). Selected key definitions are listed below; see the Explanation panel for the full text of each.",
    explanations: [
      "(1) 'act' — a series of acts is treated as a single act.",
      "(2) 'animal' — any living creature other than a human being.",
      "(3) 'child' — any person below eighteen years of age.",
      "(4) 'counterfeit' — causing one thing to resemble another, intending or knowing it likely that deception will be practised by that resemblance.",
      "(5) 'Court' — a Judge, or body of Judges, empowered by law to act judicially.",
      "(6) 'death' — the death of a human being, unless the context indicates otherwise.",
      "(7) 'dishonestly' — doing an act intending to cause wrongful gain to one person or wrongful loss to another.",
      "(8) 'document' — any matter expressed on any substance by letters, figures, or marks, intended or usable as evidence.",
      "(9) 'fraudulently' — doing a thing with intent to defraud, and not otherwise.",
      "(10) 'gender' — 'he' and its derivatives refer to any person, male, female, or transgender (per the Transgender Persons (Protection of Rights) Act, 2019).",
      "(11) 'good faith' — nothing is done or believed in good faith if done without due care and attention.",
      "(12) 'Government' — the Central Government or a State Government.",
      "(13) 'harbour' — includes supplying shelter, food, money, arms, or transport, or otherwise helping a person evade apprehension.",
      "(14) 'injury' — any harm illegally caused to a person in body, mind, reputation, or property.",
      "(15) 'illegal' / 'legally bound to do' — 'illegal' covers anything that is an offence, prohibited by law, or grounds for a civil action; a person is 'legally bound to do' whatever it would be illegal for them to omit.",
      "(16) 'Judge' — a person officially designated as a Judge, or empowered to give a definitive (or appealable) judgment.",
      "(17) 'life' — the life of a human being, unless context indicates otherwise.",
      "(18) 'local law' — a law applicable only to a particular part of India.",
      "(19) 'man' — a male human being of any age.",
      "(20) 'month' / 'year' — reckoned by the Gregorian calendar.",
      "(21) 'movable property' — property of every description except land and things attached to the earth.",
      "(22) 'number' — singular includes plural and vice versa, unless context indicates otherwise.",
      "(23) 'oath' — includes a solemn affirmation substituted by law for an oath.",
      "(24) 'offence' — generally, an act made punishable by this Sanhita, with specific listed exceptions (e.g. Chapter III) where it also covers acts punishable under a special or local law.",
      "(25) 'omission' — a series of omissions is treated as a single omission.",
      "(26) 'person' — includes any company, association, or body of persons, whether incorporated or not.",
      "(27) 'public' — includes any class of the public, or any community.",
      "(28) 'public servant' — a detailed, specifically defined list: commissioned armed-forces officers, judges, government officers investigating offences or handling government property/documents, election officials, arbitrators, and anyone in government service or pay for a public duty, among others.",
      "(29) 'reason to believe' — a person has 'reason to believe' a thing if they have sufficient cause to believe it, and not otherwise.",
      "(30) 'special law' — a law applicable to a particular subject.",
      "(31) 'valuable security' — a document by which a legal right is created, transferred, restricted, extinguished, or released, or a legal liability acknowledged.",
      "(32) 'vessel' — anything made for conveying people or property by water.",
      "(33) 'voluntarily' — causing an effect by means intended to cause it, or means known/believed likely to cause it.",
      "(34) 'will' — any testamentary document.",
      "(35) 'woman' — a female human being of any age.",
      "(36) 'wrongful gain' — gain, by unlawful means, of property the gainer isn't legally entitled to.",
      "(37) 'wrongful loss' — loss, by unlawful means, of property the loser is legally entitled to.",
      "(38) 'gaining/losing wrongfully' — covers both wrongful retention/being kept out of property, and wrongful acquisition/deprivation.",
      "(39) Undefined terms also used in the IT Act, 2000 or the BNSS, 2023 carry the meanings assigned there."
    ],
    illustrations: [], crossRefs: [] },
  { id: 3, ipc: null, category: "Y", title: "General explanations",
    text: "(1) Every offence definition, penal provision, and illustration in this Sanhita is understood subject to the General Exceptions (Chapter III), even where those exceptions aren't repeated. (2) A term explained in one Part of the Sanhita carries that meaning throughout. (3) Property in the possession of a person's spouse, clerk, or servant, on that person's account, is in that person's possession. (4) References to 'acts done' extend to illegal omissions too, unless context indicates otherwise. (5) When a criminal act is done by several people in furtherance of a common intention, each is liable as if they alone had done it. (6) When an act is criminal only because of a particular knowledge or intention, each person who joins in it with that knowledge/intention is liable as if they alone had done it. (7) Causing an effect partly by act and partly by omission is treated the same as causing it wholly by act or wholly by omission. (8) When an offence is committed by several acts, anyone who intentionally co-operates by doing any one of those acts is guilty of the offence. (9) Several people engaged in one criminal act may still be guilty of different offences by means of that act.",
    illustrations: [
      "A police officer, without a warrant, apprehends Z, who has committed murder. The officer commits no wrongful confinement, since he was legally bound to apprehend Z — this falls within the General Exceptions even though not repeated in the wrongful-confinement provision.",
      "A attacks Z under such grave and sudden provocation that his act would be only culpable homicide. B, bearing separate ill-will and not provoked, assists A in killing Z. B is guilty of murder; A is guilty only of culpable homicide — though both were engaged in the same act."
    ], crossRefs: [] },

  /* ---- Chapter II — Of Punishments ---- */
  { id: 4, ipc: 53, category: "Z", title: "Punishments",
    text: "The punishments to which offenders are liable under this Sanhita are: (1) Death; (2) Imprisonment for life, meaning imprisonment for the remainder of the person's natural life; (3) Imprisonment — of two kinds: (a) Rigorous, i.e. with hard labour; (b) Simple; (4) Forfeiture of property; (5) Fine; (6) Community Service.",
    ingredients: ["Six categories exist: death, life imprisonment, imprisonment (rigorous or simple), forfeiture of property, fine, and community service (newly introduced by the BNS, not present in the IPC)"],
    illustrations: [], crossRefs: [] },
  { id: 5, ipc: null, category: "Z", title: "Commutation of sentence",
    text: "The appropriate Government may, without the offender's consent, commute any punishment under this Sanhita to any other punishment, in accordance with Section 474 of the Bharatiya Nagarik Suraksha Sanhita, 2023.",
    explanations: ["'Appropriate Government' means the Central Government, where the sentence is death or concerns a matter under Union executive power; otherwise, the State Government of the State where the offender is sentenced."],
    illustrations: [], crossRefs: [] },
  { id: 6, ipc: 57, category: "Z", title: "Fractions of terms of punishment",
    text: "In calculating fractions of terms of punishment, imprisonment for life is reckoned as equivalent to imprisonment for twenty years, unless otherwise provided.",
    illustrations: [], crossRefs: [] },
  { id: 7, ipc: 60, category: "Z", title: "Sentence may be (in certain cases of imprisonment) wholly or partly rigorous or simple",
    text: "Where an offender is punishable with imprisonment that may be of either description, the sentencing Court may direct that the imprisonment be wholly rigorous, wholly simple, or partly rigorous and partly simple.",
    illustrations: [], crossRefs: [] },
  { id: 8, ipc: 63, category: "Z", title: "Amount of fine, liability in default of payment of fine, etc.",
    text: "(1) Where no upper limit is stated for a fine, the amount is unlimited but must not be excessive. (2) Where an offender is sentenced to a fine, the Court may direct that, in default of payment, the offender suffers imprisonment in addition to any other sentence. (3) Default imprisonment must not exceed one-fourth of the maximum imprisonment term fixed for the offence, where the offence carries both imprisonment and fine. (4) Default imprisonment may be of any description available for the offence. (5) Where the offence carries only a fine or community service, default imprisonment is simple, capped at two months (fines up to ₹5,000), four months (fines up to ₹10,000), or one year (any other case). (6) Default imprisonment ends once the fine is paid or levied, or proportionally if part-paid. (7) The fine may be levied within six years of sentencing (or the full sentence period, if longer) — the offender's death does not discharge property that remains legally liable for their debts.",
    illustrations: ["A is fined ₹1,000 with four months' imprisonment in default. If ₹750 is paid before one month of imprisonment has passed, A is discharged as soon as that month ends. If ₹500 is paid before two months have passed, A is discharged once those two months are completed."],
    crossRefs: [] },
  { id: 9, ipc: 71, category: "Z", title: "Limit of punishment of offence made up of several offences",
    text: "(1) Where an offence is made up of parts, each of which is itself an offence, the offender is not punished for more than one of those offences, unless expressly provided otherwise. (2) Where an act falls within two or more separate legal definitions, or where several acts (each potentially an offence alone) combine into a different offence, the offender is not punished more severely than the Court could award for any single one of those offences.",
    illustrations: [
      "A gives Z fifty strokes with a stick. Though each blow could be a separate act of causing hurt, A is liable to only one punishment for the whole beating, not fifty.",
      "While A is beating Z, Y interferes, and A intentionally strikes Y too. Since the blow to Y is no part of the act against Z, A is liable to separate punishments — one for each victim."
    ], crossRefs: [] },
  { id: 10, ipc: 72, category: "Z", title: "Punishment of person guilty of one of several offences, judgment stating that it is doubtful of which",
    text: "Where a judgment finds a person guilty of one of several specified offences, but it is doubtful which, the offender is punished for the offence carrying the lowest punishment, if the offences don't all carry the same punishment.",
    illustrations: [], crossRefs: [] },
  { id: 11, ipc: 73, category: "Z", title: "Solitary confinement",
    text: "Where a Court has power to sentence an offender to rigorous imprisonment, it may order solitary confinement for part of that sentence, up to three months total, on this scale: up to one month, if the total term doesn't exceed six months; up to two months, if the term exceeds six months but not one year; up to three months, if the term exceeds one year.",
    illustrations: [], crossRefs: [12] },
  { id: 12, ipc: 74, category: "Z", title: "Limit of solitary confinement",
    text: "Solitary confinement must never exceed fourteen days at a time, with intervals between periods of at least equal length. Where the total imprisonment exceeds three months, solitary confinement must not exceed seven days in any one month of the sentence, again with intervals of at least equal length.",
    illustrations: [], crossRefs: [11] },
  { id: 13, ipc: 75, category: "Z", title: "Enhanced punishment for certain offences after previous conviction",
    text: "Whoever, having already been convicted in India of an offence under Chapter X or Chapter XVII of this Sanhita, punishable with three or more years' imprisonment, is subsequently convicted of any offence under either of those Chapters carrying the same term, is liable for every such subsequent offence to imprisonment for life, or imprisonment up to ten years.",
    illustrations: [], crossRefs: [] },

  /* ---- Chapter III — General Exceptions ---- */
  { id: 14, ipc: 76, category: "A", title: "Act done by a person bound, or by mistake of fact believing himself bound, by law",
    text: "Nothing is an offence which is done by a person who is, or who by reason of a mistake of fact and not by reason of a mistake of law in good faith believes himself to be, bound by law to do it.",
    illustrations: [
      "A, a soldier, fires on a mob by the order of his superior officer, in conformity with the commands of the law. A has committed no offence.",
      "A, an officer of a Court, being ordered by that Court to arrest Y, and after due enquiry, believing Z to be Y, arrests Z. A has committed no offence."
    ], crossRefs: [] },
  { id: 15, ipc: 77, category: "A", title: "Act of Judge when acting judicially",
    text: "Nothing is an offence which is done by a Judge when acting judicially in the exercise of any power which is, or which in good faith he believes to be, given to him by law.",
    illustrations: [], crossRefs: [] },
  { id: 16, ipc: 78, category: "A", title: "Act done pursuant to the judgment or order of Court",
    text: "Nothing which is done in pursuance of, or which is warranted by the judgment or order of, a Court, if done whilst such judgment or order remains in force, is an offence — notwithstanding the Court may have had no jurisdiction to pass it — provided the person doing the act in good faith believes the Court had such jurisdiction.",
    illustrations: [], crossRefs: [] },
  { id: 17, ipc: 79, category: "A", title: "Act done by a person justified, or by mistake of fact believing himself justified, by law",
    text: "Nothing is an offence which is done by any person who is justified by law, or who by reason of a mistake of fact and not by reason of a mistake of law in good faith believes himself to be justified by law, in doing it.",
    illustrations: [
      "A sees Z commit what appears to A to be a murder. A, in the exercise, to the best of his judgment exerted in good faith, of the power the law gives to all persons to apprehend murderers, seizes Z to bring him before the proper authorities. A has committed no offence, though it may turn out Z was acting in self-defence."
    ], crossRefs: [] },
  { id: 18, ipc: 80, category: "B", title: "Accident in doing a lawful act",
    text: "Nothing is an offence which is done by accident or misfortune, and without any criminal intention or knowledge, in the doing of a lawful act in a lawful manner by lawful means and with proper care and caution.",
    illustrations: ["A is at work with a hatchet; the head flies off and kills a man standing by. If there was no want of proper caution on A's part, his act is excusable and not an offence."],
    ingredients: ["The act was done by accident or misfortune", "No criminal intention or knowledge of causing harm", "The underlying act itself was lawful", "It was done in a lawful manner, by lawful means", "Proper care and caution were exercised"],
    crossRefs: [] },
  { id: 19, ipc: 81, category: "B", title: "Act likely to cause harm, but done without criminal intent, and to prevent other harm",
    text: "Nothing is an offence merely by reason of its being done with the knowledge that it is likely to cause harm, if it be done without any criminal intention to cause harm, and in good faith for the purpose of preventing or avoiding other harm to person or property.",
    explanations: ["It is a question of fact whether the harm to be prevented was of such a nature and so imminent as to justify or excuse the risk of doing the act with the knowledge that it was likely to cause harm."],
    illustrations: [
      "A, the captain of a vessel, must inevitably run down a boat B carrying twenty or thirty passengers unless he changes course — but changing course risks running down a smaller boat C carrying two. If A alters course without intending to run down C, and in good faith to avoid danger to B's passengers, he is not guilty even if he runs down C.",
      "A, in a great fire, pulls down houses to stop it spreading, in good faith intending to save life or property. If the harm prevented was serious and imminent enough to justify it, A is not guilty."
    ], crossRefs: [] },
  { id: 20, ipc: 82, category: "C", title: "Act of a child under seven years of age",
    text: "Nothing is an offence which is done by a child under seven years of age.",
    ingredients: ["The accused is a child", "The child was under seven years of age at the time of the act"],
    illustrations: [], crossRefs: [] },
  { id: 21, ipc: 83, category: "C", title: "Act of a child above seven and under twelve of immature understanding",
    text: "Nothing is an offence which is done by a child above seven years of age and under twelve, who has not attained sufficient maturity of understanding to judge the nature and consequences of his conduct on that occasion.",
    illustrations: [], crossRefs: [] },
  { id: 22, ipc: 84, category: "C", title: "Act of a person of unsound mind",
    text: "Nothing is an offence which is done by a person who, at the time of doing it, by reason of mental illness, is incapable of knowing the nature of the act, or that he is doing what is either wrong or contrary to law.",
    ingredients: ["The accused had a mental illness (legal, not merely medical, insanity)", "This existed at the time of doing the act", "It made him incapable of knowing the nature of the act, OR incapable of knowing it was wrong or contrary to law"],
    illustrations: [], crossRefs: [],
    cases: [{ name: "Surendra Mishra v. State of Jharkhand", cite: "(2011) 11 SCC 495", year: 2011,
      ratio: "The Supreme Court held this section protects legal insanity, not medical insanity — every person with a mental disease is not automatically exempt. The accused must prove unsoundness of mind on a preponderance of probabilities, not beyond reasonable doubt.",
      url: "https://indiankanoon.org/doc/1259566/" }] },
  { id: 23, ipc: 85, category: "D", title: "Act of a person incapable of judgment by reason of intoxication caused against his will",
    text: "Nothing is an offence which is done by a person who, at the time of doing it, is by reason of intoxication incapable of knowing the nature of the act, or that he is doing what is either wrong or contrary to law — provided the thing which intoxicated him was administered without his knowledge or against his will.",
    illustrations: [], crossRefs: [] },
  { id: 24, ipc: 86, category: "D", title: "Offence requiring a particular intent or knowledge committed by one who is intoxicated",
    text: "Where an act is not an offence unless done with a particular knowledge or intent, a person who does the act while intoxicated is liable to be dealt with as if he had the same knowledge he would have had if not intoxicated — unless the thing that intoxicated him was administered without his knowledge or against his will.",
    illustrations: [], crossRefs: [] },
  { id: 25, ipc: 87, category: "E", title: "Act not intended and not known to be likely to cause death or grievous hurt, done by consent",
    text: "Nothing not intended to cause death or grievous hurt, and not known by the doer to be likely to do so, is an offence by reason of any harm it may cause to any person above eighteen who has given consent, express or implied, to suffer that harm or take the risk of it.",
    illustrations: ["A and Z agree to fence with each other for amusement. This implies consent of each to suffer any harm which, in the course of fair play, may be caused; if A, playing fairly, hurts Z, A commits no offence."],
    crossRefs: [] },
  { id: 26, ipc: 88, category: "E", title: "Act not intended to cause death, done by consent in good faith for person's benefit",
    text: "Nothing not intended to cause death is an offence by reason of any harm it may cause to a person for whose benefit it is done in good faith, who has consented, express or implied, to suffer that harm or take the risk of it.",
    illustrations: ["A, a surgeon, knowing an operation is likely to cause Z's death but not intending it, and acting in good faith for Z's benefit, performs the operation with Z's consent. A commits no offence."],
    crossRefs: [] },
  { id: 27, ipc: 89, category: "E", title: "Act done in good faith for benefit of child or person with unsound mind, by or with consent of guardian",
    text: "Nothing done in good faith for the benefit of a person under twelve, or a person with mental illness, by or with the consent of their guardian, is an offence by reason of any harm it may cause to that person.",
    provisos: [
      "the intentional causing of death, or the attempting to cause death;",
      "doing anything known to be likely to cause death, for any purpose other than preventing death or grievous hurt, or curing a grievous disease or infirmity;",
      "the voluntary causing of grievous hurt, or attempting it, unless to prevent death or grievous hurt, or to cure a grievous disease or infirmity;",
      "the abetment of any offence to which this exception would not otherwise extend."
    ],
    illustrations: ["A, in good faith, for his child's benefit and without the child's consent, has the child operated on by a surgeon knowing the operation may cause death but not intending it. A is within the exception, as his object was the child's cure."],
    crossRefs: [] },
  { id: 28, ipc: 90, category: "E", title: "Consent known to be given under fear or misconception",
    text: "A consent is not such a consent as is intended by any section of this Sanhita — (a) if given under fear of injury or a misconception of fact, and the person doing the act knows or has reason to believe this; or (b) if given by a person who, from mental illness or intoxication, cannot understand the nature and consequence of what they consent to; or (c) unless the context shows otherwise, if given by a person under twelve years of age.",
    illustrations: [], crossRefs: [] },
  { id: 29, ipc: 91, category: "E", title: "Exclusion of acts which are offences independently of harm caused",
    text: "The exceptions in sections 21, 22 and 23 do not extend to acts which are offences independently of any harm they may cause, or be intended or known to be likely to cause, to the person giving the consent.",
    illustrations: ["Causing miscarriage (unless in good faith to save the woman's life) is an offence independently of any harm it may cause. It is therefore not an offence 'by reason of such harm', so the woman's or guardian's consent does not justify the act."],
    crossRefs: [21, 22, 23] },
  { id: 30, ipc: 92, category: "E", title: "Act done in good faith for benefit of a person without consent",
    text: "Nothing is an offence by reason of any harm it may cause to a person for whose benefit it is done in good faith, even without that person's consent, if it is impossible for them to signify consent, or if they are incapable of consenting and have no guardian from whom consent could be obtained in time.",
    provisos: [
      "the intentional causing of death, or attempting to cause death;",
      "doing anything known to be likely to cause death, for any purpose other than preventing death or grievous hurt, or curing a grievous disease or infirmity;",
      "the voluntary causing of hurt, or attempting it, for any purpose other than preventing death or hurt;",
      "the abetment of any offence to which this exception would not otherwise extend."
    ],
    explanations: ["Mere pecuniary benefit is not \u2018benefit\u2019 within the meaning of this exception."],
    illustrations: [
      "Z is thrown from his horse and left insensible. A, a surgeon, finds Z requires trepanning. Not intending death but acting in good faith for Z's benefit, A operates before Z can consent. A commits no offence.",
      "A is in a burning house with Z, a child. People below hold out a blanket. A drops the child, knowing the fall may kill it but not intending to, and in good faith intending the child's benefit. Even if the child dies, A commits no offence."
    ], crossRefs: [] },
  { id: 31, ipc: 93, category: "E", title: "Communication made in good faith",
    text: "No communication made in good faith is an offence by reason of any harm to the person to whom it is made, if it is made for that person's benefit.",
    illustrations: ["A, a surgeon, in good faith, tells a patient he cannot live. The patient dies from the shock. A commits no offence, though he knew the communication might cause this."],
    crossRefs: [] },
  { id: 32, ipc: 94, category: "F", title: "Act to which a person is compelled by threats",
    text: "Except murder, and offences against the State punishable with death, nothing is an offence which is done by a person compelled to do it by threats which, at the time, reasonably cause the apprehension that instant death to that person will otherwise follow.",
    provisos: ["the person doing the act did not, of their own accord, or from reasonable apprehension of harm short of instant death, place themselves in the situation that led to the constraint."],
    explanations: [
      "A person who, of their own accord or by threat of being beaten, joins a gang of dacoits knowing their character, cannot claim this exception on the ground of having been compelled by associates to commit an offence.",
      "A person seized by a gang of dacoits and forced, under threat of instant death, to do an act that is an offence — e.g., a smith compelled to force open a door for the dacoits to plunder — is entitled to this exception."
    ], illustrations: [], crossRefs: [] },
  { id: 33, ipc: 95, category: "F", title: "Act causing slight harm",
    text: "Nothing is an offence by reason that it causes, or is intended or known to be likely to cause, any harm, if that harm is so slight that no person of ordinary sense and temper would complain of it.",
    illustrations: [], crossRefs: [] },
  { id: 34, ipc: 96, category: "G", title: "Things done in private defence",
    text: "Nothing is an offence which is done in the exercise of the right of private defence.", illustrations: [], crossRefs: [] },
  { id: 35, ipc: 97, category: "G", title: "Right of private defence of the body and of property",
    text: "Every person has a right, subject to the restrictions in section 37, to defend — (1) his own body, and the body of any other person, against any offence affecting the human body; (2) the property, movable or immovable, of himself or any other person, against theft, robbery, mischief or criminal trespass, or an attempt to commit any of these.",
    ingredients: ["There must be an offence (actual or attempted) affecting the body or property", "The defence must be exercised against that offence", "Subject at all times to the restrictions in Section 37 (no more harm than necessary; not against a public servant acting lawfully; not where time exists to seek public authorities)"],
    illustrations: [], crossRefs: [37],
    cases: [{ name: "Darshan Singh v. State of Punjab", cite: "AIR 2010 SC 1212", year: 2010,
      ratio: "The Supreme Court laid down guidelines on the right of private defence, holding it is available to every citizen and should not require a person facing an imminent attack to behave like a coward.",
      url: "https://indiankanoon.org/doc/1748156/" }] },
  { id: 36, ipc: 98, category: "G", title: "Right of private defence against the act of a person with unsound mind, etc.",
    text: "When an act which would otherwise be a certain offence is not that offence, by reason of the youth, immaturity, mental illness or intoxication of the doer, or a misconception on their part, every person has the same right of private defence against that act as if it were that offence.",
    illustrations: [
      "Z, under the influence of mental illness, attempts to kill A. Z commits no offence, but A has the same right of private defence as if Z were sane.",
      "A enters at night a house he is legally entitled to enter. Z, mistaking A for a house-breaker, attacks him in good faith. Z commits no offence, but A still has the same right of private defence against Z."
    ], crossRefs: [] },
  { id: 37, ipc: 99, category: "G", title: "Acts against which there is no right of private defence",
    text: "There is no right of private defence against an act not reasonably causing apprehension of death or grievous hurt, done (or attempted) by a public servant acting in good faith under colour of office, or under such a public servant's direction — even if not strictly justifiable by law — nor in cases where there is time to seek the protection of the public authorities. The right never extends to inflicting more harm than is necessary for the purpose of defence.",
    explanations: [
      "A person is not deprived of the right of private defence against a public servant's act unless they know or have reason to believe the person is such a public servant.",
      "A person is not deprived of the right against an act done by the direction of a public servant unless they know or have reason to believe this, or the authority is not produced when demanded."
    ], illustrations: [], crossRefs: [] },
  { id: 38, ipc: 100, category: "G", title: "When the right of private defence of the body extends to causing death",
    text: "The right of private defence of the body extends, under the restrictions in section 37, to voluntarily causing death or any other harm to the assailant, if the offence is: an assault reasonably causing apprehension of death or of grievous hurt; an assault with intent to commit rape, or to gratify unnatural lust, or to kidnap or abduct; an assault intending wrongful confinement under circumstances giving no recourse to public authorities; or throwing or attempting to throw acid causing reasonable apprehension of grievous hurt.",
    ingredients: ["The assault falls within one of the specified grave categories (death/grievous hurt, rape, unnatural lust, kidnap/abduction, certain confinement, or acid attack)", "The apprehension of harm was reasonable, judged from the defender's position", "The response stayed within the Section 37 restrictions on proportionality"],
    illustrations: [], crossRefs: [37],
    cases: [{ name: "Darshan Singh v. State of Punjab", cite: "AIR 2010 SC 1212", year: 2010,
      ratio: "The Court held the right of private defence can extend to causing death where the accused's response was proportionate to a real and imminent threat of death or grievous hurt.",
      url: "https://indiankanoon.org/doc/1748156/" }] },
  { id: 39, ipc: 101, category: "G", title: "When such right extends to causing any harm other than death",
    text: "If the offence is not of a description specified in section 38, the right of private defence of the body does not extend to voluntarily causing death to the assailant, but does extend, under the restrictions in section 37, to voluntarily causing any harm other than death.",
    illustrations: [], crossRefs: [37, 38] },
  { id: 40, ipc: 102, category: "G", title: "Commencement and continuance of the right of private defence of the body",
    text: "The right of private defence of the body commences as soon as a reasonable apprehension of danger arises from an attempt or threat to commit the offence, though the offence may not yet have been committed, and continues as long as that apprehension continues.",
    illustrations: [], crossRefs: [] },
  { id: 41, ipc: 103, category: "G", title: "When the right of private defence of property extends to causing death",
    text: "The right of private defence of property extends, under the restrictions in section 37, to voluntarily causing death or any other harm to the wrong-doer, if the offence is: robbery; house-breaking after sunset and before sunrise; mischief by fire or explosive substance on a dwelling or place used for custody of property; or theft, mischief or house-trespass under circumstances reasonably causing apprehension that death or grievous hurt will follow if the right is not exercised.",
    illustrations: [], crossRefs: [37] },
  { id: 42, ipc: 104, category: "G", title: "When such right extends to causing any harm other than death",
    text: "If the offence is theft, mischief or criminal trespass not of the descriptions in section 41, the right does not extend to voluntarily causing death, but does extend, subject to the restrictions in section 37, to voluntarily causing the wrong-doer any harm other than death.",
    illustrations: [], crossRefs: [41, 37] },
  { id: 43, ipc: 105, category: "G", title: "Commencement and continuance of the right of private defence of property",
    text: "The right of private defence of property commences when a reasonable apprehension of danger to the property arises; against theft, continues till the offender effects retreat with the property or public assistance is obtained or the property is recovered; against robbery, continues as long as the offender causes or attempts death, hurt or wrongful restraint, or the fear of these continues; against criminal trespass or mischief, continues as long as it is being committed; against house-breaking after sunset and before sunrise, continues as long as the house-trespass thereby begun continues.",
    illustrations: [], crossRefs: [] },
  { id: 44, ipc: 106, category: "G", title: "Right of private defence against deadly assault when there is risk of harm to innocent person",
    text: "If, in exercising the right of private defence against an assault reasonably causing apprehension of death, the defender cannot effectually exercise that right without risk of harm to an innocent person, the right of private defence extends to running that risk.",
    illustrations: ["A is attacked by a mob attempting to murder him. He cannot exercise his right of private defence without firing on the mob, and cannot fire without risk of harming young children mixed in with it. A commits no offence if, by firing, he harms any of the children."],
    crossRefs: [] },

  /* ---- Chapter IV — Of Abetment, Criminal Conspiracy and Attempt ---- */
  { id: 45, ipc: 107, category: "H", title: "Abetment of a thing",
    text: "A person abets the doing of a thing, who: (1) instigates any person to do that thing; or (2) engages with one or more other persons in any conspiracy for the doing of that thing, if an act or illegal omission takes place in pursuance of that conspiracy and in order to the doing of that thing; or (3) intentionally aids, by any act or illegal omission, the doing of that thing.",
    explanations: [
      "A person who, by wilful misrepresentation or wilful concealment of a material fact which he is bound to disclose, voluntarily causes or procures a thing to be done, is said to instigate the doing of that thing.",
      "Whoever, prior to or at the time of the commission of an act, does anything to facilitate its commission, and thereby facilitates it, is said to aid the doing of that act."
    ],
    illustrations: ["A, a public officer, is authorised by a warrant to apprehend Z. B, knowing this and that C is not Z, wilfully represents to A that C is Z, thereby intentionally causing A to apprehend C. B abets by instigation the apprehension of C."],
    ingredients: ["Instigating any person to do a thing, OR", "Engaging in a conspiracy for doing it, with an act or illegal omission done in pursuance of that conspiracy, OR", "Intentionally aiding the doing of it, by act or illegal omission"],
    crossRefs: [],
    cases: [{ name: "Ramesh Kumar v. State of Chhattisgarh", cite: "(2001) 9 SCC 618", year: 2001,
      ratio: "The Supreme Court held that instigation means to goad, urge, provoke, incite or encourage the doing of an act, with a reasonable certainty to incite the consequence; mere words uttered in anger or emotion, without intending the consequence, do not amount to instigation.",
      url: "https://indiankanoon.org/doc/229273/" }] },
  { id: 46, ipc: 108, category: "H", title: "Abettor",
    text: "A person abets an offence, who abets either the commission of an offence, or the commission of an act which would be an offence if committed by a person capable by law of committing an offence, with the same intention or knowledge as that of the abettor.",
    explanations: [
      "The abetment of the illegal omission of an act may amount to an offence although the abettor may not himself be bound to do that act.",
      "To constitute abetment it is not necessary that the act abetted actually be committed, or that the effect requisite to constitute the offence be caused.",
      "It is not necessary that the person abetted be capable by law of committing an offence, or share the abettor's guilty intention or knowledge, or have any guilty intention or knowledge at all.",
      "The abetment of an offence being itself an offence, the abetment of such an abetment is also an offence.",
      "It is not necessary to abetment by conspiracy that the abettor concert the offence with the person who commits it — it is enough that he engages in the conspiracy in pursuance of which the offence is committed."
    ],
    illustrations: [
      "A instigates B to murder C. B refuses. A is still guilty of abetting B to commit murder.",
      "A, with the intention of murdering Z, instigates B, a child under seven, to do an act causing Z's death. B does the act in A's absence. Though B was not capable by law of committing an offence, A is liable as if he had committed murder himself.",
      "A instigates B to instigate C to murder Z. B instigates C, and C commits the murder in consequence. Both B and A are liable to the punishment for murder."
    ], crossRefs: [] },
  { id: 47, ipc: "108A", category: "H", title: "Abetment in India of offences outside India",
    text: "A person abets an offence within the meaning of this Sanhita who, in India, abets the commission of any act without and beyond India which would constitute an offence if committed in India.",
    illustrations: ["A, in India, instigates B, a foreigner in country X, to commit a murder in that country. A is guilty of abetting murder."],
    crossRefs: [] },
  { id: 48, ipc: null, category: "H", title: "Abetment outside India for offence in India",
    text: "A person abets an offence within the meaning of this Sanhita who, without and beyond India, abets the commission of any act in India which would constitute an offence if committed in India.",
    illustrations: ["A, in country X, instigates B to commit a murder in India. A is guilty of abetting murder."],
    crossRefs: [] },
  { id: 49, ipc: 109, category: "I", title: "Punishment of abetment if the act abetted is committed in consequence and no express provision is made for its punishment",
    text: "Whoever abets any offence shall, if the act abetted is committed in consequence of the abetment, and no express provision is made by this Sanhita for the punishment of such abetment, be punished with the punishment provided for the offence.",
    explanations: ["An act or offence is said to be committed in consequence of abetment when it is committed in consequence of the instigation, or in pursuance of the conspiracy, or with the aid which constitutes the abetment."],
    illustrations: ["A and B conspire to poison Z. A procures the poison and delivers it to B, who administers it to Z in A's absence, causing Z's death. B is guilty of murder; A is guilty of abetting that murder by conspiracy, and liable to the same punishment."],
    crossRefs: [] },
  { id: 50, ipc: 110, category: "I", title: "Punishment of abetment if person abetted does act with different intention from that of abettor",
    text: "Whoever abets the commission of an offence shall, if the person abetted does the act with a different intention or knowledge from that of the abettor, be punished with the punishment provided for the offence which would have been committed if the act had been done with the intention or knowledge of the abettor and no other.",
    illustrations: [], crossRefs: [] },
  { id: 51, ipc: 111, category: "I", title: "Liability of abettor when one act abetted and different act done",
    text: "When an act is abetted and a different act is done, the abettor is liable for the act done in the same manner as if he had directly abetted it — provided the act done was a probable consequence of the abetment, and was committed under the influence of the instigation, or with the aid or in pursuance of the conspiracy which constituted the abetment.",
    illustrations: [
      "A instigates B and C to break into a house at midnight for robbery and gives them arms. Resisted by Z, an inmate, they murder Z. If the murder was a probable consequence of the abetment, A is liable to the punishment for murder.",
      "A instigates B to burn Z's house; B sets fire to it and also commits theft there. A is guilty of abetting the burning, but not the theft, since the theft was a distinct act, not a probable consequence."
    ], crossRefs: [] },
  { id: 52, ipc: 112, category: "I", title: "Abettor when liable to cumulative punishment for act abetted and for act done",
    text: "If the act for which the abettor is liable under section 51 is committed in addition to the act abetted, and constitutes a distinct offence, the abettor is liable to punishment for each of the offences.",
    illustrations: ["A instigates B to resist by force a distress made by a public servant. B resists, and in doing so voluntarily causes grievous hurt to the officer. B is liable for both resisting the distress and causing grievous hurt; if A knew grievous hurt was likely, A is liable for both offences too."],
    crossRefs: [51] },
  { id: 53, ipc: 113, category: "I", title: "Liability of abettor for an effect caused by the act abetted different from that intended by the abettor",
    text: "When an act is abetted with the intention of causing a particular effect, and the act for which the abettor is liable causes a different effect from that intended, the abettor is liable for the effect actually caused in the same manner as if he had abetted the act intending that effect — provided he knew the act abetted was likely to cause it.",
    illustrations: ["A instigates B to cause grievous hurt to Z. B causes grievous hurt, and Z dies of it. If A knew the grievous hurt abetted was likely to cause death, A is liable to the punishment for murder."],
    crossRefs: [] },
  { id: 54, ipc: 114, category: "I", title: "Abettor present when offence is committed",
    text: "Whenever a person who, if absent, would be liable to be punished as an abettor is present when the act or offence for which he would be so punishable is committed, he shall be deemed to have committed such act or offence.",
    illustrations: [], crossRefs: [] },
  { id: 55, ipc: 115, category: "J", title: "Abetment of offence punishable with death or imprisonment for life",
    text: "(1) Whoever abets the commission of an offence punishable with death or imprisonment for life shall, if that offence is not committed in consequence of the abetment, and no express provision is made under this Sanhita for the punishment of such abetment, be punished with imprisonment of either description up to seven years, and shall also be liable to fine. (2) If any act for which the abettor is liable in consequence of the abetment, and which causes hurt to any person, is done, the abettor shall be liable to imprisonment up to fourteen years, and shall also be liable to fine.",
    illustrations: ["A instigates B to murder Z. The offence is not committed. A is liable to imprisonment up to seven years and a fine; if any hurt is caused to Z in consequence of the abetment, A is liable to imprisonment up to fourteen years and a fine."],
    crossRefs: [] },
  { id: 56, ipc: 116, category: "J", title: "Abetment of offence punishable with imprisonment",
    text: "(1) Whoever abets an offence punishable with imprisonment shall, if that offence is not committed in consequence of the abetment, and no express provision is made by this Sanhita for the punishment of such abetment, be punished with imprisonment up to one-fourth of the longest term provided for that offence, or with such fine as is provided for that offence, or with both. (2) If the abettor or the person abetted is a public servant whose duty it is to prevent the offence, the abettor shall be punished with imprisonment up to one-half of the longest term provided for that offence, or with such fine, or with both.",
    illustrations: ["A, a police officer whose duty it is to prevent robbery, abets the commission of robbery. Though the robbery is not committed, A is liable to one-half of the longest term of imprisonment provided for robbery, and also to fine."],
    crossRefs: [] },
  { id: 57, ipc: 117, category: "J", title: "Abetting commission of offence by the public or by more than ten persons",
    text: "Whoever abets the commission of an offence by the public generally, or by any number or class of persons exceeding ten, shall be punished with imprisonment of either description for a term which may extend to seven years and with fine.",
    illustrations: ["A affixes in a public place a placard instigating a sect of more than ten members to attack members of an adverse sect during a procession. A has committed the offence defined in this section."],
    crossRefs: [] },
  { id: 58, ipc: 118, category: "J", title: "Concealing design to commit offence punishable with death or imprisonment for life",
    text: "Whoever, intending to facilitate or knowing it likely that he will thereby facilitate the commission of an offence punishable with death or imprisonment for life, voluntarily conceals — by act, illegal omission, or use of encryption or any information-hiding tool — the existence of a design to commit such offence, or makes a representation he knows to be false about that design, shall (1) if the offence is committed, be punished with imprisonment up to seven years; or (2) if the offence is not committed, with imprisonment up to three years, and shall also be liable to fine.",
    illustrations: ["A, knowing that a dacoity is about to be committed at B, falsely informs the Magistrate it will occur at C, misleading him with intent to facilitate the offence. The dacoity is committed at B. A is punishable under this section."],
    crossRefs: [] },
  { id: 59, ipc: 119, category: "J", title: "Public servant concealing design to commit offence which it is his duty to prevent",
    text: "Whoever, being a public servant, intending to facilitate or knowing it likely that he will thereby facilitate the commission of an offence which it is his duty to prevent, voluntarily conceals — by act, illegal omission, or use of encryption or any information-hiding tool — the existence of a design to commit it, or makes a false representation about it, shall be punished on a graded scale depending on whether the offence is committed, and the severity of the offence concealed.",
    illustrations: ["A, a police officer legally bound to report designs to commit robbery, knows B designs to commit robbery but omits to report it, intending to facilitate the offence. A is liable under this section."],
    crossRefs: [] },
  { id: 60, ipc: 120, category: "J", title: "Concealing design to commit offence punishable with imprisonment",
    text: "Whoever, intending to facilitate or knowing it likely that he will thereby facilitate the commission of an offence punishable with imprisonment, voluntarily conceals, by act or illegal omission, the existence of a design to commit it, or makes a false representation about it, shall be punished with imprisonment up to one-fourth of the longest term provided for the offence if it is committed, or up to one-eighth if it is not, or with fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 61, ipc: "120A/120B", category: "K", title: "Criminal conspiracy",
    text: "When two or more persons agree to do, or cause to be done — (a) an illegal act; or (b) an act which is not illegal, by illegal means — such an agreement is designated a criminal conspiracy: Provided that no agreement except an agreement to commit an offence shall amount to a criminal conspiracy unless some act besides the agreement is done by one or more parties in pursuance thereof. Whoever is a party to a criminal conspiracy to commit an offence punishable with death, imprisonment for life, or rigorous imprisonment for two years or upwards shall, where no express provision is made for the punishment of such a conspiracy, be punished as if he had abetted such offence; any other criminal conspiracy is punishable with imprisonment up to six months, or fine, or both.",
    explanations: ["It is immaterial whether the illegal act is the ultimate object of the agreement, or merely incidental to it."],
    ingredients: ["An agreement between two or more persons", "The agreement is to do an illegal act, or a legal act by illegal means", "For conspiracies other than to commit an offence, some overt act beyond the agreement itself, done by a party in pursuance of it"],
    illustrations: [], crossRefs: [],
    cases: [{ name: "State of Maharashtra v. Som Nath Thapa", cite: "(1996) 4 SCC 659", year: 1996,
      ratio: "The Supreme Court held that to establish criminal conspiracy, knowledge of the illegal act or illegal means is essential; intent may be inferred from knowledge itself where the goods or services involved have no legitimate use.",
      url: "https://indiankanoon.org/doc/702724/" }] },
  { id: 62, ipc: 511, category: "L", title: "Punishment for attempting to commit offences punishable with imprisonment for life or other imprisonment",
    text: "Whoever attempts to commit an offence punishable by this Sanhita with imprisonment for life or imprisonment, or to cause such an offence to be committed, and in such attempt does any act towards the commission of the offence, shall, where no express provision is made by this Sanhita for the punishment of such attempt, be punished with imprisonment of any description provided for the offence, for a term up to one-half of the imprisonment for life or, as the case may be, one-half of the longest term of imprisonment provided for that offence, or with such fine as is provided for the offence, or with both.",
    ingredients: ["Intention to commit an offence punishable with imprisonment (or imprisonment for life)", "Doing some act towards the commission of that offence — going beyond mere preparation", "The offence itself is not actually completed"],
    illustrations: [
      "A attempts to steal jewels by breaking open a box, and finds after opening it that there is no jewel inside. He has done an act towards the commission of theft, and is guilty under this section.",
      "A attempts to pick Z's pocket by thrusting his hand into it, but fails because Z's pocket is empty. A is guilty under this section."
    ], crossRefs: [] },

  /* ---- Chapter V — Of Offences Against Woman and Child ---- */
  { id: 63, ipc: 375, category: "T", title: "Rape",
    text: "A man is said to commit 'rape' if he — (a) penetrates his penis, to any extent, into the vagina, mouth, urethra or anus of a woman or makes her do so with him or any other person; or (b) inserts, to any extent, any object or body part (not the penis) into the vagina, urethra or anus of a woman, or makes her do so; or (c) manipulates any part of a woman's body so as to cause penetration into the vagina, urethra, anus, or any part of her body, or makes her do so; or (d) applies his mouth to the vagina, anus, or urethra of a woman, or makes her do so — under any of the following seven circumstances: against her will; without her consent; with consent obtained by putting her (or someone she is interested in) in fear of death or hurt; with consent obtained by impersonating her husband; with consent given while unable to understand the nature and consequences of the act due to mental illness, intoxication, or a stupefying substance administered to her; with or without consent, when she is under eighteen; or when she is unable to communicate consent.",
    simpleExplanation: "The definition has two parts, and both must be met. First, one of four physical acts (clauses a–d) — the definition is broader than penile-vaginal penetration alone. Second, one of seven circumstances showing the act wasn't a freely consenting adult encounter — absence of will/consent, coerced or tricked consent, incapacity to consent, or the woman being under eighteen (where consent is irrelevant either way). Exception 2 (marital rape) is narrower than it looks — it only shields a husband where the wife is not a minor; Independent Thought is why that age line is drawn at eighteen.",
    punishment: "Base punishment: rigorous imprisonment of ten years to life, and fine (Section 64(1)). Aggravated circumstances — custodial rape, rape by a person in a position of trust, rape during communal violence, or on a vulnerable woman — raise this to ten years-to-life meaning the remainder of natural life (Section 64(2)). Where the victim is under sixteen or twelve, or dies, or the rape is a gang rape, punishment escalates further, up to the death penalty (Sections 65, 66, 70).",
    explanations: [
      "'Vagina' includes the labia majora.",
      "Consent means an unequivocal voluntary agreement, communicated by words, gestures, or any verbal or non-verbal form, showing willingness to participate in the specific act — a woman who does not physically resist is not, for that reason alone, deemed to consent."
    ],
    provisos: [
      "Exception 1 — A medical procedure or intervention does not constitute rape.",
      "Exception 2 — Sexual intercourse or acts by a man with his own wife, provided she is not under eighteen, is not rape."
    ],
    ingredients: ["One of the four acts described in clauses (a)-(d) is done", "It occurs under one of the seven listed circumstances (absence of will/consent, coerced or vitiated consent, minority, or inability to communicate consent)"],
    illustrations: [], crossRefs: [64],
    cases: [{ name: "Independent Thought v. Union of India", cite: "(2017) 10 SCC 800", year: 2017,
      ratio: "The Supreme Court read down the marital-rape exception, holding that sexual intercourse with a wife under eighteen is rape regardless of marriage — this ruling is why Exception 2 is worded 'not being under eighteen years of age' rather than the older, lower age threshold.",
      url: "https://indiankanoon.org/doc/87705010/" },
      { name: "State of Punjab v. Gurmit Singh", cite: "(1996) 2 SCC 384 (also reported as 1996 AIR 1393)", year: 1996,
      ratio: "The Supreme Court reversed a trial court acquittal, holding that the sole testimony of a rape survivor, if found credible and trustworthy, is sufficient for conviction without requiring corroboration. The Court criticised insensitive judicial treatment of survivors and directed that rape trials be held in camera to protect their dignity.",
      url: "https://indiankanoon.org/doc/1046545/" }] },
  { id: 64, ipc: 376, category: "T", title: "Punishment for rape",
    text: "(1) Rape, other than the aggravated cases in sub-section (2), is punishable with rigorous imprisonment of ten years to life, and fine. (2) Rape committed by a police officer or public servant on a woman in their custody; by armed forces personnel in an area of deployment; by jail/institution/hospital staff on an inmate or patient; by a relative, guardian, teacher, or person in a position of trust; during communal or sectarian violence; on a woman known to be pregnant, incapable of consenting, or suffering mental illness or physical disability; causing grievous harm or repeated rape on the same woman — is punishable with rigorous imprisonment of ten years to imprisonment for life meaning the remainder of natural life, and fine.",
    illustrations: [], crossRefs: [63] },
  { id: 65, ipc: null, category: "T", title: "Punishment for rape in certain cases (victim under 16 or 12)",
    text: "(1) Rape on a woman under sixteen is punishable with rigorous imprisonment of twenty years to life (meaning the remainder of natural life), and fine. (2) Rape on a woman under twelve is punishable with rigorous imprisonment of twenty years to life (meaning the remainder of natural life), and fine, or with death.",
    provisos: ["Any fine imposed must be just and reasonable to cover the victim's medical treatment and rehabilitation, and is payable to the victim."],
    illustrations: [], crossRefs: [64] },
  { id: 66, ipc: "376A", category: "T", title: "Punishment for causing death or persistent vegetative state of the victim",
    text: "Whoever commits an offence under Section 64(1) or (2), and in the course of it inflicts an injury causing the woman's death or leaving her in a persistent vegetative state, is punishable with rigorous imprisonment of twenty years to life (meaning the remainder of natural life), or with death.",
    illustrations: [], crossRefs: [64] },
  { id: 67, ipc: "376B", category: "T", title: "Sexual intercourse by husband upon his wife during separation",
    text: "Whoever has sexual intercourse with his own wife, who is living separately under a decree of separation or otherwise, without her consent, shall be punished with imprisonment of two to seven years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 68, ipc: "376C", category: "T", title: "Sexual intercourse by a person in authority",
    text: "Whoever, being in a position of authority or a fiduciary relationship, a public servant, superintendent/manager of a place of custody or a women's/children's institution, or hospital management/staff, abuses that position to induce or seduce a woman in their custody or charge into sexual intercourse not amounting to rape, shall be punished with rigorous imprisonment of five to ten years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 69, ipc: null, category: "T", title: "Sexual intercourse by employing deceitful means, etc.",
    text: "Whoever, by deceitful means or a false promise to marry made without intending to keep it, has sexual intercourse with a woman not amounting to rape, shall be punished with imprisonment up to ten years, and fine.",
    explanations: ["'Deceitful means' includes a false promise of employment or promotion, inducement, or marrying after concealing one's identity."],
    illustrations: [], crossRefs: [] },
  { id: 70, ipc: "376D", category: "T", title: "Gang rape",
    text: "(1) Where a woman is raped by one or more persons constituting a group acting in furtherance of a common intention, each such person is deemed to have committed rape and is punishable with rigorous imprisonment of twenty years to life (meaning the remainder of natural life), and fine. (2) Where the woman is under eighteen, each person is punishable with imprisonment for life (remainder of natural life), and fine, or with death.",
    provisos: ["Any fine imposed must be just and reasonable to cover medical treatment and rehabilitation, and is payable to the victim."],
    illustrations: [], crossRefs: [63] },
  { id: 71, ipc: null, category: "T", title: "Punishment for repeat offenders",
    text: "Whoever, having been previously convicted of an offence under Section 64, 65, 66, or 67, is subsequently convicted of an offence under any of those sections, shall be punished with imprisonment for life (meaning the remainder of natural life), or with death.",
    illustrations: [], crossRefs: [64, 65, 66, 67] },
  { id: 72, ipc: null, category: "T", title: "Disclosure of identity of victim of certain offences",
    text: "(1) Printing or publishing the name or anything that may reveal the identity of a victim of an offence under Sections 64–71 is punishable with imprisonment up to two years, and fine. (2) This does not apply to disclosure authorised in writing by the investigating police officer acting in good faith, by the victim, or (where the victim is deceased, a minor, or has a mental illness) by the next of kin — such authorisation from next of kin may only be given to the head of a recognised welfare institution.",
    illustrations: [], crossRefs: [] },
  { id: 73, ipc: null, category: "T", title: "Printing or publishing matter relating to Court proceedings without permission",
    text: "Whoever prints or publishes any matter relating to a Court proceeding on an offence referred to in Section 72, without the Court's prior permission, shall be punished with imprisonment up to two years, and fine.",
    explanations: ["Printing or publishing a judgment of the High Court or Supreme Court is not an offence under this section."],
    illustrations: [], crossRefs: [72] },

  { id: 74, ipc: 354, category: "U", title: "Assault or criminal force to woman with intent to outrage her modesty",
    text: "Whoever assaults or uses criminal force to any woman, intending to outrage her modesty or knowing it likely to do so, shall be punished with imprisonment of one to five years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 75, ipc: null, category: "U", title: "Sexual harassment",
    text: "(1) A man commits sexual harassment if he: (i) makes unwelcome, explicit sexual physical contact or advances; (ii) demands or requests sexual favours; (iii) shows pornography against a woman's will; or (iv) makes sexually coloured remarks. (2) Acts (i)-(iii) are punishable with rigorous imprisonment up to three years, or fine, or both. (3) Act (iv) is punishable with imprisonment up to one year, or fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 76, ipc: "354B", category: "U", title: "Assault or use of criminal force to woman with intent to disrobe",
    text: "Whoever assaults or uses criminal force to a woman, or abets such an act, intending to disrobe her or compel her to be naked, shall be punished with imprisonment of three to seven years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 77, ipc: "354C", category: "U", title: "Voyeurism",
    text: "Whoever watches or captures the image of a woman engaged in a private act, in circumstances where she would expect not to be observed, or disseminates such an image, is punishable on first conviction with imprisonment of one to three years and fine, and on a second or subsequent conviction with imprisonment of three to seven years and fine.",
    explanations: [
      "'Private act' includes being watched in a place reasonably expected to provide privacy where genitals, posterior, or breasts are exposed or covered only in underwear, using a lavatory, or doing a sexual act not ordinarily done in public.",
      "Consenting to the image being captured is not consent to its dissemination — disseminating it without that separate consent is itself an offence under this section."
    ], illustrations: [], crossRefs: [] },
  { id: 78, ipc: "354D", category: "U", title: "Stalking",
    text: "(1) A man commits stalking if he follows a woman and repeatedly contacts or attempts to contact her to foster personal interaction despite her clear disinterest, or monitors her use of the internet, email, or electronic communication — unless he proves it was to prevent/detect crime under State authorisation, was required by law, or was reasonable and justified in the circumstances. (2) Punishable on first conviction with imprisonment up to three years and fine, and on a second or subsequent conviction with imprisonment up to five years and fine.",
    illustrations: [], crossRefs: [] },
  { id: 79, ipc: 509, category: "U", title: "Word, gesture or act intended to insult the modesty of a woman",
    text: "Whoever, intending to insult a woman's modesty, utters any word, makes any sound or gesture, or exhibits any object, intending it to be heard or seen by her, or intrudes upon her privacy, shall be punished with simple imprisonment up to three years, and fine.",
    illustrations: [], crossRefs: [] },

  { id: 80, ipc: "304B", category: "V2", title: "Dowry death",
    text: "(1) Where a woman dies of burns, bodily injury, or otherwise than under normal circumstances within seven years of marriage, and it is shown that she was subjected to cruelty or harassment by her husband or his relatives for or in connection with a dowry demand soon before her death, that death is called 'dowry death', and the husband or relative is deemed to have caused it. (2) Punishable with imprisonment of seven years to life.",
    explanations: ["'Dowry' carries the same meaning as under Section 2 of the Dowry Prohibition Act, 1961."],
    ingredients: ["Death of a woman by burns, injury, or unnatural circumstances", "Within seven years of her marriage", "Shown that she was subjected to cruelty/harassment for a dowry demand soon before death"],
    illustrations: [], crossRefs: [86] },
  { id: 81, ipc: 493, category: "V2", title: "Cohabitation caused by a man deceitfully inducing a belief of lawful marriage",
    text: "Whoever, by deceit, causes a woman not lawfully married to him to believe she is lawfully married, and to cohabit or have intercourse with him in that belief, shall be punished with imprisonment up to ten years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 82, ipc: 494, category: "V2", title: "Marrying again during lifetime of husband or wife (bigamy)",
    text: "(1) Whoever, having a spouse living, marries again in a case where such marriage is void by reason of taking place during that spouse's lifetime, shall be punished with imprisonment up to seven years, and fine. (2) If the subsequent marriage was contracted while concealing the former marriage from the other party, imprisonment up to ten years, and fine.",
    provisos: ["Does not apply where the earlier marriage was declared void by a competent Court, or where the absent spouse has not been heard of as alive for seven continuous years and the other party is informed of the real facts before the subsequent marriage."],
    illustrations: [], crossRefs: [] },
  { id: 83, ipc: 496, category: "V2", title: "Marriage ceremony fraudulently gone through without lawful marriage",
    text: "Whoever, dishonestly or fraudulently, goes through a marriage ceremony knowing he is not thereby lawfully married, shall be punished with imprisonment up to seven years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 84, ipc: 498, category: "V2", title: "Enticing or taking away or detaining with criminal intent a married woman",
    text: "Whoever takes or entices away a woman known or believed to be another man's wife, intending that she have illicit intercourse with any person, or conceals or detains her with that intent, shall be punished with imprisonment up to two years, or fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 85, ipc: "498A", category: "V2", title: "Husband or relative of husband subjecting a woman to cruelty",
    text: "Whoever, being the husband or a relative of the husband, subjects a woman to cruelty (as defined in Section 86), shall be punished with imprisonment up to three years, and fine.",
    illustrations: [], crossRefs: [86],
    cases: [{ name: "Arnesh Kumar v. State of Bihar", cite: "(2014) 8 SCC 273", year: 2014,
      ratio: "Responding to widespread misuse of this provision for arbitrary arrests, the Supreme Court held that arrest should not be automatic or routine, and directed police to first satisfy the necessity-of-arrest conditions under Section 35 BNSS (formerly Section 41 CrPC) before arresting — non-compliance invites departmental action and contempt proceedings against the police officer.",
      url: "https://indiankanoon.org/doc/2982624/" }] },
  { id: 86, ipc: "498A", category: "V2", title: "Cruelty defined",
    text: "For the purposes of Section 85, 'cruelty' means: (a) wilful conduct likely to drive the woman to suicide, or to cause grave injury or danger to her life, limb, or health (mental or physical); or (b) harassment intended to coerce her, or a person related to her, into meeting an unlawful demand for property or valuable security, or harassment on account of failure to meet such a demand.",
    illustrations: [], crossRefs: [85, 80] },
  { id: 87, ipc: 366, category: "V2", title: "Kidnapping, abducting, or inducing a woman to compel her marriage, etc.",
    text: "Whoever kidnaps or abducts a woman intending (or knowing it likely) that she will be compelled to marry against her will, or forced/seduced into illicit intercourse, is punishable with imprisonment up to ten years, and fine — the same applies to inducing a woman to leave any place, by criminal intimidation, abuse of authority, or other compulsion, with the same intent.",
    illustrations: [], crossRefs: [] },

  { id: 88, ipc: 312, category: "W", title: "Causing miscarriage",
    text: "Whoever voluntarily causes a pregnant woman to miscarry, unless done in good faith to save her life, shall be punished with imprisonment up to three years, or fine, or both; if the woman is quick with child, imprisonment up to seven years, and fine.",
    explanations: ["A woman who causes her own miscarriage falls within the meaning of this section."],
    illustrations: [], crossRefs: [89] },
  { id: 89, ipc: 313, category: "W", title: "Causing miscarriage without the woman's consent",
    text: "Whoever causes a miscarriage without the woman's consent (whether or not she is quick with child) shall be punished with imprisonment for life, or imprisonment up to ten years, and fine.",
    illustrations: [], crossRefs: [88] },
  { id: 90, ipc: 314, category: "W", title: "Death caused by an act done with intent to cause miscarriage",
    text: "(1) Whoever, intending to cause a woman's miscarriage, does an act causing her death, shall be punished with imprisonment up to ten years, and fine. (2) If done without her consent, imprisonment for life, or the punishment in sub-section (1).",
    explanations: ["It is not essential that the offender knew the act was likely to cause death."],
    illustrations: [], crossRefs: [] },
  { id: 91, ipc: 315, category: "W", title: "Act done with intent to prevent a child being born alive or to cause it to die after birth",
    text: "Whoever, before a child's birth, does an act intending to prevent it being born alive or to cause its death after birth, and thereby does so, shall (unless done in good faith to save the mother's life) be punished with imprisonment up to ten years, or fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 92, ipc: 316, category: "W", title: "Causing death of a quick unborn child by an act amounting to culpable homicide",
    text: "Whoever does an act that, had it caused a person's death, would amount to culpable homicide, and thereby causes the death of a quick unborn child, shall be punished with imprisonment up to ten years, and fine.",
    illustrations: ["A, knowing he is likely to cause the death of a pregnant woman, does an act that would amount to culpable homicide if it killed her. She is injured but survives; the unborn quick child she carries dies as a result. A is guilty of the offence defined in this section."],
    crossRefs: [100] },

  { id: 93, ipc: 317, category: "X", title: "Exposure and abandonment of a child under twelve, by parent or caregiver",
    text: "Whoever, being the father, mother, or caregiver of a child under twelve, exposes or leaves the child anywhere intending to wholly abandon them, shall be punished with imprisonment up to seven years, or fine, or both.",
    explanations: ["This does not bar trial for murder or culpable homicide if the child dies as a result of the exposure."],
    illustrations: [], crossRefs: [] },
  { id: 94, ipc: 318, category: "X", title: "Concealment of birth by secret disposal of a dead body",
    text: "Whoever, by secretly burying or otherwise disposing of a child's dead body (whether the child died before, during, or after birth), intentionally conceals or attempts to conceal the birth, shall be punished with imprisonment up to two years, or fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 95, ipc: null, category: "X", title: "Hiring, employing or engaging a child to commit an offence",
    text: "Whoever hires, employs, or engages a child to commit an offence shall be punished with imprisonment of three to ten years, and fine; if the offence is actually committed, the person is additionally liable to the punishment for that offence as if they had committed it themselves.",
    explanations: ["Hiring, employing, or using a child for sexual exploitation or pornography falls within this section."],
    illustrations: [], crossRefs: [] },
  { id: 96, ipc: "366A", category: "X", title: "Procuration of a child",
    text: "Whoever, by any means, induces a child under eighteen to go from any place or to do any act, intending (or knowing it likely) that the child will be forced or seduced into illicit intercourse with another person, is punishable with imprisonment up to ten years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 97, ipc: 369, category: "X", title: "Kidnapping or abducting a child under ten to steal from its person",
    text: "Whoever kidnaps or abducts a child under ten, intending to dishonestly take movable property from the child's person, shall be punished with imprisonment up to seven years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 98, ipc: 372, category: "X", title: "Selling a child for purposes of prostitution, etc.",
    text: "Whoever sells, lets to hire, or otherwise disposes of a child under eighteen, intending (or knowing it likely) that the child will at any age be used for prostitution, illicit intercourse, or any unlawful or immoral purpose, shall be punished with imprisonment up to ten years, and fine.",
    explanations: [
      "Where a female under eighteen is sold or let to hire to a prostitute or brothel-keeper, the seller is presumed (until proven otherwise) to have done so with intent that she be used for prostitution.",
      "'Illicit intercourse' means sexual intercourse between persons not united by marriage or an equivalent recognised tie."
    ], illustrations: [], crossRefs: [99] },
  { id: 99, ipc: 373, category: "X", title: "Buying a child for purposes of prostitution, etc.",
    text: "Whoever buys, hires, or otherwise obtains possession of a child under eighteen, intending (or knowing it likely) that the child will at any age be used for prostitution, illicit intercourse, or any unlawful or immoral purpose, shall be punished with imprisonment of seven to fourteen years, and fine.",
    explanations: ["A prostitute or brothel-keeper who buys or obtains possession of a female under eighteen is presumed (until proven otherwise) to have done so with intent that she be used for prostitution."],
    illustrations: [], crossRefs: [98] },

  /* ---- Chapter VI — Of Offences Affecting the Human Body ---- */
  { id: 100, ipc: 299, category: "M", title: "Culpable homicide",
    text: "Whoever causes death by doing an act with the intention of causing death, or with the intention of causing such bodily injury as is likely to cause death, or with the knowledge that he is likely by such act to cause death, commits the offence of culpable homicide.",
    simpleExplanation: "Culpable homicide is the broad category — 'unlawful killing.' Murder (Section 101) is a narrower, more serious subset within it. Think of it as two circles: every murder is culpable homicide, but not every culpable homicide is murder. What separates the two is the degree of intention/knowledge and whether an Exception applies — this is exactly the distinction Reg. v. Govinda first drew.",
    punishment: "Culpable homicide itself has no fixed punishment — its punishment depends on whether it turns out to be murder (Section 103: death or life imprisonment) or culpable homicide not amounting to murder (Section 105: life imprisonment, or 5–10 years with fine, or up to 10 years with fine, depending on intention vs. mere knowledge).",
    explanations: ["A person who causes bodily injury to another who is labouring under a disorder, disease or bodily infirmity, and thereby accelerates that other's death, shall be deemed to have caused his death."],
    ingredients: ["Death of a person was caused by the accused's act", "The act was done with intention of causing death, OR intention of causing bodily injury likely to cause death, OR knowledge that the act was likely to cause death"],
    illustrations: [
      "A lays sticks and turf over a pit, intending or knowing it likely to cause death. Z, believing the ground firm, treads on it, falls in and is killed. A has committed culpable homicide.",
      "A, by shooting at a fowl with intent to kill and steal it, kills B, who is behind a bush, not knowing B was there. A is not guilty of culpable homicide, as he neither intended B's death nor knew the act was likely to cause it."
    ], crossRefs: [101],
    cases: [{ name: "Reg. v. Govinda", cite: "(1876) ILR 1 Bom 342", year: 1876,
      ratio: "This foundational Bombay High Court ruling (Melvill J.) first drew the line between culpable homicide and murder: culpable homicide is the genus, murder the aggravated species. Where injury is likely but not sufficient in the ordinary course of nature to cause death, and death was not intended, the offence remains culpable homicide, not murder.",
      url: "https://indiankanoon.org/doc/783074/" }] },
  { id: 101, ipc: 300, category: "M", title: "Murder",
    text: "Except in the cases hereinafter excepted, culpable homicide is murder — (a) if the act is done with the intention of causing death; or (b) if done with the intention of causing such bodily injury as the offender knows to be likely to cause death; or (c) if done with the intention of causing bodily injury to any person, and the bodily injury intended to be inflicted is sufficient in the ordinary course of nature to cause death; or (d) if the person committing the act knows it to be so imminently dangerous that it must, in all probability, cause death or such injury as is likely to cause death, and commits the act without any excuse for incurring that risk.",
    simpleExplanation: "Murder is the most serious form of culpable homicide (Section 100). Not every killing is murder — it becomes murder when the killer either meant to kill, meant to cause an injury they knew was likely fatal, meant to cause an injury that turns out to be objectively fatal (clause (c) — this is what Virsa Singh interprets), or did something so recklessly dangerous that death was almost certain. Even then, it's NOT murder if one of the five Exceptions applies (e.g. sudden grave provocation) — those turn it back into the lesser offence of culpable homicide not amounting to murder (Section 105).",
    punishment: "Death or imprisonment for life, plus fine (Section 103). Where five or more people act together and kill on grounds like caste, religion, or race, each member faces death, life imprisonment, or a minimum of seven years, plus fine.",
    ingredients: ["Culpable homicide (Section 100) is first established", "Falls under clause (a), (b), (c), or (d) above", "None of the five Exceptions apply"],
    illustrations: [
      "A shoots Z with the intention of killing him. Z dies in consequence. A commits murder.",
      "A intentionally gives Z a sword-cut sufficient to cause death in the ordinary course of nature. Z dies. A is guilty of murder, although he may not have intended Z's death specifically.",
      "A, without excuse, fires a loaded cannon into a crowd and kills one person. A is guilty of murder, though he had no premeditated design against that particular individual."
    ],
    provisos: [
      "Exception 1 — Grave and sudden provocation: not murder if the offender, deprived of self-control by grave and sudden provocation, kills the provoker (or another, by mistake/accident) — unless the provocation was self-sought, given by a lawful act of a public servant, or given in the lawful exercise of private defence.",
      "Exception 2 — Exceeding the right of private defence: not murder if done in good-faith exercise of private defence, exceeding the power given by law, without premeditation and without intending more harm than necessary.",
      "Exception 3 — Public servant exceeding lawful powers: not murder if a public servant (or one aiding him) acting for the advancement of public justice exceeds his lawful powers and causes death by an act believed in good faith to be lawful and necessary, without ill-will.",
      "Exception 4 — Sudden fight: not murder if committed without premeditation in a sudden fight, in the heat of passion, without undue advantage or cruelty.",
      "Exception 5 — Consent: not murder if the person killed, above eighteen, suffers death or takes the risk of death with his own consent."
    ],
    crossRefs: [100],
    cases: [{ name: "Virsa Singh v. State of Punjab", cite: "AIR 1958 SC 465", year: 1958,
      ratio: "The Supreme Court laid down a four-part test for clause (c): the injury must be objectively present, its nature proved, its infliction shown to be intentional (not accidental), and it must be objectively sufficient in the ordinary course of nature to cause death — the offender's awareness that it was fatal is irrelevant once these are proved.",
      url: "https://indiankanoon.org/doc/1296255/" },
      { name: "K.M. Nanavati v. State of Maharashtra", cite: "AIR 1962 SC 605", year: 1961,
      ratio: "The Supreme Court held that Exception 1 (grave and sudden provocation) only protects a killing done while the offender's passion was still hot — if enough time passed for the mind to 'cool down' before the fatal act, the exception does not apply, and the offence remains murder.",
      url: "https://indiankanoon.org/doc/1596139/" }] },
  { id: 102, ipc: 301, category: "M", title: "Culpable homicide by causing death of person other than person whose death was intended",
    text: "If a person, doing an act intending or knowing it likely to cause death, commits culpable homicide by causing the death of a person whose death he neither intended nor knew himself likely to cause, the culpable homicide committed is of the same description as it would have been had he caused the death of the person he actually intended or knew himself likely to kill.",
    illustrations: [], crossRefs: [100, 101] },
  { id: 103, ipc: 302, category: "M", title: "Punishment for murder",
    text: "(1) Whoever commits murder shall be punished with death or imprisonment for life, and shall also be liable to fine. (2) When a group of five or more persons acting in concert commits murder on the ground of race, caste, community, sex, place of birth, language, personal belief, or any other similar ground, each member of the group shall be punished with death, imprisonment for life, or imprisonment for a term not less than seven years, and shall also be liable to fine.",
    illustrations: [], crossRefs: [101] },
  { id: 104, ipc: 303, category: "M", title: "Punishment for murder by life-convict",
    text: "Whoever, being under sentence of imprisonment for life, commits murder, shall be punished with death or with imprisonment for life, meaning the remainder of that person's natural life.",
    illustrations: [], crossRefs: [101] },
  { id: 105, ipc: 304, category: "M", title: "Punishment for culpable homicide not amounting to murder",
    text: "Whoever commits culpable homicide not amounting to murder shall be punished with imprisonment for life, or imprisonment for a term of five to ten years, and fine, if the act was done with intention of causing death or of causing bodily injury likely to cause death; or with imprisonment up to ten years and fine, if done with knowledge that it was likely to cause death, but without any such intention.",
    illustrations: [], crossRefs: [100, 101] },
  { id: 106, ipc: null, category: "N", title: "Causing death by negligence",
    text: "(1) Whoever causes the death of any person by a rash or negligent act not amounting to culpable homicide shall be punished with imprisonment up to five years and fine; if such an act is done by a registered medical practitioner performing a medical procedure, imprisonment up to two years and fine. (2) Whoever causes death by rash or negligent driving of a vehicle, not amounting to culpable homicide, and escapes without reporting it to a police officer or Magistrate soon after, shall be punished with imprisonment up to ten years and fine.",
    illustrations: [], crossRefs: [] },
  { id: 107, ipc: 305, category: "N", title: "Abetment of suicide of child or person of unsound mind",
    text: "If any person under eighteen, any person with mental illness, any delirious person, or any intoxicated person commits suicide, whoever abets that suicide shall be punished with death, imprisonment for life, or imprisonment up to ten years, and shall also be liable to fine.",
    illustrations: [], crossRefs: [] },
  { id: 108, ipc: 306, category: "N", title: "Abetment of suicide",
    text: "If any person commits suicide, whoever abets the commission of such suicide shall be punished with imprisonment up to ten years, and shall also be liable to fine.",
    illustrations: [], crossRefs: [] },
  { id: 109, ipc: 307, category: "N", title: "Attempt to murder",
    text: "(1) Whoever does any act with such intention or knowledge, and under such circumstances that, had death been caused, he would be guilty of murder, shall be punished with imprisonment up to ten years and fine; if hurt is caused by such act, he shall be liable to imprisonment for life or the punishment above. (2) If the offender under sub-section (1) is already under sentence of imprisonment for life, and hurt is caused, he may be punished with death or imprisonment for life meaning the remainder of his natural life.",
    ingredients: ["An act done with the intention or knowledge that would make the offender guilty of murder if death resulted", "Circumstances such that death could have resulted from the act", "Death did not actually occur"],
    illustrations: [
      "A shoots at Z intending to kill him, under such circumstances that had death ensued, A would be guilty of murder. A is liable under this section, whether or not Z is actually hit.",
      "A, intending to murder Z by poison, purchases poison, mixes it with food, and delivers it to Z's servant to be placed on Z's table. A has committed the offence defined in this section, even before Z eats the food."
    ], crossRefs: [101] },
  { id: 110, ipc: 308, category: "N", title: "Attempt to commit culpable homicide",
    text: "Whoever does any act with such intention or knowledge, and under such circumstances that, had death been caused, he would be guilty of culpable homicide not amounting to murder, shall be punished with imprisonment up to three years, or fine, or both; if hurt is caused by such act, imprisonment up to seven years, or fine, or both.",
    illustrations: ["A, on grave and sudden provocation, fires a pistol at Z, under such circumstances that if death were caused, A would be guilty only of culpable homicide not amounting to murder. A has committed the offence defined in this section."],
    crossRefs: [105] },
  { id: 111, ipc: null, category: "O", title: "Organised crime",
    text: "(1) Any continuing unlawful activity — including kidnapping, robbery, vehicle theft, extortion, land grabbing, contract killing, economic offences, cyber-crime, or trafficking of persons, drugs, weapons or illicit goods or services, or human trafficking for prostitution or ransom — carried out by a person or group acting in concert, singly or jointly, either as a member of an organised crime syndicate or on its behalf, by violence, threat of violence, intimidation, coercion, or any other unlawful means, to obtain direct or indirect material benefit (including financial benefit), constitutes organised crime.",
    explanations: [
      "To sub-section (1)(i): 'Organised crime syndicate' means a group of two or more persons who, acting singly or jointly, as a syndicate or gang, indulge in continuing unlawful activity.",
      "To sub-section (1)(ii): 'Continuing unlawful activity' means an activity prohibited by law, being a cognizable offence punishable with three or more years' imprisonment, undertaken singly or jointly as a member of, or on behalf of, an organised crime syndicate, in respect of which more than one chargesheet has been filed before a competent Court within the preceding ten years, and that Court has taken cognizance — this includes economic offences.",
      "To sub-section (1)(iii): 'Economic offences' include criminal breach of trust, forgery, counterfeiting of currency-notes/bank-notes/Government stamps, hawala transactions, and mass-marketing fraud or schemes to defraud several persons, banks, or financial institutions.",
      "To the section as a whole: 'Proceeds of any organised crime' means all kinds of property derived or obtained from, or acquired through funds traceable to, any organised crime — including cash, regardless of in whose name or possession it is found."
    ],
    illustrations: [],
    provisos: [
      "(2)(a) — If the organised crime results in death: punishable with death or imprisonment for life, and fine not less than ten lakh rupees.",
      "(2)(b) — In any other case: imprisonment of five years to life, and fine not less than five lakh rupees.",
      "(3) — Abetting, attempting, conspiring, or knowingly facilitating organised crime, or engaging in any preparatory act: imprisonment of five years to life, and fine not less than five lakh rupees.",
      "(4) — Being a member of an organised crime syndicate: imprisonment of five years to life, and fine not less than five lakh rupees.",
      "(5) — Intentionally harbouring or concealing a person who has committed organised crime: imprisonment of three years to life, and fine not less than five lakh rupees — provided this does not apply where the harbourer/concealer is the offender's spouse.",
      "(6) — Possessing property derived or obtained from organised crime: imprisonment of three years to life, and fine not less than two lakh rupees.",
      "(7) — Possessing, on behalf of a syndicate member, movable or immovable property that cannot be satisfactorily accounted for: imprisonment of three to ten years, and fine not less than one lakh rupees."
    ],
    crossRefs: [] },
  { id: 112, ipc: null, category: "O", title: "Petty organised crime",
    text: "(1) Crimes causing general public insecurity — vehicle theft or theft from vehicles, domestic and business theft, trick theft, cargo crime, theft (including attempts), organised pickpocketing, snatching, shoplifting, card-skimming and ATM theft, illegal ticket sales, or selling public examination question papers, and similar organised crimes — including when committed by mobile groups building networks of contacts and logistics across a region before moving on — constitute petty organised crime. (2) Punishable with imprisonment of one to seven years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 113, ipc: null, category: "O", title: "Terrorist act",
    text: "(1) A person commits a terrorist act if he does any act in India or a foreign country, with intent to threaten India's unity, integrity, or security, to intimidate the public, or to disturb public order, by — (a) using bombs, explosives, firearms, poison, noxious gases, chemicals, or hazardous biological substances to spread fear, cause death or serious harm, or endanger life; (b) causing damage or destruction to property, or disrupting essential supplies or services, or destroying a Government/public facility or private property; (c) causing extensive interference with or damage to critical infrastructure; (d) provoking or compelling the Government (or intimidating/detaining a person) to act or abstain from acting, or seeking to destabilise the political, economic or social structure of the country, or create a public emergency; or (e) an act within the scope of the treaties listed in the Second Schedule to the Unlawful Activities (Prevention) Act, 1967.",
    explanations: [
      "'Terrorist' (for this section) refers to a person who develops, manufactures, possesses, transports, supplies, or uses weapons/explosives/hazardous substances or causes fire, floods, or explosions for a terrorist act; or commits, attempts, or conspires to commit a terrorist act, directly or indirectly; or participates as principal or accomplice in a terrorist act.",
      "'Proceeds of terrorism' carries the same meaning as under Section 2(g) of the Unlawful Activities (Prevention) Act, 1967.",
      "'Terrorist organisation, association or group' refers to any entity owned or controlled by a terrorist or group of terrorists that commits, attempts, participates in, prepares for, promotes, organises, directs, contributes to, or is otherwise involved in terrorism — including any organisation listed in the First Schedule to the UAPA, 1967, or operating under the same name as one so listed."
    ],
    illustrations: [],
    provisos: [
      "(2)(a) — If the terrorist act results in death: punishable with death or imprisonment for life without parole, and fine not less than ten lakh rupees.",
      "(2)(b) — In any other case: imprisonment of five years to life, and fine not less than five lakh rupees.",
      "(3) — Conspiring, organising, or causing to be organised any group for terrorist acts, or assisting/facilitating preparatory acts: imprisonment of five years to life, and fine not less than five lakh rupees.",
      "(4) — Being a member of a terrorist organisation involved in a terrorist act: imprisonment up to life, and fine not less than five lakh rupees.",
      "(5) — Intentionally harbouring, concealing, or attempting to harbour/conceal a person who has committed a terrorist act: imprisonment of three years to life, and fine not less than five lakh rupees — provided this does not apply where the harbourer/concealer is the offender's spouse.",
      "(6) — Holding, possessing, providing, collecting, or using property, funds, or financial services derived from or intended to facilitate a terrorist act: imprisonment up to life, and fine not less than five lakh rupees; such property is also liable to attachment and forfeiture."
    ], crossRefs: [] },

  /* ---- Of Hurt ---- */
  { id: 114, ipc: 319, category: "P", title: "Hurt",
    text: "Whoever causes bodily pain, disease, or infirmity to any person is said to cause hurt.",
    illustrations: [], crossRefs: [] },
  { id: 115, ipc: 321, category: "P", title: "Voluntarily causing hurt",
    text: "(1) Whoever does an act with the intention of causing hurt, or with knowledge that he is likely to cause hurt, and does thereby cause hurt, is said to voluntarily cause hurt. (2) Whoever, except as provided in Section 120(1), voluntarily causes hurt, shall be punished with imprisonment up to one year, or fine up to ten thousand rupees, or both.",
    ingredients: ["An act done with intention to cause hurt, or knowledge it is likely to cause hurt", "Hurt is actually caused as a result"],
    illustrations: [], crossRefs: [120] },
  { id: 116, ipc: 320, category: "P", title: "Grievous hurt",
    text: "The following kinds of hurt only are designated 'grievous': (1) Emasculation. (2) Permanent privation of sight of either eye. (3) Permanent privation of hearing of either ear. (4) Privation of any member or joint. (5) Destruction or permanent impairing of the powers of any member or joint. (6) Permanent disfiguration of the head or face. (7) Fracture or dislocation of a bone or tooth. (8) Any hurt endangering life, or causing the sufferer severe bodily pain, or inability to follow ordinary pursuits, for fifteen days or more.",
    ingredients: ["The hurt must fall within one of the eight specifically listed categories — this is an exhaustive list, not illustrative"],
    illustrations: [], crossRefs: [117] },
  { id: 117, ipc: 322, category: "P", title: "Voluntarily causing grievous hurt",
    text: "(1) Whoever voluntarily causes hurt is said to voluntarily cause grievous hurt if the hurt he intends or knows himself likely to cause, and the hurt he actually causes, is grievous hurt. (2) Punishable, except as provided in sub-section (3), with imprisonment up to seven years and fine. (3) If the offence causes permanent disability or a persistent vegetative state, punishable with rigorous imprisonment of ten years to life. (4) If grievous hurt is caused by a group of five or more on grounds of race, caste, sex, place of birth, language, personal belief, or similar ground, each member is punishable with imprisonment up to seven years and fine.",
    explanations: ["A person is not said to voluntarily cause grievous hurt unless he both causes it and intends or knows himself likely to cause it — but if he intends one kind of grievous hurt and actually causes another kind, he is still said to have voluntarily caused grievous hurt."],
    illustrations: ["A, intending to permanently disfigure Z's face, gives a blow that does not disfigure Z but causes severe pain for fifteen days. A has voluntarily caused grievous hurt (of a different kind than intended)."],
    ingredients: ["Voluntarily causing hurt (Section 115)", "The hurt intended/known-likely, and the hurt actually caused, both qualify as 'grievous' under Section 116"],
    crossRefs: [115, 116] },
  { id: 118, ipc: 324, category: "P", title: "Voluntarily causing hurt or grievous hurt by dangerous weapons or means",
    text: "Voluntarily causing hurt by a shooting, stabbing, or cutting instrument, or any weapon likely to cause death, or by fire, heated substance, poison, corrosive substance, explosive, a substance deleterious to inhale/swallow/absorb into blood, or by an animal — punishable, for hurt, with imprisonment up to three years or fine up to twenty thousand rupees, or both; for grievous hurt by the same means, imprisonment for life or one to ten years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 119, ipc: 327, category: "P", title: "Voluntarily causing hurt or grievous hurt to extort property, or to constrain to an illegal act",
    text: "Voluntarily causing hurt to extort property or valuable security, or to constrain the sufferer (or someone interested in them) to do an illegal act, is punishable with imprisonment up to ten years and fine; for grievous hurt with the same purpose, imprisonment for life or up to ten years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 120, ipc: 330, category: "P", title: "Voluntarily causing hurt or grievous hurt to extort confession, or to compel restoration of property",
    text: "(1) Voluntarily causing hurt to extort a confession or information leading to detection of an offence, or to compel restoration of property — punishable with imprisonment up to seven years and fine. (2) For grievous hurt with the same purpose, imprisonment up to ten years and fine.",
    illustrations: [
      "A, a police officer, tortures Z to induce a confession. A is guilty under this section.",
      "A, a revenue officer, tortures Z to compel payment of arrears due. A is guilty under this section."
    ], crossRefs: [115, 117] },
  { id: 121, ipc: 332, category: "P", title: "Voluntarily causing hurt or grievous hurt to deter public servant from his duty",
    text: "(1) Voluntarily causing hurt to a public servant in the discharge of his duty, or to deter/prevent such discharge, or in consequence of it — imprisonment up to five years, or fine, or both. (2) For grievous hurt in the same circumstances — imprisonment of one to ten years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 122, ipc: 335, category: "P", title: "Voluntarily causing hurt or grievous hurt on provocation",
    text: "(1) Voluntarily causing hurt on grave and sudden provocation, without intending or knowing it likely to harm anyone other than the provoker — imprisonment up to one month, or fine up to five thousand rupees, or both. (2) For grievous hurt in the same circumstances — imprisonment up to five years, or fine up to ten thousand rupees, or both.",
    explanations: ["Subject to the same provisos as Exception 1 to Section 101 (the provocation must not be self-sought, given by lawful action of a public servant, or given during lawful private defence)."],
    illustrations: [], crossRefs: [101] },
  { id: 123, ipc: 328, category: "P", title: "Causing hurt by means of poison, etc., with intent to commit an offence",
    text: "Administering, or causing to be taken, any poison or stupefying, intoxicating, or unwholesome drug or substance, with intent to cause hurt, or to commit or facilitate an offence, or knowing hurt is likely to be caused thereby — punishable with imprisonment up to ten years and fine.",
    illustrations: [], crossRefs: [] },
  { id: 124, ipc: 326, category: "P", title: "Voluntarily causing grievous hurt by use of acid, etc.",
    text: "(1) Causing permanent or partial damage, deformity, burns, maiming, disfigurement, disability, or a permanent vegetative state by throwing or administering acid, or by any comparable means, with intent or knowledge — punishable with rigorous imprisonment of ten years to life, and a fine that must be just and reasonable to cover the victim's medical treatment, payable to the victim. (2) Throwing or attempting to throw/administer acid, or attempting comparable means, with such intent — punishable with imprisonment of five to seven years, and fine.",
    explanations: ["'Acid' includes any substance with acidic or corrosive character or burning nature capable of causing bodily injury leading to scarring or disfigurement, temporary or permanent."],
    illustrations: [], crossRefs: [],
    cases: [{ name: "Laxmi v. Union of India", cite: "(2014) 4 SCC 427", year: 2013,
      ratio: "In this PIL brought by an acid attack survivor, the Supreme Court held that the unrestricted, unregulated sale of acid violated Article 21, and directed every State and Union Territory to regulate its sale, provide minimum compensation of ₹3,00,000 to survivors, and ensure no hospital could refuse them treatment — the case that directly shaped why acid attacks are now a distinctly punished offence.",
      url: "https://indiankanoon.org/doc/90443079/" }] },
  { id: 125, ipc: 336, category: "P", title: "Act endangering life or personal safety of others",
    text: "Doing any act so rashly or negligently as to endanger human life or personal safety — punishable with imprisonment up to three months or fine up to two thousand five hundred rupees, or both; if hurt is caused, imprisonment up to six months or fine up to five thousand rupees, or both; if grievous hurt is caused, imprisonment up to three years or fine up to ten thousand rupees, or both.",
    illustrations: [], crossRefs: [] },

  /* ---- Of Wrongful Restraint and Wrongful Confinement ---- */
  { id: 126, ipc: 339, category: "Q", title: "Wrongful restraint",
    text: "(1) Whoever voluntarily obstructs a person so as to prevent that person proceeding in a direction they have a right to proceed in, is said to wrongfully restrain them. (2) Punishable with simple imprisonment up to one month, or fine up to five thousand rupees, or both.",
    provisos: ["The obstruction of a private way over land or water, which a person in good faith believes he has a lawful right to obstruct, is not an offence under this section."],
    illustrations: ["A obstructs a path along which Z has a right to pass, not believing in good faith that he has a right to stop it. Z is thereby prevented from passing. A wrongfully restrains Z."],
    crossRefs: [127] },
  { id: 127, ipc: 340, category: "Q", title: "Wrongful confinement",
    text: "(1) Wrongfully restraining a person so as to prevent them proceeding beyond certain circumscribing limits is 'wrongful confinement'. (2) Basic punishment: imprisonment up to one year, or fine up to five thousand rupees, or both. (3) For three days or more: imprisonment up to three years, or fine up to ten thousand rupees, or both. (4) For ten days or more: imprisonment up to five years, and fine not less than ten thousand rupees. (5)-(8) Enhanced punishments apply for confining someone despite a writ of liberation, confining someone secretly so their whereabouts are unknown, or confining someone to extort property, a confession, or information.",
    illustrations: [
      "A causes Z to enter a walled space and locks him in, preventing him proceeding beyond the wall. A wrongfully confines Z.",
      "A places armed men at a building's exits and tells Z they will fire if he tries to leave. A wrongfully confines Z."
    ], crossRefs: [126] },

  /* ---- Of Criminal Force and Assault ---- */
  { id: 128, ipc: 349, category: "R", title: "Force",
    text: "A person uses force on another if he causes motion, change of motion, or cessation of motion to that other (or to a substance that brings it into contact with that other), by his own bodily power, by disposing a substance so that motion happens without further act, or by inducing an animal to move.",
    illustrations: [], crossRefs: [129] },
  { id: 129, ipc: 350, category: "R", title: "Criminal force",
    text: "Whoever intentionally uses force to any person, without that person's consent, in order to commit an offence, or intending or knowing it likely that such force will cause injury, fear, or annoyance to the person to whom it is used, is said to use criminal force.",
    illustrations: [
      "A intentionally pushes against Z in the street, without Z's consent, intending or knowing it likely to injure, frighten, or annoy Z. A has used criminal force to Z.",
      "A pours boiling water into a bath he knows Z is about to use, without Z's consent, intending or knowing it likely to injure or annoy Z. A has used criminal force to Z."
    ], crossRefs: [128, 130] },
  { id: 130, ipc: 351, category: "R", title: "Assault",
    text: "Whoever makes any gesture, or preparation, intending or knowing it likely that it will cause any person present to apprehend that criminal force is about to be used against them, is said to commit an assault.",
    explanations: ["Mere words do not amount to an assault. But words may give a gesture or preparation a meaning that makes it amount to an assault."],
    ingredients: ["A gesture or preparation is made", "It is intended, or known to be likely, to cause apprehension of imminent criminal force in a person present"],
    illustrations: [
      "A shakes his fist at Z, intending or knowing it likely to make Z believe A is about to strike him. A has committed an assault.",
      "A takes up a stick, saying to Z, 'I will give you a beating.' The words alone would not be an assault, but the gesture explained by the words may amount to one."
    ], crossRefs: [129] },
  { id: 131, ipc: 352, category: "R", title: "Punishment for assault or criminal force otherwise than on grave provocation",
    text: "Whoever assaults or uses criminal force to any person, otherwise than on grave and sudden provocation given by that person, shall be punished with imprisonment up to three months, or fine up to one thousand rupees, or both.",
    explanations: ["Provocation does not mitigate punishment under this section if self-sought, given by a lawful act of a public servant, or given during lawful private defence."],
    illustrations: [], crossRefs: [136] },
  { id: 132, ipc: 353, category: "R", title: "Assault or criminal force to deter public servant from discharge of his duty",
    text: "Whoever assaults or uses criminal force to a public servant in the execution of his duty, or to prevent/deter such discharge, or in consequence of it, shall be punished with imprisonment up to two years, or fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 133, ipc: 354, category: "R", title: "Assault or criminal force with intent to dishonour a person, otherwise than on grave provocation",
    text: "Whoever assaults or uses criminal force to any person, intending to dishonour them, otherwise than on grave and sudden provocation given by that person, shall be punished with imprisonment up to two years, or fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 134, ipc: 356, category: "R", title: "Assault or criminal force in attempt to commit theft of property carried by a person",
    text: "Whoever assaults or uses criminal force to any person while attempting to commit theft of property that person is wearing or carrying, shall be punished with imprisonment up to two years, or fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 135, ipc: 357, category: "R", title: "Assault or criminal force in attempt wrongfully to confine a person",
    text: "Whoever assaults or uses criminal force to any person while attempting to wrongfully confine them, shall be punished with imprisonment up to one year, or fine up to five thousand rupees, or both.",
    illustrations: [], crossRefs: [127] },
  { id: 136, ipc: 358, category: "R", title: "Assault or criminal force on grave provocation",
    text: "Whoever assaults or uses criminal force to any person on grave and sudden provocation given by that person, shall be punished with simple imprisonment up to one month, or fine up to one thousand rupees, or both.",
    explanations: ["Subject to the same explanation as Section 129 — provocation is measured by whether it was grave and sudden enough, a question of fact."],
    illustrations: [], crossRefs: [131] },

  /* ---- Of Kidnapping, Abduction, Slavery and Forced Labour ---- */
  { id: 137, ipc: 359, category: "S", title: "Kidnapping",
    text: "Kidnapping is of two kinds: (a) kidnapping from India — conveying a person beyond India's limits without their consent (or that of someone legally authorised to consent for them); and (b) kidnapping from lawful guardianship — taking or enticing a child under eighteen, or a person with mental illness, out of the keeping of their lawful guardian, without the guardian's consent. Punishable with imprisonment up to seven years and fine.",
    provisos: ["Does not extend to a person who, in good faith, believes himself to be the father of an illegitimate child under eighteen, or believes himself entitled to the child's lawful custody, unless the act is for an immoral or unlawful purpose."],
    ingredients: ["Taking or enticing a minor (under 18) or person of unsound mind out of lawful guardianship, OR conveying a person beyond India's limits", "Without the consent of the guardian, or the person / their authorised representative, respectively"],
    illustrations: [], crossRefs: [138] },
  { id: 138, ipc: 362, category: "S", title: "Abduction",
    text: "Whoever by force compels, or by any deceitful means induces, any person to go from any place, is said to abduct that person.",
    illustrations: [], crossRefs: [137] },
  { id: 139, ipc: "363A", category: "S", title: "Kidnapping or maiming a child for purposes of begging",
    text: "(1) Kidnapping a child under eighteen, or obtaining custody of such a child (without being the lawful guardian), for the purpose of begging — rigorous imprisonment of ten years to life, and fine. (2) Maiming a child under eighteen for the purpose of begging — imprisonment of twenty years to life (meaning the remainder of natural life), and fine. (3) A non-guardian who employs or uses such a child for begging is presumed, unless proven otherwise, to have kidnapped or obtained the child for that purpose.",
    explanations: ["'Begging' includes soliciting or receiving alms in public (however disguised), entering private premises to solicit alms, exhibiting a sore, wound, deformity, or disease to obtain alms, and using a child as an exhibit to solicit alms."],
    illustrations: [], crossRefs: [] },
  { id: 140, ipc: 364, category: "S", title: "Kidnapping or abducting in order to murder or for ransom, etc.",
    text: "(1) Kidnapping or abducting a person so that they may be murdered, or disposed of in a manner risking murder — imprisonment for life or up to ten years, and fine. (2) Kidnapping/abducting and threatening death or hurt, or by conduct raising reasonable apprehension of death or hurt, or actually causing hurt or death, to compel the Government, a foreign state, an international organisation, or any other person to act, abstain, or pay ransom — punishable with death or imprisonment for life, and fine. (3) Kidnapping/abducting with intent to secretly and wrongfully confine — imprisonment up to seven years, and fine. (4) Kidnapping/abducting to subject the person to grievous hurt, slavery, or unnatural lust — imprisonment up to ten years, and fine.",
    ingredients: ["Kidnapping or abduction (as defined in Sections 137/138)", "Done with intent (or knowledge of likelihood) that the person will be murdered, subjected to grievous harm, or used to extract ransom/compliance through threats to their safety"],
    illustrations: [
      "A kidnaps Z from India, intending or knowing it likely that Z may be sacrificed to an idol. A has committed the offence defined in this section.",
      "A forcibly carries B away from home in order that B may be murdered. A has committed the offence defined in this section."
    ], crossRefs: [137, 138] },
  { id: 141, ipc: "366B", category: "S", title: "Importation of girl or boy from foreign country",
    text: "Importing into India, from any country outside it, a girl under twenty-one or a boy under eighteen, with intent (or knowledge it is likely) that they will be forced or seduced into illicit intercourse with another person — punishable with imprisonment up to ten years and fine.",
    illustrations: [], crossRefs: [] },
  { id: 142, ipc: 368, category: "S", title: "Wrongfully concealing or keeping in confinement, kidnapped or abducted person",
    text: "Whoever, knowing a person has been kidnapped or abducted, wrongfully conceals or confines them, shall be punished as if he himself had kidnapped or abducted that person with the same intention or for the same purpose.",
    illustrations: [], crossRefs: [137, 138] },
  { id: 143, ipc: 370, category: "S", title: "Trafficking of person",
    text: "(1) Recruiting, transporting, harbouring, transferring, or receiving a person, for the purpose of exploitation, by means of threats, force or coercion, abduction, fraud or deception, abuse of power, or inducement (including payments or benefits) to obtain the consent of a person controlling the victim, constitutes trafficking. (2)-(7) Base punishment is rigorous imprisonment of seven to ten years, escalating to ten years-to-life for trafficking multiple persons or a child, fourteen years-to-life for multiple children, mandatory life imprisonment for repeat child-trafficking offenders, and mandatory life imprisonment where a public servant or police officer is involved.",
    explanations: ["'Exploitation' includes physical or sexual exploitation, slavery or practices similar to slavery, servitude, beggary, or forced organ removal.", "The consent of the victim is immaterial in determining whether trafficking occurred."],
    illustrations: [], crossRefs: [] },
  { id: 144, ipc: 370, category: "S", title: "Exploitation of a trafficked person",
    text: "(1) Knowingly, or with reason to believe, engaging a trafficked child (under eighteen) for sexual exploitation — rigorous imprisonment of five to ten years, and fine. (2) The same act against a trafficked adult — rigorous imprisonment of three to seven years, and fine.",
    illustrations: [], crossRefs: [143] },
  { id: 145, ipc: 371, category: "S", title: "Habitual dealing in slaves",
    text: "Whoever habitually imports, exports, removes, buys, sells, traffics, or deals in slaves shall be punished with imprisonment for life, or imprisonment up to ten years, and shall also be liable to fine.",
    illustrations: [], crossRefs: [] },
  { id: 146, ipc: 374, category: "S", title: "Unlawful compulsory labour",
    text: "Whoever unlawfully compels any person to labour against that person's will shall be punished with imprisonment up to one year, or fine, or both.",
    illustrations: [], crossRefs: [] },

  /* ---- Chapter VII — Of Offences Against The State ---- */
  { id: 147, ipc: 121, category: "AA", title: "Waging, or attempting to wage war, or abetting waging of war, against the Government of India",
    text: "Whoever wages war against the Government of India, or attempts to wage such war, or abets the waging of such war, shall be punished with death, or imprisonment for life and shall also be liable to fine.",
    punishment: "Death, or imprisonment for life, plus fine.",
    illustrations: ["A joins an insurrection against the Government of India. A has committed the offence defined in this section."],
    crossRefs: [] },
  { id: 148, ipc: "121A", category: "AA", title: "Conspiracy to commit offences punishable by Section 147",
    text: "Whoever within or without and beyond India conspires to commit any of the offences punishable by section 147, or conspires to overawe, by means of criminal force or the show of criminal force, the Central Government or any State Government, shall be punished with imprisonment for life, or with imprisonment of either description which may extend to ten years, and shall also be liable to fine.",
    explanations: ["To constitute a conspiracy under this section, it is not necessary that any act or illegal omission shall take place in pursuance thereof — the agreement alone is enough."],
    punishment: "Imprisonment for life, or up to ten years, plus fine.",
    illustrations: [], crossRefs: [147] },
  { id: 149, ipc: 122, category: "AA", title: "Collecting arms, etc., with intention of waging war against the Government of India",
    text: "Whoever collects men, arms or ammunition or otherwise prepares to wage war with the intention of either waging or being prepared to wage war against the Government of India, shall be punished with imprisonment for life or imprisonment of either description for a term not exceeding ten years, and shall also be liable to fine.",
    punishment: "Imprisonment for life, or up to ten years, plus fine.",
    illustrations: [], crossRefs: [147] },
  { id: 150, ipc: 123, category: "AA", title: "Concealing with intent to facilitate design to wage war",
    text: "Whoever by any act, or by any illegal omission, conceals the existence of a design to wage war against the Government of India, intending by such concealment to facilitate, or knowing it to be likely that such concealment will facilitate, the waging of such war, shall be punished with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.",
    punishment: "Imprisonment up to ten years, plus fine.",
    illustrations: [], crossRefs: [147] },
  { id: 151, ipc: 124, category: "AA", title: "Assaulting President, Governor, etc., with intent to compel or restrain the exercise of any lawful power",
    text: "Whoever, with the intention of inducing or compelling the President of India, or Governor of any State, to exercise or refrain from exercising in any manner any of the lawful powers of such President or Governor, assaults or wrongfully restrains, or attempts wrongfully to restrain, or overawes, by means of criminal force or the show of criminal force, or attempts so to overawe, such President or Governor, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    punishment: "Imprisonment up to seven years, plus fine.",
    illustrations: [], crossRefs: [] },
  { id: 152, ipc: "124A", category: "AA", title: "Acts endangering sovereignty, unity and integrity of India",
    text: "Whoever, purposely or knowingly, by words, either spoken or written, or by signs, or by visible representation, or by electronic communication or by use of financial means, or otherwise, excites or attempts to excite, secession or armed rebellion or subversive activities, or encourages feelings of separatist activities or endangers sovereignty or unity and integrity of India, or indulges in or commits any such act, shall be punished with imprisonment for life or with imprisonment which may extend to seven years, and shall also be liable to fine.",
    simpleExplanation: "This is BNS's replacement for the old, highly controversial 'sedition' provision (IPC Section 124A). It's framed differently — not around criticism of government, but around exciting secession, armed rebellion, or acts endangering India's sovereignty/unity. The Explanation below is the safeguard: honest criticism of government policy through lawful means is expressly carved out and protected.",
    explanations: ["Comments expressing disapproval of the measures, or administrative or other action, of the Government, made with a view to obtaining their alteration by lawful means, without exciting or attempting to excite the activities referred to in this section, do not constitute an offence under this section."],
    punishment: "Imprisonment for life, or up to seven years, plus fine.",
    illustrations: [], crossRefs: [] },
  { id: 153, ipc: 125, category: "AA", title: "Waging war against the Government of any foreign State at peace with the Government of India",
    text: "Whoever wages war against the Government of any foreign State at peace with the Government of India, or attempts to wage such war, or abets the waging of such war, shall be punished with imprisonment for life, to which fine may be added, or with imprisonment of either description for a term which may extend to seven years, to which fine may be added, or with fine.",
    illustrations: [], crossRefs: [] },
  { id: 154, ipc: 126, category: "AA", title: "Committing depredation on territories of foreign State at peace with the Government of India",
    text: "Whoever commits depredation, or makes preparations to commit depredation, on the territories of any foreign State at peace with the Government of India, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine and to forfeiture of any property used or intended to be used in committing such depredation, or acquired by such depredation.",
    illustrations: [], crossRefs: [] },
  { id: 155, ipc: 127, category: "AA", title: "Receiving property taken by war or depredation mentioned in Sections 153 and 154",
    text: "Whoever receives any property knowing the same to have been taken in the commission of any of the offences mentioned in sections 153 and 154, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine and to forfeiture of the property so received.",
    illustrations: [], crossRefs: [153, 154] },
  { id: 156, ipc: 128, category: "AA", title: "Public servant voluntarily allowing prisoner of State or war to escape",
    text: "Whoever, being a public servant and having the custody of any State prisoner or prisoner of war, voluntarily allows such prisoner to escape from any place in which such prisoner is confined, shall be punished with imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.",
    illustrations: [], crossRefs: [157] },
  { id: 157, ipc: 129, category: "AA", title: "Public servant negligently suffering such prisoner to escape",
    text: "Whoever, being a public servant and having the custody of any State prisoner or prisoner of war, negligently suffers such prisoner to escape from any place of confinement in which such prisoner is confined, shall be punished with simple imprisonment for a term which may extend to three years, and shall also be liable to fine.",
    simpleExplanation: "The companion offence to Section 156 — same custodial failure, but the difference is intent. Voluntarily allowing escape (156) means deliberate or knowing conduct; negligently suffering escape (157) means carelessness, not deliberate action. That's why the punishment gap is so large — life/ten years versus three years simple imprisonment.",
    illustrations: [], crossRefs: [156] },
  { id: 158, ipc: 130, category: "AA", title: "Aiding escape of, rescuing or harbouring such prisoner",
    text: "Whoever knowingly aids or assists any State prisoner or prisoner of war in escaping from lawful custody, or rescues or attempts to rescue any such prisoner, or harbours or conceals any such prisoner who has escaped from lawful custody, or offers or attempts to offer any resistance to the recapture of such prisoner, shall be punished with imprisonment for life, or with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.",
    explanations: ["A State prisoner or prisoner of war who is permitted to be at large on parole within certain limits in India is said to escape from lawful custody if he goes beyond those limits."],
    illustrations: [], crossRefs: [156] },

  /* ---- Chapter X — Of Coin, Currency-Notes, Bank-Notes and Government Stamps ---- */
  { id: 178, ipc: null, category: "YY", title: "Counterfeiting coin, government stamps, currency-notes or bank-notes",
    text: "Whoever counterfeits, or knowingly performs any part of the process of counterfeiting, any coin, stamp issued by Government for the purpose of revenue, currency note or bank-note, shall be punished with imprisonment for life, or with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.",
    explanations: [
      "\"Bank-note\" means a promissory note or engagement for the payment of money to bearer on demand issued by any person carrying on the business of banking anywhere in the world, or issued by or under the authority of any State or Sovereign Power, intended to be used as equivalent to, or a substitute for, money.",
      "\"Coin\" has the meaning assigned in Section 2 of the Coinage Act, 2011, and includes metal used for the time being as money, stamped and issued by or under the authority of any State or Sovereign Power, intended to be so used.",
      "A person commits \"counterfeiting Government stamp\" who causes a genuine stamp of one denomination to appear like a genuine stamp of a different denomination.",
      "A person commits \"counterfeiting coin\" who, intending to practise deception (or knowing deception is likely), causes a genuine coin to appear like a different coin.",
      "\"Counterfeiting coin\" includes diminishing a coin's weight, or altering its composition or appearance."
    ],
    punishment: "Imprisonment for life, or up to ten years, plus fine. Cognizable, non-bailable, triable by Court of Session.",
    illustrations: [], crossRefs: [179, 180, 181] },
  { id: 179, ipc: null, category: "YY", title: "Using as genuine, forged or counterfeit coin, Government stamp, currency-notes or bank-notes",
    text: "Whoever sells or delivers to, or buys or receives from, any other person, or otherwise traffics or uses as genuine, any forged or counterfeit coin, stamp issued by Government for the purpose of revenue, currency-note or bank-note, knowing or having reason to believe it forged or counterfeit, shall be punished with imprisonment for life, or with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.",
    punishment: "Imprisonment for life, or up to ten years, plus fine. Cognizable, non-bailable, triable by Court of Session.",
    illustrations: [], crossRefs: [178] },
  { id: 180, ipc: null, category: "YY", title: "Possession of forged or counterfeit coin, Government stamp, currency-notes or bank-notes",
    text: "Whoever has in his possession any forged or counterfeit coin, stamp issued by Government for the purpose of revenue, currency-note or bank-note, knowing or having reason to believe it forged or counterfeit, and intending to use it as genuine (or that it may be used as genuine), shall be punished with imprisonment up to seven years, or fine, or both.",
    punishment: "Up to seven years, or fine, or both. Cognizable, non-bailable, triable by Court of Session.",
    illustrations: [], crossRefs: [178, 179] },
  { id: 181, ipc: null, category: "YY", title: "Making or possessing instruments or materials for forging or counterfeiting coin, Government stamp, currency-notes or bank-notes",
    text: "Whoever makes or mends, or performs any part of the process of making or mending, or buys, sells, disposes of, or possesses any machinery, die, instrument, or material for the purpose of being used (or knowing/believing it is intended to be used) for forging or counterfeiting any coin, Government revenue stamp, currency-note, or bank-note, shall be punished with imprisonment for life, or with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.",
    punishment: "Imprisonment for life, or up to ten years, plus fine. Cognizable, non-bailable, triable by Court of Session.",
    illustrations: [], crossRefs: [178] },
  { id: 182, ipc: null, category: "YY", title: "Making or using documents resembling currency-notes or bank-notes",
    text: "(1) Whoever makes, causes to be made, uses for any purpose, or delivers to any person, a document purporting to be, or resembling (or so nearly resembling as to be calculated to deceive), any currency-note or bank-note, shall be punished with fine up to ₹300. (2) A person whose name appears on such a document, who refuses without lawful excuse to disclose to a police officer (on being required) the name and address of the printer/maker, shall be punished with fine up to ₹600. (3) Where a person's name appears on such a document, or on any other document used/distributed in connection with it, it may be presumed (until the contrary is proved) that they caused the document to be made.",
    punishment: "Fine up to ₹300 (sub-section 1); fine up to ₹600 (sub-section 2, refusal to disclose).",
    illustrations: [], crossRefs: [] },
  { id: 183, ipc: null, category: "YY", title: "Effacing writing from substance bearing Government stamp, or removing from document a stamp used for it, with intent to cause loss to Government",
    text: "Whoever, fraudulently or intending to cause loss to Government, removes or effaces from any substance bearing a Government revenue stamp any writing/document for which the stamp was used, or removes from a writing/document a stamp used for it, so that the stamp may be used for a different writing/document, shall be punished with imprisonment up to three years, or fine, or both.",
    punishment: "Up to three years, or fine, or both. Cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [184, 185] },
  { id: 184, ipc: null, category: "YY", title: "Using Government stamp known to have been before used",
    text: "Whoever, fraudulently or intending to cause loss to Government, uses for any purpose a Government revenue stamp which he knows to have been used before, shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Up to two years, or fine, or both. Cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [183, 185] },
  { id: 185, ipc: null, category: "YY", title: "Erasure of mark denoting that stamp has been used",
    text: "Whoever, fraudulently or intending to cause loss to Government, erases or removes from a Government revenue stamp any mark denoting it has been used, or knowingly possesses, sells, or disposes of any such stamp from which such a mark has been erased/removed, or sells/disposes of a stamp they know to have been used, shall be punished with imprisonment up to three years, or fine, or both.",
    punishment: "Up to three years, or fine, or both. Cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [183, 184] },
  { id: 186, ipc: null, category: "YY", title: "Prohibition of fictitious stamps",
    text: "(1) Whoever (a) makes, knowingly utters, deals in, or sells any fictitious stamp, or knowingly uses any fictitious stamp for a postal purpose; or (b) possesses, without lawful excuse, any fictitious stamp; or (c) makes, or without lawful excuse possesses, any die, plate, instrument, or materials for making a fictitious stamp — shall be punished with fine up to ₹200. (2) Any such stamp, die, plate, instrument, or materials found in someone's possession for making a fictitious stamp may be seized and, if seized, forfeited.",
    explanations: [
      "\"Fictitious stamp\" means any stamp falsely purporting to be issued by Government to denote a rate of postage, or any facsimile, imitation, or representation (on paper or otherwise) of such a stamp.",
      "In this section, and in Sections 176–179 and 181–183, \"Government\" (in connection with a postage stamp) includes any person authorised by law to administer executive Government in any part of India or a foreign country."
    ],
    punishment: "Fine up to ₹200. Cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [] },
  { id: 187, ipc: null, category: "YY", title: "Person employed in mint causing coin to be of different weight or composition from that fixed by law",
    text: "Whoever, being employed in a mint lawfully established in India, does any act or omits a legally required act, intending to cause any coin issued from that mint to differ in weight or composition from what is fixed by law, shall be punished with imprisonment up to seven years, and shall also be liable to fine.",
    punishment: "Up to seven years, and fine. Cognizable, non-bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [188] },
  { id: 188, ipc: null, category: "YY", title: "Unlawfully taking coining instrument from mint",
    text: "Whoever, without lawful authority, takes out of any mint lawfully established in India any coining tool or instrument, shall be punished with imprisonment up to seven years, and shall also be liable to fine.",
    punishment: "Up to seven years, and fine. Cognizable, non-bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [187] },

  /* ---- Chapter XI — Of Offences Against The Public Tranquillity ---- */
  { id: 189, ipc: 141, category: "BB", title: "Unlawful assembly",
    text: "(1) An assembly of five or more persons is designated an 'unlawful assembly' if the common object of the persons composing it is: (a) to overawe by criminal force the Central or State Government, Parliament, or a State Legislature, or a public servant exercising lawful power; or (b) to resist the execution of any law or legal process; or (c) to commit any mischief, criminal trespass, or other offence; or (d) by criminal force, to take/obtain possession of property, or deprive a person of a right of way or use of water or other incorporeal right, or to enforce a right or supposed right; or (e) by criminal force, to compel a person to do what they are not legally bound to do, or omit what they are legally entitled to do. (2)-(9) Membership of, joining, continuing in, or failing to disperse from such an assembly is separately punishable, on an escalating scale depending on whether the member is armed, knows the assembly was ordered to disperse, or is the one hiring/harbouring participants.",
    simpleExplanation: "Note that an unlawful assembly is defined entirely by its shared purpose (one of five listed objects), not by anything violent actually happening — that's what separates it from Rioting (Section 191), which requires force or violence to have actually been used.",
    explanations: ["An assembly that was lawful when it gathered may subsequently become an unlawful assembly if its object changes.", "If the assembly is already an unlawful assembly under sub-section (1), an offender under sub-section (5) is punished instead under sub-section (3)."],
    punishment: "Simple membership: up to 6 months or fine or both. Continuing after order to disperse: up to 2 years or fine or both. Being armed with a deadly weapon as a member: up to 2 years or fine or both. Hiring/harbouring participants: punished as a member for the assembly's own offences.",
    ingredients: ["Five or more persons assembled", "A shared common object falling within one of the five listed categories", "The person charged knew the facts making the assembly unlawful and intentionally joined or continued in it"],
    illustrations: [], crossRefs: [190, 191] },
  { id: 190, ipc: 149, category: "BB", title: "Every member of unlawful assembly guilty of offence committed in prosecution of common object",
    text: "If an offence is committed by any member of an unlawful assembly in prosecution of the common object of that assembly, or such as the members of that assembly knew to be likely to be committed in prosecution of that object, every person who, at the time of the committing of that offence, is a member of the same assembly, is guilty of that offence.",
    simpleExplanation: "This is the 'constructive liability' provision — it makes every member of the mob liable for what any one member does, as long as it was either the shared goal or something the group could reasonably foresee. You don't have to have thrown the stone yourself to be guilty of the offence the stone caused.",
    punishment: "The same punishment as for the offence actually committed.",
    illustrations: [], crossRefs: [189] },
  { id: 191, ipc: 146, category: "BB", title: "Rioting",
    text: "(1) Whenever force or violence is used by an unlawful assembly, or by any member of it, in prosecution of the common object of the assembly, every member of the assembly is guilty of the offence of rioting. (2) Rioting is punishable with imprisonment up to two years, or fine, or both. (3) Rioting while armed with a deadly weapon is punishable with imprisonment up to five years, or fine, or both.",
    ingredients: ["An unlawful assembly (Section 189) exists", "Force or violence is actually used by the assembly, or any member of it, in prosecution of the common object"],
    illustrations: [], crossRefs: [189, 190] },
  { id: 192, ipc: 153, category: "BB", title: "Wantonly giving provocation with intent to cause riot",
    text: "Whoever malignantly, or wantonly by doing anything illegal, gives provocation to any person, intending or knowing it likely that such provocation will cause the offence of rioting to be committed, shall — if rioting is committed in consequence — be punished with imprisonment up to one year, or fine, or both; if rioting is not committed, with imprisonment up to six months, or fine, or both.",
    illustrations: [], crossRefs: [191] },
  { id: 193, ipc: 154, category: "BB", title: "Liability of owner, occupier, etc., of land on which an unlawful assembly or riot takes place",
    text: "(1) Where an unlawful assembly or riot occurs on land, the owner/occupier (or anyone claiming an interest in it) is punishable with fine up to one thousand rupees if they (or their agent/manager), knowing of it or having reason to believe it was likely, fail to give the earliest possible notice to the nearest police station, fail to use all lawful means to prevent it beforehand, or fail to use all lawful means to disperse or suppress it once it occurs. (2)-(3) Where the riot is committed for the benefit of, or on behalf of, such a person with an interest in the land or the underlying dispute, that person (or their agent/manager) is separately punishable with fine on the same failure-to-prevent basis.",
    illustrations: [], crossRefs: [189, 191] },
  { id: 194, ipc: 159, category: "BB", title: "Affray",
    text: "(1) When two or more persons, by fighting in a public place, disturb the public peace, they are said to commit an affray. (2) Affray is punishable with imprisonment up to one month, or fine up to one thousand rupees, or both.",
    illustrations: [], crossRefs: [] },
  { id: 195, ipc: 152, category: "BB", title: "Assaulting or obstructing public servant when suppressing riot, etc.",
    text: "(1) Assaulting, obstructing, or using criminal force on a public servant discharging their duty to disperse an unlawful assembly or suppress a riot/affray is punishable with imprisonment up to three years, or fine not less than twenty-five thousand rupees, or both. (2) Threatening or attempting the same is punishable with imprisonment up to one year, or fine, or both.",
    illustrations: [], crossRefs: [189, 191] },
  { id: 196, ipc: "153A", category: "BB", title: "Promoting enmity between different groups on grounds of religion, race, etc., and acts prejudicial to maintenance of harmony",
    text: "(1) Whoever — (a) by words, signs, visible representation, or electronic communication, promotes or attempts to promote disharmony or feelings of enmity, hatred, or ill-will between groups on grounds of religion, race, place of birth, residence, language, caste, community, or any other ground; or (b) commits an act prejudicial to the maintenance of harmony between such groups, likely to disturb public tranquillity; or (c) organises, trains for, or participates in any exercise/drill/movement intending or knowing it likely that participants will use or be trained to use criminal force or violence against such a group, causing fear or insecurity among its members — shall be punished with imprisonment up to three years, or fine, or both. (2) The same offence committed in a place of worship or religious assembly is punishable with imprisonment up to five years, and fine.",
    illustrations: [], crossRefs: [] },
  { id: 197, ipc: "153B", category: "BB", title: "Imputations, assertions prejudicial to national integration",
    text: "(1) Whoever, by words, signs, visible representation, or electronic communication — (a) imputes that any class of persons cannot, by reason of religion/race/language/regional/caste/community membership, bear true faith and allegiance to the Constitution or uphold India's sovereignty and integrity; or (b) asserts that such persons should be denied their rights as citizens; or (c) makes an assertion/appeal about the obligations of such persons that is likely to cause disharmony or enmity; or (d) publishes false or misleading information jeopardising India's sovereignty, unity, integrity, or security — shall be punished with imprisonment up to three years, or fine, or both. (2) The same offence committed in a place of worship or religious assembly is punishable with imprisonment up to five years, and fine.",
    illustrations: [], crossRefs: [196] },

  /* ---- Chapter XIX — Of Criminal Intimidation, Insult, Annoyance, Defamation, Etc. ---- */
  { id: 351, ipc: 503, category: "CC", title: "Criminal intimidation",
    text: "(1) Whoever threatens by any means another with injury to their person, reputation, or property (or to a person in whom that person is interested), intending to cause alarm, or to compel them to do an act they are not legally bound to do, or omit an act they are legally entitled to do — as the means of avoiding execution of the threat — commits criminal intimidation. (2) Basic punishment: imprisonment up to two years, or fine, or both. (3) Where the threat is to cause death, grievous hurt, destruction of property by fire, an offence punishable with death/life/up to seven years' imprisonment, or to impute unchastity to a woman: imprisonment up to seven years, or fine, or both. (4) Where committed by anonymous communication, or having concealed the sender's identity: an additional two years' imprisonment on top of the punishment under sub-section (1).",
    explanations: ["A threat to injure the reputation of a deceased person in whom the threatened person is interested falls within this section."],
    ingredients: ["A threat of injury to person, reputation, or property (of the person threatened or someone they care about)", "Made with intent to cause alarm, or to compel an act/omission as the means of avoiding the threat"],
    illustrations: ["A, to induce B to desist from prosecuting a civil suit, threatens to burn B's house. A is guilty of criminal intimidation."],
    crossRefs: [] },
  { id: 352, ipc: 504, category: "CC", title: "Intentional insult with intent to provoke breach of peace",
    text: "Whoever intentionally insults another, thereby giving provocation, intending or knowing it likely that such provocation will cause the person to break the public peace or commit any other offence, shall be punished with imprisonment up to two years, or fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 353, ipc: 505, category: "CC", title: "Statements conducing to public mischief",
    text: "(1) Making, publishing, or circulating (including electronically) any statement, false information, rumour, or report — (a) intending or likely to cause armed-forces personnel to mutiny or disregard duty; or (b) intending or likely to cause fear/alarm to the public leading someone to commit an offence against the State or public tranquillity; or (c) intending or likely to incite one class/community against another — is punishable with imprisonment up to three years, or fine, or both. (2) The same, aimed at creating enmity between religious/racial/language/regional/caste groups, carries the same punishment. (3) If committed in a place of worship or religious assembly: imprisonment up to five years, and fine.",
    provisos: ["It is not an offence if the person had reasonable grounds to believe the statement was true and made/published/circulated it in good faith, without any of the intents listed above."],
    illustrations: [], crossRefs: [] },
  { id: 354, ipc: 508, category: "CC", title: "Act caused by inducing person to believe that he will be rendered an object of the Divine displeasure",
    text: "Whoever voluntarily causes or attempts to cause a person to do (or omit) something they are not legally bound to do (or legally entitled to do), by inducing a belief that they or someone they care about will become an object of Divine displeasure otherwise, shall be punished with imprisonment up to one year, or fine, or both.",
    illustrations: [
      "A sits dharna at Z's door intending to cause it to be believed that, by so sitting, he renders Z an object of Divine displeasure. A has committed the offence.",
      "A threatens Z that, unless Z performs a certain act, A will kill one of his own children, in circumstances where the killing would be believed to render Z an object of Divine displeasure. A has committed the offence."
    ], crossRefs: [] },
  { id: 355, ipc: 510, category: "CC", title: "Misconduct in public by a drunken person",
    text: "Whoever, in a state of intoxication, appears in any public place or a place they are trespassing into, and conducts themselves so as to cause annoyance to any person, shall be punished with simple imprisonment up to twenty-four hours, or fine up to one thousand rupees, or both, or with community service.",
    illustrations: [], crossRefs: [] },
  { id: 356, ipc: 499, category: "DD", title: "Defamation",
    text: "(1) Whoever, by words (spoken or intended to be read), signs, or visible representations, makes or publishes any imputation concerning a person, intending to harm (or knowing/having reason to believe it will harm) that person's reputation, is said — except in the cases excepted below — to defame that person. (2) Defamation is punishable with simple imprisonment up to two years, or fine, or both, or community service. (3) Printing or engraving defamatory matter, knowing it to be such, is punishable with simple imprisonment up to two years, or fine, or both. (4) Selling or offering for sale printed/engraved defamatory matter, knowing it to contain such matter, carries the same punishment as sub-section (3).",
    simpleExplanation: "Defamation has two layers: the definition (what counts as defaming someone) and ten Exceptions (situations that look like defamation but the law protects anyway — fair comment on public servants, true statements for the public good, court reporting, good-faith reviews of a book/performance, and so on). Subramanian Swamy is the case to know here: it settled that criminal defamation itself is constitutional, not just civil defamation.",
    explanations: [
      "Explanation 1: Imputing something to a deceased person can be defamation if it would harm their reputation while living, and is meant to hurt their family's feelings.",
      "Explanation 2: An imputation against a company, association, or collection of persons can amount to defamation.",
      "Explanation 3: An imputation made as an alternative, or expressed ironically, can still amount to defamation.",
      "Explanation 4: No imputation harms reputation unless it lowers the person's moral/intellectual character, their character in respect of caste or calling, their credit, or causes belief that their body is in a loathsome or generally disgraceful state."
    ],
    provisos: [
      "Exception 1 — True imputations made for the public good.",
      "Exception 2 — Good-faith opinion on a public servant's conduct in discharging public functions (and character only as it appears in that conduct).",
      "Exception 3 — Good-faith opinion on any person's conduct touching a public question (character only as it appears in that conduct).",
      "Exception 4 — Publishing a substantially true report of Court proceedings.",
      "Exception 5 — Good-faith opinion on the merits of a case already decided by a Court, or on a party/witness/agent's conduct in it.",
      "Exception 6 — Good-faith opinion on the merits of a performance its author submitted to public judgment (a book, speech, public performance).",
      "Exception 7 — Good-faith censure by someone with lawful authority over another (a Judge on a witness, a parent on a child, an employer on an employee), limited to matters within that authority.",
      "Exception 8 — Good-faith accusation to a person with lawful authority over the person accused.",
      "Exception 9 — Good-faith imputation made to protect the interests of the speaker, another person, or the public.",
      "Exception 10 — A good-faith caution given for the benefit of the person warned, someone they care about, or the public."
    ],
    ingredients: ["An imputation concerning a person, made or published by words/signs/visible representation", "Made with intent to harm reputation, or knowledge/reason to believe it will", "Does not fall within any of the ten Exceptions"],
    illustrations: [
      "A says 'Z is an honest man; he never stole B's watch,' intending to cause it to be believed that Z did steal B's watch. This is defamation, unless within an Exception.",
      "A draws a picture of Z running away with B's watch, intending it to be believed that Z stole B's watch. This is defamation, unless within an Exception."
    ], crossRefs: [],
    cases: [{ name: "Subramanian Swamy v. Union of India", cite: "(2016) 7 SCC 221", year: 2016,
      ratio: "The Supreme Court upheld the constitutional validity of criminal defamation, holding that the right to reputation under Article 21 justifies criminal defamation as a reasonable restriction on free speech under Article 19(2) — free speech and the right to reputation must be balanced, not one automatically trumping the other.",
      url: "https://indiankanoon.org/doc/80997184/" }] },
  { id: 357, ipc: 491, category: "DD", title: "Breach of contract to attend on and supply wants of helpless person",
    text: "Whoever, being bound by a lawful contract to attend on or supply the wants of a person who, by reason of youth, mental illness, disease, or bodily weakness, is helpless or incapable of providing for their own safety or wants, voluntarily omits to do so, shall be punished with imprisonment up to three months, or fine up to five thousand rupees, or both.",
    illustrations: [], crossRefs: [] },

  /* ---- Chapter XVII — Of Offences Against Property ---- */
  { id: 303, ipc: 378, category: "EE", title: "Theft",
    text: "(1) Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
    simpleExplanation: "Four things must line up: the property must be movable, it must be taken out of someone's possession, without their consent, and — the part students most often get wrong — the offence is complete the instant the property is *moved* with dishonest intent, even if the thief is caught a second later and never actually gets away with it. You don't need asportation (successful carrying-away) for theft to be committed, just the dishonest moving.",
    explanations: [
      "Explanation 1: A thing so long as it is attached to the earth, not being movable property, is not the subject of theft; but it becomes capable of being the subject of theft as soon as it is severed from the earth.",
      "Explanation 2: A moving effected by the same act which effects the severance may be a theft.",
      "Explanation 3: A person is said to cause a thing to move by removing an obstacle which prevented it from moving, or by separating it from any other thing, as well as by actually moving it.",
      "Explanation 4: A person who by any means causes an animal to move is said to move that animal, and to move everything which, in consequence of the motion so caused, is moved by that animal.",
      "Explanation 5: The consent mentioned in this section may be express or implied, and may be given either by the person in possession, or by any person having authority, express or implied, for that purpose."
    ],
    punishment: "Imprisonment up to three years, or fine, or both. On a second or subsequent conviction: rigorous imprisonment of one to five years, and fine. Where the stolen property is worth less than ₹5,000 and it's a first conviction, the court may order community service instead, if the value or the property itself is returned.",
    ingredients: ["The property is movable", "It was taken out of the possession of another person", "It was taken without that person's consent", "The taking (moving) was done with dishonest intention"],
    illustrations: [
      "A cuts down a tree on Z's ground, with the intention of dishonestly taking the tree out of Z's possession without Z's consent. As soon as A has severed the tree in order to such taking, he has committed theft.",
      "A puts a bait for dogs in his pocket, and thus induces Z's dog to follow it. If A's intention is to dishonestly take the dog out of Z's possession without Z's consent, A has committed theft as soon as Z's dog begins to follow A.",
      "A meets a bullock carrying a box of treasure. He drives the bullock in a certain direction to dishonestly take the treasure. As soon as the bullock begins to move, A has committed theft of the treasure.",
      "A, being Z's servant and entrusted with the care of Z's plate, dishonestly runs away with the plate, without Z's consent. A has committed theft.",
      "Z, going on a journey, entrusts his plate to A, a warehouse-keeper, till Z returns. A carries the plate to a goldsmith and sells it. Here the plate was not in Z's possession, so it could not be taken out of Z's possession — A has not committed theft, though he may have committed criminal breach of trust.",
      "A finds a ring belonging to Z on a table in the house Z occupies. The ring is in Z's possession, and if A dishonestly removes it, A commits theft.",
      "A finds a ring lying on the highroad, not in the possession of any person. A, by taking it, commits no theft, though he may commit criminal misappropriation.",
      "A sees a ring belonging to Z lying on a table in Z's house. Not venturing to misappropriate it immediately for fear of detection, A hides it where it is highly improbable Z will ever find it, intending to retrieve and sell it once the loss is forgotten. A commits theft at the moment he first moves the ring.",
      "A delivers his watch to Z, a jeweller, for repair. A, not owing Z any debt that would let Z lawfully detain the watch, openly enters the shop, takes his watch by force from Z's hand, and carries it away. A may have committed criminal trespass and assault, but not theft, since what he did was not done dishonestly.",
      "If A owes Z money for repairing the watch, and Z lawfully retains it as security, and A takes the watch from Z's possession intending to deprive Z of that security, A commits theft, since he takes it dishonestly.",
      "If A, having pawned his watch to Z, takes it out of Z's possession without Z's consent, without having repaid what he borrowed, he commits theft — even though the watch is his own property — because he takes it dishonestly.",
      "A takes an article belonging to Z out of Z's possession without consent, intending to keep it until Z pays a reward for its return. A takes dishonestly and has therefore committed theft.",
      "A, on friendly terms with Z, enters Z's library in Z's absence and takes a book merely to read it, intending to return it. If A believed he had Z's implied consent, A has not committed theft.",
      "A asks charity from Z's wife. She gives A money, food, and clothes she knows belong to Z, her husband. If A reasonably believed she was authorised to give alms, A has not committed theft.",
      "A is the paramour of Z's wife. She gives A valuable property she knows belongs to Z and that she has no authority to give. If A takes it dishonestly, he commits theft.",
      "A, in good faith believing property belonging to Z is actually his own, takes it out of Z's possession. As A does not take dishonestly, he does not commit theft."
    ], crossRefs: [],
    cases: [{ name: "Pyare Lal Bhargava v. State of Rajasthan", cite: "AIR 1963 SC 1094", year: 1962,
      ratio: "The Supreme Court held that theft doesn't require permanent deprivation — temporarily removing property, even with intent to return it, still amounts to theft if it causes wrongful loss to the possessor in the meantime. A government official who temporarily removed and later returned an office file was still guilty of theft.",
      url: "https://indiankanoon.org/doc/1689792/" }] },
  { id: 304, ipc: null, category: "EE", title: "Snatching",
    text: "(1) Theft is 'snatching' if, in order to commit theft, the offender suddenly or quickly or forcibly seizes, secures, grabs, or takes away any movable property from any person or from their possession. (2) Whoever commits snatching shall be punished with imprisonment up to three years, and shall also be liable to fine.",
    simpleExplanation: "This is a genuinely new offence — it didn't exist as a separate provision in the IPC, where a snatched phone or chain would just be prosecuted as ordinary theft (or robbery, if force against the person was used). BNS carves 'snatching' out as its own named offence, reflecting how common chain- and phone-snatching had become.",
    punishment: "Imprisonment up to three years, plus fine.",
    illustrations: [], crossRefs: [303] },
  { id: 305, ipc: 380, category: "EE", title: "Theft in a dwelling house, or means of transportation or place of worship, etc.",
    text: "Whoever commits theft — (1) in any building, tent, or vessel used as a human dwelling or for the custody of property; or (2) of any means of transport used to carry goods or passengers; or (3) of any article or goods from such a means of transport; or (4) of an idol or icon in a place of worship; or (5) of any property of the Government or a local authority — shall be punished with imprisonment up to seven years, and shall also be liable to fine.",
    punishment: "Imprisonment up to seven years, plus fine. Cognizable, non-bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [303] },
  { id: 306, ipc: 381, category: "EE", title: "Theft by clerk or servant of property in possession of master",
    text: "Whoever, being a clerk or servant, or employed as a clerk or servant, commits theft of property in the possession of their master or employer, shall be punished with imprisonment up to seven years, and shall also be liable to fine.",
    punishment: "Imprisonment up to seven years, plus fine. Cognizable, non-bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [303] },
  { id: 307, ipc: 382, category: "EE", title: "Theft after preparation made for causing death, hurt or restraint in order to the committing of theft",
    text: "Whoever commits theft, having made preparation for causing death, hurt, restraint, or fear of death, hurt, or restraint to any person, in order to commit the theft, or to effect their escape after committing it, or to retain the property taken, shall be punished with rigorous imprisonment up to ten years, and shall also be liable to fine.",
    punishment: "Rigorous imprisonment up to ten years, plus fine.",
    illustrations: [
      "A commits theft on property in Z's possession, and while committing the theft has a loaded pistol under his garment, having provided it to hurt Z should Z resist. A has committed the offence defined in this section.",
      "A picks Z's pocket, having posted several companions nearby to restrain Z if Z should perceive what is happening and resist or attempt to apprehend A. A has committed the offence defined in this section."
    ], crossRefs: [303] },

  { id: 308, ipc: 383, category: "FF", title: "Extortion",
    text: "(1) Whoever intentionally puts any person in fear of injury to that person or any other, and thereby dishonestly induces the person so put in fear to deliver to any person any property, valuable security, or anything signed or sealed which may be converted into a valuable security, commits 'extortion'.",
    simpleExplanation: "The core distinction from theft: extortion involves the victim *handing over* the property themselves, induced by fear — there's a delivery, not a taking. That's also what separates it from robbery: extortion becomes robbery only when the fear is of instant harm and the offender is physically present when it happens (Section 309).",
    punishment: "Base: imprisonment up to seven years, or fine, or both (sub-section 2). Merely attempting to instil fear in order to extort: up to two years, or fine, or both (sub-section 3). Fear of death/grievous hurt used to extort: up to seven years, plus fine (sub-section 4); if extortion is actually committed this way: up to ten years, plus fine (sub-section 5). Fear of a false accusation carrying death/life/up to ten years' imprisonment, used to attempt extortion: up to ten years, plus fine (sub-section 6); if committed: up to ten years, plus fine (sub-section 7).",
    illustrations: [
      "A threatens to publish a defamatory libel concerning Z unless Z gives him money. Z gives him money. A has committed extortion.",
      "A threatens Z that he will wrongfully confine Z's child unless Z signs and delivers a promissory note to A. Z does so. A has committed extortion.",
      "A threatens to send men to plough up Z's field unless Z signs and delivers a bond to B. Z does so. A has committed extortion.",
      "A, by putting Z in fear of grievous hurt, dishonestly induces Z to sign a blank paper and deliver it to A, which may be converted into a valuable security. A has committed extortion.",
      "A sends Z an electronic message: 'Your child is in my possession and will be put to death unless you send me one lakh rupees.' Z sends the money. A has committed extortion."
    ], crossRefs: [309] },

  { id: 309, ipc: 390, category: "GG", title: "Robbery",
    text: "(1) In all robbery there is either theft or extortion. (2) Theft is 'robbery' if, in order to commit the theft, or while committing it, or while carrying away or attempting to carry away the stolen property, the offender voluntarily causes or attempts to cause death, hurt, wrongful restraint, or fear of instant death, hurt, or wrongful restraint to any person. (3) Extortion is 'robbery' if the offender, at the time of committing it, is present before the person put in fear, and commits the extortion by putting them in fear of instant death, instant hurt, or instant wrongful restraint, and by that fear induces them to deliver up the thing then and there.",
    simpleExplanation: "Robbery isn't a separate offence from scratch — it's aggravated theft or aggravated extortion. The aggravating ingredient is always the same: death, hurt, restraint, or the instant fear of one of these, tied to the taking. That's why Section 309(1) opens by saying 'in all robbery there is either theft or extortion' — you must first establish one of those two before robbery can exist at all.",
    explanations: ["The offender is said to be 'present' if he is sufficiently near to put the other person in fear of instant death, instant hurt, or instant wrongful restraint."],
    punishment: "Rigorous imprisonment up to ten years, plus fine (up to fourteen years if committed on the highway between sunset and sunrise). Attempt to commit robbery: rigorous imprisonment up to seven years, plus fine. Voluntarily causing hurt while committing or attempting robbery: imprisonment for life, or rigorous imprisonment up to ten years, plus fine — for every person jointly concerned.",
    ingredients: ["Either theft or extortion is first established", "The taking is accompanied by voluntarily causing (or attempting/threatening) death, hurt, or wrongful restraint", "For theft-based robbery: this happens in order to commit the theft, while committing it, or while escaping with the property", "For extortion-based robbery: the offender is physically present and the fear is of something instant, not future"],
    illustrations: [
      "A holds Z down and fraudulently takes Z's money and jewels from his clothes, without consent. A has committed theft, and in order to commit it, has voluntarily caused wrongful restraint to Z — A has therefore committed robbery.",
      "A meets Z on the highroad, shows a pistol, and demands Z's purse. Z surrenders it. A has extorted the purse by putting Z in fear of instant hurt while present — A has therefore committed robbery.",
      "A meets Z and Z's child on the highroad. A takes the child and threatens to fling it down a precipice unless Z delivers his purse. Z does so. A has committed robbery on Z, by causing fear of instant hurt to the child present there.",
      "A obtains property from Z by messaging 'Your child is in the hands of my gang and will be put to death unless you send ten thousand rupees.' This is extortion — but not robbery, unless Z is put in fear of the *instant* death of the child."
    ], crossRefs: [303, 308, 310] },
  { id: 310, ipc: 391, category: "GG", title: "Dacoity",
    text: "(1) When five or more persons conjointly commit or attempt to commit a robbery — or where the total number of persons committing/attempting the robbery, together with those present and aiding, amounts to five or more — every person so committing, attempting, or aiding is said to commit 'dacoity'.",
    simpleExplanation: "Dacoity is simply group robbery with a numbers threshold — five or more. The headcount includes not just those who physically rob, but anyone present and aiding, so a four-person robbery with one lookout still counts as dacoity.",
    punishment: "Imprisonment for life, or rigorous imprisonment up to ten years, plus fine. If murder is committed by any one of five-or-more persons conjointly committing dacoity, every one of them faces death, life imprisonment, or rigorous imprisonment of not less than ten years, plus fine. Mere preparation for dacoity: rigorous imprisonment up to ten years, plus fine. Being one of five-or-more assembled to commit dacoity: rigorous imprisonment up to seven years, plus fine. Belonging to a gang habitually committing dacoity: imprisonment for life, or rigorous imprisonment up to ten years, plus fine.",
    ingredients: ["Five or more persons (including those present and aiding)", "Conjointly committing or attempting a robbery"],
    illustrations: [], crossRefs: [309] },
  { id: 311, ipc: 397, category: "GG", title: "Robbery, or dacoity, with attempt to cause death or grievous hurt",
    text: "If, at the time of committing robbery or dacoity, the offender uses any deadly weapon, causes grievous hurt to any person, or attempts to cause death or grievous hurt to any person, the term of imprisonment shall not be less than seven years.",
    punishment: "Imprisonment of not less than seven years, plus fine. Cognizable, non-bailable, triable by Court of Session.",
    illustrations: [], crossRefs: [309, 310] },
  { id: 312, ipc: 398, category: "GG", title: "Attempt to commit robbery or dacoity when armed with deadly weapon",
    text: "If, at the time of attempting to commit robbery or dacoity, the offender is armed with any deadly weapon, the term of imprisonment shall not be less than seven years.",
    punishment: "Imprisonment of not less than seven years. Cognizable, non-bailable, triable by Court of Session.",
    illustrations: [], crossRefs: [309, 310] },
  { id: 313, ipc: 401, category: "GG", title: "Punishment for belonging to gang of robbers, etc.",
    text: "Whoever belongs to any gang of persons associated for habitually committing theft or robbery, not being a gang of dacoits, shall be punished with rigorous imprisonment up to seven years, and shall also be liable to fine.",
    punishment: "Rigorous imprisonment up to seven years, plus fine. Cognizable, non-bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [303, 309] },

  { id: 314, ipc: 403, category: "HH", title: "Dishonest misappropriation of property",
    text: "Whoever dishonestly misappropriates or converts to their own use any movable property shall be punished with imprisonment of six months to two years, and fine.",
    simpleExplanation: "The key difference from theft: here, the accused's original possession of the property was innocent — they found it, or it came to them lawfully — and the offence lies purely in the dishonest decision to keep or use it afterward, not in how it was obtained.",
    explanations: [
      "Explanation 1: A dishonest misappropriation for a time only is still a misappropriation within the meaning of this section.",
      "Explanation 2: A person who finds property not in anyone's possession, and takes it to protect or restore it to the owner, does not dishonestly misappropriate it, and commits no offence. But they become guilty if they appropriate it once they know (or could discover) the owner, or before using reasonable means and reasonable time to find and notify the owner. What counts as reasonable means or reasonable time is a question of fact — it's enough that at the time of appropriating, the finder does not believe it is their own, or does not, in good faith, believe the real owner cannot be found."
    ],
    punishment: "Imprisonment of six months to two years, and fine. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [
      "A takes property belonging to Z out of Z's possession, in good faith believing it to be his own. A is not guilty of theft — but if A, after discovering the mistake, dishonestly appropriates the property, he is guilty under this section.",
      "A, on friendly terms with Z, takes a book from Z's library without express consent, believing he has implied consent to read it — no theft. But if A later sells the book for his own benefit, he is guilty under this section.",
      "A and B jointly own a horse. A takes it out of B's possession intending to use it — no dishonest misappropriation, since A has a right to use it. But if A sells the horse and keeps the proceeds, he is guilty under this section.",
      "A finds a Government promissory note belonging to Z, bearing a blank endorsement. Knowing it belongs to Z, A pledges it with a banker as security for a loan, intending to restore it later. A has committed the offence under this section.",
      "A finds a rupee on the highroad, not knowing to whom it belongs, and picks it up. A has not committed the offence under this section.",
      "A finds a letter on the road containing a bank note, and learns from its contents whom it belongs to. He appropriates the note. He is guilty under this section.",
      "A finds a bearer cheque and cannot identify who lost it, but the drawer's name appears, and A knows the drawer could direct him to the payee. A appropriates the cheque without attempting to find the owner. He is guilty under this section.",
      "A sees Z drop his purse with money in it. A picks it up meaning to restore it to Z, but afterwards appropriates it. A has committed the offence under this section.",
      "A finds a purse with money not knowing whose it is; he later discovers it is Z's and appropriates it. A is guilty under this section.",
      "A finds a valuable ring, not knowing to whom it belongs, and sells it immediately without attempting to discover the owner. A is guilty under this section."
    ], crossRefs: [303, 316] },
  { id: 315, ipc: 404, category: "HH", title: "Dishonest misappropriation of property possessed by deceased person at the time of his death",
    text: "Whoever dishonestly misappropriates or converts to their own use any property, knowing it was in the possession of a deceased person at the time of death, and has not since been in the possession of anyone legally entitled to it, shall be punished with imprisonment up to three years, and fine — extending to seven years if the offender, at the time of the deceased's death, was employed by them as a clerk or servant.",
    punishment: "Imprisonment up to three years, and fine; up to seven years and fine if the offender was employed as the deceased's clerk or servant. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: ["Z dies in possession of furniture and money. His servant A, before the money comes into the possession of anyone entitled to it, dishonestly misappropriates it. A has committed the offence defined in this section."],
    crossRefs: [314] },

  { id: 316, ipc: 405, category: "II", title: "Criminal breach of trust",
    text: "(1) Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts it to their own use, or dishonestly uses or disposes of it in violation of any legal direction prescribing how the trust is to be discharged, or of any express or implied legal contract they have made touching its discharge, or wilfully suffers any other person to do so, commits 'criminal breach of trust'.",
    simpleExplanation: "The essential difference from theft: the accused already lawfully possesses the property — they were entrusted with it — and the offence lies in dishonestly betraying that trust, not in wrongfully taking possession in the first place. R.K. Dalmia is the case to know: it confirmed 'property' here is read broadly, and 'entrustment' isn't limited to formal fiduciary relationships.",
    explanations: [
      "Explanation 1: An employer who deducts an employee's Provident Fund/Family Pension Fund contribution from wages is deemed entrusted with that amount, and defaulting on paying it into the Fund is deemed a dishonest use of it in violation of the law.",
      "Explanation 2: The same principle applies to an employer who deducts an employee's ESI contribution and defaults on paying it to the ESI Fund."
    ],
    punishment: "Basic: imprisonment up to five years, or fine, or both. As a carrier/wharfinger/warehouse-keeper: up to seven years, plus fine. As a clerk or servant: up to seven years, plus fine. As a public servant, banker, merchant, factor, broker, attorney, or agent: imprisonment for life, or up to ten years, plus fine.",
    ingredients: ["The accused was entrusted with property, or given dominion over it", "They dishonestly misappropriated it, converted it to their own use, or used/disposed of it in violation of a legal direction or contract governing the trust"],
    illustrations: [
      "A, executor to a deceased person's will, dishonestly disobeys the law directing him to divide the effects per the will, and appropriates them. A has committed criminal breach of trust.",
      "A, a warehouse-keeper, is entrusted by Z with furniture under a contract to return it on payment of warehouse rent. A dishonestly sells the goods. A has committed criminal breach of trust.",
      "Z remits a lakh of rupees to his agent A with directions to invest it in Company's paper. A dishonestly disobeys and uses the money in his own business. A has committed criminal breach of trust.",
      "If A, instead, in good faith believing it better for Z, invests in Bank shares rather than Company's paper as directed, A has not acted dishonestly and has not committed criminal breach of trust, even if Z suffers a loss (though Z may have a civil claim).",
      "A, a revenue officer entrusted with public money, is bound by law or contract to deposit it in a treasury. A dishonestly appropriates it. A has committed criminal breach of trust.",
      "A, a carrier, is entrusted by Z with property to be carried. A dishonestly misappropriates it. A has committed criminal breach of trust."
    ], crossRefs: [314] },

  { id: 317, ipc: 410, category: "JJ", title: "Stolen property",
    text: "(1) Property whose possession has been transferred by theft, extortion, robbery, or cheating, and property that has been criminally misappropriated or is the subject of criminal breach of trust, is 'stolen property' — whether the transfer, misappropriation, or breach happened within or outside India — but it ceases to be stolen property once it comes into the possession of a person legally entitled to it.",
    punishment: "Dishonestly receiving or retaining stolen property, knowing or having reason to believe it stolen: imprisonment up to three years, or fine, or both. Where known/believed to be from a dacoity, or received from someone known/believed to belong to a gang of dacoits: imprisonment for life, or rigorous imprisonment up to ten years, plus fine. Habitually receiving or dealing in stolen property: imprisonment for life, or up to ten years, plus fine. Voluntarily assisting in concealing, disposing of, or making away with property known/believed to be stolen: imprisonment up to three years, or fine, or both.",
    illustrations: [], crossRefs: [303, 308, 309] },

  { id: 318, ipc: 415, category: "KK", title: "Cheating",
    text: "(1) Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, or intentionally induces the person so deceived to do or omit to do anything they would not have done or omitted if not so deceived, and which act or omission causes or is likely to cause damage or harm to that person in body, mind, reputation, or property, is said to 'cheat'.",
    simpleExplanation: "Cheating has two distinct paths, both requiring deception: (1) inducing delivery/retention of property, or (2) inducing any act or omission causing likely harm — the second path doesn't even require property to change hands. Illustration 7 is the one to remember for exams: a broken promise alone is only a civil wrong (breach of contract), unless the accused never intended to keep the promise from the very start — that's what makes it cheating instead of a contract dispute.",
    explanations: ["A dishonest concealment of facts is a deception within the meaning of this section."],
    punishment: "Basic: imprisonment up to three years, or fine, or both. Where the offender knows the cheating is likely to cause wrongful loss to a person whose interest they were legally/contractually bound to protect: up to five years, or fine, or both. Where cheating induces delivery of property or the making/altering/destroying of a valuable security: up to seven years, plus fine.",
    ingredients: ["Deception of a person", "Fraudulent or dishonest inducement to deliver property, consent to its retention, or do/omit an act", "The act/omission causes or is likely to cause damage or harm"],
    illustrations: [
      "A, by falsely pretending to be in the Civil Service, deceives Z into giving him goods on credit he doesn't mean to pay for. A cheats.",
      "A, by putting a counterfeit mark on an article, deceives Z into believing it was made by a celebrated manufacturer, inducing Z to buy it. A cheats.",
      "A, by showing Z a false sample, deceives Z into believing the article matches it, inducing Z to buy. A cheats.",
      "A tenders a bill on a house where he keeps no money, expecting it to be dishonoured, deceiving Z into delivering an article A never intends to pay for. A cheats.",
      "A, pledging items he knows are not diamonds as diamonds, deceives Z into lending money. A cheats.",
      "A deceives Z into believing he will repay a loan, inducing Z to lend money, not intending to repay it. A cheats.",
      "A deceives Z into believing he will deliver indigo he doesn't intend to deliver, inducing Z to advance money. A cheats — but if A intended delivery at the time and later merely breaks the contract, that is only a civil wrong, not cheating.",
      "A deceives Z into believing he has performed his part of a contract, which he has not, inducing Z to pay. A cheats.",
      "A sells an estate to B, then, knowing he has no further right to it, sells or mortgages it to Z without disclosing the earlier sale, and takes Z's money. A cheats."
    ], crossRefs: [] },
  { id: 319, ipc: 416, category: "KK", title: "Cheating by personation",
    text: "(1) A person 'cheats by personation' if he cheats by pretending to be some other person, or by knowingly substituting one person for another, or by representing that he or any other person is someone other than who they really are.",
    explanations: ["The offence is committed whether the person impersonated is real or imaginary."],
    punishment: "Imprisonment up to five years, or fine, or both. Cognizable, bailable, triable by any Magistrate.",
    illustrations: [
      "A cheats by pretending to be a certain rich banker of the same name. A cheats by personation.",
      "A cheats by pretending to be B, a person who is deceased. A cheats by personation."
    ], crossRefs: [318] },

  { id: 320, ipc: 421, category: "LL", title: "Dishonest or fraudulent removal or concealment of property to prevent distribution among creditors",
    text: "Whoever dishonestly or fraudulently removes, conceals, or delivers to any person, or transfers or causes to be transferred to any person without adequate consideration, any property, intending or knowing it likely that this will prevent the distribution of that property according to law among their creditors or the creditors of another person, shall be punished with imprisonment of six months to two years, or fine, or both.",
    punishment: "Imprisonment of six months to two years, or fine, or both. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [] },
  { id: 321, ipc: 422, category: "LL", title: "Dishonestly or fraudulently preventing debt being available for creditors",
    text: "Whoever dishonestly or fraudulently prevents any debt or demand due to themselves or another person from being made available, according to law, for payment of their debts or the debts of that other person, shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Imprisonment up to two years, or fine, or both. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [320] },
  { id: 322, ipc: 423, category: "LL", title: "Dishonest or fraudulent execution of deed of transfer containing false statement of consideration",
    text: "Whoever dishonestly or fraudulently signs, executes, or becomes a party to any deed or instrument purporting to transfer or charge any property or interest, and which contains a false statement regarding the consideration for the transfer/charge, or regarding the person(s) for whose benefit it is really intended, shall be punished with imprisonment up to three years, or fine, or both.",
    punishment: "Imprisonment up to three years, or fine, or both. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [320] },
  { id: 323, ipc: 424, category: "LL", title: "Dishonest or fraudulent removal or concealment of property",
    text: "Whoever dishonestly or fraudulently conceals or removes any property of themselves or another, or assists in its concealment or removal, or dishonestly releases any demand or claim to which they are entitled, shall be punished with imprisonment up to three years, or fine, or both.",
    punishment: "Imprisonment up to three years, or fine, or both. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [320] },

  { id: 324, ipc: 425, category: "MM", title: "Mischief",
    text: "(1) Whoever, with intent to cause, or knowing themselves likely to cause, wrongful loss or damage to the public or any person, causes the destruction of any property, or any change in it or its situation that destroys or diminishes its value or utility, or affects it injuriously, commits 'mischief'.",
    explanations: [
      "Explanation 1: It is not essential that the offender intend loss or damage to the owner specifically — it's enough that he intends, or knows likely, wrongful loss or damage to any person, whether or not it's their property.",
      "Explanation 2: Mischief may be committed by an act affecting property belonging to the offender himself, or to himself and others jointly."
    ],
    punishment: "Basic mischief: up to six months, or fine, or both. Causing loss/damage to any property (including Government/local authority property): up to one year, or fine, or both. Loss/damage of ₹20,000 to under ₹1,00,000: up to two years, or fine, or both. Loss/damage of ₹1,00,000 or more: up to five years, or fine, or both. Mischief with preparation made for causing death, hurt, or wrongful restraint (or fear of these): up to five years, plus fine.",
    ingredients: ["Intent to cause, or knowledge of likelihood of causing, wrongful loss or damage", "Destruction of property, or a change in it/its situation that destroys, diminishes, or injuriously affects its value or utility"],
    illustrations: [
      "A voluntarily burns a valuable security belonging to Z, intending wrongful loss to Z. A has committed mischief.",
      "A introduces water into Z's ice-house, melting the ice, intending wrongful loss to Z. A has committed mischief.",
      "A throws a ring belonging to Z into a river, intending wrongful loss to Z. A has committed mischief.",
      "A, knowing his effects are about to be taken in execution for a debt owed to Z, destroys them to prevent Z recovering the debt. A has committed mischief.",
      "A, having insured a ship, voluntarily causes it to be cast away, intending to damage the underwriters. A has committed mischief.",
      "A causes a ship to be cast away, intending to damage Z, who has lent money on bottomry on the ship. A has committed mischief.",
      "A, having joint property with Z in a horse, shoots the horse, intending wrongful loss to Z. A has committed mischief.",
      "A causes cattle to enter Z's field, intending or knowing likely to cause damage to Z's crop. A has committed mischief."
    ], crossRefs: [] },
  { id: 325, ipc: 428, category: "MM", title: "Mischief by killing or maiming animal",
    text: "Whoever commits mischief by killing, poisoning, maiming, or rendering useless any animal shall be punished with imprisonment up to five years, or fine, or both.",
    punishment: "Imprisonment up to five years, or fine, or both. Cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [324] },
  { id: 326, ipc: 430, category: "MM", title: "Mischief by injury, inundation, fire or explosive substance, etc.",
    text: "Whoever commits mischief by: (1) diminishing the water supply for agriculture, human/animal food or drink, cleanliness, or manufacturing; (2) rendering a public road, bridge, or navigable river/channel impassable or less safe; (3) causing an inundation or obstruction to public drainage causing injury or damage; (4) destroying or moving a navigation sign/signal for rail, aircraft, or ship, or rendering it less useful; (5) destroying or moving a public-servant-fixed land-mark, or rendering it less useful; (6) using fire or an explosive substance to damage any property, including agricultural produce; or (7) using fire or an explosive substance to destroy a building ordinarily used as a place of worship, human dwelling, or custody of property.",
    punishment: "(1)–(3): up to five years, or fine, or both, each. (4): up to seven years, or fine, or both. (5): up to one year, or fine, or both. (6): up to seven years, plus fine. (7): imprisonment for life, or up to ten years, plus fine.",
    illustrations: [], crossRefs: [324] },
  { id: 327, ipc: 431, category: "MM", title: "Mischief with intent to destroy or make unsafe a rail, aircraft, decked vessel or one of twenty tons burden",
    text: "(1) Whoever commits mischief to any rail, aircraft, decked vessel, or vessel of twenty tons burden or more, intending to destroy or render it unsafe, or knowing this likely, shall be punished with imprisonment up to ten years, plus fine. (2) The same mischief committed by fire or explosive substance is punishable with imprisonment for life, or up to ten years, plus fine.",
    punishment: "Up to ten years, plus fine; by fire/explosive, imprisonment for life or up to ten years, plus fine.",
    illustrations: [], crossRefs: [324] },
  { id: 328, ipc: 438, category: "MM", title: "Punishment for intentionally running vessel aground or ashore with intent to commit theft, etc.",
    text: "Whoever intentionally runs any vessel aground or ashore, intending to commit theft of property on board, or to dishonestly misappropriate such property, or with intent that such theft/misappropriation may be committed, shall be punished with imprisonment up to ten years, plus fine.",
    punishment: "Imprisonment up to ten years, plus fine. Cognizable, non-bailable, triable by Court of Session.",
    illustrations: [], crossRefs: [303, 314] },

  { id: 329, ipc: 441, category: "NN", title: "Criminal trespass and house-trespass",
    text: "(1) Whoever enters into or upon property in another's possession with intent to commit an offence, or to intimidate, insult, or annoy the person in possession, or having lawfully entered, unlawfully remains with intent to intimidate, insult, annoy, or commit an offence, is said to commit 'criminal trespass'. (2) Criminal trespass by entering or remaining in a building, tent, or vessel used as a human dwelling, or as a place of worship or custody of property, is 'house-trespass'.",
    explanations: ["The introduction of any part of the criminal trespasser's body is sufficient entry to constitute house-trespass."],
    punishment: "Criminal trespass: imprisonment up to three months, or fine up to ₹5,000, or both. House-trespass: imprisonment up to one year, or fine up to ₹5,000, or both.",
    illustrations: [], crossRefs: [330] },
  { id: 330, ipc: 443, category: "NN", title: "House-trespass and house-breaking",
    text: "(1) House-trespass committed with precautions taken to conceal it from someone entitled to exclude or eject the trespasser is 'lurking house-trespass'. (2) A person commits 'house-breaking' if they enter (or, being inside for an offence, quit) a house through any of six specified means: (a) a passage made by themselves/an abettor for the trespass; (b) a passage not intended for human entrance, or by scaling/climbing; (c) a passage opened by themselves/an abettor by means not intended by the occupier; (d) opening a lock; (e) using criminal force, assault, or the threat of assault; or (f) a passage known to have been fastened against entry and unfastened by themselves/an abettor.",
    explanations: ["Any out-house or building occupied with a house, with immediate internal communication to it, is part of the house for this section."],
    illustrations: [
      "A commits house-trespass by making a hole through Z's wall and putting his hand through the aperture. This is house-breaking.",
      "A commits house-trespass by creeping into a ship through a port-hole between decks. This is house-breaking.",
      "A commits house-trespass by entering Z's house through a window. This is house-breaking.",
      "A commits house-trespass by entering through a door he had to unfasten first. This is house-breaking.",
      "A commits house-trespass by lifting a latch with a wire through a hole in the door. This is house-breaking.",
      "A finds a key Z had lost, and enters Z's house using it. This is house-breaking.",
      "Z stands in his doorway; A forces a passage by knocking Z down. This is house-breaking.",
      "Z, Y's doorkeeper, stands in the doorway; A enters having deterred Z by threatening to beat him. This is house-breaking."
    ], crossRefs: [329] },
  { id: 331, ipc: 456, category: "NN", title: "Punishment for house-trespass or house-breaking",
    text: "(1) Lurking house-trespass or house-breaking: imprisonment up to two years, plus fine. (2) The same after sunset and before sunrise: up to three years, plus fine. (3) The same to commit an imprisonable offence: up to three years, plus fine (up to ten years, if the intended offence is theft). (4) The same after sunset and before sunrise, to commit an imprisonable offence: up to five years, plus fine (up to fourteen years, if the intended offence is theft). (5) The same with preparation made for causing hurt, assault, wrongful restraint, or fear of these: up to ten years, plus fine. (6) The same after sunset and before sunrise, with such preparation: up to fourteen years, plus fine. (7) Causing grievous hurt, or attempting death/grievous hurt, while committing the same: imprisonment for life, or up to ten years, plus fine. (8) Where, during such an offence after sunset and before sunrise, death or an attempt at death/grievous hurt is voluntarily caused, every person jointly concerned faces imprisonment for life, or up to ten years, plus fine.",
    punishment: "Escalating scale from two years up to imprisonment for life, depending on timing, intent, and harm caused — see full text.",
    illustrations: [], crossRefs: [329, 330] },
  { id: 332, ipc: 449, category: "NN", title: "House-trespass in order to commit offence",
    text: "Whoever commits house-trespass in order to commit an offence: (1) punishable with death — imprisonment for life, or rigorous imprisonment up to ten years, plus fine; (2) punishable with imprisonment for life — imprisonment up to ten years, plus fine; (3) punishable with imprisonment — imprisonment up to two years, plus fine.",
    provisos: ["If the offence intended is theft, the imprisonment term under clause (3) may extend to seven years."],
    illustrations: [], crossRefs: [329] },
  { id: 333, ipc: 452, category: "NN", title: "House-trespass after preparation for hurt, assault or wrongful restraint",
    text: "Whoever commits house-trespass having made preparation for causing hurt to any person, for assaulting any person, for wrongfully restraining any person, or for putting any person in fear of hurt, assault, or wrongful restraint, shall be punished with imprisonment up to seven years, plus fine.",
    punishment: "Imprisonment up to seven years, plus fine. Cognizable, non-bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [329] },
  { id: 334, ipc: 461, category: "NN", title: "Dishonestly breaking open receptacle containing property",
    text: "(1) Whoever dishonestly, or intending mischief, breaks open or unfastens any closed receptacle containing (or believed to contain) property, shall be punished with imprisonment up to two years, or fine, or both. (2) Whoever, being entrusted with such a receptacle without authority to open it, dishonestly or intending mischief breaks it open or unfastens it, shall be punished with imprisonment up to three years, or fine, or both.",
    illustrations: [], crossRefs: [316] },

  /* ---- Chapter XIII — Of Contempts of the Lawful Authority of Public Servants ---- */
  { id: 206, ipc: 172, category: "OO", title: "Absconding to avoid service of summons or other proceeding",
    text: "Whoever absconds in order to avoid being served with a summons, notice, or order from a public servant legally competent to issue it, shall be punished with simple imprisonment up to one month, or fine up to ₹5,000, or both — up to six months, or fine up to ₹10,000, or both, where the summons/notice/order is to attend in person or by agent, or to produce a document/electronic record, in a Court.",
    punishment: "Up to one month (up to six months if Court-related), or fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 207, ipc: 173, category: "OO", title: "Preventing service of summons or other proceeding, or preventing publication thereof",
    text: "Whoever intentionally prevents the serving of a summons/notice/order on themselves or another, or prevents its lawful affixing to a place, or removes it from where it is lawfully affixed, or prevents a lawful proclamation from being made, shall be punished with simple imprisonment up to one month, or fine up to ₹5,000, or both — up to six months, or fine up to ₹10,000, or both, where Court-related.",
    punishment: "Up to one month (up to six months if Court-related), or fine, or both.",
    illustrations: [], crossRefs: [206] },
  { id: 208, ipc: 174, category: "OO", title: "Non-attendance in obedience to an order from public servant",
    text: "Whoever, being legally bound to attend in person or by agent at a place and time under a summons/notice/order/proclamation from a legally competent public servant, intentionally omits to attend, or departs before lawfully permitted, shall be punished with simple imprisonment up to one month, or fine up to ₹5,000, or both — up to six months, or fine up to ₹10,000, or both, where the requirement is to attend a Court.",
    punishment: "Up to one month (up to six months if Court-related), or fine, or both.",
    illustrations: [
      "A, being legally bound to appear before a High Court, in obedience to a subpoena issuing from that Court, intentionally omits to appear. A has committed the offence defined in this section.",
      "A, being legally bound to appear before a District Judge as a witness, in obedience to a summons issued by that Judge, intentionally omits to appear. A has committed the offence defined in this section."
    ], crossRefs: [] },
  { id: 209, ipc: null, category: "OO", title: "Non-appearance in response to a proclamation under Section 84 of the BNSS, 2023",
    text: "Whoever fails to appear at the place and time required by a proclamation published under Section 84(1) of the BNSS, 2023 shall be punished with imprisonment up to three years, or fine, or both, or with community service; where declared a proclaimed offender under Section 84(4), imprisonment up to seven years, and fine.",
    punishment: "Up to three years/fine/community service; up to seven years plus fine if declared a proclaimed offender. Cognizable, non-bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [208] },
  { id: 210, ipc: 175, category: "OO", title: "Omission to produce document or electronic record to public servant by person legally bound to produce it",
    text: "Whoever, being legally bound to produce or deliver a document or electronic record to a public servant, intentionally omits to do so, shall be punished with simple imprisonment up to one month, or fine up to ₹5,000, or both — up to six months, or fine up to ₹10,000, or both, where it is to be produced before a Court.",
    punishment: "Up to one month (up to six months if Court-related), or fine, or both.",
    illustrations: ["A, being legally bound to produce a document before a District Court, intentionally omits to produce the same. A has committed the offence defined in this section."],
    crossRefs: [] },
  { id: 211, ipc: 176, category: "OO", title: "Omission to give notice or information to public servant by person legally bound to give it",
    text: "Whoever, being legally bound to give notice or furnish information on a subject to a public servant, intentionally omits to do so in the manner and time required by law, shall be punished with simple imprisonment up to one month, or fine up to ₹5,000, or both — up to six months, or fine up to ₹10,000, or both, where the information concerns the commission of an offence, preventing one, or apprehending an offender — or up to six months, or fine up to ₹1,000, or both, where required by an order under Section 447, BNSS.",
    punishment: "Up to one month, escalating to six months depending on the subject-matter.",
    illustrations: [], crossRefs: [212] },
  { id: 212, ipc: 177, category: "OO", title: "Furnishing false information",
    text: "Whoever, being legally bound to furnish information to a public servant, furnishes as true, information they know or have reason to believe is false, shall be punished with simple imprisonment up to six months, or fine up to ₹5,000, or both — up to two years, or fine, or both, where the information concerns the commission of an offence, preventing one, or apprehending an offender.",
    explanations: ["In this section and Section 209, 'offence' includes any act committed outside India which, if committed in India, would be punishable under Sections 97, 99, 172–175, 301, clauses (b)–(d) of Section 303, 304, 305, 306, 320, 325, and 326; and 'offender' includes any person alleged to be guilty of such an act."],
    punishment: "Up to six months (up to two years if concerning an offence, prevention, or apprehension), or fine, or both.",
    illustrations: [
      "A, a landholder, knowing of a murder within his estate, wilfully misinforms the Magistrate that death occurred by snakebite. A is guilty of the offence defined in this section.",
      "A, a village watchman, knowing a body of strangers passed through his village to commit dacoity at Z's house nearby, and being bound to inform the nearest police station, wilfully misinforms the officer that the strangers were headed to commit dacoity somewhere else entirely. A is guilty of the offence defined in the latter part of this section."
    ], crossRefs: [211] },
  { id: 213, ipc: 178, category: "OO", title: "Refusing oath or affirmation when duly required by public servant to make it",
    text: "Whoever refuses to bind himself by an oath or affirmation to state the truth, when required to do so by a public servant legally competent to require it, shall be punished with simple imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 214, ipc: 179, category: "OO", title: "Refusing to answer public servant authorised to question",
    text: "Whoever, being legally bound to state the truth on a subject to a public servant, refuses to answer a question demanded of them touching that subject by that public servant in the exercise of their legal powers, shall be punished with simple imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [213] },
  { id: 215, ipc: 180, category: "OO", title: "Refusing to sign statement",
    text: "Whoever refuses to sign a statement made by them, when required to sign it by a public servant legally competent to require this, shall be punished with simple imprisonment up to three months, or fine up to ₹3,000, or both.",
    punishment: "Up to three months, or fine up to ₹3,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 216, ipc: 181, category: "OO", title: "False statement on oath or affirmation to public servant or person authorised to administer an oath or affirmation",
    text: "Whoever, being legally bound by an oath or affirmation to state the truth on a subject to a public servant or person authorised to administer it, makes a statement on that subject which is false, and which they know or believe to be false, or do not believe to be true, shall be punished with imprisonment up to three years, and fine.",
    punishment: "Imprisonment up to three years, and fine. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 217, ipc: 182, category: "OO", title: "False information, with intent to cause public servant to use his lawful power to the injury of another person",
    text: "Whoever gives a public servant information they know or believe to be false, intending or knowing it likely to cause that public servant to do or omit something they ought not to (if the true facts were known), or to use their lawful power to the injury or annoyance of any person, shall be punished with imprisonment up to one year, or fine up to ₹10,000, or both.",
    punishment: "Up to one year, or fine up to ₹10,000, or both. Non-cognizable, bailable.",
    illustrations: [
      "A informs a Magistrate that Z, a police officer subordinate to that Magistrate, has been guilty of neglect of duty, knowing this to be false and knowing it likely to cause the Magistrate to dismiss Z. A has committed the offence defined in this section.",
      "A falsely informs a public servant that Z has contraband salt in a secret place, knowing this is false and knowing it likely to cause a search of Z's premises, annoying Z. A has committed the offence defined in this section.",
      "A falsely informs a policeman that he was assaulted and robbed near a particular village, without naming any assailant, knowing it likely that the police will make enquiries and searches to the annoyance of the villagers. A has committed an offence under this section."
    ], crossRefs: [] },

  { id: 218, ipc: 183, category: "PP", title: "Resistance to the taking of property by the lawful authority of a public servant",
    text: "Whoever offers resistance to the taking of property by the lawful authority of a public servant, knowing or having reason to believe they are such a public servant, shall be punished with imprisonment up to six months, or fine up to ₹10,000, or both.",
    punishment: "Up to six months, or fine up to ₹10,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 219, ipc: 186, category: "PP", title: "Obstructing sale of property offered for sale by authority of public servant",
    text: "Whoever intentionally obstructs a sale of property offered for sale by the lawful authority of a public servant shall be punished with imprisonment up to one month, or fine up to ₹5,000, or both.",
    punishment: "Up to one month, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [218] },
  { id: 220, ipc: 187, category: "PP", title: "Illegal purchase or bid for property offered for sale by authority of public servant",
    text: "Whoever, at a sale of property held by the lawful authority of a public servant, purchases or bids for property on account of anyone they know to be under a legal incapacity to purchase it at that sale, or bids without intending to perform the resulting obligations, shall be punished with imprisonment up to one month, or fine up to ₹200, or both.",
    punishment: "Up to one month, or fine up to ₹200, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 221, ipc: 186, category: "PP", title: "Obstructing public servant in discharge of public functions",
    text: "Whoever voluntarily obstructs a public servant in the discharge of their public functions shall be punished with imprisonment up to three months, or fine up to ₹2,500, or both.",
    punishment: "Up to three months, or fine up to ₹2,500, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 222, ipc: 187, category: "PP", title: "Omission to assist public servant when bound by law to give assistance",
    text: "Whoever, being bound by law to render assistance to a public servant in executing their public duty, intentionally omits to give it, shall be punished with simple imprisonment up to one month, or fine up to ₹2,500, or both — up to six months, or fine up to ₹5,000, or both, where the assistance was demanded for executing a lawful Court process, preventing an offence, suppressing a riot/affray, or apprehending/re-apprehending a person charged with or escaped from custody for an offence.",
    punishment: "Up to one month, escalating to six months for the listed graver purposes.",
    illustrations: [], crossRefs: [] },
  { id: 223, ipc: 188, category: "PP", title: "Disobedience to order duly promulgated by public servant",
    text: "Whoever, knowing they are directed by a lawfully-empowered public servant's order to abstain from an act or to take certain order with property, disobeys that direction, shall — if the disobedience causes or tends to cause obstruction, annoyance, or injury (or risk of it) to persons lawfully employed — be punished with simple imprisonment up to six months, or fine up to ₹2,500, or both; where it causes or tends to cause danger to human life, health, or safety, or a riot or affray, imprisonment up to one year, or fine up to ₹5,000, or both.",
    explanations: ["It is not necessary that the offender intend to produce harm or contemplate the disobedience as likely to produce it — it is enough that they know of the order and that the disobedience produces, or is likely to produce, harm."],
    punishment: "Up to six months, or up to one year if danger/riot results, or fine, or both.",
    illustrations: ["An order is promulgated by a lawfully-empowered public servant directing that a religious procession shall not pass down a certain street. A knowingly disobeys, thereby causing danger of a riot. A has committed the offence defined in this section."],
    crossRefs: [] },
  { id: 224, ipc: 189, category: "PP", title: "Threat of injury to public servant",
    text: "Whoever holds out any threat of injury to a public servant, or to a person that public servant is believed to be interested in, for the purpose of inducing that public servant to do, forbear, or delay any act connected with the exercise of their public functions, shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Up to two years, or fine, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 225, ipc: 190, category: "PP", title: "Threat of injury to induce person to refrain from applying for protection to public servant",
    text: "Whoever holds out any threat of injury to a person, for the purpose of inducing them to refrain from making a legal application for protection against injury to a public servant legally empowered to give such protection, shall be punished with imprisonment up to one year, or fine, or both.",
    punishment: "Up to one year, or fine, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [224] },
  { id: 226, ipc: 309, category: "PP", title: "Attempt to commit suicide to compel or restrain exercise of lawful power",
    text: "Whoever attempts to commit suicide with intent to compel or restrain a public servant from discharging their official duty shall be punished with simple imprisonment up to one year, or fine, or both, or with community service.",
    punishment: "Up to one year, or fine, or both, or community service. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },

  /* ---- Chapter XIV — Of False Evidence and Offences Against Public Justice ---- */
  { id: 227, ipc: 191, category: "QQ", title: "Giving false evidence",
    text: "Whoever, being legally bound by an oath or express legal provision to state the truth, or bound by law to make a declaration, makes a statement which is false, and which they either know or believe to be false, or do not believe to be true, is said to give false evidence.",
    explanations: [
      "Explanation 1: A statement is within this section whether made verbally or otherwise.",
      "Explanation 2: A false statement as to belief is within this section — a person may give false evidence by stating they believe something they don't believe, just as by stating they know something they don't know."
    ],
    ingredients: ["Legally bound by oath, legal provision, or a declaration requirement to state the truth", "Makes a statement that is false", "Knows or believes it to be false, or does not believe it to be true"],
    illustrations: [
      "A, in support of a just claim B has against Z, falsely swears at trial that he heard Z admit the justice of B's claim. A has given false evidence.",
      "A, bound by oath, states he believes a signature to be Z's handwriting, when he does not believe this. A states what he knows to be false — false evidence.",
      "A, knowing Z's general handwriting, in good faith states he believes a signature to be Z's. This is merely A's honest belief, true as to his belief — not false evidence, even if the signature isn't actually Z's.",
      "A, bound by oath, states he knows Z was at a particular place on a particular day, not knowing anything on the subject. A gives false evidence, whether or not Z was actually there.",
      "An interpreter, bound by oath to interpret truly, certifies as a true translation something he does not believe to be a true translation. He has given false evidence."
    ], crossRefs: [229] },
  { id: 228, ipc: 192, category: "QQ", title: "Fabricating false evidence",
    text: "Whoever causes a circumstance to exist, or makes a false entry in a book/record/electronic record, or makes a document/electronic record containing a false statement, intending that it may appear in evidence in a judicial proceeding (or a proceeding before a public servant or arbitrator), and thereby cause a person forming an opinion on the evidence to reach an erroneous conclusion material to the result, is said to 'fabricate false evidence.'",
    illustrations: [
      "A puts jewels in Z's box, intending they be found there so Z is convicted of theft. A has fabricated false evidence.",
      "A makes a false entry in his shop-book to use as corroborative evidence in Court. A has fabricated false evidence.",
      "A, intending to cause Z to be convicted of criminal conspiracy, writes a letter imitating Z's handwriting, addressed to a supposed accomplice, and places it where he knows the police are likely to search. A has fabricated false evidence."
    ], crossRefs: [227, 229] },
  { id: 229, ipc: 193, category: "QQ", title: "Punishment for false evidence",
    text: "(1) Whoever intentionally gives false evidence in any stage of a judicial proceeding, or fabricates false evidence for use in any stage of a judicial proceeding, shall be punished with imprisonment up to seven years, and fine up to ₹10,000. (2) In any other case, imprisonment up to three years, and fine up to ₹5,000.",
    explanations: [
      "Explanation 1: A trial before a Court-martial is a judicial proceeding.",
      "Explanation 2: An investigation directed by law preliminary to a Court proceeding is a stage of judicial proceeding, even if not held before a Court.",
      "Explanation 3: An investigation directed by, and conducted under the authority of, a Court is a stage of judicial proceeding, even if not held before a Court."
    ],
    punishment: "Up to seven years and fine (judicial proceedings); up to three years and fine (otherwise).",
    illustrations: [
      "A, in an inquiry before a Magistrate to decide whether Z should be committed for trial, makes a statement on oath he knows to be false. As this inquiry is a stage of judicial proceeding, A has given false evidence.",
      "A, in an inquiry before an officer deputed by a Court to ascertain land boundaries, makes a statement on oath he knows to be false. As this inquiry is a stage of judicial proceeding, A has given false evidence."
    ], crossRefs: [227, 228] },
  { id: 230, ipc: 194, category: "QQ", title: "Giving or fabricating false evidence with intent to procure conviction of capital offence",
    text: "(1) Whoever gives or fabricates false evidence, intending or knowing it likely to cause any person to be convicted of an offence carrying the death penalty, shall be punished with imprisonment for life, or rigorous imprisonment up to ten years, and fine up to ₹50,000. (2) If an innocent person is convicted and executed as a result, the offender shall be punished with death, or the punishment above.",
    punishment: "Imprisonment for life or up to ten years, plus fine; death if an innocent person is executed as a result.",
    illustrations: [], crossRefs: [227, 228] },
  { id: 231, ipc: 195, category: "QQ", title: "Giving or fabricating false evidence with intent to procure conviction of offence punishable with imprisonment for life or imprisonment",
    text: "Whoever gives or fabricates false evidence, intending or knowing it likely to cause a person to be convicted of a non-capital offence punishable with imprisonment for life or seven or more years, shall be punished as a person convicted of that offence would be liable to be punished.",
    punishment: "Same as for the offence the false evidence targeted. Non-cognizable, non-bailable, triable by Court of Session.",
    illustrations: ["A gives false evidence before a Court intending to cause Z to be convicted of dacoity, punishable with imprisonment for life or up to ten years, with or without fine. A is therefore liable to imprisonment for life or imprisonment, with or without fine."],
    crossRefs: [227, 228] },
  { id: 232, ipc: 195, category: "QQ", title: "Threatening any person to give false evidence",
    text: "(1) Whoever threatens another with injury to person, reputation, or property (or to someone they're interested in), intending to cause that person to give false evidence, shall be punished with imprisonment up to seven years, or fine, or both. (2) If an innocent person is convicted and sentenced to death or over seven years' imprisonment as a result, the threatener is punished the same way as that innocent person.",
    punishment: "Up to seven years, or fine, or both; matching the innocent person's sentence if their conviction results.",
    illustrations: [], crossRefs: [227] },
  { id: 233, ipc: 196, category: "QQ", title: "Using evidence known to be false",
    text: "Whoever corruptly uses or attempts to use, as true or genuine, evidence they know to be false or fabricated, shall be punished the same way as if they had given or fabricated false evidence.",
    punishment: "Same as giving/fabricating false evidence.",
    illustrations: [], crossRefs: [227, 228] },
  { id: 234, ipc: 197, category: "QQ", title: "Issuing or signing false certificate",
    text: "Whoever issues or signs a certificate required or admissible by law, knowing or believing it to be materially false, shall be punished the same way as if they had given false evidence.",
    punishment: "Same as giving false evidence. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [227] },
  { id: 235, ipc: 198, category: "QQ", title: "Using as true a certificate known to be false",
    text: "Whoever corruptly uses or attempts to use, as a true certificate, one they know to be materially false, shall be punished the same way as if they had given false evidence.",
    punishment: "Same as giving false evidence. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [234] },
  { id: 236, ipc: 199, category: "QQ", title: "False statement made in declaration which is by law receivable as evidence",
    text: "Whoever, in a declaration they make or subscribe, which a Court or public servant is bound or authorised by law to receive as evidence of a fact, makes a statement they know or believe to be false or don't believe to be true, touching a point material to the declaration's purpose, shall be punished the same way as if they had given false evidence.",
    explanations: ["In this and the next section, and Section 240, 'offence' includes any act committed outside India that would be punishable under Sections 97, 99, 172–175, 301, 304, 305, 306, 320, 325, and 326 if committed in India."],
    punishment: "Same as giving false evidence. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [227] },
  { id: 237, ipc: 200, category: "QQ", title: "Using as true such declaration knowing it to be false",
    text: "Whoever corruptly uses or attempts to use, as true, a declaration they know to be materially false, shall be punished the same way as if they had given false evidence.",
    explanations: ["A declaration inadmissible merely for informality is still a declaration within the meaning of Sections 234 and 237."],
    punishment: "Same as giving false evidence. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [236] },

  { id: 238, ipc: 201, category: "RR", title: "Causing disappearance of evidence of offence, or giving false information to screen offender",
    text: "Whoever, knowing or having reason to believe an offence has been committed, causes evidence of it to disappear (intending to screen the offender), or gives false information about it with that intention, shall be punished: (a) up to seven years, plus fine, if the offence is punishable with death; (b) up to three years, plus fine, if punishable with life imprisonment or up to ten years; (c) up to one-fourth of the longest term for the offence, or fine, or both, in any other case.",
    punishment: "Escalating scale from one-fourth the offence's term up to seven years, depending on the underlying offence's severity.",
    illustrations: ["A, knowing that B has murdered Z, assists B in hiding the body intending to screen B from punishment. A is liable to imprisonment up to seven years, and fine."],
    crossRefs: [] },
  { id: 239, ipc: 202, category: "RR", title: "Intentional omission to give information of offence by person bound to inform",
    text: "Whoever, knowing or having reason to believe an offence has been committed, intentionally omits to give information about it that they are legally bound to give, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [238] },
  { id: 240, ipc: 203, category: "RR", title: "Giving false information respecting an offence committed",
    text: "Whoever, knowing or having reason to believe an offence has been committed, gives information about it that they know or believe to be false, shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Up to two years, or fine, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [239] },
  { id: 241, ipc: 204, category: "RR", title: "Destruction of document or electronic record to prevent its production as evidence",
    text: "Whoever secretes or destroys a document/electronic record they may be lawfully compelled to produce as evidence, or obliterates/renders illegible any part of it, intending to prevent its production or use as evidence, shall be punished with imprisonment up to three years, or fine up to ₹5,000, or both.",
    punishment: "Up to three years, or fine up to ₹5,000, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 242, ipc: 205, category: "RR", title: "False personation for purpose of act or proceeding in suit or prosecution",
    text: "Whoever falsely personates another and, in that assumed character, makes an admission or statement, confesses judgment, causes process to be issued, becomes bail or security, or does any other act in a suit or criminal prosecution, shall be punished with imprisonment up to three years, or fine, or both.",
    punishment: "Up to three years, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 243, ipc: 206, category: "RR", title: "Fraudulent removal or concealment of property to prevent its seizure as forfeited or in execution",
    text: "Whoever fraudulently removes, conceals, transfers, or delivers any property to prevent it being taken as forfeiture or in satisfaction of a fine under a sentence, or from being taken in execution of a decree/order made or likely to be made by a Court, shall be punished with imprisonment up to three years, or fine up to ₹5,000, or both.",
    punishment: "Up to three years, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [244] },
  { id: 244, ipc: 207, category: "RR", title: "Fraudulent claim to property to prevent its seizure as forfeited or in execution",
    text: "Whoever fraudulently accepts, receives, or claims property (or an interest in it) knowing they have no right or rightful claim to it, or practices deception touching such a claim, intending to prevent it being taken as forfeiture or in execution of a decree, shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Up to two years, or fine, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [243] },
  { id: 245, ipc: 208, category: "RR", title: "Fraudulently suffering decree for sum not due",
    text: "Whoever fraudulently causes or suffers a decree/order to be passed against them for a sum, or property, they don't owe or aren't entitled to be claimed against, or fraudulently causes/suffers a decree to be executed after satisfaction, shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Up to two years, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: ["A institutes a suit against Z. Z, knowing A is likely to win, fraudulently suffers judgment to pass against him for a larger sum at B's suit — B having no just claim — so that B (for his own benefit, or Z's) may share the proceeds of any sale of Z's property under A's decree. Z has committed an offence under this section."],
    crossRefs: [] },
  { id: 246, ipc: 209, category: "RR", title: "Dishonestly making false claim in Court",
    text: "Whoever fraudulently or dishonestly, or with intent to injure or annoy any person, makes a claim in Court they know to be false, shall be punished with imprisonment up to two years, and fine.",
    punishment: "Up to two years, and fine. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [],
    cases: [{ name: "Kishore Samrite v. State of Uttar Pradesh", cite: "(2013) 2 SCC 398", year: 2012,
      ratio: "The Supreme Court held that a litigant whose case is built on falsehood has no right to approach the court, and that suppression or concealment of material facts is impermissible — courts must remain vigilant against parties who abuse judicial process through dishonest claims.",
      url: "https://indiankanoon.org/doc/172073149/" }] },
  { id: 247, ipc: 210, category: "RR", title: "Fraudulently obtaining decree for sum not due",
    text: "Whoever fraudulently obtains a decree/order against a person for a sum, or property, not due or not entitled to, or fraudulently causes a decree to be executed after satisfaction, or permits such an act in their name, shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Up to two years, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [245] },
  { id: 248, ipc: 211, category: "RR", title: "False charge of offence made with intent to injure",
    text: "Whoever, intending to injure a person, institutes (or causes to be instituted) a criminal proceeding against them, or falsely charges them with an offence, knowing there's no just or lawful ground for it, shall be punished with imprisonment up to five years, or fine up to ₹2,00,000, or both — up to ten years, plus fine, if the false charge concerns an offence punishable with death, life imprisonment, or ten or more years.",
    punishment: "Up to five years (up to ten years for grave false charges), or fine, or both.",
    illustrations: [], crossRefs: [] },
  { id: 249, ipc: 212, category: "RR", title: "Harbouring offender",
    text: "Whoever, knowing or having reason to believe a person is an offender, harbours or conceals them intending to screen them from legal punishment, shall be punished: (a) up to five years, plus fine, if the offence is punishable with death; (b) up to three years, plus fine, if punishable with life imprisonment or up to ten years; (c) up to one-fourth of the longest term for the offence, or fine, or both, in any other case.",
    explanations: ["'Offence' includes any act committed outside India which, if committed in India, would be punishable under Sections 97, 99, 172–175, 301, 304, 305, 306, 320, 325, and 326."],
    provisos: ["This section does not extend to a case where the harbourer or concealer is the offender's spouse."],
    punishment: "Escalating scale up to five years, depending on the underlying offence's severity.",
    illustrations: ["A, knowing B has committed dacoity, knowingly conceals B to screen him from punishment. Since dacoity carries imprisonment for life, A is liable to imprisonment up to three years, and fine."],
    crossRefs: [] },
  { id: 250, ipc: 213, category: "RR", title: "Taking gift, etc., to screen an offender from punishment",
    text: "Whoever accepts, attempts to obtain, or agrees to accept, any gratification (or restitution of property) in consideration for concealing an offence, screening an offender, or not proceeding against a person, shall be punished: (a) up to seven years, plus fine, if the offence is punishable with death; (b) up to three years, plus fine, if punishable with life imprisonment or up to ten years; (c) up to one-fourth of the longest term for the offence, or fine, or both, in any other case.",
    punishment: "Escalating scale up to seven years, depending on the underlying offence's severity.",
    illustrations: [], crossRefs: [249] },
  { id: 251, ipc: 214, category: "RR", title: "Offering gift or restoration of property in consideration of screening offender",
    text: "Whoever gives, offers, or agrees to give any gratification, or restores property, in consideration of concealing an offence, screening an offender, or not proceeding against a person, shall be punished on the same escalating scale as Section 250.",
    punishment: "Same escalating scale as Section 250, up to seven years.",
    illustrations: [], crossRefs: [250] },
  { id: 252, ipc: 215, category: "RR", title: "Taking gift to help to recover stolen property, etc.",
    text: "Whoever takes, agrees, or consents to take a gratification under pretence of helping a person recover movable property they were deprived of by an offence, shall — unless they use all means in their power to have the offender apprehended and convicted — be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Up to two years, or fine, or both. Cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 253, ipc: 216, category: "RR", title: "Harbouring offender who has escaped from custody or whose apprehension has been ordered",
    text: "Whoever, knowing that a person has escaped lawful custody, or that a public servant has ordered a person's apprehension, harbours or conceals that person intending to prevent their apprehension, shall be punished: (a) up to seven years, plus fine, if the underlying offence is punishable with death; (b) up to three years, with or without fine, if punishable with life imprisonment or ten years; (c) up to one-fourth of the longest term for the offence, or fine, or both, in any other case.",
    explanations: ["'Offence' also includes an act/omission alleged to have occurred outside India, which if committed in India would be punishable, and for which the person is liable to be apprehended or detained under extradition law or otherwise."],
    provisos: ["Does not extend to harbouring/concealment by the spouse of the person to be apprehended."],
    punishment: "Escalating scale up to seven years, depending on the underlying offence's severity.",
    illustrations: [], crossRefs: [249] },
  { id: 254, ipc: 216, category: "RR", title: "Penalty for harbouring robbers or dacoits",
    text: "Whoever, knowing or having reason to believe that persons are about to commit or have recently committed robbery or dacoity, harbours them (or any of them) intending to facilitate or screen the offence, shall be punished with rigorous imprisonment up to seven years, and fine.",
    explanations: ["It is immaterial whether the robbery/dacoity is intended to be, or has been, committed within or outside India."],
    provisos: ["Does not extend to harbouring by the spouse of the offender."],
    punishment: "Rigorous imprisonment up to seven years, and fine. Cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [310] },

  { id: 255, ipc: 217, category: "SS", title: "Public servant disobeying direction of law with intent to save person from punishment or property from forfeiture",
    text: "Whoever, being a public servant, knowingly disobeys a legal direction as to how they should conduct themselves, intending or knowing it likely to save a person from legal punishment (or subject them to a lesser one), or to save property from forfeiture or a legal charge, shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Up to two years, or fine, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 256, ipc: 218, category: "SS", title: "Public servant framing incorrect record or writing with intent to save person from punishment or property from forfeiture",
    text: "Whoever, being a public servant charged with preparing a record or writing, frames it in a manner they know to be incorrect, intending or knowing it likely to cause loss/injury to the public or a person, or to save a person from legal punishment, or save property from forfeiture, shall be punished with imprisonment up to three years, or fine, or both.",
    punishment: "Up to three years, or fine, or both. Cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [255] },
  { id: 257, ipc: 219, category: "SS", title: "Public servant in judicial proceeding corruptly making report, etc., contrary to law",
    text: "Whoever, being a public servant, corruptly or maliciously makes or pronounces, at any stage of a judicial proceeding, a report, order, verdict, or decision they know to be contrary to law, shall be punished with imprisonment up to seven years, or fine, or both.",
    punishment: "Up to seven years, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 258, ipc: 220, category: "SS", title: "Commitment for trial or confinement by person having authority who knows that he is acting contrary to law",
    text: "Whoever, having legal authority to commit persons for trial or confinement, or to keep persons in confinement, corruptly or maliciously commits or confines a person, knowing they are acting contrary to law, shall be punished with imprisonment up to seven years, or fine, or both.",
    punishment: "Up to seven years, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [257] },
  { id: 259, ipc: 221, category: "SS", title: "Intentional omission to apprehend on the part of public servant bound to apprehend",
    text: "Whoever, being a public servant legally bound to apprehend or keep in confinement a person charged with or liable to apprehension for an offence, intentionally omits to apprehend them, or suffers/aids their escape, shall be punished with imprisonment up to seven years (with or without fine) if the offence is capital; up to three years (with or without fine) if punishable with life imprisonment or up to ten years; up to two years (with or without fine) if punishable with less than ten years.",
    punishment: "Escalating scale up to seven years, depending on the underlying offence's severity.",
    illustrations: [], crossRefs: [] },
  { id: 260, ipc: 222, category: "SS", title: "Intentional omission to apprehend on the part of public servant bound to apprehend person under sentence or lawfully committed",
    text: "Whoever, being a public servant legally bound to apprehend or confine a person already under sentence or lawfully committed to custody, intentionally omits to apprehend them or suffers/aids their escape, shall be punished with imprisonment for life or up to fourteen years (with or without fine) if the person was under sentence of death; up to seven years (with or without fine) if under a life sentence or ten-plus years; up to three years, or fine, or both, otherwise.",
    punishment: "Escalating scale up to imprisonment for life, depending on the severity of the original sentence.",
    illustrations: [], crossRefs: [259] },
  { id: 261, ipc: 223, category: "SS", title: "Escape from confinement or custody negligently suffered by public servant",
    text: "Whoever, being a public servant legally bound to keep a charged, convicted, or lawfully committed person in confinement, negligently suffers their escape, shall be punished with simple imprisonment up to two years, or fine, or both.",
    punishment: "Up to two years, or fine, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [259] },

  { id: 262, ipc: 224, category: "TT", title: "Resistance or obstruction by a person to his lawful apprehension",
    text: "Whoever intentionally resists or illegally obstructs the lawful apprehension of themselves for an offence they are charged with or convicted of, or escapes/attempts to escape from lawful custody for such an offence, shall be punished with imprisonment up to two years, or fine, or both.",
    explanations: ["This punishment is in addition to the punishment for the offence with which the person was charged or convicted."],
    punishment: "Up to two years, or fine, or both, in addition to the underlying offence's punishment. Cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 263, ipc: 225, category: "TT", title: "Resistance or obstruction to lawful apprehension of another person",
    text: "Whoever intentionally resists or illegally obstructs the lawful apprehension of another person, or rescues/attempts to rescue them from lawful custody, shall be punished with imprisonment up to two years, or fine, or both — up to three years, plus fine, if the person is liable for an offence carrying life imprisonment or up to ten years; up to seven years, plus fine, if capital, or if already under a life/ten-plus-year sentence; up to ten years, plus fine, if under sentence of death.",
    punishment: "Escalating scale from two to ten years, depending on the person rescued/obstructed's exposure.",
    illustrations: [], crossRefs: [262] },
  { id: 264, ipc: 226, category: "TT", title: "Omission to apprehend, or sufferance of escape, on part of public servant, in cases not otherwise provided for",
    text: "Whoever, being a public servant legally bound to apprehend or confine a person in a case not covered by Sections 257–259 or other law, omits to apprehend them or suffers their escape, shall be punished with imprisonment up to three years, or fine, or both, if intentional; or simple imprisonment up to two years, or fine, or both, if negligent.",
    punishment: "Up to three years (intentional) or up to two years (negligent), or fine, or both.",
    illustrations: [], crossRefs: [259, 261] },
  { id: 265, ipc: 225, category: "TT", title: "Resistance or obstruction to lawful apprehension or escape or rescue in cases not otherwise provided for",
    text: "Whoever, in a case not covered by Sections 260–261 or other law, intentionally resists or illegally obstructs their own or another's lawful apprehension, or escapes/attempts to escape lawful custody, or rescues/attempts to rescue another from it, shall be punished with imprisonment up to six months, or fine, or both.",
    punishment: "Up to six months, or fine, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [262, 263] },
  { id: 266, ipc: 224, category: "TT", title: "Violation of condition of remission of punishment",
    text: "Whoever, having accepted a conditional remission of punishment, knowingly violates a condition of that remission, shall be punished with the original sentence — in full, if none has been served, or with the residue, if part has already been served.",
    punishment: "The original sentence or its unserved residue. Cognizable, non-bailable.",
    illustrations: [], crossRefs: [] },
  { id: 267, ipc: 228, category: "TT", title: "Intentional insult or interruption to public servant sitting in judicial proceeding",
    text: "Whoever intentionally insults, or causes interruption to, a public servant while sitting in any stage of a judicial proceeding, shall be punished with simple imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 268, ipc: null, category: "TT", title: "Personation of an assessor",
    text: "Whoever, by personation or otherwise, intentionally causes or knowingly suffers themselves to be returned, empanelled, or sworn as an assessor knowing they are not entitled by law to be so, or knowing they were so returned contrary to law, voluntarily serves as an assessor, shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Up to two years, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 269, ipc: null, category: "TT", title: "Failure by person released on bail or bond to appear in court",
    text: "Whoever, having been charged with an offence and released on bail or on a bond without sureties, fails without sufficient cause (the burden of proof lying on them) to appear in Court per the bail/bond terms, shall be punished with imprisonment up to one year, or fine, or both.",
    explanations: ["This punishment is in addition to the punishment for the offence they were charged with, and is without prejudice to the Court's power to order forfeiture of the bond."],
    punishment: "Up to one year, or fine, or both, in addition to the underlying charge's punishment. Cognizable, non-bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },

  /* ---- Chapter XV — Of Offences Affecting the Public Health, Safety, Convenience, Decency and Morals ---- */
  { id: 270, ipc: 268, category: "UU", title: "Public nuisance",
    text: "A person is guilty of a public nuisance who does an act, or is guilty of an illegal omission, causing common injury, danger, or annoyance to the public or to people in general who dwell or occupy property nearby, or which necessarily causes injury, obstruction, danger, or annoyance to persons who may have occasion to use a public right — a common nuisance is not excused merely because it causes some convenience or advantage.",
    simpleExplanation: "The defining feature of public nuisance, versus a private civil wrong, is that it affects the public generally or a class of the public, not just one identifiable victim — and importantly, the nuisance-maker can't defend it by pointing to some benefit or convenience it also creates.",
    illustrations: [], crossRefs: [],
    cases: [{ name: "K. Ramakrishnan v. State of Kerala", cite: "AIR 1999 Ker 385", year: 1999,
      ratio: "The Kerala High Court held that public smoking of tobacco falls within the mischief of the public nuisance provision, and that exposing non-smokers to secondhand smoke also violates the right to life under Article 21 — directing District Collectors to prohibit public smoking and prosecute violators.",
      url: "https://indiankanoon.org/doc/1480636/" }] },
  { id: 271, ipc: 269, category: "UU", title: "Negligent act likely to spread infection of disease dangerous to life",
    text: "Whoever unlawfully or negligently does an act which they know, or have reason to believe, is likely to spread the infection of a disease dangerous to life, shall be punished with imprisonment up to six months, or fine, or both.",
    punishment: "Up to six months, or fine, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [272] },
  { id: 272, ipc: 270, category: "UU", title: "Malignant act likely to spread infection of disease dangerous to life",
    text: "Whoever malignantly does an act which they know, or have reason to believe, is likely to spread the infection of a disease dangerous to life, shall be punished with imprisonment up to two years, or fine, or both.",
    simpleExplanation: "This is the aggravated version of Section 271 — same underlying conduct, but done malignantly (with actual ill-will or malice) rather than merely negligently, which is why the punishment jumps from six months to two years.",
    punishment: "Up to two years, or fine, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [271] },
  { id: 273, ipc: 271, category: "UU", title: "Disobedience to quarantine rule",
    text: "Whoever knowingly disobeys a Government rule for placing any mode of transport into quarantine, or regulating intercourse with a transport in quarantine, or regulating intercourse between places where an infectious disease prevails and other places, shall be punished with imprisonment up to six months, or fine, or both.",
    punishment: "Up to six months, or fine, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },

  { id: 274, ipc: 272, category: "VV", title: "Adulteration of food or drink intended for sale",
    text: "Whoever adulterates an article of food or drink so as to make it noxious, intending to sell it as food/drink, or knowing it is likely to be so sold, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [275] },
  { id: 275, ipc: 273, category: "VV", title: "Sale of noxious food or drink",
    text: "Whoever sells, or offers/exposes for sale, as food or drink, an article that has become noxious or unfit for food/drink, knowing or having reason to believe this, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [274] },
  { id: 276, ipc: 274, category: "VV", title: "Adulteration of drugs",
    text: "Whoever adulterates a drug or medical preparation so as to lessen its efficacy, change its operation, or make it noxious, intending or knowing it likely that it will be sold/used for a medicinal purpose as if unadulterated, shall be punished with imprisonment up to one year, or fine up to ₹5,000, or both.",
    punishment: "Up to one year, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [277] },
  { id: 277, ipc: 275, category: "VV", title: "Sale of adulterated drugs",
    text: "Whoever, knowing a drug/medical preparation has been adulterated so as to lessen its efficacy, change its operation, or render it noxious, sells it, offers/exposes it for sale, or issues it from a dispensary as unadulterated, or causes it to be used medicinally by someone unaware of the adulteration, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [276] },
  { id: 278, ipc: 276, category: "VV", title: "Sale of drug as a different drug or preparation",
    text: "Whoever knowingly sells, or offers/exposes for sale, or issues from a dispensary for medicinal purposes, a drug or medical preparation as a different drug or preparation, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },

  { id: 279, ipc: 277, category: "WW", title: "Fouling water of public spring or reservoir",
    text: "Whoever voluntarily corrupts or fouls the water of a public spring or reservoir, rendering it less fit for its ordinary use, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 280, ipc: 278, category: "WW", title: "Making atmosphere noxious to health",
    text: "Whoever voluntarily vitiates the atmosphere of a place so as to make it noxious to the health of people generally dwelling, working, or passing along a public way nearby, shall be punished with fine up to ₹1,000.",
    punishment: "Fine up to ₹1,000. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 281, ipc: 279, category: "WW", title: "Rash driving or riding on a public way",
    text: "Whoever drives or rides a vehicle on a public way so rashly or negligently as to endanger human life or be likely to cause hurt or injury, shall be punished with imprisonment up to six months, or fine up to ₹1,000, or both.",
    punishment: "Up to six months, or fine up to ₹1,000, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 282, ipc: 280, category: "WW", title: "Rash navigation of vessel",
    text: "Whoever navigates a vessel so rashly or negligently as to endanger human life or be likely to cause hurt or injury, shall be punished with imprisonment up to six months, or fine up to ₹10,000, or both.",
    punishment: "Up to six months, or fine up to ₹10,000, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 283, ipc: 281, category: "WW", title: "Exhibition of false light, mark or buoy",
    text: "Whoever exhibits a false light, mark, or buoy, intending or knowing it likely to mislead a navigator, shall be punished with imprisonment up to seven years, and fine not less than ₹10,000.",
    punishment: "Up to seven years, and fine not less than ₹10,000. Cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 284, ipc: 282, category: "WW", title: "Conveying person by water for hire in unsafe or overloaded vessel",
    text: "Whoever knowingly or negligently conveys, or causes to be conveyed for hire, a person by water in a vessel that is in such a state, or so overloaded, as to endanger that person's life, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 285, ipc: 283, category: "WW", title: "Danger or obstruction in public way or line of navigation",
    text: "Whoever, by an act or omission to take order with property in their possession/charge, causes danger, obstruction, or injury to a person in a public way or public line of navigation, shall be punished with fine up to ₹5,000.",
    punishment: "Fine up to ₹5,000. Cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 286, ipc: 284, category: "WW", title: "Negligent conduct with respect to poisonous substance",
    text: "Whoever does, with a poisonous substance, an act so rash or negligent as to endanger human life or be likely to cause hurt/injury, or knowingly/negligently omits to take order with such a substance in their possession sufficient to guard against probable danger, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [287, 288] },
  { id: 287, ipc: 285, category: "WW", title: "Negligent conduct with respect to fire or combustible matter",
    text: "Whoever does, with fire or combustible matter, an act so rash or negligent as to endanger human life or be likely to cause hurt/injury, or knowingly/negligently omits to take order with such matter in their possession sufficient to guard against probable danger, shall be punished with imprisonment up to six months, or fine up to ₹2,000, or both.",
    punishment: "Up to six months, or fine up to ₹2,000, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [286, 288] },
  { id: 288, ipc: 286, category: "WW", title: "Negligent conduct with respect to explosive substance",
    text: "Whoever does, with an explosive substance, an act so rash or negligent as to endanger human life or be likely to cause hurt/injury, or knowingly/negligently omits to take order with such a substance in their possession sufficient to guard against probable danger, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [286, 287] },
  { id: 289, ipc: 287, category: "WW", title: "Negligent conduct with respect to machinery",
    text: "Whoever does, with machinery, an act so rash or negligent as to endanger human life or be likely to cause hurt/injury, or knowingly/negligently omits to take order with machinery in their possession/care sufficient to guard against probable danger, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 290, ipc: 288, category: "WW", title: "Negligent conduct with respect to pulling down, repairing or constructing buildings, etc.",
    text: "Whoever, in pulling down, repairing, or constructing a building, knowingly or negligently omits to take sufficient measures to guard against probable danger to human life from its fall, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 291, ipc: 289, category: "WW", title: "Negligent conduct with respect to animal",
    text: "Whoever knowingly or negligently omits to take sufficient measures with an animal in their possession to guard against probable danger to human life, or probable danger of grievous hurt, from it, shall be punished with imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [] },

  { id: 292, ipc: 290, category: "XX", title: "Punishment for public nuisance in cases not otherwise provided for",
    text: "Whoever commits a public nuisance not otherwise specifically punishable under this Sanhita shall be punished with fine up to ₹1,000.",
    punishment: "Fine up to ₹1,000. Non-cognizable, bailable.",
    illustrations: [], crossRefs: [270] },
  { id: 293, ipc: 291, category: "XX", title: "Continuance of nuisance after injunction to discontinue",
    text: "Whoever repeats or continues a public nuisance, having been enjoined by a public servant with lawful authority not to repeat or continue it, shall be punished with simple imprisonment up to six months, or fine up to ₹5,000, or both.",
    punishment: "Up to six months, or fine up to ₹5,000, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [270, 292] },
  { id: 294, ipc: 292, category: "XX", title: "Sale, etc., of obscene books, etc.",
    text: "(1) A book, pamphlet, paper, drawing, painting, or other object (including electronic content) is deemed obscene if it is lascivious, appeals to prurient interest, or its effect (taken as a whole) tends to deprave and corrupt likely readers/viewers. (2) Selling, letting to hire, distributing, publicly exhibiting, or circulating (or making/possessing for those purposes) any obscene object; importing, exporting, or conveying it for such purposes; profiting from a business dealing in such objects; advertising such availability; or attempting any of these, is punishable on first conviction with imprisonment up to two years and fine up to ₹5,000, and on subsequent conviction with imprisonment up to five years and fine up to ₹10,000.",
    provisos: [
      "Does not extend to a book/object whose publication is proved justified as being for the public good, on grounds of science, literature, art, learning, or other objects of general concern.",
      "Does not extend to anything kept or used bona fide for religious purposes.",
      "Does not extend to representations on ancient monuments (under the Ancient Monuments and Archaeological Sites and Remains Act, 1958), or on/in any temple or any car used to convey idols, or otherwise kept/used for religious purposes."
    ],
    punishment: "First conviction: up to two years and fine up to ₹5,000. Subsequent: up to five years and fine up to ₹10,000. Cognizable, bailable.",
    illustrations: [], crossRefs: [295] },
  { id: 295, ipc: "292A", category: "XX", title: "Sale, etc., of obscene objects to child",
    text: "Whoever sells, lets to hire, distributes, exhibits, or circulates to a child under eighteen any obscene object referred to in Section 294, or attempts to do so, shall be punished on first conviction with imprisonment up to three years and fine up to ₹2,000, and on subsequent conviction with imprisonment up to seven years and fine up to ₹5,000.",
    punishment: "First conviction: up to three years and fine up to ₹2,000. Subsequent: up to seven years and fine up to ₹5,000. Cognizable, bailable.",
    illustrations: [], crossRefs: [294] },
  { id: 296, ipc: 294, category: "XX", title: "Obscene acts and songs",
    text: "Whoever, to the annoyance of others, does an obscene act in a public place, or sings, recites, or utters an obscene song, ballad, or words in or near a public place, shall be punished with imprisonment up to three months, or fine up to ₹1,000, or both.",
    punishment: "Up to three months, or fine up to ₹1,000, or both. Cognizable, bailable.",
    illustrations: [], crossRefs: [] },
  { id: 297, ipc: 294, category: "XX", title: "Keeping lottery office",
    text: "(1) Whoever keeps an office or place for drawing a lottery, other than a State lottery or one authorised by the State Government, shall be punished with imprisonment up to six months, or fine, or both. (2) Whoever publishes a proposal to pay a sum, deliver goods, or do/forbear anything for a person's benefit, contingent on the drawing of a ticket/lot/number/figure in such a lottery, shall be punished with fine up to ₹5,000.",
    punishment: "Up to six months, or fine, or both (sub-section 1); fine up to ₹5,000 (sub-section 2).",
    illustrations: [], crossRefs: [] },

  /* ---- Chapter VIII — Of Offences Relating To The Army, Navy And Air Force ---- */
  { id: 159, ipc: 131, category: "BBB", title: "Abetting mutiny, or attempting to seduce a soldier, sailor or airman from his duty",
    text: "Whoever abets the committing of mutiny by an officer, soldier, sailor or airman in the Army, Navy or Air Force subject to the Acts referred to in Section 167, or attempts to seduce any such officer, soldier, sailor or airman from his allegiance or duty, shall be punished with imprisonment for life, or with imprisonment up to ten years, and shall also be liable to fine.",
    punishment: "Imprisonment for life, or up to ten years, plus fine. Cognizable, non-bailable, triable by Court of Session.",
    illustrations: [], crossRefs: [160] },
  { id: 160, ipc: 132, category: "BBB", title: "Abetment of mutiny, if mutiny is committed in consequence thereof",
    text: "Whoever abets the committing of mutiny by an officer, soldier, sailor or airman in the Army, Navy or Air Force of the Government of India shall, if mutiny is committed in consequence of that abetment, be punished with death or imprisonment for life, or imprisonment up to ten years, and shall also be liable to fine.",
    punishment: "Death, or imprisonment for life, or up to ten years, plus fine. Cognizable, non-bailable, triable by Court of Session.",
    illustrations: [], crossRefs: [159] },
  { id: 161, ipc: 133, category: "BBB", title: "Abetment of assault by soldier, sailor or airman on his superior officer, when in execution of his office",
    text: "Whoever abets an assault by an officer, soldier, sailor or airman on any superior officer being in the execution of his office, shall be punished with imprisonment up to three years, and shall also be liable to fine.",
    punishment: "Imprisonment up to three years, plus fine. Cognizable, non-bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [162] },
  { id: 162, ipc: 134, category: "BBB", title: "Abetment of such assault, if the assault committed",
    text: "Whoever abets such an assault shall, if it is committed in consequence of that abetment, be punished with imprisonment up to seven years, and shall also be liable to fine.",
    punishment: "Imprisonment up to seven years, plus fine. Cognizable, non-bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [161] },
  { id: 163, ipc: 135, category: "BBB", title: "Abetment of desertion of soldier, sailor or airman",
    text: "Whoever abets the desertion of any officer, soldier, sailor or airman in the Army, Navy or Air Force shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Imprisonment up to two years, or fine, or both. Cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [164] },
  { id: 164, ipc: 136, category: "BBB", title: "Harbouring deserter",
    text: "Whoever, knowing or having reason to believe that an officer, soldier, sailor or airman has deserted, harbours them, shall be punished with imprisonment up to two years, or fine, or both.",
    provisos: ["Does not extend to harbouring by the deserter's spouse."],
    punishment: "Imprisonment up to two years, or fine, or both. Cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [163] },
  { id: 165, ipc: 137, category: "BBB", title: "Deserter concealed on board merchant vessel through negligence of master",
    text: "The master or person in charge of a merchant vessel on which a deserter is concealed shall, though ignorant of the concealment, be liable to a penalty up to ₹3,000 if he might have known of it but for neglect of his duty or want of discipline on board.",
    punishment: "Fine up to ₹3,000. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [] },
  { id: 166, ipc: 138, category: "BBB", title: "Abetment of act of insubordination by soldier, sailor or airman",
    text: "Whoever abets what he knows to be an act of insubordination by an officer, soldier, sailor or airman shall, if that act is committed in consequence of the abetment, be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Imprisonment up to two years, or fine, or both. Cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [] },
  { id: 167, ipc: 139, category: "BBB", title: "Persons subject to certain Acts",
    text: "No person subject to the Army Act 1950, the Indian Navy (Discipline) Act 1934, or the Air Force Act 1950 shall be subject to punishment under this Sanhita for any offence defined in this Chapter.",
    illustrations: [], crossRefs: [] },
  { id: 168, ipc: 140, category: "BBB", title: "Wearing garb or carrying token used by soldier, sailor or airman",
    text: "Whoever, not being a soldier, sailor or airman, wears any garb or carries any token resembling one used by such a person, intending it to be believed that he is such a person, shall be punished with imprisonment up to three months, or fine up to ₹2,000, or both.",
    punishment: "Imprisonment up to three months, or fine up to ₹2,000, or both. Cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [] },

  /* ---- Chapter IX — Of Offences Relating To Elections ---- */
  { id: 169, ipc: "171A", category: "CCC", title: "Candidate, electoral right defined",
    text: "For this Chapter — \"candidate\" means a person nominated as a candidate at any election; \"electoral right\" means the right of a person to stand, or not stand as, or withdraw from being, a candidate, or to vote or refrain from voting at an election.",
    illustrations: [], crossRefs: [] },
  { id: 170, ipc: "171B", category: "CCC", title: "Bribery",
    text: "A person commits bribery if he — (a) gives a gratification to induce any person to exercise an electoral right, or as a reward for having exercised it; or (b) accepts a gratification as a reward for exercising such a right, or for inducing/attempting to induce another to exercise it.",
    explanations: ["A declaration of public policy or promise of public action is not an offence under this section.", "A person who offers, agrees to give, or attempts to procure a gratification is deemed to give one; a person who obtains, agrees to accept, or attempts to obtain one is deemed to accept it — including as a reward for something not actually done."],
    illustrations: [], crossRefs: [173] },
  { id: 171, ipc: "171C", category: "CCC", title: "Undue influence at elections",
    text: "Whoever voluntarily interferes, or attempts to interfere, with the free exercise of any electoral right commits undue influence at an election — including threatening a candidate/voter (or someone they care about) with injury, or inducing a belief that they will become an object of Divine displeasure or spiritual censure.",
    provisos: ["A declaration of public policy, promise of public action, or the mere exercise of a legal right without intent to interfere, is not undue influence."],
    illustrations: [], crossRefs: [174] },
  { id: 172, ipc: "171D", category: "CCC", title: "Personation at elections",
    text: "Whoever, at an election, applies for a voting paper in the name of another person (living or dead) or a fictitious name, or having already voted applies again in their own name, or abets/procures/attempts to procure such voting, commits personation at an election.",
    provisos: ["Does not apply to a person authorised to vote as proxy for an elector, so long as they vote as that proxy."],
    illustrations: [], crossRefs: [174] },
  { id: 173, ipc: "171E", category: "CCC", title: "Punishment for bribery",
    text: "Whoever commits bribery shall be punished with imprisonment up to one year, or fine, or both — provided bribery by \"treating\" (gratification consisting of food, drink, entertainment, or provision) is punished with fine only.",
    punishment: "Imprisonment up to one year, or fine, or both (fine only if by treating). Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [170] },
  { id: 174, ipc: "171F", category: "CCC", title: "Punishment for undue influence or personation at an election",
    text: "Whoever commits undue influence or personation at an election shall be punished with imprisonment up to one year, or fine, or both.",
    punishment: "Imprisonment up to one year, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [171, 172] },
  { id: 175, ipc: "171G", category: "CCC", title: "False statement in connection with an election",
    text: "Whoever, intending to affect an election's result, makes or publishes a statement of fact he knows or believes to be false (or does not believe true), about a candidate's personal character or conduct, shall be punished with fine.",
    punishment: "Fine. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 176, ipc: "171H", category: "CCC", title: "Illegal payments in connection with an election",
    text: "Whoever, without a candidate's written authority, incurs or authorises election-related expenses (public meetings, advertisements, etc.) for promoting that candidate's election, shall be punished with fine up to ₹10,000.",
    provisos: ["If expenses up to ₹10 were incurred without authority, and the candidate's written approval is obtained within ten days, the expense is deemed authorised."],
    punishment: "Fine up to ₹10,000. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 177, ipc: "171I", category: "CCC", title: "Failure to keep election accounts",
    text: "Whoever, being required by law to keep accounts of election-related expenses, fails to do so, shall be punished with fine up to ₹5,000.",
    punishment: "Fine up to ₹5,000. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },

  /* ---- Chapter XII — Of Offences By Or Relating To Public Servants ---- */
  { id: 198, ipc: 166, category: "ZZ", title: "Public servant disobeying law, with intent to cause injury to any person",
    text: "Whoever, being a public servant, knowingly disobeys any direction of the law as to the way in which he is to conduct himself as such public servant, intending to cause, or knowing it to be likely that he will by such disobedience cause injury to any person, shall be punished with simple imprisonment up to one year, or fine, or both.",
    illustrations: ["A, being an officer directed by law to take property in execution to satisfy a decree in Z's favour, knowingly disobeys that direction of law, knowing he is likely thereby to cause injury to Z. A has committed the offence defined in this section."],
    punishment: "Simple imprisonment up to one year, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    crossRefs: [199] },
  { id: 199, ipc: "166A", category: "ZZ", title: "Public servant disobeying direction under law",
    text: "Whoever, being a public servant — (a) knowingly disobeys any direction of the law which prohibits him from requiring the attendance at any place of any person for the purpose of investigation into an offence or any other matter; or (b) knowingly disobeys, to the prejudice of any person, any other direction of the law regulating the manner in which he shall conduct such investigation; or (c) fails to record any information given to him under Section 174(1) of the BNSS, 2023 relating to a cognizable offence punishable under Sections 64, 65, 66, 67, 68, 71, 73, 76, 122, 141, or 142 — shall be punished with rigorous imprisonment of six months to two years, and shall also be liable to fine.",
    punishment: "Rigorous imprisonment of six months to two years, and fine. Cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [198] },
  { id: 200, ipc: "166B", category: "ZZ", title: "Punishment for non-treatment of victim",
    text: "Whoever, being in charge of a hospital (public or private, whether run by the Central Government, State Government, local bodies, or any other person), contravenes the provisions of Section 449 of the BNSS, 2023, shall be punished with imprisonment up to one year, or fine, or both.",
    punishment: "Imprisonment up to one year, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 201, ipc: 167, category: "ZZ", title: "Public servant framing an incorrect document with intent to cause injury",
    text: "Whoever, being a public servant charged with preparing or translating a document or electronic record, frames, prepares, or translates it in a manner he knows or believes to be incorrect, intending to cause (or knowing it likely to cause) injury to any person, shall be punished with imprisonment up to three years, or fine, or both.",
    punishment: "Imprisonment up to three years, or fine, or both. Cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 202, ipc: 168, category: "ZZ", title: "Public servant unlawfully engaging in trade",
    text: "Whoever, being a public servant legally bound not to engage in trade, engages in trade, shall be punished with simple imprisonment up to one year, or fine, or both, or with community service.",
    punishment: "Simple imprisonment up to one year, or fine, or both, or community service. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [203] },
  { id: 203, ipc: 169, category: "ZZ", title: "Public servant unlawfully buying or bidding for property",
    text: "Whoever, being a public servant legally bound not to purchase or bid for certain property, purchases or bids for it (in his own name, another's name, jointly, or in shares), shall be punished with simple imprisonment up to two years, or fine, or both; the property, if purchased, shall be confiscated.",
    punishment: "Simple imprisonment up to two years, or fine, or both, plus confiscation of the property if purchased. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [202] },
  { id: 204, ipc: 170, category: "ZZ", title: "Personating a public servant",
    text: "Whoever pretends to hold a particular office as a public servant, knowing he does not hold it, or falsely personates another person holding such office, and in that assumed character does or attempts to do any act under colour of that office, shall be punished with imprisonment of six months to three years, and fine.",
    punishment: "Imprisonment of six months to three years, and fine. Cognizable, non-bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [205] },
  { id: 205, ipc: 171, category: "ZZ", title: "Wearing garb or carrying token used by public servant with fraudulent intent",
    text: "Whoever, not belonging to a certain class of public servants, wears any garb or carries any token resembling one used by that class, intending (or knowing it likely) that others will believe he belongs to that class, shall be punished with imprisonment up to three months, or fine up to ₹5,000, or both.",
    punishment: "Imprisonment up to three months, or fine up to ₹5,000, or both. Cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [204] },

  /* ---- Chapter XVI — Of Offences Relating To Religion ---- */
  { id: 298, ipc: 295, category: "AAA", title: "Injuring or defiling place of worship, with intent to insult the religion of any class",
    text: "Whoever destroys, damages, or defiles any place of worship, or any object held sacred by any class of persons, intending thereby to insult that class's religion, or knowing that class is likely to consider it an insult, shall be punished with imprisonment up to two years, or fine, or both.",
    punishment: "Imprisonment up to two years, or fine, or both. Cognizable, non-bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [299] },
  { id: 299, ipc: "295A", category: "AAA", title: "Deliberate and malicious acts, intended to outrage religious feelings of any class by insulting its religion or religious beliefs",
    text: "Whoever, with deliberate and malicious intention of outraging the religious feelings of any class of citizens of India, insults or attempts to insult that class's religion or religious beliefs — by words (spoken or written), signs, visible representations, electronic means, or otherwise — shall be punished with imprisonment up to three years, or fine, or both.",
    punishment: "Imprisonment up to three years, or fine, or both. Cognizable, non-bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [298] },
  { id: 300, ipc: 296, category: "AAA", title: "Disturbing religious assembly",
    text: "Whoever voluntarily causes disturbance to any assembly lawfully engaged in religious worship or religious ceremonies shall be punished with imprisonment up to one year, or fine, or both.",
    punishment: "Imprisonment up to one year, or fine, or both. Cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [] },
  { id: 301, ipc: 297, category: "AAA", title: "Trespassing on burial places, etc.",
    text: "Whoever, intending to wound any person's feelings or insult their religion (or knowing this is likely), commits trespass in a place of worship or a place of sepulture, or a place set apart for funeral rites or as a depository for the dead, or offers any indignity to a human corpse, or disturbs persons assembled for funeral ceremonies, shall be punished with imprisonment up to one year, or fine, or both.",
    punishment: "Imprisonment up to one year, or fine, or both. Cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [] },
  { id: 302, ipc: 298, category: "AAA", title: "Uttering words, etc., with deliberate intent to wound religious feelings of any person",
    text: "Whoever, with deliberate intention of wounding a person's religious feelings, utters any word or makes any sound in that person's hearing, or makes any gesture in their sight, or places any object in their sight, shall be punished with imprisonment up to one year, or fine, or both.",
    punishment: "Imprisonment up to one year, or fine, or both. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [299] },

  /* ---- Chapter XVIII — Of Offences Relating To Documents And To Property Marks ---- */
  { id: 335, ipc: 464, category: "DDD", title: "Making a false document",
    text: "A person makes a false document or false electronic record who dishonestly or fraudulently: makes/signs/seals/executes a document or part of one; makes or transmits an electronic record; affixes an electronic signature; makes a mark denoting execution/authenticity — intending it to be believed made/signed/executed by someone whose authority he knows it was not; OR who, without lawful authority, dishonestly alters a document/electronic record in a material part after it was made; OR who dishonestly causes a person to sign/execute/alter a document, or affix an electronic signature, knowing that person cannot understand its contents due to mental illness, intoxication, or deception practised on them.",
    explanations: ["A person's signature of his own name may still amount to forgery — e.g. signing his own name to a bill of exchange intending it be believed drawn by a different person of the same name.", "Making a false document in a fictitious person's name, or a deceased person's name (intending it believed made in their lifetime), may amount to forgery.", "\"Affixing electronic signature\" has the meaning under Section 2(1)(d) of the Information Technology Act, 2000."],
    illustrations: ["A adds a cipher to a ₹10,000 letter of credit making it ₹1,00,000, intending B to believe Z wrote it that way — forgery.", "A affixes Z's seal without authority to a fake conveyance document intending to sell the estate and obtain money from B — forgery.", "A fraudulently fills in a sum on a blank signed cheque he found — forgery.", "A dishonestly scratches out a beneficiary's name from a will to redirect the inheritance — forgery."],
    crossRefs: [336] },
  { id: 336, ipc: null, category: "DDD", title: "Forgery",
    text: "(1) Whoever makes a false document/electronic record, intending to cause damage or injury to the public or any person, or to support a claim/title, or to cause a person to part with property, or to enter a contract, or to commit fraud, commits forgery. (2) Basic forgery: imprisonment up to two years, or fine, or both. (3) Forgery intended for use in cheating: imprisonment up to seven years, and fine. (4) Forgery intended to harm reputation, or known likely to: imprisonment up to three years, and fine.",
    punishment: "Two years base; up to seven years plus fine if for cheating; up to three years plus fine if to harm reputation.",
    illustrations: [], crossRefs: [335] },
  { id: 337, ipc: 466, category: "DDD", title: "Forgery of record of Court or of public register, etc.",
    text: "Whoever forges a document/electronic record purporting to be a Court record/proceeding, a Government-issued identity document (including voter ID or Aadhaar), a register of birth/marriage/burial, a public servant's official register, a certificate purporting to be made by a public servant, an authority to institute/defend a suit or confess judgment, or a power of attorney, shall be punished with imprisonment up to seven years, and fine.",
    punishment: "Imprisonment up to seven years, and fine. Non-cognizable, non-bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [339] },
  { id: 338, ipc: 467, category: "DDD", title: "Forgery of valuable security, will, etc.",
    text: "Whoever forges a document purporting to be a valuable security, a will, an authority to adopt a son, an authority to transfer/receive a valuable security or its proceeds, or an acquittance/receipt for money or movable property, shall be punished with imprisonment for life, or up to ten years, and fine.",
    punishment: "Imprisonment for life, or up to ten years, and fine.",
    illustrations: [], crossRefs: [339] },
  { id: 339, ipc: 474, category: "DDD", title: "Having possession of document described in Section 337 or 338, knowing it to be forged and intending to use it as genuine",
    text: "Whoever possesses a document/electronic record knowing it forged and intending it be fraudulently/dishonestly used as genuine, shall be punished with imprisonment up to seven years and fine if it's of the description in Section 337; or imprisonment for life, or up to seven years, and fine, if of the description in Section 338.",
    punishment: "Up to seven years plus fine (Section 337-type); life or up to seven years plus fine (Section 338-type).",
    illustrations: [], crossRefs: [337, 338] },
  { id: 340, ipc: null, category: "DDD", title: "Forged document or electronic record and using it as genuine",
    text: "(1) A false document/electronic record made wholly or partly by forgery is a \"forged document or electronic record\". (2) Whoever fraudulently/dishonestly uses as genuine a document he knows or has reason to believe is forged shall be punished as if he had forged it himself.",
    punishment: "Same as the punishment for forging that document. Cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [336] },
  { id: 341, ipc: null, category: "DDD", title: "Making or possessing counterfeit seal, etc., with intent to commit forgery punishable under Section 338",
    text: "(1) Whoever makes/counterfeits a seal, plate, or instrument intending it be used for forgery punishable under Section 336, or possesses such knowing it counterfeit, shall be punished with imprisonment for life, or up to seven years, and fine. (2) The same for forgery punishable under any other section of this Chapter, except 336: imprisonment up to seven years, and fine. (3) Mere possession, knowing it counterfeit: imprisonment up to three years, and fine. (4) Fraudulently using such a counterfeit item as genuine: punished as if he made/counterfeited it.",
    punishment: "Escalating scale from three years to life, depending on intent/use and the target offence's severity.",
    illustrations: [], crossRefs: [336, 338] },
  { id: 342, ipc: null, category: "DDD", title: "Counterfeiting device or mark used for authenticating documents described in Section 338, or possessing counterfeit marked material",
    text: "(1) Whoever counterfeits an authenticating device/mark for documents described in Section 336, intending it be used to give forged documents an appearance of authenticity, or possesses material bearing such a counterfeited mark with that intent, shall be punished with imprisonment for life, or up to seven years, and fine. (2) The same for documents other than those in Section 336: imprisonment up to seven years, and fine.",
    punishment: "Life or up to seven years plus fine (Section 336-type documents); up to seven years plus fine (others).",
    illustrations: [], crossRefs: [336, 338] },
  { id: 343, ipc: 477, category: "DDD", title: "Fraudulent cancellation, destruction, etc., of will, authority to adopt, or valuable security",
    text: "Whoever fraudulently or dishonestly, or intending to cause damage/injury, cancels, destroys, defaces, or secretes, or attempts to, a document that is or purports to be a will, an authority to adopt a son, or a valuable security, or commits mischief regarding such a document, shall be punished with imprisonment for life, or up to seven years, and fine.",
    punishment: "Imprisonment for life, or up to seven years, and fine. Non-cognizable, non-bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 344, ipc: "477A", category: "DDD", title: "Falsification of accounts",
    text: "Whoever, being a clerk, officer, or servant, wilfully and with intent to defraud destroys, alters, mutilates, or falsifies any book, electronic record, paper, writing, valuable security, or account belonging to, or received on behalf of, his employer, or makes/abets a false entry, or omits/alters a material particular, shall be punished with imprisonment up to seven years, or fine, or both.",
    explanations: ["It is sufficient to allege a general intent to defraud, without naming a specific intended victim, sum, or date."],
    punishment: "Imprisonment up to seven years, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [] },
  { id: 345, ipc: null, category: "EEE", title: "Property mark",
    text: "(1) A mark denoting that movable property belongs to a particular person is a \"property mark\". (2) Whoever marks property/goods, or a receptacle, in a manner reasonably calculated to cause it to be believed they belong to someone they don't, uses a \"false property mark\". (3) Whoever uses a false property mark shall, unless he proves he acted without intent to defraud, be punished with imprisonment up to one year, or fine, or both.",
    punishment: "Imprisonment up to one year, or fine, or both. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [346, 347] },
  { id: 346, ipc: 489, category: "EEE", title: "Tampering with property mark with intent to cause injury",
    text: "Whoever removes, destroys, defaces, or adds to any property mark, intending, or knowing it likely, to cause injury to any person, shall be punished with imprisonment up to one year, or fine, or both.",
    punishment: "Imprisonment up to one year, or fine, or both. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [345] },
  { id: 347, ipc: null, category: "EEE", title: "Counterfeiting a property mark",
    text: "(1) Whoever counterfeits any property mark used by another person shall be punished with imprisonment up to two years, or fine, or both. (2) Counterfeiting a mark used by a public servant, denoting manufacture, quality, passage through an office, or exemption entitlement, or using such a counterfeit as genuine, shall be punished with imprisonment up to three years, and fine.",
    punishment: "Up to two years plus fine (general); up to three years plus fine (public servant's mark).",
    illustrations: [], crossRefs: [345] },
  { id: 348, ipc: 485, category: "EEE", title: "Making or possession of any instrument for counterfeiting a property mark",
    text: "Whoever makes or possesses any die, plate, or instrument for counterfeiting a property mark, or possesses a property mark intending to denote goods belong to someone they don't, shall be punished with imprisonment up to three years, or fine, or both.",
    punishment: "Imprisonment up to three years, or fine, or both. Non-cognizable, bailable, triable by Magistrate of the first class.",
    illustrations: [], crossRefs: [347] },
  { id: 349, ipc: 486, category: "EEE", title: "Selling goods marked with a counterfeit property mark",
    text: "Whoever sells, or possesses for sale, goods with a counterfeit property mark shall be punished with imprisonment up to one year, or fine, or both — unless he proves he took reasonable precautions and had no reason to suspect the mark, gave all information he could about where he got the goods when demanded, or otherwise acted innocently.",
    punishment: "Imprisonment up to one year, or fine, or both. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [347] },
  { id: 350, ipc: null, category: "EEE", title: "Making a false mark upon any receptacle containing goods",
    text: "(1) Whoever makes a false mark on a case/package/receptacle reasonably calculated to make a public servant or other person believe it contains goods it doesn't, or doesn't contain goods it does, or that the goods are of different nature/quality, shall, unless he proves he acted without intent to defraud, be punished with imprisonment up to three years, or fine, or both. (2) Using such a false mark is punished the same way.",
    punishment: "Imprisonment up to three years, or fine, or both. Non-cognizable, bailable, triable by any Magistrate.",
    illustrations: [], crossRefs: [] },

  /* ---- Chapter XX — Repeal and Savings ---- */
  { id: 358, ipc: null, category: "FFF", title: "Repeal and savings",
    text: "(1) The Indian Penal Code (45 of 1860) is hereby repealed. (2) Notwithstanding that repeal, it shall not affect — (a) the previous operation of the repealed Code, or anything duly done or suffered under it; or (b) any right, privilege, obligation, or liability acquired, accrued, or incurred under the repealed Code; or (c) any penalty or punishment incurred for offences against the repealed Code; or (d) any investigation or remedy in respect of such penalty or punishment; or (e) any proceeding, investigation, or remedy as aforesaid — and any such proceeding or remedy may be instituted, continued, or enforced, and any such penalty imposed, as if the Code had not been repealed. (3) Notwithstanding the repeal, anything done or any action taken under the repealed Code is deemed to have been done or taken under the corresponding provisions of this Sanhita. (4) The mention of particular matters in sub-section (2) does not prejudice or affect the general application of Section 6 of the General Clauses Act, 1897, regarding the effect of repeal.",
    simpleExplanation: "This is the closing section of BNS — the formal handover clause. It does two things: kills off the old IPC, and makes sure nothing falls through the cracks in the transition — ongoing IPC cases, already-accrued rights, and pending punishments all carry over cleanly into the new Sanhita rather than becoming void.",
    illustrations: [], crossRefs: [] },

  /* ==================================================================== */
  /* THE SPECIFIC RELIEF ACT, 1963 — all 42 active sections (Act 18 of    */
  /* 2018 amendments incorporated). Sections use string ids "SRA-N" so   */
  /* they never collide with the numeric BNS section ids above.          */
  /* Sections 43–44 were themselves repealed by the Repealing and        */
  /* Amending Act, 1974 and are not part of the Act's active content.    */
  /* ==================================================================== */

  /* ---- Part I — Preliminary ---- */
  { id: "SRA-1", category: "SRC-A", title: "Short title, extent and commencement",
    text: "(1) This Act may be called the Specific Relief Act, 1963. (2) It extends to the whole of India. (3) It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint. [Came into force 1 March 1964.]",
    crossRefs: [] },
  { id: "SRA-2", category: "SRC-A", title: "Definitions",
    text: "In this Act, unless the context otherwise requires — (a) \"obligation\" includes every duty enforceable by law; (b) \"settlement\" means an instrument (other than a will or codicil) whereby the destination or devolution of successive interests in movable or immovable property is disposed of or agreed to be disposed of; (c) \"trust\" has the same meaning as in Section 3 of the Indian Trusts Act, 1882, and includes an obligation in the nature of a trust within the meaning of Chapter IX of that Act; (d) \"trustee\" includes every person holding property in trust; (e) all other words and expressions used but not defined here, and defined in the Indian Contract Act, 1872, have the meanings assigned to them in that Act.",
    crossRefs: [] },
  { id: "SRA-3", category: "SRC-A", title: "Savings",
    text: "Except as otherwise provided herein, nothing in this Act shall be deemed — (a) to deprive any person of any right to relief, other than specific performance, which he may have under any contract; or (b) to affect the operation of the Indian Registration Act, 1908, on documents.",
    crossRefs: [] },
  { id: "SRA-4", category: "SRC-A", title: "Specific relief to be granted only for enforcing individual civil rights and not for enforcing penal laws",
    text: "Specific relief can be granted only for the purpose of enforcing individual civil rights and not for the mere purpose of enforcing a penal law.",
    simpleExplanation: "This is the Act's foundational limiting principle — it exists to make private civil obligations (like a broken contract) actually enforceable, not to let someone use a civil court to punish another person for a crime. That's what criminal law and prosecution are for.",
    crossRefs: [] },

  /* ---- Part II, Chapter I — Recovering Possession of Property ---- */
  { id: "SRA-5", category: "SRC-B", title: "Recovery of specific immovable property",
    text: "A person entitled to the possession of specific immovable property may recover it in the manner provided by the Code of Civil Procedure, 1908.",
    crossRefs: ["SRA-6"] },
  { id: "SRA-6", category: "SRC-B", title: "Suit by person dispossessed of immovable property",
    text: "(1) If any person is dispossessed without his consent of immovable property otherwise than in due course of law, he (or any person through whom he has been in possession, or any person claiming through him) may, by suit, recover possession of it, notwithstanding any other title that may be set up in that suit. (2) No suit under this section shall be brought — (a) after the expiry of six months from the date of dispossession; or (b) against the Government. (3) No appeal shall lie from any order or decree passed in a suit under this section, nor shall any review of such an order or decree be allowed. (4) Nothing in this section bars any person from suing to establish his title to the property and recover its possession.",
    simpleExplanation: "This is the classic \"possession is nine-tenths of the law\" provision — it protects whoever was actually in possession, regardless of who really owns the property, as a fast, summary remedy against being thrown out other than through due legal process. The strict six-month deadline and the \"no appeal, no review\" rule both exist to keep this remedy quick — if you miss the window, you still have the slower, ordinary title suit under sub-section (4) available.",
    crossRefs: ["SRA-5"] },
  { id: "SRA-7", category: "SRC-B", title: "Recovery of specific movable property",
    text: "A person entitled to the possession of specific movable property may recover it in the manner provided by the Code of Civil Procedure, 1908.",
    explanations: ["A trustee may sue under this section for possession of movable property in which the person for whom he is trustee holds the beneficial interest.", "A special or temporary right to present possession of movable property is sufficient to support a suit under this section."],
    crossRefs: ["SRA-8"] },
  { id: "SRA-8", category: "SRC-B", title: "Liability of person in possession, not as owner, to deliver to persons entitled to immediate possession",
    text: "A person having possession or control of a particular article of movable property, of which he is not the owner, may be compelled to specifically deliver it to the person entitled to its immediate possession, in any of these cases — (a) the thing claimed is held by the defendant as agent or trustee of the plaintiff; (b) compensation in money would not afford the plaintiff adequate relief for its loss; (c) it would be extremely difficult to ascertain the actual damage caused by its loss; (d) possession of the thing claimed was wrongfully transferred from the plaintiff.",
    explanations: ["Unless proven otherwise, the court shall presume, for property claimed under clause (b) or (c), that money compensation would not be adequate, or that actual damage would be extremely difficult to ascertain."],
    crossRefs: ["SRA-7"] },

  /* ---- Part II, Chapter II — Specific Performance of Contracts ---- */
  { id: "SRA-9", category: "SRC-C", title: "Defences respecting suits for relief based on contract",
    text: "Except as otherwise provided herein, where any relief is claimed under this Chapter in respect of a contract, the person against whom the relief is claimed may plead by way of defence any ground available to him under any law relating to contracts.",
    crossRefs: [] },
  { id: "SRA-10", category: "SRC-C", title: "Specific performance in respect of contracts",
    text: "The specific performance of a contract shall be enforced by the court subject to the provisions contained in Section 11(2), Section 14, and Section 16.",
    simpleExplanation: "This is the single most important structural change from the 2018 amendment — before 2018, courts had wide discretion whether to order specific performance at all, treating it as an exception to the normal remedy of damages. Since 2018, specific performance is the default, general rule, and courts must enforce it unless one of the specific exceptions in Sections 11(2), 14, or 16 applies.",
    crossRefs: ["SRA-11", "SRA-14", "SRA-16"],
    cases: [
      { name: "Chand Rani v. Kamal Rani", cite: "(1993) 1 SCC 519 (also AIR 1993 SC 1742)", year: 1992,
        ratio: "A Constitution Bench of the Supreme Court held that in contracts for the sale of immovable property, time is never regarded as the essence of the contract by default — there is a presumption against it — unless the parties specifically stipulate this or it clearly emerges by implication from the contract's terms.",
        url: "https://indiankanoon.org/doc/1757550/" },
      { name: "Saradamani Kandappan v. S. Rajalakshmi", cite: "(2011) 12 SCC 18", year: 2011,
        ratio: "The Supreme Court held that the traditional \"time is not of the essence\" presumption from Chand Rani needs to be revisited in light of modern economic reality — given the steep, rapid rise in property prices, treating time as insignificant can unfairly prejudice a vendor forced to wait years for a buyer to complete payment, and courts must weigh this practical reality when deciding whether to grant specific performance.",
        url: "https://indiankanoon.org/doc/834739/" },
      { name: "Katta Sujatha Reddy v. Siddamsetty Infra Projects Pvt. Ltd.", cite: "Civil Appeal No. 5822 of 2022", year: 2022,
        ratio: "The Supreme Court held that the 2018 amendment to Section 10 — which made specific performance the general rule rather than a discretionary exception — applies only prospectively, not retrospectively. Suits filed, and contracts entered into, before the amendment came into force (1 October 2018) continue to be governed by the old discretionary regime.",
        url: "https://indiankanoon.org/doc/64833870/" }
    ] },
  { id: "SRA-11", category: "SRC-C", title: "Cases in which specific performance of contracts connected with trusts enforceable",
    text: "(1) Except as otherwise provided in this Act, specific performance of a contract shall be enforced when the act agreed to be done is in the performance, wholly or partly, of a trust. (2) A contract made by a trustee in excess of his powers, or in breach of trust, cannot be specifically enforced.",
    crossRefs: ["SRA-10"] },
  { id: "SRA-12", category: "SRC-C", title: "Specific performance of part of contract",
    text: "(1) Except as otherwise provided in this section, the court shall not direct specific performance of only part of a contract. (2) Where a party is unable to perform the whole of his part, but the unperformed part is only a small proportion of the whole in value and admits of money compensation, the court may direct specific performance of as much as can be performed, with compensation for the deficiency. (3) Where the unperformed part is either a considerable part of the whole (though it admits of compensation), or does not admit of compensation at all, the party in default is not entitled to a decree for specific performance — but the court may, on the other party's suit, direct the defaulting party to perform what he can, if the other party pays the full consideration (reduced appropriately if compensable) and relinquishes all claims to the rest of the contract's performance and to compensation for the shortfall. (4) Where a performable part of a contract stands on a separate, independent footing from a part that cannot or should not be specifically performed, the court may direct specific performance of the former part alone.",
    explanations: ["A party is deemed unable to perform the whole of his part if part of the contract's subject-matter, existing at the date of the contract, has ceased to exist by the time of performance."],
    crossRefs: ["SRA-10"] },
  { id: "SRA-13", category: "SRC-C", title: "Rights of purchaser or lessee against person with no title or imperfect title",
    text: "(1) Where a person contracts to sell or let immovable property having no title, or only an imperfect title, the purchaser or lessee has these rights — (a) if the vendor/lessor later acquires an interest in the property, the purchaser/lessee may compel him to make good the contract out of that interest; (b) where a third party's concurrence is needed to validate the title, and they're bound to concur at the vendor/lessor's request, the purchaser/lessee may compel the vendor/lessor to procure that concurrence or conveyance; (c) where the vendor claimed to sell unencumbered property but it's actually mortgaged for an amount not exceeding the purchase money (with only a right to redeem), the purchaser may compel him to redeem the mortgage and obtain a valid discharge (and conveyance from the mortgagee if needed); (d) where the vendor/lessor sues for specific performance and the suit is dismissed for want of title, the defendant has a right to the return of his deposit with interest, his costs, and a lien for these on the vendor/lessor's interest in the property. (2) These provisions also apply, as far as possible, to contracts for the sale or hire of movable property.",
    crossRefs: ["SRA-17"] },
  { id: "SRA-14", category: "SRC-C", title: "Contracts not specifically enforceable",
    text: "The following contracts cannot be specifically enforced — (a) a contract where a party has already obtained substituted performance under Section 20; (b) a contract whose performance involves a continuous duty the court cannot supervise; (c) a contract so dependent on the parties' personal qualifications that the court cannot enforce its material terms specifically; and (d) a contract that is by its nature determinable (i.e. terminable at will).",
    simpleExplanation: "These are the four categories courts cannot force specific performance on, even after the 2018 amendment made specific performance the default rule — practical unenforceability (courts can't supervise every ongoing duty forever), personal-skill contracts (you can't force someone to paint a masterpiece), and contracts either side could freely walk away from anyway.",
    crossRefs: ["SRA-10"],
    cases: [{ name: "Executive Committee of Vaish Degree College, Shamli v. Lakshmi Narain", cite: "AIR 1976 SC 888 (also (1976) 2 SCC 58)", year: 1975,
      ratio: "The Supreme Court held that a contract of personal service (such as an employment relationship) cannot ordinarily be specifically enforced — a dismissed employee cannot obtain a court order forcing the employer to reinstate them, since courts cannot supervise an ongoing personal working relationship. This is the classic case behind the \"personal service contracts\" category of non-enforceable contracts.",
      url: "https://indiankanoon.org/doc/1004292/" }] },
  { id: "SRA-14A", category: "SRC-C", title: "Power of court to engage experts",
    text: "(1) In any suit under this Act, where the court considers it necessary to get expert opinion on a specific issue, it may engage one or more experts, direct them to report on that issue, and secure their attendance to give evidence (including producing documents). (2) The court may require any person to give relevant information to the expert, or produce/give access to relevant documents, goods, or property for inspection. (3) The expert's opinion/report becomes part of the suit's record; the court (or, with permission, any party) may examine the expert in open court on the matters referred to them, their opinion/report, or how they conducted their inspection. (4) The expert is entitled to a fee/cost/expense fixed by the court, payable by the parties as the court directs.",
    simpleExplanation: "This was added by the 2018 amendment — it lets courts bring in outside technical experts (engineers, valuers, etc.) for complex specific-performance disputes, particularly relevant given the same amendment's new focus on infrastructure project contracts.",
    crossRefs: [] },
  { id: "SRA-15", category: "SRC-D", title: "Who may obtain specific performance",
    text: "Except as otherwise provided by this Chapter, specific performance of a contract may be obtained by — (a) any party to it; (b) the representative in interest or principal of any party (unless personal skill/solvency/quality was a material ingredient, or assignment was barred by the contract, in which case the representative/principal can't claim it unless the original party already performed or their performance was accepted); (c) any person beneficially entitled under a marriage settlement or family compromise of doubtful rights; (d) the remainderman, where a tenant for life entered the contract in due exercise of a power; (e) a reversioner in possession, entitled to the benefit of a covenant entered with his predecessor in title; (f) a reversioner in remainder, similarly entitled and who will suffer material injury from the breach; (fa) a new LLP arising from amalgamation of an LLP that had entered the contract; (g) a new company arising from amalgamation of a company that had entered the contract; (h) a company, where its promoters entered a pre-incorporation contract for its purposes and it has since accepted and communicated acceptance of that contract.",
    crossRefs: ["SRA-16"] },
  { id: "SRA-16", category: "SRC-D", title: "Personal bars to relief",
    text: "Specific performance of a contract cannot be enforced in favour of a person — (a) who has already obtained substituted performance under Section 20; or (b) who has become incapable of performing, or violates any essential term of, the contract remaining to be performed on his part, or acts in fraud of the contract, or wilfully acts at variance with or in subversion of the relationship the contract intended to establish; or (c) who fails to prove that he has performed, or has always been ready and willing to perform, the essential terms of the contract that are his to perform (other than terms whose performance was prevented or waived by the defendant).",
    explanations: ["For clause (c) — where a contract involves paying money, the plaintiff need not actually tender money or deposit it in court except when the court so directs; the plaintiff must prove performance of, or readiness and willingness to perform, the contract according to its true construction."],
    simpleExplanation: "Clause (c)'s \"readiness and willingness\" requirement is one of the most frequently tested points in this Act — a plaintiff seeking specific performance must affirmatively prove they were genuinely able and willing to hold up their end of the bargain throughout, not just that the other side breached.",
    crossRefs: ["SRA-15"],
    cases: [
      { name: "N.P. Thirugnanam v. Dr. R. Jagan Mohan Rao", cite: "(1995) 5 SCC 115 (also AIR 1996 SC 116)", year: 1995,
        ratio: "The Supreme Court held that \"continuous readiness and willingness\" on the plaintiff's part is a condition precedent to obtaining specific performance under Section 16(c) — it must be proved through conduct both before and after filing the suit, running all the way from the date of the contract's execution to the date of the decree, not just asserted. If the plaintiff fails to plead or prove this, the claim fails regardless of the defendant's own breach.",
        url: "https://indiankanoon.org/doc/169428/" },
      { name: "Gaddipati Divija v. Pathuri Samrajyam", cite: "2023 INSC 385 (also (2023) 3 SCR 802)", year: 2023,
        ratio: "The Supreme Court reaffirmed that a plaintiff seeking specific performance must plead and prove continuous readiness and willingness to perform their part of the contract, and reiterated the classic rule that time is not ordinarily of the essence in contracts for the sale of immovable property, unless the contract's express terms show otherwise.",
        url: "https://www.legitquest.com/case/gaddipati-divija-anr-v-pathuri-samrajyam-ors/7781EF" }
    ] },
  { id: "SRA-17", category: "SRC-D", title: "Contract to sell or let property by one who has no title, not specifically enforceable",
    text: "(1) A contract to sell or let immovable property cannot be specifically enforced against a vendor or lessor — (a) who, knowing he had no title to the property, contracted to sell or let it; or (b) who, though believing in good faith he had good title when contracting, cannot at the time fixed for completion give the purchaser/lessee a title free from reasonable doubt. (2) These provisions also apply, as far as possible, to contracts for the sale or hire of movable property.",
    crossRefs: ["SRA-13"] },
  { id: "SRA-18", category: "SRC-D", title: "Non-enforcement except with variation",
    text: "Where a plaintiff seeks specific performance of a written contract, and the defendant sets up a variation, the plaintiff cannot obtain the performance sought except with that variation, in these cases — (a) where fraud, mistake of fact, or misrepresentation means the written contract differs in terms/effect from what the parties actually agreed, or omits agreed terms the defendant relied on; (b) where the parties' object was a certain legal result the contract as framed doesn't achieve; (c) where the parties, after executing the contract, subsequently varied its terms.",
    crossRefs: [] },
  { id: "SRA-19", category: "SRC-D", title: "Relief against parties and persons claiming under them by subsequent title",
    text: "Except as otherwise provided by this Chapter, specific performance of a contract may be enforced against — (a) either party to it; (b) any other person claiming under him by a title arising after the contract, except a good-faith transferee for value without notice of the original contract; (c) any person claiming under a title that, though prior to the contract and known to the plaintiff, might have been displaced by the defendant; (ca) a new LLP arising from amalgamation of an LLP that entered the contract; (d) a new company arising from amalgamation of a company that entered the contract; (e) a company, where its promoters entered a pre-incorporation contract for its purposes and it has since accepted and communicated acceptance.",
    crossRefs: [] },
  { id: "SRA-20", category: "SRC-E", title: "Substituted performance of contract",
    text: "(1) Without prejudice to the Indian Contract Act, 1872, and except as otherwise agreed by the parties, where a contract is broken due to a party's non-performance, the party who suffers the breach may choose substituted performance — through a third party or his own agency — and recover the actual expenses/costs incurred from the party in breach. (2) No substituted performance may be undertaken unless the aggrieved party first gives at least thirty days' written notice calling on the breaching party to perform within the specified time; only on refusal/failure may substituted performance proceed. The aggrieved party may only recover expenses under sub-section (1) if he has actually gotten the contract performed through a third party or his own agency. (3) Once substituted performance has actually occurred after such notice, the aggrieved party can no longer claim specific performance against the breaching party. (4) Nothing here prevents the aggrieved party from separately claiming compensation from the breaching party.",
    simpleExplanation: "This is the 2018 amendment's other headline addition, alongside making specific performance the default rule. It gives the wronged party a genuinely new option: instead of going to court for specific performance, they can hire someone else to do the job and then bill the difference to the party who broke the contract — provided they follow the mandatory 30-day notice procedure first.",
    crossRefs: ["SRA-10", "SRA-14", "SRA-16"] },
  { id: "SRA-20A", category: "SRC-E", title: "Special provisions for contract relating to infrastructure project",
    text: "(1) No injunction shall be granted by a court in a suit under this Act involving a contract relating to an infrastructure project specified in the Schedule, where granting the injunction would impede or delay that project's progress or completion. (2) The Central Government may, by Gazette notification, amend the Schedule's categories of projects or infrastructure sub-sectors as needed. (3) Every such notification must be laid before both Houses of Parliament for a total of thirty days (across one or more sessions); if both Houses agree to modify or reject it within that period, it takes effect only in modified form or not at all — without prejudice to anything already done under it.",
    simpleExplanation: "Added in 2018 specifically to stop courts from granting injunctions that could stall major public infrastructure projects (roads, ports, power plants, etc. — the full list is in the Act's Schedule) over contract disputes, prioritizing project completion over a party's ability to freeze the project through litigation.",
    crossRefs: ["SRA-41"] },
  { id: "SRA-20B", category: "SRC-E", title: "Special Courts",
    text: "The State Government, in consultation with the Chief Justice of the High Court, shall designate (by Gazette notification) one or more Civil Courts as Special Courts, within local area limits, to try suits under this Act involving contracts relating to infrastructure projects.",
    crossRefs: ["SRA-20"] },
  { id: "SRA-20C", category: "SRC-E", title: "Expeditious disposal of suits",
    text: "Notwithstanding the Code of Civil Procedure, 1908, a suit filed under this Act shall be disposed of by the court within twelve months from the date of service of summons to the defendant — extendable by a further period of up to six months in aggregate, if the court records written reasons for the extension.",
    crossRefs: [] },
  { id: "SRA-21", category: "SRC-E", title: "Power to award compensation in certain cases",
    text: "(1) In a suit for specific performance, the plaintiff may also claim compensation for the breach in addition to such performance. (2) If the court decides specific performance should not be granted, but there was a contract broken by the defendant entitling the plaintiff to compensation, it shall award that compensation. (3) If the court decides specific performance should be granted, but it alone wouldn't satisfy justice, and some compensation should also be paid, it shall award that too. (4) In determining compensation under this section, the court is guided by the principles in Section 73 of the Indian Contract Act, 1872. (5) No compensation is awarded unless claimed in the plaint — though the court may, at any stage, allow the plaint to be amended to include such a claim, on just terms.",
    explanations: ["The fact that a contract has become incapable of specific performance doesn't stop the court from exercising jurisdiction under this section."],
    crossRefs: [] },
  { id: "SRA-22", category: "SRC-E", title: "Power to grant relief for possession, partition, refund of earnest money, etc.",
    text: "(1) Notwithstanding the Code of Civil Procedure, 1908, a person suing for specific performance of a contract to transfer immovable property may, in an appropriate case, also ask for — (a) possession, or partition and separate possession, of the property, in addition to such performance; or (b) any other relief he's entitled to, including refund of earnest money or deposit, if his claim for specific performance is refused. (2) No relief under clause (a) or (b) is granted unless specifically claimed — though the court may allow the plaint to be amended at any stage, on just terms, to include such a claim. (3) The court's power to grant relief under clause (b) is without prejudice to its power to award compensation under Section 21.",
    crossRefs: ["SRA-21"] },
  { id: "SRA-23", category: "SRC-E", title: "Liquidation of damages not a bar to specific performance",
    text: "(1) A contract otherwise proper for specific performance may still be so enforced, even if it names a sum payable on breach and the defaulting party is willing to pay it, if the court is satisfied (given the contract's terms and circumstances) that the named sum was only meant to secure performance — not to give the defaulting party an option to simply pay money instead of performing. (2) When enforcing specific performance under this section, the court shall not also order payment of that named sum.",
    crossRefs: [] },
  { id: "SRA-24", category: "SRC-E", title: "Bar of suit for compensation for breach after dismissal of suit for specific performance",
    text: "Dismissal of a suit for specific performance of a contract (or part of it) bars the plaintiff's right to separately sue for compensation for that breach — but does not bar his right to sue for any other relief he may be entitled to by reason of the breach.",
    crossRefs: [] },
  { id: "SRA-25", category: "SRC-E", title: "Application of preceding sections to certain awards and testamentary directions to execute settlements",
    text: "The provisions of this Chapter regarding contracts apply equally to arbitration awards to which the Arbitration and Conciliation Act, 1996 does not apply, and to directions in a will or codicil to execute a particular settlement.",
    crossRefs: [] },

  /* ---- Part II, Chapter III — Rectification of Instruments ---- */
  { id: "SRA-26", category: "SRC-F", title: "When instrument may be rectified",
    text: "(1) When, through fraud or a mutual mistake of the parties, a contract or other written instrument (not being a company's articles of association) fails to express their real intention, then — (a) either party or his representative may sue to have the instrument rectified; or (b) the plaintiff may claim rectification in any suit where a right arising under the instrument is at issue; or (c) a defendant in such a suit may, in addition to any other defence, ask for rectification. (2) If the court finds, in such a suit, that fraud or mistake means the instrument doesn't express the real intention, it may in its discretion direct rectification to express that intention — so far as this can be done without prejudicing third parties' good-faith rights acquired for value. (3) A written contract may first be rectified, and then — if the party claiming rectification has prayed for it and the court thinks fit — be specifically enforced. (4) No relief for rectification is granted unless specifically claimed — though the court may allow amendment at any stage, on just terms, to include such a claim.",
    crossRefs: [] },

  /* ---- Part II, Chapter IV — Rescission of Contracts ---- */
  { id: "SRA-27", category: "SRC-G", title: "When rescission may be adjudged or refused",
    text: "(1) Any person interested in a contract may sue to have it rescinded, and the court may adjudge rescission where — (a) the contract is voidable or terminable by the plaintiff; or (b) the contract is unlawful for reasons not apparent on its face, and the defendant is more to blame than the plaintiff. (2) Notwithstanding this, the court may refuse to rescind where — (a) the plaintiff has expressly or impliedly ratified the contract; or (b) circumstances have changed since the contract was made (not due to the defendant's own act) such that the parties can't be substantially restored to their original position; or (c) third parties have, during the contract's subsistence, acquired good-faith rights for value; or (d) only part of the contract is sought to be rescinded and that part isn't severable from the rest.",
    explanations: ["\"Contract,\" in territories where the Transfer of Property Act, 1882 doesn't extend, means a contract in writing for the purposes of this section."],
    crossRefs: ["SRA-29"] },
  { id: "SRA-28", category: "SRC-G", title: "Rescission in certain circumstances of contracts for the sale or lease of immovable property, the specific performance of which has been decreed",
    text: "(1) Where a decree for specific performance of a sale/lease contract for immovable property has been made, and the purchaser/lessee fails to pay the purchase money or other ordered sum within the decreed (or extended) period, the vendor/lessor may apply in the same suit to have the contract rescinded, and the court may rescind it (partially against the defaulting party, or altogether) as justice requires. (2) On such rescission, the court shall direct the purchaser/lessee, if he'd obtained possession, to restore it to the vendor/lessor, and may direct payment of all rents/profits accrued from when possession was obtained until restoration, and (if justice requires) refund of any earnest money or deposit paid. (3) If the purchaser/lessee does pay within the period, the court may, on application in the same suit, award further relief he's entitled to, including execution of a proper conveyance/lease, and delivery of possession (or partition and separate possession). (4) No separate suit for relief claimable under this section lies for any of these parties. (5) Costs of proceedings under this section are at the court's discretion.",
    crossRefs: ["SRA-27"] },
  { id: "SRA-29", category: "SRC-G", title: "Alternative prayer for rescission in suit for specific performance",
    text: "A plaintiff suing for specific performance of a written contract may pray in the alternative that, if the contract cannot be specifically enforced, it be rescinded and delivered up to be cancelled; and if the court refuses specific enforcement, it may direct rescission and delivery up accordingly.",
    crossRefs: ["SRA-27"] },
  { id: "SRA-30", category: "SRC-G", title: "Court may require parties rescinding to do equity",
    text: "On adjudging rescission of a contract, the court may require the party granted that relief to restore, so far as possible, any benefit he received from the other party, and to make any compensation justice requires.",
    crossRefs: [] },

  /* ---- Part II, Chapter V — Cancellation of Instruments ---- */
  { id: "SRA-31", category: "SRC-H", title: "When cancellation may be ordered",
    text: "(1) Any person against whom a written instrument is void or voidable, who has reasonable apprehension that it may cause him serious injury if left outstanding, may sue to have it adjudged void or voidable — and the court may, in its discretion, so adjudge it and order it delivered up and cancelled. (2) If the instrument was registered under the Indian Registration Act, 1908, the court shall also send a copy of its decree to the registering officer, who shall note the cancellation on the instrument's copy in his books.",
    crossRefs: ["SRA-32", "SRA-33"] },
  { id: "SRA-32", category: "SRC-H", title: "What instruments may be partially cancelled",
    text: "Where an instrument is evidence of different rights or different obligations, the court may, in a proper case, cancel it in part and let it stand for the residue.",
    crossRefs: ["SRA-31"] },
  { id: "SRA-33", category: "SRC-H", title: "Power to require benefit to be restored or compensation to be made when instrument is cancelled or is successfully resisted as being void or voidable",
    text: "(1) On adjudging cancellation of an instrument, the court may require the party granted that relief to restore, so far as possible, any benefit he received from the other party, and make any compensation justice requires. (2) Where a defendant successfully resists a suit on the ground that — (a) the instrument sought to be enforced against him is voidable, the court may (if he received any benefit under it) require him to restore that benefit or compensate for it; (b) the agreement sought to be enforced is void because he wasn't competent to contract under Section 11 of the Indian Contract Act, 1872, the court may require him to restore any benefit received, to the extent he or his estate benefited.",
    crossRefs: ["SRA-31"] },

  /* ---- Part II, Chapter VI — Declaratory Decrees ---- */
  { id: "SRA-34", category: "SRC-I", title: "Discretion of court as to declaration of status or right",
    text: "Any person entitled to any legal character, or to any right as to any property, may sue any person denying (or interested in denying) his title to that character or right, and the court may in its discretion declare that he is so entitled — the plaintiff need not ask for any further relief in such a suit.",
    provisos: ["No court shall make such a declaration where the plaintiff, being able to seek further relief than a mere declaration of title, omits to do so."],
    explanations: ["A property trustee is a \"person interested to deny\" a title adverse to someone not yet in existence, for whom he would be a trustee if they existed."],
    simpleExplanation: "The proviso here is the classic exam trap — a declaratory suit is meant as a genuine remedy, not a way to dodge asking for the \"real\" relief you could have claimed (like possession or an injunction) alongside the mere declaration. If you could have asked for more and simply chose not to, courts will refuse the declaration.",
    crossRefs: ["SRA-35"] },
  { id: "SRA-35", category: "SRC-I", title: "Effect of declaration",
    text: "A declaration made under this Chapter binds only the parties to the suit, persons claiming through them, and, where any party is a trustee, the persons for whom that party would be a trustee if they existed at the date of the declaration.",
    crossRefs: ["SRA-34"] },

  /* ---- Part III, Chapter VII — Injunctions Generally ---- */
  { id: "SRA-36", category: "SRC-J", title: "Preventive relief how granted",
    text: "Preventive relief is granted at the court's discretion, by injunction — temporary or perpetual.",
    crossRefs: ["SRA-37"] },
  { id: "SRA-37", category: "SRC-J", title: "Temporary and perpetual injunctions",
    text: "(1) Temporary injunctions continue until a specified time, or until further order of the court, and may be granted at any stage of a suit; they are regulated by the Code of Civil Procedure, 1908. (2) A perpetual injunction can only be granted by a decree made at the hearing, on the suit's merits — the defendant is thereby permanently barred from asserting a right, or committing an act, contrary to the plaintiff's rights.",
    crossRefs: ["SRA-36", "SRA-38"],
    cases: [{ name: "Dalpat Kumar v. Prahlad Singh", cite: "(1992) 1 SCC 719 (also AIR 1993 SC 276)", year: 1991,
      ratio: "The Supreme Court laid down the foundational three-part test that still governs every temporary injunction application in India: the plaintiff must show (1) a prima facie case — a serious question requiring investigation, not proof of certain success; (2) that irreparable injury would result without the injunction — meaning harm that damages alone couldn't fairly compensate; and (3) that the balance of convenience favours granting it. All three factors must be weighed together, not treated as a mechanical checklist.",
      url: "https://indiankanoon.org/doc/49480/" }] },

  /* ---- Part III, Chapter VIII — Perpetual Injunctions ---- */
  { id: "SRA-38", category: "SRC-K", title: "Perpetual injunction when granted",
    text: "(1) Subject to this Chapter's other provisions, a perpetual injunction may be granted to prevent breach of an obligation existing in the plaintiff's favour, whether express or implied. (2) Where such an obligation arises from contract, the court is guided by the rules in Chapter II. (3) Where the defendant invades or threatens the plaintiff's right to, or enjoyment of, property, the court may grant a perpetual injunction where — (a) the defendant is trustee of the property for the plaintiff; (b) there's no standard for ascertaining the actual or likely damage from the invasion; (c) money compensation wouldn't afford adequate relief; (d) the injunction is necessary to prevent a multiplicity of judicial proceedings.",
    crossRefs: ["SRA-37", "SRA-39"] },
  { id: "SRA-39", category: "SRC-K", title: "Mandatory injunctions",
    text: "When, to prevent breach of an obligation, it's necessary to compel performance of certain acts the court is capable of enforcing, the court may, in its discretion, grant an injunction to both prevent the breach complained of and compel performance of the requisite acts.",
    crossRefs: ["SRA-38"] },
  { id: "SRA-40", category: "SRC-K", title: "Damages in lieu of, or in addition to, injunction",
    text: "(1) A plaintiff suing for a perpetual injunction (Section 38) or mandatory injunction (Section 39) may claim damages either in addition to, or instead of, such an injunction, and the court may award them if it thinks fit. (2) No damages are granted unless claimed in the plaint — though the court may, at any stage, allow amendment to include such a claim, on just terms. (3) Dismissal of a suit to prevent breach of an obligation bars the plaintiff's right to separately sue for damages for that breach.",
    crossRefs: ["SRA-38", "SRA-39"] },
  { id: "SRA-41", category: "SRC-K", title: "Injunction when refused",
    text: "An injunction cannot be granted — (a) to restrain prosecuting a judicial proceeding already pending when the injunction suit was filed, unless necessary to prevent a multiplicity of proceedings; (b) to restrain instituting/prosecuting proceedings in a court not subordinate to the one from which the injunction is sought; (c) to restrain applying to any legislative body; (d) to restrain instituting/prosecuting a criminal matter proceeding; (e) to prevent breach of a contract whose performance wouldn't itself be specifically enforced; (f) to prevent, on nuisance grounds, an act not reasonably clear to actually be a nuisance; (g) to prevent a continuing breach the plaintiff has acquiesced in; (h) when equally effective relief can certainly be obtained through another usual proceeding, except in cases of breach of trust; (ha) if it would impede or delay an infrastructure project's progress/completion, or interfere with continued provision of a related facility/service; (i) when the plaintiff's or his agents' conduct disentitles him to the court's assistance; (j) when the plaintiff has no personal interest in the matter.",
    crossRefs: ["SRA-20A"] },
  { id: "SRA-42", category: "SRC-K", title: "Injunction to perform negative agreement",
    text: "Notwithstanding Section 41(e), where a contract has an affirmative agreement to do a certain act coupled with a negative agreement (express or implied) not to do a certain act, the court's inability to compel specific performance of the affirmative part doesn't stop it from granting an injunction to enforce the negative part.",
    provisos: ["This applies provided the plaintiff hasn't failed to perform the contract insofar as it binds him."],
    crossRefs: ["SRA-41"],
    cases: [{ name: "Gujarat Bottling Co. Ltd. v. Coca-Cola Co.", cite: "(1995) 5 SCC 545", year: 1995,
      ratio: "The Supreme Court held that a negative covenant in a commercial agreement (here, a bottling franchise agreement restraining the franchisee from dealing in competing brands) can be enforced by injunction under this section, even though the positive obligations of the same contract could not themselves be specifically enforced — confirming that Section 42 lets courts restrain the \"don't do X\" half of a contract independent of the \"do Y\" half.",
      url: "https://www.casemine.com/commentary/in/enforceability-of-negative-covenants-in-franchise-agreements:-a-comprehensive-analysis-of-gujarat-bottling-co.-ltd.-v.-coca-cola-co.-(1995)/view" }] },
  /* ============================================================ */
  /* BHARATIYA SAKSHYA ADHINIYAM, 2023 (BSA)                        */
  /* Sections 1-50 verified & complete: Chapter I (Preliminary,     */
  /* SS1-2) and the entire Chapter II (Relevancy of Facts, SS3-50). */
  /* Sourced from the official Gazette text via India Code          */
  /* (indiacode.nic.in), Act No. 47 of 2023, as on 6 Oct 2025.      */
  /* simpleExplanation added on ~20 conceptually dense sections.    */
  /* 5 verified landmark cases (SS8,23,24,26,39) -- all decided pre-*/
  /* BSA under the old Indian Evidence Act's equivalent provision;  */
  /* see decidedUnder/continuityNote on each case object.           */
  /* Sections 51-170 (Chapters III-XII) are placeholders pending a  */
  /* future verified batch -- see PROJECT-HANDOFF.md.               */
  /* ============================================================ */
  { id: "BSA-1", category: "preliminary", title: "Short title, application and commencement",
    text: "(1) This Act may be called the Bharatiya Sakshya Adhiniyam, 2023.\n\n(2) It applies to all judicial proceedings in or before any Court, including Courts-martial, but not to affidavits presented to any Court or officer, nor to proceedings before an arbitrator.\n\n(3) It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint." },
  { id: "BSA-2", category: "preliminary", title: "Definitions",
    text: "(1) In this Adhiniyam, unless the context otherwise requires,--\n\n(a) \"Court\" includes all Judges and Magistrates, and all persons, except arbitrators, legally authorised to take evidence;\n\n(b) \"conclusive proof\" means when one fact is declared by this Adhiniyam to be conclusive proof of another, the Court shall, on proof of the one fact, regard the other as proved, and shall not allow evidence to be given for the purpose of disproving it;\n\n(c) \"disproved\" in relation to a fact, means when, after considering the matters before it, the Court either believes that it does not exist, or considers its non-existence so probable that a prudent man ought, under the circumstances of the particular case, to act upon the supposition that it does not exist;\n\n(d) \"document\" means any matter expressed or described or otherwise recorded upon any substance by means of letters, figures or marks or any other means or by more than one of those means, intended to be used, or which may be used, for the purpose of recording that matter and includes electronic and digital records.\nIllustrations.\n(i) A writing is a document.\n(ii) Words printed, lithographed or photographed are documents.\n(iii) A map or plan is a document.\n(iv) An inscription on a metal plate or stone is a document.\n(v) A caricature is a document.\n(vi) An electronic record on emails, server logs, documents on computers, laptop or smartphone, messages, websites, locational evidence and voice mail messages stored on digital devices are documents;\n\n(e) \"evidence\" means and includes--\n(i) all statements including statements given electronically which the Court permits or requires to be made before it by witnesses in relation to matters of fact under inquiry and such statements are called oral evidence;\n(ii) all documents including electronic or digital records produced for the inspection of the Court and such documents are called documentary evidence;\n\n(f) \"fact\" means and includes--\n(i) any thing, state of things, or relation of things, capable of being perceived by the senses;\n(ii) any mental condition of which any person is conscious.\nIllustrations.\n(i) That there are certain objects arranged in a certain order in a certain place, is a fact.\n(ii) That a person heard or saw something, is a fact.\n(iii) That a person said certain words, is a fact.\n(iv) That a person holds a certain opinion, has a certain intention, acts in good faith, or fraudulently, or uses a particular word in a particular sense, or is or was at a specified time conscious of a particular sensation, is a fact;\n\n(g) \"facts in issue\" means and includes any fact from which, either by itself or in connection with other facts, the existence, non-existence, nature or extent of any right, liability or disability, asserted or denied in any suit or proceeding, necessarily follows.\nExplanation.--Whenever, under the provisions of the law for the time being in force relating to Civil Procedure, any Court records an issue of fact, the fact to be asserted or denied in the answer to such issue is a fact in issue.\nIllustrations.\nA is accused of the murder of B. At his trial, the following facts may be in issue:--\n(i) That A caused B's death.\n(ii) That A intended to cause B's death.\n(iii) That A had received grave and sudden provocation from B.\n(iv) That A, at the time of doing the act which caused B's death, was, by reason of unsoundness of mind, incapable of knowing its nature;\n\n(h) \"may presume\".--Whenever it is provided by this Adhiniyam that the Court may presume a fact, it may either regard such fact as proved, unless and until it is disproved or may call for proof of it;\n\n(i) \"not proved\".--A fact is said to be not proved when it is neither proved nor disproved;\n\n(j) \"proved\".--A fact is said to be proved when, after considering the matters before it, the Court either believes it to exist, or considers its existence so probable that a prudent man ought, under the circumstances of the particular case, to act upon the supposition that it exists;\n\n(k) \"relevant\".--A fact is said to be relevant to another when it is connected with the other in any of the ways referred to in the provisions of this Adhiniyam relating to the relevancy of facts;\n\n(l) \"shall presume\".--Whenever it is directed by this Adhiniyam that the Court shall presume a fact, it shall regard such fact as proved, unless and until it is disproved.\n\n(2) Words and expressions used herein and not defined but defined in the Information Technology Act, 2000 (21 of 2000), the Bharatiya Nagarik Suraksha Sanhita, 2023 and the Bharatiya Nyaya Sanhita, 2023 shall have the same meanings as assigned to them in the said Act and Sanhitas." },
  { id: "BSA-3", category: "relevancy-general", title: "Evidence may be given of facts in issue and relevant facts",
    text: "Evidence may be given in any suit or proceeding of the existence or non-existence of every fact in issue and of such other facts as are hereinafter declared to be relevant, and of no others.\n\nExplanation.--This section shall not enable any person to give evidence of a fact which he is disentitled to prove by any provision of the law for the time being in force relating to civil procedure.\n\nIllustrations.\n(a) A is tried for the murder of B by beating him with a club with the intention of causing his death. At A's trial the following facts are in issue:--\nA's beating B with the club;\nA's causing B's death by such beating;\nA's intention to cause B's death.\n(b) A suitor does not bring with him, and have in readiness for production at the first hearing of the case, a bond on which he relies. This section does not enable him to produce the bond or prove its contents at a subsequent stage of the proceedings, otherwise than in accordance with the conditions prescribed by the Code of Civil Procedure, 1908 (5 of 1908)." },
  { id: "BSA-4", category: "closely-connected-facts", title: "Relevancy of facts forming part of same transaction",
    text: "Facts which, though not in issue, are so connected with a fact in issue or a relevant fact as to form part of the same transaction, are relevant, whether they occurred at the same time and place or at different times and places.\n\nIllustrations.\n(a) A is accused of the murder of B by beating him. Whatever was said or done by A or B or the bystanders at the beating, or so shortly before or after it as to form part of the transaction, is a relevant fact.\n(b) A is accused of waging war against the Government of India by taking part in an armed insurrection in which property is destroyed, troops are attacked and jails are broken open. The occurrence of these facts is relevant, as forming part of the general transaction, though A may not have been present at all of them.\n(c) A sues B for a libel contained in a letter forming part of a correspondence. Letters between the parties relating to the subject out of which the libel arose, and forming part of the correspondence in which it is contained, are relevant facts, though they do not contain the libel itself.\n(d) The question is, whether certain goods ordered from B were delivered to A. The goods were delivered to several intermediate persons successively. Each delivery is a relevant fact.",
    simpleExplanation: "This is the 'res gestae' rule. Facts and statements that happen so close in time and place to the main event that they're really part of the same incident — not something separate — count as relevant even though they aren't themselves 'in issue'. Example: what bystanders shouted during a beating is admissible even though the shouting itself isn't the crime." },
  { id: "BSA-5", category: "closely-connected-facts", title: "Facts which are occasion, cause or effect of facts in issue or relevant facts",
    text: "Facts which are the occasion, cause or effect, immediate or otherwise, of relevant facts, or facts in issue, or which constitute the state of things under which they happened, or which afforded an opportunity for their occurrence or transaction, are relevant.\n\nIllustrations.\n(a) The question is, whether A robbed B. The facts that, shortly before the robbery, B went to a fair with money in his possession, and that he showed it, or mentioned the fact that he had it, to third persons, are relevant.\n(b) The question is, whether A murdered B. Marks on the ground, produced by a struggle at or near the place where the murder was committed, are relevant facts.\n(c) The question is, whether A poisoned B. The state of B's health before the symptoms ascribed to poison, and habits of B, known to A, which afforded an opportunity for the administration of poison, are relevant facts." },
  { id: "BSA-6", category: "closely-connected-facts", title: "Motive, preparation and previous or subsequent conduct",
    text: "(1) Any fact is relevant which shows or constitutes a motive or preparation for any fact in issue or relevant fact.\n\n(2) The conduct of any party, or of any agent to any party, to any suit or proceeding, in reference to such suit or proceeding, or in reference to any fact in issue therein or relevant thereto, and the conduct of any person, an offence against whom is the subject of any proceeding, is relevant, if such conduct influences or is influenced by any fact in issue or relevant fact, and whether it was previous or subsequent thereto.\n\nExplanation 1.--The word \"conduct\" in this section does not include statements, unless those statements accompany and explain acts other than statements; but this explanation is not to affect the relevancy of statements under any other section of this Adhiniyam.\n\nExplanation 2.--When the conduct of any person is relevant, any statement made to him or in his presence and hearing, which affects such conduct, is relevant.\n\nIllustrations.\n(a) A is tried for the murder of B. The facts that A murdered C, that B knew that A had murdered C, and that B had tried to extort money from A by threatening to make his knowledge public, are relevant.\n(b) A sues B upon a bond for the payment of money. B denies the making of the bond. The fact that, at the time when the bond was alleged to be made, B required money for a particular purpose, is relevant.\n(c) A is tried for the murder of B by poison. The fact that, before the death of B, A procured poison similar to that which was administered to B, is relevant.\n(d) The question is, whether a certain document is the will of A. The facts that, not long before, the date of the alleged will, A made inquiry into matters to which the provisions of the alleged will relate; that he consulted advocates in reference to making the will, and that he caused drafts of other wills to be prepared, of which he did not approve, are relevant.\n(e) A is accused of a crime. The facts that, either before, or at the time of, or after the alleged crime, A provided evidence which would tend to give to the facts of the case an appearance favourable to himself, or that he destroyed or concealed evidence, or prevented the presence or procured the absence of persons who might have been witnesses, or suborned persons to give false evidence respecting it, are relevant.\n(f) The question is, whether A robbed B. The facts that, after B was robbed, C said in A's presence--\"the police are coming to look for the person who robbed B\", and that immediately afterwards A ran away, are relevant.\n(g) The question is, whether A owes B ten thousand rupees. The facts that A asked C to lend him money, and that D said to C in A's presence and hearing--\"I advise you not to trust A, for he owes B ten thousand rupees\", and that A went away without making any answer, are relevant facts.\n(h) The question is, whether A committed a crime. The fact that A absconded, after receiving a letter, warning A that inquiry was being made for the criminal, and the contents of the letter, are relevant.\n(i) A is accused of a crime. The facts that, after the commission of the alleged crime, A absconded, or was in possession of property or the proceeds of property acquired by the crime, or attempted to conceal things which were or might have been used in committing it, are relevant.\n(j) The question is, whether A was raped. The fact that, shortly after the alleged rape, A made a complaint relating to the crime, the circumstances under which, and the terms in which, the complaint was made, are relevant. The fact that, without making a complaint, A said that A had been raped is not relevant as conduct under this section, though it may be relevant as a dying declaration under clause (a) of section 26, or as corroborative evidence under section 160.\n(k) The question is, whether A was robbed. The fact that, soon after the alleged robbery, A made a complaint relating to the offence, the circumstances under which, and the terms in which, the complaint was made, are relevant. The fact that A said he had been robbed, without making any complaint, is not relevant, as conduct under this section, though it may be relevant as a dying declaration under clause (a) of section 26, or as corroborative evidence under section 160.",
    simpleExplanation: "Two separate ideas bundled into one section: (1) evidence of motive or preparation is relevant to prove a fact in issue; and (2) a person's conduct — before or after the event, and even a victim's conduct — is relevant if it was influenced by, or influenced, a fact in issue. 'Conduct' here means actions, not spoken statements (though a statement that explains an action can still come in through it, per Explanation 1)." },
  { id: "BSA-7", category: "closely-connected-facts", title: "Facts necessary to explain or introduce fact in issue or relevant facts",
    text: "Facts necessary to explain or introduce a fact in issue or relevant fact, or which support or rebut an inference suggested by a fact in issue or a relevant fact, or which establish the identity of anything, or person whose identity, is relevant, or fix the time or place at which any fact in issue or relevant fact happened, or which show the relation of parties by whom any such fact was transacted, are relevant in so far as they are necessary for that purpose.\n\nIllustrations.\n(a) The question is, whether a given document is the will of A. The state of A's property and of his family at the date of the alleged will may be relevant facts.\n(b) A sues B for a libel imputing disgraceful conduct to A; B affirms that the matter alleged to be libellous is true. The position and relations of the parties at the time when the libel was published may be relevant facts as introductory to the facts in issue. The particulars of a dispute between A and B about a matter unconnected with the alleged libel are irrelevant, though the fact that there was a dispute may be relevant if it affected the relations between A and B.\n(c) A is accused of a crime. The fact that, soon after the commission of the crime, A absconded from his house, is relevant under section 6, as conduct subsequent to and affected by facts in issue. The fact that, at the time when he left home, A had sudden and urgent business at the place to which he went, is relevant, as tending to explain the fact that he left home suddenly. The details of the business on which he left are not relevant, except in so far as they are necessary to show that the business was sudden and urgent.\n(d) A sues B for inducing C to break a contract of service made by him with A. C, on leaving A's service, says to A--\"I am leaving you because B has made me a better offer\". This statement is a relevant fact as explanatory of C's conduct, which is relevant as a fact in issue.\n(e) A, accused of theft, is seen to give the stolen property to B, who is seen to give it to A's wife. B says as he delivers it--\"A says you are to hide this\". B's statement is relevant as explanatory of a fact which is part of the transaction.\n(f) A is tried for a riot and is proved to have marched at the head of a mob. The cries of the mob are relevant as explanatory of the nature of the transaction." },
  { id: "BSA-8", category: "closely-connected-facts", title: "Things said or done by conspirator in reference to common design",
    text: "Where there is reasonable ground to believe that two or more persons have conspired together to commit an offence or an actionable wrong, anything said, done or written by any one of such persons in reference to their common intention, after the time when such intention was first entertained by any one of them, is a relevant fact as against each of the persons believed to be so conspiring, as well for the purpose of proving the existence of the conspiracy as for the purpose of showing that any such person was a party to it.\n\nIllustration.\nReasonable ground exists for believing that A has joined in a conspiracy to wage war against the State.\nThe facts that B procured arms in Europe for the purpose of the conspiracy, C collected money in Kolkata for a like object, D persuaded persons to join the conspiracy in Mumbai, E published writings advocating the object in view at Agra, and F transmitted from Delhi to G at Singapore the money which C had collected at Kolkata, and the contents of a letter written by H giving an account of the conspiracy, are each relevant, both to prove the existence of the conspiracy, and to prove A's complicity in it, although he may have been ignorant of all of them, and although the persons by whom they were done were strangers to him, and although they may have taken place before he joined the conspiracy or after he left it.",
    simpleExplanation: "Once there's reasonable ground to believe a conspiracy exists, anything one conspirator says, does, or writes in furtherance of the shared plan becomes evidence against every conspirator — even those who didn't hear or know about it. This only covers acts and statements made while pursuing the common design, not before it started or after its object was achieved.",
    cases: [{ name: "Badri Rai v. State of Bihar", cite: "AIR 1958 SC 953", year: 1958,
      ratio: "A statement made by one conspirator in furtherance of the common design (here, while handing over a bribe) is admissible against a co-conspirator under this provision, once reasonable grounds to believe in the conspiracy exist.",
      url: "https://indiankanoon.org/doc/1799828/",
      decidedUnder: "Section 10, Indian Evidence Act, 1872",
      continuityNote: "Decided before BSA existed, under the old Act's equivalent provision. BSA Section 8 carries over this wording essentially unchanged, so courts are expected to keep treating this as persuasive authority — but no BSA-era judgment has yet confirmed that continuity." }] },
  { id: "BSA-9", category: "closely-connected-facts", title: "When facts not otherwise relevant become relevant",
    text: "Facts not otherwise relevant are relevant--\n(1) if they are inconsistent with any fact in issue or relevant fact;\n(2) if by themselves or in connection with other facts they make the existence or non-existence of any fact in issue or relevant fact highly probable or improbable.\n\nIllustrations.\n(a) The question is, whether A committed a crime at Chennai on a certain day. The fact that, on that day, A was at Ladakh is relevant. The fact that, near the time when the crime was committed, A was at a distance from the place where it was committed, which would render it highly improbable, though not impossible, that he committed it, is relevant.\n(b) The question is, whether A committed a crime. The circumstances are such that the crime must have been committed either by A, B, C or D. Every fact which shows that the crime could have been committed by no one else, and that it was not committed by either B, C or D, is relevant.",
    simpleExplanation: "A catch-all provision: even a fact with no obvious connection to the case can be brought in if it's inconsistent with something already in issue, or if it makes some fact in issue significantly more or less likely — this is the basis for alibi evidence, among other things." },
  { id: "BSA-10", category: "closely-connected-facts", title: "Facts tending to enable Court to determine amount are relevant in suits for damages",
    text: "In suits in which damages are claimed, any fact which will enable the Court to determine the amount of damages which ought to be awarded, is relevant." },
  { id: "BSA-11", category: "closely-connected-facts", title: "Facts relevant when right or custom is in question",
    text: "Where the question is as to the existence of any right or custom, the following facts are relevant--\n(a) any transaction by which the right or custom in question was created, claimed, modified, recognised, asserted or denied, or which was inconsistent with its existence;\n(b) particular instances in which the right or custom was claimed, recognised or exercised, or in which its exercise was disputed, asserted or departed from.\n\nIllustration.\nThe question is, whether A has a right to a fishery. A deed conferring the fishery on A's ancestors, a mortgage of the fishery by A's father, a subsequent grant of the fishery by A's father, irreconcilable with the mortgage, particular instances in which A's father exercised the right, or in which the exercise of the right was stopped by A's neighbours, are relevant facts." },
  { id: "BSA-12", category: "closely-connected-facts", title: "Facts showing existence of state of mind, or of body or bodily feeling",
    text: "Facts showing the existence of any state of mind, such as intention, knowledge, good faith, negligence, rashness, ill-will or goodwill towards any particular person, or showing the existence of any state of body or bodily feeling, are relevant, when the existence of any such state of mind or body or bodily feeling is in issue or relevant.\n\nExplanation 1.--A fact relevant as showing the existence of a relevant state of mind must show that the state of mind exists, not generally, but in reference to the particular matter in question.\n\nExplanation 2.--But where, upon the trial of a person accused of an offence, the previous commission by the accused of an offence is relevant within the meaning of this section, the previous conviction of such person shall also be a relevant fact.\n\nIllustrations.\n(a) A is accused of receiving stolen goods knowing them to be stolen. It is proved that he was in possession of a particular stolen article. The fact that, at the same time, he was in possession of many other stolen articles is relevant, as tending to show that he knew each and all of the articles of which he was in possession to be stolen.\n(b) A is accused of fraudulently delivering to another person a counterfeit currency which, at the time when he delivered it, he knew to be counterfeit. The fact that, at the time of its delivery, A was possessed of a number of other pieces of counterfeit currency is relevant. The fact that A had been previously convicted of delivering to another person as genuine a counterfeit currency knowing it to be counterfeit is relevant.\n(c) A sues B for damage done by a dog of B's, which B knew to be ferocious. The fact that the dog had previously bitten X, Y and Z, and that they had made complaints to B, are relevant.\n(d) The question is, whether A, the acceptor of a bill of exchange, knew that the name of the payee was fictitious. The fact that A had accepted other bills drawn in the same manner before they could have been transmitted to him by the payee if the payee had been a real person, is relevant, as showing that A knew that the payee was a fictitious person.\n(e) A is accused of defaming B by publishing an imputation intended to harm the reputation of B. The fact of previous publications by A respecting B, showing ill-will on the part of A towards B is relevant, as proving A's intention to harm B's reputation by the particular publication in question. The facts that there was no previous quarrel between A and B, and that A repeated the matter complained of as he heard it, are relevant, as showing that A did not intend to harm the reputation of B.\n(f) A is sued by B for fraudulently representing to B that C was solvent, whereby B, being induced to trust C, who was insolvent, suffered loss. The fact that, at the time when A represented C to be solvent, C was supposed to be solvent by his neighbours and by persons dealing with him, is relevant, as showing that A made the representation in good faith.\n(g) A is sued by B for the price of work done by B, upon a house of which A is owner, by the order of C, a contractor. A's defence is that B's contract was with C. The fact that A paid C for the work in question is relevant, as proving that A did, in good faith, make over to C the management of the work in question, so that C was in a position to contract with B on C's own account, and not as agent for A.\n(h) A is accused of the dishonest misappropriation of property which he had found, and the question is whether, when he appropriated it, he believed in good faith that the real owner could not be found. The fact that public notice of the loss of the property had been given in the place where A was, is relevant, as showing that A did not in good faith believe that the real owner of the property could not be found. The fact that A knew, or had reason to believe, that the notice was given fraudulently by C, who had heard of the loss of the property and wished to set up a false claim to it, is relevant, as showing that the fact that A knew of the notice did not disprove A's good faith.\n(i) A is charged with shooting at B with intent to kill him. In order to show A's intent, the fact of A's having previously shot at B may be proved.\n(j) A is charged with sending threatening letters to B. Threatening letters previously sent by A to B may be proved, as showing the intention of the letters.\n(k) The question is, whether A has been guilty of cruelty towards B, his wife. Expressions of their feeling towards each other shortly before or after the alleged cruelty are relevant facts.\n(l) The question is, whether A's death was caused by poison. Statements made by A during his illness as to his symptoms are relevant facts.\n(m) The question is, what was the state of A's health at the time when an assurance on his life was effected. Statements made by A as to the state of his health at or near the time in question are relevant facts.\n(n) A sues B for negligence in providing him with a car for hire not reasonably fit for use, whereby A was injured. The fact that B's attention was drawn on other occasions to the defect of that particular car is relevant. The fact that B was habitually negligent about the cars which he let to hire is irrelevant.\n(o) A is tried for the murder of B by intentionally shooting him dead. The fact that A on other occasions shot at B is relevant as showing his intention to shoot B. The fact that A was in the habit of shooting at people with intent to murder them is irrelevant.\n(p) A is tried for a crime. The fact that he said something indicating an intention to commit that particular crime is relevant. The fact that he said something indicating a general disposition to commit crimes of that class is irrelevant.",
    simpleExplanation: "Lets a party show a person's state of mind (intent, knowledge, good or bad faith, ill-will) or physical state through related facts — including, importantly, that the person has done something similar before (this is 'similar fact evidence'). Explanation 2 clarifies that where a past offence is relevant this way, the past conviction itself is relevant too, not just the underlying conduct. Illustration (p) marks the limit: a general criminal disposition is not enough — the facts must point to intent for this particular act." },
  { id: "BSA-13", category: "closely-connected-facts", title: "Facts bearing on question whether act was accidental or intentional",
    text: "When there is a question whether an act was accidental or intentional, or done with a particular knowledge or intention, the fact that such act formed part of a series of similar occurrences, in each of which the person doing the act was concerned, is relevant.\n\nIllustrations.\n(a) A is accused of burning down his house in order to obtain money for which it is insured. The facts that A lived in several houses successively each of which he insured, in each of which a fire occurred, and after each of which fires A received payment from a different insurance company, are relevant, as tending to show that the fires were not accidental.\n(b) A is employed to receive money from the debtors of B. It is A's duty to make entries in a book showing the amounts received by him. He makes an entry showing that on a particular occasion he received less than he really did receive. The question is, whether this false entry was accidental or intentional. The facts that other entries made by A in the same book are false, and that the false entry is in each case in favour of A, are relevant.\n(c) A is accused of fraudulently delivering to B a counterfeit currency. The question is, whether the delivery of the currency was accidental. The facts that, soon before or soon after the delivery to B, A delivered counterfeit currency to C, D and E are relevant, as showing that the delivery to B was not accidental." },
  { id: "BSA-14", category: "closely-connected-facts", title: "Existence of course of business when relevant",
    text: "When there is a question whether a particular act was done, the existence of any course of business, according to which it naturally would have been done, is a relevant fact.\n\nIllustrations.\n(a) The question is, whether a particular letter was dispatched. The facts that it was the ordinary course of business for all letters put in a certain place to be carried to the post, and that particular letter was put in that place are relevant.\n(b) The question is, whether a particular letter reached A. The facts that it was posted in due course, and was not returned through the Return Letter Office, are relevant." },
  { id: "BSA-15", category: "admissions", title: "Admission defined",
    text: "An admission is a statement, oral or documentary or contained in electronic form, which suggests any inference as to any fact in issue or relevant fact, and which is made by any of the persons, and under the circumstances, hereinafter mentioned.",
    simpleExplanation: "Defines 'admission' broadly — any statement (spoken, written, or electronic) that suggests something about a fact in issue, made by one of the specific categories of people listed in the sections that follow (a party to the case, their agent, a person expressly referred to for information, etc.). Note this is a broader, civil-and-criminal concept than 'confession' — a confession (Sections 22-24) is a narrower category, specifically an admission of guilt by an accused in a criminal case." },
  { id: "BSA-16", category: "admissions", title: "Admission by party to proceeding or his agent",
    text: "(1) Statements made by a party to the proceeding, or by an agent to any such party, whom the Court regards, under the circumstances of the case, as expressly or impliedly authorised by him to make them, are admissions.\n\n(2) Statements made by--\n(i) parties to suits suing or sued in a representative character, are not admissions, unless they were made while the party making them held that character; or\n(ii) (a) persons who have any proprietary or pecuniary interest in the subject matter of the proceeding, and who make the statement in their character of persons so interested; or\n(b) persons from whom the parties to the suit have derived their interest in the subject matter of the suit,\nare admissions, if they are made during the continuance of the interest of the persons making the statements." },
  { id: "BSA-17", category: "admissions", title: "Admissions by persons whose position must be proved as against party to suit",
    text: "Statements made by persons whose position or liability, it is necessary to prove as against any party to the suit, are admissions, if such statements would be relevant as against such persons in relation to such position or liability in a suit brought by or against them, and if they are made whilst the person making them occupies such position or is subject to such liability.\n\nIllustration.\nA undertakes to collect rents for B. B sues A for not collecting rent due from C to B. A denies that rent was due from C to B. A statement by C that he owed B rent is an admission, and is a relevant fact as against A, if A denies that C did owe rent to B." },
  { id: "BSA-18", category: "admissions", title: "Admissions by persons expressly referred to by party to suit",
    text: "Statements made by persons to whom a party to the suit has expressly referred for information in reference to a matter in dispute are admissions.\n\nIllustration.\nThe question is, whether a horse sold by A to B is sound.\nA says to B--\"Go and ask C, C knows all about it\". C's statement is an admission." },
  { id: "BSA-19", category: "admissions", title: "Proof of admissions against persons making them, and by or on their behalf",
    text: "Admissions are relevant and may be proved as against the person who makes them, or his representative in interest; but they cannot be proved by or on behalf of the person who makes them or by his representative in interest, except in the following cases, namely:--\n(1) an admission may be proved by or on behalf of the person making it, when it is of such a nature that, if the person making it were dead, it would be relevant as between third persons under section 26;\n(2) an admission may be proved by or on behalf of the person making it, when it consists of a statement of the existence of any state of mind or body, relevant or in issue, made at or about the time when such state of mind or body existed, and is accompanied by conduct rendering its falsehood improbable;\n(3) an admission may be proved by or on behalf of the person making it, if it is relevant otherwise than as an admission.\n\nIllustrations.\n(a) The question between A and B is, whether a certain deed is or is not forged. A affirms that it is genuine, B that it is forged. A may prove a statement by B that the deed is genuine, and B may prove a statement by A that deed is forged; but A cannot prove a statement by himself that the deed is genuine, nor can B prove a statement by himself that the deed is forged.\n(b) A, the captain of a ship, is tried for casting her away. Evidence is given to show that the ship was taken out of her proper course. A produces a book kept by him in the ordinary course of his business showing observations alleged to have been taken by him from day to day, and indicating that the ship was not taken out of her proper course. A may prove these statements, because they would be admissible between third parties, if he were dead, under clause (b) of section 26.\n(c) A is accused of a crime committed by him at Kolkata. He produces a letter written by himself and dated at Chennai on that day, and bearing the Chennai post-mark of that day. The statement in the date of the letter is admissible, because, if A were dead, it would be admissible under clause (b) of section 26.\n(d) A is accused of receiving stolen goods knowing them to be stolen. He offers to prove that he refused to sell them below their value. A may prove these statements, though they are admissions, because they are explanatory of conduct influenced by facts in issue.\n(e) A is accused of fraudulently having in his possession counterfeit currency which he knew to be counterfeit. He offers to prove that he asked a skilful person to examine the currency as he doubted whether it was counterfeit or not, and that person did examine it and told him it was genuine. A may prove these facts.",
    simpleExplanation: "The general rule is a person's own statement can be used against them, but not for them (you can't manufacture favourable evidence just by saying something helpful). This section carves out three narrow exceptions where someone can prove their own earlier statement in their own favour — most notably where the statement would have qualified under Section 26 had the speaker since died." },
  { id: "BSA-20", category: "admissions", title: "When oral admissions as to contents of documents are relevant",
    text: "Oral admissions as to the contents of a document are not relevant, unless and until the party proposing to prove them shows that he is entitled to give secondary evidence of the contents of such document under the rules hereinafter contained, or unless the genuineness of a document produced is in question." },
  { id: "BSA-21", category: "admissions", title: "Admissions in civil cases when relevant",
    text: "In civil cases no admission is relevant, if it is made either upon an express condition that evidence of it is not to be given, or under circumstances from which the Court can infer that the parties agreed together that evidence of it should not be given.\n\nExplanation.--Nothing in this section shall be taken to exempt any advocate from giving evidence of any matter of which he may be compelled to give evidence under sub-sections (1) and (2) of section 132." },
  { id: "BSA-22", category: "admissions", title: "Confession caused by inducement, threat, coercion or promise, when irrelevant in criminal proceeding",
    text: "A confession made by an accused person is irrelevant in a criminal proceeding, if the making of the confession appears to the Court to have been caused by any inducement, threat, coercion or promise having reference to the charge against the accused person, proceeding from a person in authority and sufficient, in the opinion of the Court, to give the accused person grounds which would appear to him reasonable for supposing that by making it he would gain any advantage or avoid any evil of a temporal nature in reference to the proceedings against him:\n\nProvided that if the confession is made after the impression caused by any such inducement, threat, coercion or promise has, in the opinion of the Court, been fully removed, it is relevant:\n\nProvided further that if such a confession is otherwise relevant, it does not become irrelevant merely because it was made under a promise of secrecy, or in consequence of a deception practised on the accused person for the purpose of obtaining it, or when he was drunk, or because it was made in answer to questions which he need not have answered, whatever may have been the form of those questions, or because he was not warned that he was not bound to make such confession, and that evidence of it might be given against him.",
    simpleExplanation: "A confession is thrown out if it was extracted through inducement, threat, coercion, or a promise connected to the charge, coming from someone in authority — even without outright force, so long as it gave the accused reasonable grounds to think confessing would help, or silence would hurt, their case. If that pressure is later shown to have genuinely worn off, a subsequent confession can still count. The second proviso lists things that, by themselves, do NOT taint a confession — a promise of secrecy, a trick, drunkenness, or the absence of a formal warning." },
  { id: "BSA-23", category: "admissions", title: "Confession to police officer",
    text: "(1) No confession made to a police officer shall be proved as against a person accused of any offence.\n\n(2) No confession made by any person while he is in the custody of a police officer, unless it is made in the immediate presence of a Magistrate shall be proved against him:\n\nProvided that when any fact is deposed to as discovered in consequence of information received from a person accused of any offence, in the custody of a police officer, so much of such information, whether it amounts to a confession or not, as relates distinctly to the fact discovered, may be proved.",
    simpleExplanation: "Two separate bars: (1) a confession made directly to a police officer is never admissible against the accused, full stop; (2) a confession made while in police custody is also inadmissible unless made in the immediate presence of a Magistrate. The one carve-out is the 'discovery' rule in the proviso — if the confession leads police to a fact (e.g. a hidden weapon), the part of the statement that distinctly relates to that discovery can be proved, even though the rest of the confession stays out.",
    cases: [{ name: "Aghnoo Nagesia v. State of Bihar", cite: "AIR 1966 SC 119", year: 1966,
      ratio: "A confessional FIR given to a police officer is inadmissible in its entirety under this bar — the bar applies to the whole statement, not just the guilt-admitting portions — except for the narrow part that falls within the 'discovery' proviso.",
      url: "https://indiankanoon.org/doc/924340/",
      decidedUnder: "Sections 25 and 26, Indian Evidence Act, 1872",
      continuityNote: "Decided before BSA existed, under the old Act's equivalent provisions. BSA Section 23 carries over this wording essentially unchanged, so courts are expected to keep treating this as persuasive authority — but no BSA-era judgment has yet confirmed that continuity." }] },
  { id: "BSA-24", category: "admissions", title: "Consideration of proved confession affecting person making it and others jointly under trial for same offence",
    text: "When more persons than one are being tried jointly for the same offence, and a confession made by one of such persons affecting himself and some other of such persons is proved, the Court may take into consideration such confession as against such other person as well as against the person who makes such confession.\n\nExplanation I.--\"Offence\", as used in this section, includes the abetment of, or attempt to commit, the offence.\n\nExplanation II.--A trial of more persons than one held in the absence of the accused who has absconded or who fails to comply with a proclamation issued under section 84 of the Bharatiya Nagarik Suraksha Sanhita, 2023 shall be deemed to be a joint trial for the purpose of this section.\n\nIllustrations.\n(a) A and B are jointly tried for the murder of C. It is proved that A said--\"B and I murdered C\". The Court may consider the effect of this confession as against B.\n(b) A is on his trial for the murder of C. There is evidence to show that C was murdered by A and B, and that B said--\"A and I murdered C\". This statement may not be taken into consideration by the Court against A, as B is not being jointly tried.",
    simpleExplanation: "When two or more people are tried together for the same offence and one confesses in a way that also implicates a co-accused, the court may weigh that confession against the co-accused too — but only if they're being tried jointly (illustration (b) shows the rule doesn't apply otherwise). Courts treat this kind of evidence as weak, and generally use it only to add support to other independent evidence, not as the main basis for a conviction.",
    cases: [{ name: "Kashmira Singh v. State of Madhya Pradesh", cite: "AIR 1952 SC 159", year: 1952,
      ratio: "A co-accused's confession is not substantive evidence and cannot by itself found a conviction — the court should first assess the other evidence independently, and use the confession only to lend assurance if the case is otherwise borderline.",
      url: "https://indiankanoon.org/doc/1924452/",
      decidedUnder: "Section 30, Indian Evidence Act, 1872",
      continuityNote: "Decided before BSA existed, under the old Act's equivalent provision. BSA Section 24 carries over this wording essentially unchanged, so courts are expected to keep treating this as persuasive authority — but no BSA-era judgment has yet confirmed that continuity." }] },
  { id: "BSA-25", category: "admissions", title: "Admissions not conclusive proof, but may estop",
    text: "Admissions are not conclusive proof of the matters admitted but they may operate as estoppels under the provisions hereinafter contained." },
  { id: "BSA-26", category: "statements-unavailable-witnesses", title: "Cases in which statement of relevant fact by person who is dead or cannot be found, etc., is relevant",
    text: "Statements, written or verbal, of relevant facts made by a person who is dead, or who cannot be found, or who has become incapable of giving evidence, or whose attendance cannot be procured without an amount of delay or expense which under the circumstances of the case appears to the Court unreasonable, are themselves relevant facts in the following cases, namely:--\n\n(a) when the statement is made by a person as to the cause of his death, or as to any of the circumstances of the transaction which resulted in his death, in cases in which the cause of that person's death comes into question. Such statements are relevant whether the person who made them was or was not, at the time when they were made, under expectation of death, and whatever may be the nature of the proceeding in which the cause of his death comes into question;\n\n(b) when the statement was made by such person in the ordinary course of business, and in particular when it consists of any entry or memorandum made by him in books kept in the ordinary course of business, or in the discharge of professional duty; or of an acknowledgement written or signed by him of the receipt of money, goods, securities or property of any kind; or of a document used in commerce written or signed by him; or of the date of a letter or other document usually dated, written or signed by him;\n\n(c) when the statement is against the pecuniary or proprietary interest of the person making it, or when, if true, it would expose him or would have exposed him to a criminal prosecution or to a suit for damages;\n\n(d) when the statement gives the opinion of any such person, as to the existence of any public right or custom or matter of public or general interest, of the existence of which, if it existed, he would have been likely to be aware, and when such statement was made before any controversy as to such right, custom or matter had arisen;\n\n(e) when the statement relates to the existence of any relationship by blood, marriage or adoption between persons as to whose relationship by blood, marriage or adoption the person making the statement had special means of knowledge, and when the statement was made before the question in dispute was raised;\n\n(f) when the statement relates to the existence of any relationship by blood, marriage or adoption between persons deceased, and is made in any will or deed relating to the affairs of the family to which any such deceased person belonged, or in any family pedigree, or upon any tombstone, family portrait or other thing on which such statements are usually made, and when such statement was made before the question in dispute was raised;\n\n(g) when the statement is contained in any deed, will or other document which relates to any such transaction as is specified in clause (a) of section 11;\n\n(h) when the statement was made by a number of persons, and expressed feelings or impressions on their part relevant to the matter in question.\n\nIllustrations.\n(a) The question is, whether A was murdered by B; or A dies of injuries received in a transaction in the course of which she was raped. The question is whether she was raped by B; or the question is, whether A was killed by B under such circumstances that a suit would lie against B by A's widow. Statements made by A as to the cause of his or her death, referring respectively to the murder, the rape and the actionable wrong under consideration, are relevant facts.\n(b) The question is as to the date of A's birth. An entry in the diary of a deceased surgeon regularly kept in the course of business, stating that, on a given day he attended A's mother and delivered her of a son, is a relevant fact.\n(c) The question is, whether A was in Nagpur on a given day. A statement in the diary of a deceased solicitor, regularly kept in the course of business, that on a given day the solicitor attended A at a place mentioned, in Nagpur, for the purpose of conferring with him upon specified business, is a relevant fact.\n(d) The question is, whether a ship sailed from Mumbai harbour on a given day. A letter written by a deceased member of a merchant's firm by which she was chartered to their correspondents in Chennai, to whom the cargo was consigned, stating that the ship sailed on a given day from Mumbai port, is a relevant fact.\n(e) The question is, whether rent was paid to A for certain land. A letter from A's deceased agent to A, saying that he had received the rent on A's account and held it at A's orders is a relevant fact.\n(f) The question is, whether A and B were legally married. The statement of a deceased clergyman that he married them under such circumstances that the celebration would be a crime is relevant.\n(g) The question is, whether A, a person who cannot be found, wrote a letter on a certain day. The fact that a letter written by him is dated on that day is relevant.\n(h) The question is, what was the cause of the wreck of a ship. A protest made by the captain, whose attendance cannot be procured, is a relevant fact.\n(i) The question is, whether a given road is a public way. A statement by A, a deceased headman of the village, that the road was public, is a relevant fact.\n(j) The question is, what was the price of grain on a certain day in a particular market. A statement of the price, made by a deceased business person in the ordinary course of his business, is a relevant fact.\n(k) The question is, whether A, who is dead, was the father of B. A statement by A that B was his son, is a relevant fact.\n(l) The question is, what was the date of the birth of A. A letter from A's deceased father to a friend, announcing the birth of A on a given day, is a relevant fact.\n(m) The question is, whether, and when, A and B were married. An entry in a memorandum book by C, the deceased father of B, of his daughter's marriage with A on a given date, is a relevant fact.\n(n) A sues B for a libel expressed in a painted caricature exposed in a shop window. The question is as to the similarity of the caricature and its libellous character. The remarks of a crowd of spectators on these points may be proved.",
    simpleExplanation: "A list of hearsay exceptions covering statements by someone who's dead, missing, or otherwise unavailable to testify. The best-known is clause (a): a 'dying declaration' — what a person said about the cause of, or the circumstances leading to, their own death — which is relevant regardless of whether they knew death was coming. The other clauses cover business records, statements against one's own interest, and family/relationship statements made before any dispute arose.",
    cases: [{ name: "Pakala Narayana Swami v. Emperor", cite: "AIR 1939 PC 47", year: 1939,
      ratio: "A dying declaration under clause (a) need not be made under expectation of death — any statement by the deceased explaining the cause of, or the circumstances of the transaction leading to, their death qualifies, whether or not death was anticipated when it was made.",
      url: "https://indiankanoon.org/doc/516808/",
      decidedUnder: "Section 32(1), Indian Evidence Act, 1872",
      continuityNote: "Decided before BSA existed (and before Indian independence), under the old Act's equivalent provision. BSA Section 26(a) carries over this wording essentially unchanged, so courts are expected to keep treating this as persuasive authority — but no BSA-era judgment has yet confirmed that continuity." }] },
  { id: "BSA-27", category: "statements-unavailable-witnesses", title: "Relevancy of certain evidence for proving, in subsequent proceeding, truth of facts therein stated",
    text: "Evidence given by a witness in a judicial proceeding, or before any person authorised by law to take it, is relevant for the purpose of proving, in a subsequent judicial proceeding, or in a later stage of the same judicial proceeding, the truth of the facts which it states, when the witness is dead or cannot be found, or is incapable of giving evidence, or is kept out of the way by the adverse party, or if his presence cannot be obtained without an amount of delay or expense which, under the circumstances of the case, the Court considers unreasonable:\n\nProvided that the proceeding was between the same parties or their representatives in interest; that the adverse party in the first proceeding had the right and opportunity to cross-examine and the questions in issue were substantially the same in the first as in the second proceeding.\n\nExplanation.--A criminal trial or inquiry shall be deemed to be a proceeding between the prosecutor and the accused within the meaning of this section.",
    simpleExplanation: "Lets testimony given by a witness in an earlier proceeding be used to prove the same facts in a later (or a later stage of the same) proceeding, if that witness is now dead, missing, or otherwise unavailable — but only if the earlier proceeding was between the same parties and the other side already had the chance to cross-examine them." },
  { id: "BSA-28", category: "special-circumstances-statements", title: "Entries in books of account when relevant",
    text: "Entries in the books of account, including those maintained in an electronic form, regularly kept in the course of business are relevant whenever they refer to a matter into which the Court has to inquire, but such statements shall not alone be sufficient evidence to charge any person with liability.\n\nIllustration.\nA sues B for one thousand rupees, and shows entries in his account books showing B to be indebted to him to this amount. The entries are relevant, but are not sufficient, without other evidence, to prove the debt." },
  { id: "BSA-29", category: "special-circumstances-statements", title: "Relevancy of entry in public record or an electronic record made in performance of duty",
    text: "An entry in any public or other official book, register or record or an electronic record, stating a fact in issue or relevant fact, and made by a public servant in the discharge of his official duty, or by any other person in performance of a duty specially enjoined by the law of the country in which such book, register or record or an electronic record, is kept, is itself a relevant fact." },
  { id: "BSA-30", category: "special-circumstances-statements", title: "Relevancy of statements in maps, charts and plans",
    text: "Statements of facts in issue or relevant facts, made in published maps or charts generally offered for public sale, or in maps or plans made under the authority of the Central Government or any State Government, as to matters usually represented or stated in such maps, charts or plans, are themselves relevant facts." },
  { id: "BSA-31", category: "special-circumstances-statements", title: "Relevancy of statement as to fact of public nature contained in certain Acts or notifications",
    text: "When the Court has to form an opinion as to the existence of any fact of a public nature, any statement of it, made in a recital contained in any Central Act or State Act or in a Central Government or State Government notification appearing in the respective Official Gazette or in any printed paper or in electronic or digital form purporting to be such Gazette, is a relevant fact." },
  { id: "BSA-32", category: "special-circumstances-statements", title: "Relevancy of statements as to any law contained in law books including electronic or digital form",
    text: "When the Court has to form an opinion as to a law of any country, any statement of such law contained in a book purporting to be printed or published including in electronic or digital form under the authority of the Government of such country and to contain any such law, and any report of a ruling of the Courts of such country contained in a book including in electronic or digital form purporting to be a report of such rulings, is relevant." },
  { id: "BSA-33", category: "extent-of-statement", title: "What evidence to be given when statement forms part of a conversation, document, electronic record, book or series of letters or papers",
    text: "When any statement of which evidence is given forms part of a longer statement, or of a conversation or part of an isolated document, or is contained in a document which forms part of a book, or is contained in part of electronic record or of a connected series of letters or papers, evidence shall be given of so much and no more of the statement, conversation, document, electronic record, book or series of letters or papers as the Court considers necessary in that particular case to the full understanding of the nature and effect of the statement, and of the circumstances under which it was made.",
    simpleExplanation: "Sometimes called the rule of context, or the doctrine of completeness: if only part of a longer statement, conversation, document, or connected set of papers is put into evidence, the court can require enough of the rest to be shown too, so the excerpt isn't misleading when read out of context." },
  { id: "BSA-34", category: "judgments-relevant", title: "Previous judgments relevant to bar a second suit or trial",
    text: "The existence of any judgment, order or decree which by law prevents any Court from taking cognizance of a suit or holding a trial, is a relevant fact when the question is whether such Court ought to take cognizance of such suit or to hold such trial." },
  { id: "BSA-35", category: "judgments-relevant", title: "Relevancy of certain judgments in probate, etc., jurisdiction",
    text: "(1) A final judgment, order or decree of a competent Court or Tribunal, in the exercise of probate, matrimonial, admiralty or insolvency jurisdiction, which confers upon or takes away from any person any legal character, or which declares any person to be entitled to any such character, or to be entitled to any specific thing, not as against any specified person but absolutely, is relevant when the existence of any such legal character, or the title of any such person to any such thing, is relevant.\n\n(2) Such judgment, order or decree is conclusive proof that--\n(i) any legal character, which it confers accrued at the time when such judgment, order or decree came into operation;\n(ii) any legal character, to which it declares any such person to be entitled, accrued to that person at the time when such judgment, order or decree declares it to have accrued to that person;\n(iii) any legal character which it takes away from any such person ceased at the time from which such judgment, order or decree declared that it had ceased or should cease; and\n(iv) anything to which it declares any person to be so entitled was the property of that person at the time from which such judgment, order or decree declares that it had been or should be his property.",
    simpleExplanation: "A final judgment from a court exercising probate, matrimonial, admiralty, or insolvency jurisdiction isn't just relevant — where it grants, takes away, or declares a legal status or entitlement (e.g. who is someone's legal heir, or whether a marriage has been dissolved), it's conclusive proof of that status against the whole world, not just against the parties to that case. This is sometimes called a judgment 'in rem'. Contrast with Section 36, where other judgments are merely relevant, not conclusive." },
  { id: "BSA-36", category: "judgments-relevant", title: "Relevancy and effect of judgments, orders or decrees, other than those mentioned in section 35",
    text: "Judgments, orders or decrees other than those mentioned in section 35 are relevant if they relate to matters of a public nature relevant to the enquiry; but such judgments, orders or decrees are not conclusive proof of that which they state.\n\nIllustration.\nA sues B for trespass on his land. B alleges the existence of a public right of way over the land, which A denies. The existence of a decree in favour of the defendant, in a suit by A against C for a trespass on the same land, in which C alleged the existence of the same right of way, is relevant, but it is not conclusive proof that the right of way exists.",
    simpleExplanation: "Other judgments (outside Section 35's special probate/matrimonial/admiralty/insolvency categories) are relevant if they concern matters of public nature — but unlike Section 35, they're not conclusive; they're just one more piece of evidence for the court to weigh, not automatically decisive." },
  { id: "BSA-37", category: "judgments-relevant", title: "Judgments, etc., other than those mentioned in sections 34, 35 and 36 when relevant",
    text: "Judgments or orders or decrees, other than those mentioned in sections 34, 35 and 36, are irrelevant, unless the existence of such judgment, order or decree is a fact in issue, or is relevant under some other provision of this Adhiniyam.\n\nIllustrations.\n(a) A and B separately sue C for a libel which reflects upon each of them. C in each case says that the matter alleged to be libellous is true, and the circumstances are such that it is probably true in each case, or in neither. A obtains a decree against C for damages on the ground that C failed to make out his justification. The fact is irrelevant as between B and C.\n(b) A prosecutes B for stealing a cow from him. B is convicted. A afterwards sues C for the cow, which B had sold to him before his conviction. As between A and C, the judgment against B is irrelevant.\n(c) A has obtained a decree for the possession of land against B. C, B's son, murders A in consequence. The existence of the judgment is relevant, as showing motive for a crime.\n(d) A is charged with theft and with having been previously convicted of theft. The previous conviction is relevant as a fact in issue.\n(e) A is tried for the murder of B. The fact that B prosecuted A for libel and that A was convicted and sentenced is relevant under section 6 as showing the motive for the fact in issue.",
    simpleExplanation: "The default rule: any judgment, order or decree not covered by Sections 34-36 is simply irrelevant — unless its existence is itself a fact in issue (e.g. a prior conviction charged as part of the current offence) or it's made relevant by some other provision (e.g. as evidence of motive under Section 6, or of bad character under Section 49)." },
  { id: "BSA-38", category: "judgments-relevant", title: "Fraud or collusion in obtaining judgment, or incompetency of Court, may be proved",
    text: "Any party to a suit or other proceeding may show that any judgment, order or decree which is relevant under section 34, 35 or 36, and which has been proved by the adverse party, was delivered by a Court not competent to deliver it, or was obtained by fraud or collusion." },
  { id: "BSA-39", category: "expert-opinions", title: "Opinions of experts",
    text: "(1) When the Court has to form an opinion upon a point of foreign law or of science or art, or any other field, or as to identity of handwriting or finger impressions, the opinions upon that point of persons specially skilled in such foreign law, science or art, or any other field, or in questions as to identity of handwriting or finger impressions are relevant facts and such persons are called experts.\n\nIllustrations.\n(a) The question is, whether the death of A was caused by poison. The opinions of experts as to the symptoms produced by the poison by which A is supposed to have died, are relevant.\n(b) The question is, whether A, at the time of doing a certain act, was, by reason of unsoundness of mind, incapable of knowing the nature of the act, or that he was doing what was either wrong or contrary to law. The opinions of experts upon the question whether the symptoms exhibited by A commonly show unsoundness of mind, and whether such unsoundness of mind usually renders persons incapable of knowing the nature of the acts which they do, or of knowing that what they do is either wrong or contrary to law, are relevant.\n(c) The question is, whether a certain document was written by A. Another document is produced which is proved or admitted to have been written by A. The opinions of experts on the question whether the two documents were written by the same person or by different persons, are relevant.\n\n(2) When in a proceeding, the court has to form an opinion on any matter relating to any information transmitted or stored in any computer resource or any other electronic or digital form, the opinion of the Examiner of Electronic Evidence referred to in section 79A of the Information Technology Act, 2000 (21 of 2000), is a relevant fact.\n\nExplanation.--For the purposes of this sub-section, an Examiner of Electronic Evidence shall be an expert.",
    simpleExplanation: "Lists the situations where a court can rely on an expert's opinion — foreign law, science, art, or identity of handwriting/finger impressions — and, reflecting BSA's focus on digital evidence, adds that the opinion of a certified Examiner of Electronic Evidence counts as expert opinion too. An expert's opinion is only one relevant fact among others though — courts aren't bound by it, and can also compare disputed material themselves under Section 72.",
    cases: [{ name: "Murari Lal v. State of Madhya Pradesh", cite: "(1980) 1 SCC 704", year: 1980,
      ratio: "There is no rule of law requiring an expert's opinion (there, a handwriting expert) to always be corroborated before a court can act on it — but given the imperfect nature of opinion evidence, courts should approach it with caution rather than treat it as conclusive.",
      url: "https://indiankanoon.org/doc/813088/",
      decidedUnder: "Section 45, Indian Evidence Act, 1872",
      continuityNote: "Decided before BSA existed, under the old Act's equivalent provision. BSA Section 39 carries over this wording essentially unchanged, so courts are expected to keep treating this as persuasive authority — but no BSA-era judgment has yet confirmed that continuity." }] },
  { id: "BSA-40", category: "expert-opinions", title: "Facts bearing upon opinions of experts",
    text: "Facts, not otherwise relevant, are relevant if they support or are inconsistent with the opinions of experts, when such opinions are relevant.\n\nIllustrations.\n(a) The question is, whether A was poisoned by a certain poison. The fact that other persons, who were poisoned by that poison, exhibited certain symptoms which experts affirm or deny to be the symptoms of that poison, is relevant.\n(b) The question is, whether an obstruction to a harbour is caused by a certain sea-wall. The fact that other harbours similarly situated in other respects, but where there were no such sea-walls, began to be obstructed at about the same time, is relevant." },
  { id: "BSA-41", category: "expert-opinions", title: "Opinion as to handwriting and signature, when relevant",
    text: "(1) When the Court has to form an opinion as to the person by whom any document was written or signed, the opinion of any person acquainted with the handwriting of the person by whom it is supposed to be written or signed that it was or was not written or signed by that person, is a relevant fact.\n\nExplanation.--A person is said to be acquainted with the handwriting of another person when he has seen that person write, or when he has received documents purporting to be written by that person in answer to documents written by himself or under his authority and addressed to that person, or when, in the ordinary course of business, documents purporting to be written by that person have been habitually submitted to him.\n\nIllustration.\nThe question is, whether a given letter is in the handwriting of A, a merchant in Itanagar. B is a merchant in Bengaluru, who has written letters addressed to A and received letters purporting to be written by him. C, is B's clerk whose duty it was to examine and file B's correspondence. D is B's broker, to whom B habitually submitted the letters purporting to be written by A for the purpose of advising him thereon. The opinions of B, C and D on the question whether the letter is in the handwriting of A are relevant, though neither B, C nor D ever saw A write.\n\n(2) When the Court has to form an opinion as to the electronic signature of any person, the opinion of the Certifying Authority which has issued the Electronic Signature Certificate is a relevant fact.",
    simpleExplanation: "Two routes to prove handwriting: (1) the opinion of someone already familiar with the person's handwriting — defined broadly to include anyone who has seen them write, corresponded with them, or regularly received their writing in business; and (2), for electronic signatures, the opinion of the Certifying Authority that issued the signature certificate. Compare with Section 72, where the court compares the handwriting itself rather than relying on someone else's opinion." },
  { id: "BSA-42", category: "expert-opinions", title: "Opinion as to existence of general custom or right, when relevant",
    text: "When the Court has to form an opinion as to the existence of any general custom or right, the opinions, as to the existence of such custom or right, of persons who would be likely to know of its existence if it existed, are relevant.\n\nExplanation.--The expression \"general custom or right\" includes customs or rights common to any considerable class of persons.\n\nIllustration.\nThe right of the villagers of a particular village to use the water of a particular well is a general right within the meaning of this section." },
  { id: "BSA-43", category: "expert-opinions", title: "Opinion as to usages, tenets, etc., when relevant",
    text: "When the Court has to form an opinion as to--\n(i) the usages and tenets of any body of men or family;\n(ii) the constitution and governance of any religious or charitable foundation; or\n(iii) the meaning of words or terms used in particular districts or by particular classes of people,\nthe opinions of persons having special means of knowledge thereon, are relevant facts." },
  { id: "BSA-44", category: "expert-opinions", title: "Opinion on relationship, when relevant",
    text: "When the Court has to form an opinion as to the relationship of one person to another, the opinion, expressed by conduct, as to the existence of such relationship, of any person who, as a member of the family or otherwise, has special means of knowledge on the subject, is a relevant fact:\n\nProvided that such opinion shall not be sufficient to prove a marriage in proceedings under the Divorce Act, 1869 (4 of 1869), or in prosecution under sections 82 and 84 of the Bharatiya Nyaya Sanhita, 2023.\n\nIllustrations.\n(a) The question is, whether A and B were married. The fact that they were usually received and treated by their friends as husband and wife, is relevant.\n(b) The question is, whether A was the legitimate son of B. The fact that A was always treated as such by members of the family, is relevant." },
  { id: "BSA-45", category: "expert-opinions", title: "Grounds of opinion, when relevant",
    text: "Whenever the opinion of any living person is relevant, the grounds on which such opinion is based are also relevant.\n\nIllustration.\nAn expert may give an account of experiments performed by him for the purpose of forming his opinion." },
  { id: "BSA-46", category: "character-relevant", title: "In civil cases character to prove conduct imputed, irrelevant",
    text: "In civil cases the fact that the character of any person concerned is such as to render probable or improbable any conduct imputed to him, is irrelevant, except in so far as such character appears from facts otherwise relevant." },
  { id: "BSA-47", category: "character-relevant", title: "In criminal cases previous good character relevant",
    text: "In criminal proceedings the fact that the person accused is of a good character, is relevant.",
    simpleExplanation: "In a criminal trial, the accused is allowed to bring in evidence of their own good character to make the charge seem less plausible — this is a one-way right the accused has that the prosecution doesn't automatically get in reverse (see Section 49, which only lets the prosecution respond in kind once the accused opens the door)." },
  { id: "BSA-48", category: "character-relevant", title: "Evidence of character or previous sexual experience not relevant in certain cases",
    text: "In a prosecution for an offence under section 64, section 65, section 66, section 67, section 68, section 69, section 70, section 71, section 74, section 75, section 76, section 77 or section 78 of the Bharatiya Nyaya Sanhita, 2023 or for attempt to commit any such offence, where the question of consent is in issue, evidence of the character of the victim or of such person's previous sexual experience with any person shall not be relevant on the issue of such consent or the quality of consent." },
  { id: "BSA-49", category: "character-relevant", title: "Previous bad character not relevant, except in reply",
    text: "In criminal proceedings, the fact that the accused has a bad character, is irrelevant, unless evidence has been given that he has a good character, in which case it becomes relevant.\n\nExplanation 1.--This section does not apply to cases in which the bad character of any person is itself a fact in issue.\n\nExplanation 2.--A previous conviction is relevant as evidence of bad character.",
    simpleExplanation: "Flips Section 47's rule: the accused's bad character normally can't be used against them, unless they first put their own good character in issue — at which point the prosecution can respond in kind. A previous conviction, where relevant, counts as evidence of bad character for this purpose (Explanation 2)." },
  { id: "BSA-50", category: "character-relevant", title: "Character as affecting damages",
    text: "In civil cases, the fact that the character of any person is such as to affect the amount of damages which he ought to receive, is relevant.\n\nExplanation.--In this section and sections 46, 47 and 49, the word \"character\" includes both reputation and disposition; but, except as provided in section 49, evidence may be given only of general reputation and general disposition, and not of particular acts by which reputation or disposition has been shown." },
  /* ============================================================ */
  /* Sections 51-100: rest of Chapter III (Facts Which Need Not Be  */
  /* Proved), all of Chapter IV (Of Oral Evidence), all of Chapter  */
  /* V (Of Documentary Evidence, incl. Public Documents and         */
  /* Presumptions as to Documents sub-parts), and the first part of */
  /* Chapter VI (SS94-100 of 94-103; SS101-103 + Ch VII+ next).     */
  /* Sourced from the Gazette PDF via mha.gov.in, cross-checked     */
  /* against India Code's Arrangement of Sections.                  */
  /* simpleExplanation on 20 sections; cases on s.63 (2 cases:      */
  /* Anvar P.V., Arjun Panditrao) and s.72 (Murari Lal -- also      */
  /* cited under s.39 in the 1-50 batch, for a distinct holding).   */
  /* ============================================================ */
  { id: "BSA-51", category: "facts-not-required-proof", title: "Fact judicially noticeable need not be proved",
    text: "No fact of which the Court will take judicial notice need be proved.",
    simpleExplanation: "Introduces the concept of 'judicial notice' -- some facts are so well-established or officially recorded that the court simply accepts them as true without either side having to prove them. Section 52 lists exactly which facts qualify." },
  { id: "BSA-52", category: "facts-not-required-proof", title: "Facts of which Court shall take judicial notice",
    text: "(1) The Court shall take judicial notice of the following facts, namely:--\n(a) all laws in force in the territory of India including laws having extra-territorial operation;\n(b) international treaty, agreement or convention with country or countries by India, or decisions made by India at international associations or other bodies;\n(c) the course of proceeding of the Constituent Assembly of India, of Parliament of India and of the State Legislatures;\n(d) the seals of all Courts and Tribunals;\n(e) the seals of Courts of Admiralty and Maritime Jurisdiction, Notaries Public, and all seals which any person is authorised to use by the Constitution, or by an Act of Parliament or State Legislatures, or Regulations having the force of law in India;\n(f) the accession to office, names, titles, functions, and signatures of the persons filling for the time being any public office in any State, if the fact of their appointment to such office is notified in any Official Gazette;\n(g) the existence, title and national flag of every country or sovereign recognised by the Government of India;\n(h) the divisions of time, the geographical divisions of the world, and public festivals, fasts and holidays notified in the Official Gazette;\n(i) the territory of India;\n(j) the commencement, continuance and termination of hostilities between the Government of India and any other country or body of persons;\n(k) the names of the members and officers of the Court and of their deputies and subordinate officers and assistants, and also of all officers acting in execution of its process, and of advocates and other persons authorised by law to appear or act before it;\n(l) the rule of the road on land or at sea.\n\n(2) In the cases referred to in sub-section (1) and also on all matters of public history, literature, science or art, the Court may resort for its aid to appropriate books or documents of reference and if the Court is called upon by any person to take judicial notice of any fact, it may refuse to do so unless and until such person produces any such book or document as it may consider necessary to enable it to do so." },
  { id: "BSA-53", category: "facts-not-required-proof", title: "Facts admitted need not be proved",
    text: "No fact needs to be proved in any proceeding which the parties thereto or their agents agree to admit at the hearing, or which, before the hearing, they agree to admit by any writing under their hands, or which by any rule of pleading in force at the time they are deemed to have admitted by their pleadings:\n\nProvided that the Court may, in its discretion, require the facts admitted to be proved otherwise than by such admissions." },
  { id: "BSA-54", category: "oral-evidence", title: "Proof of facts by oral evidence",
    text: "All facts, except the contents of documents may be proved by oral evidence.",
    simpleExplanation: "The baseline rule: anything can be proved by a witness speaking about it in court, with one carve-out -- what a document actually says has to be proved by producing the document itself (or valid secondary evidence of it under Sections 56-60), not by someone testifying from memory about its contents." },
  { id: "BSA-55", category: "oral-evidence", title: "Oral evidence to be direct",
    text: "Oral evidence shall, in all cases whatever, be direct; if it refers to,--\n(i) a fact which could be seen, it must be the evidence of a witness who says he saw it;\n(ii) a fact which could be heard, it must be the evidence of a witness who says he heard it;\n(iii) a fact which could be perceived by any other sense or in any other manner, it must be the evidence of a witness who says he perceived it by that sense or in that manner;\n(iv) an opinion or to the grounds on which that opinion is held, it must be the evidence of the person who holds that opinion on those grounds:\n\nProvided that the opinions of experts expressed in any treatise commonly offered for sale, and the grounds on which such opinions are held, may be proved by the production of such treatises if the author is dead or cannot be found, or has become incapable of giving evidence, or cannot be called as a witness without an amount of delay or expense which the Court regards as unreasonable:\n\nProvided further that, if oral evidence refers to the existence or condition of any material thing other than a document, the Court may, if it thinks fit, require the production of such material thing for its inspection.",
    simpleExplanation: "This is India's version of the rule against hearsay: a witness can only testify to what they themselves directly perceived (saw, heard, or otherwise sensed) -- not what someone else told them about it. Two narrow exceptions let the rule bend: a dead or unavailable expert's published treatise can substitute for their live testimony, and the court can demand to physically inspect an object instead of just hearing it described." },
  { id: "BSA-56", category: "documentary-evidence-general", title: "Proof of contents of documents",
    text: "The contents of documents may be proved either by primary or by secondary evidence." },
  { id: "BSA-57", category: "documentary-evidence-general", title: "Primary evidence",
    text: "Primary evidence means the document itself produced for the inspection of the Court.\n\nExplanation 1.--Where a document is executed in several parts, each part is primary evidence of the document.\n\nExplanation 2.--Where a document is executed in counterpart, each counterpart being executed by one or some of the parties only, each counterpart is primary evidence as against the parties executing it.\n\nExplanation 3.--Where a number of documents are all made by one uniform process, as in the case of printing, lithography or photography, each is primary evidence of the contents of the rest; but, where they are all copies of a common original, they are not primary evidence of the contents of the original.\n\nExplanation 4.--Where an electronic or digital record is created or stored, and such storage occurs simultaneously or sequentially in multiple files, each such file is primary evidence.\n\nExplanation 5.--Where an electronic or digital record is produced from proper custody, such electronic and digital record is primary evidence unless it is disputed.\n\nExplanation 6.--Where a video recording is simultaneously stored in electronic form and transmitted or broadcast or transferred to another, each of the stored recordings is primary evidence.\n\nExplanation 7.--Where an electronic or digital record is stored in multiple storage spaces in a computer resource, each such automated storage, including temporary files, is primary evidence.\n\nIllustration.\nA person is shown to have been in possession of a number of placards, all printed at one time from one original. Any one of the placards is primary evidence of the contents of any other, but no one of them is primary evidence of the contents of the original.",
    simpleExplanation: "Primary evidence is simply the original document itself. The seven explanations exist mainly to answer a modern question: in a world of counterparts, printed copies, and digital files, what counts as 'the original'? Explanations 1-3 handle paper-era cases (counterparts, uniform printing runs); Explanations 4-7 extend the same logic to electronic and digital records -- e.g. if a video is stored in three places at once, all three stored copies count as primary evidence, not just one." },
  { id: "BSA-58", category: "documentary-evidence-general", title: "Secondary evidence",
    text: "Secondary evidence includes--\n(i) certified copies given under the provisions hereinafter contained;\n(ii) copies made from the original by mechanical processes which in themselves ensure the accuracy of the copy, and copies compared with such copies;\n(iii) copies made from or compared with the original;\n(iv) counterparts of documents as against the parties who did not execute them;\n(v) oral accounts of the contents of a document given by some person who has himself seen it;\n(vi) oral admissions;\n(vii) written admissions;\n(viii) evidence of a person who has examined a document, the original of which consists of numerous accounts or other documents which cannot conveniently be examined in Court, and who is skilled in the examination of such documents.\n\nIllustrations.\n(a) A photograph of an original is secondary evidence of its contents, though the two have not been compared, if it is proved that the thing photographed was the original.\n(b) A copy compared with a copy of a letter made by a copying machine is secondary evidence of the contents of the letter, if it is shown that the copy made by the copying machine was made from the original.\n(c) A copy transcribed from a copy, but afterwards compared with the original, is secondary evidence; but the copy not so compared is not secondary evidence of the original, although the copy from which it was transcribed was compared with the original.\n(d) Neither an oral account of a copy compared with the original, nor an oral account of a photograph or machine-copy of the original, is secondary evidence of the original." },
  { id: "BSA-59", category: "documentary-evidence-general", title: "Proof of documents by primary evidence",
    text: "Documents shall be proved by primary evidence except in the cases hereinafter mentioned.",
    simpleExplanation: "This is the 'best evidence rule' in one sentence: produce the original, unless one of the specific exceptions in Section 60 applies. Sections 56-73 as a whole exist to spell out exactly what those exceptions are and how each type of secondary evidence gets proved when they do." },
  { id: "BSA-60", category: "documentary-evidence-general", title: "Cases in which secondary evidence relating to documents maybe given",
    text: "Secondary evidence may be given of the existence, condition, or contents of a document in the following cases, namely:--\n(a) when the original is shown or appears to be in the possession or power--\n(i) of the person against whom the document is sought to be proved; or\n(ii) of any person out of reach of, or not subject to, the process of the Court; or\n(iii) of any person legally bound to produce it,\nand when, after the notice mentioned in section 64 such person does not produce it;\n(b) when the existence, condition or contents of the original have been proved to be admitted in writing by the person against whom it is proved or by his representative in interest;\n(c) when the original has been destroyed or lost, or when the party offering evidence of its contents cannot, for any other reason not arising from his own default or neglect, produce it in reasonable time;\n(d) when the original is of such a nature as not to be easily movable;\n(e) when the original is a public document within the meaning of section 74;\n(f) when the original is a document of which a certified copy is permitted by this Adhiniyam, or by any other law in force in India to be given in evidence;\n(g) when the originals consist of numerous accounts or other documents which cannot conveniently be examined in Court, and the fact to be proved is the general result of the whole collection.\n\nExplanation.--For the purposes of--\n(i) clauses (a), (c) and (d), any secondary evidence of the contents of the document is admissible;\n(ii) clause (b), the written admission is admissible;\n(iii) clause (e) or (f), a certified copy of the document, but no other kind of secondary evidence, is admissible;\n(iv) clause (g), evidence may be given as to the general result of the documents by any person who has examined them, and who is skilled in the examination of such document.",
    simpleExplanation: "The exceptions to Section 59's best-evidence rule, in one place: the original is in the wrong hands and won't be produced, it's been lost or destroyed through no fault of the party, it's physically too large or fixed to bring to court, it's a public document (certified copy suffices instead), or the underlying originals are too voluminous to examine practically. The Explanation then matches each exception to exactly what kind of secondary evidence is allowed in that case -- not just any secondary evidence will do for every ground." },
  { id: "BSA-61", category: "documentary-evidence-general", title: "Electronic or digital record",
    text: "Nothing in this Adhiniyam shall apply to deny the admissibility of an electronic or digital record in the evidence on the ground that it is an electronic or digital record and such record shall, subject to section 63, have the same legal effect, validity and enforceability as other document." },
  { id: "BSA-62", category: "documentary-evidence-general", title: "Special provisions as to evidence relating to electronic record",
    text: "The contents of electronic records may be proved in accordance with the provisions of section 63." },
  { id: "BSA-63", category: "documentary-evidence-general", title: "Admissibility of electronic records",
    text: "(1) Notwithstanding anything contained in this Adhiniyam, any information contained in an electronic record which is printed on paper, stored, recorded or copied in optical or magnetic media or semiconductor memory which is produced by a computer or any communication device or otherwise stored, recorded or copied in any electronic form (hereinafter referred to as the computer output) shall be deemed to be also a document, if the conditions mentioned in this section are satisfied in relation to the information and computer in question and shall be admissible in any proceedings, without further proof or production of the original, as evidence or any contents of the original or of any fact stated therein of which direct evidence would be admissible.\n\n(2) The conditions referred to in sub-section (1) in respect of a computer output shall be the following, namely:--\n(a) the computer output containing the information was produced by the computer or communication device during the period over which the computer or communication device was used regularly to create, store or process information for the purposes of any activity regularly carried on over that period by the person having lawful control over the use of the computer or communication device;\n(b) during the said period, information of the kind contained in the electronic record or of the kind from which the information so contained is derived was regularly fed into the computer or communication device in the ordinary course of the said activities;\n(c) throughout the material part of the said period, the computer or communication device was operating properly or, if not, then in respect of any period in which it was not operating properly or was out of operation during that part of the period, was not such as to affect the electronic record or the accuracy of its contents; and\n(d) the information contained in the electronic record reproduces or is derived from such information fed into the computer or communication device in the ordinary course of the said activities.\n\n(3) Where over any period, the function of creating, storing or processing information for the purposes of any activity regularly carried on over that period as mentioned in clause (a) of sub-section (2) was regularly performed by means of one or more computers or communication device, whether--\n(a) in standalone mode; or\n(b) on a computer system; or\n(c) on a computer network; or\n(d) on a computer resource enabling information creation or providing information processing and storage; or\n(e) through an intermediary,\nall the computers or communication devices used for that purpose during that period shall be treated for the purposes of this section as constituting a single computer or communication device; and references in this section to a computer or communication device shall be construed accordingly.\n\n(4) In any proceeding where it is desired to give a statement in evidence by virtue of this section, a certificate doing any of the following things shall be submitted along with the electronic record at each instance where it is being submitted for admission, namely:--\n(a) identifying the electronic record containing the statement and describing the manner in which it was produced;\n(b) giving such particulars of any device involved in the production of that electronic record as may be appropriate for the purpose of showing that the electronic record was produced by a computer or a communication device referred to in clauses (a) to (e) of sub-section (3);\n(c) dealing with any of the matters to which the conditions mentioned in sub-section (2) relate,\nand purporting to be signed by a person in charge of the computer or communication device or the management of the relevant activities (whichever is appropriate) and an expert shall be evidence of any matter stated in the certificate; and for the purposes of this sub-section it shall be sufficient for a matter to be stated to the best of the knowledge and belief of the person stating it in the certificate specified in the Schedule.\n\n(5) For the purposes of this section,--\n(a) information shall be taken to be supplied to a computer or communication device if it is supplied thereto in any appropriate form and whether it is so supplied directly or (with or without human intervention) by means of any appropriate equipment;\n(b) a computer output shall be taken to have been produced by a computer or communication device whether it was produced by it directly or (with or without human intervention) by means of any appropriate equipment or by other electronic means as referred to in clauses (a) to (e) of sub-section (3).",
    simpleExplanation: "This is the single most litigated provision in modern Indian evidence law. It lets an electronic record (printouts, computer outputs, phone data, etc.) stand in for the original without producing the underlying device -- but only if it comes with a signed certificate (sub-section 4) confirming the device was working properly and the record wasn't tampered with. Skip the certificate, and courts have repeatedly held the electronic evidence can't be admitted this way, no matter how genuine it actually is -- see the two cases below.",
    cases: [{ name: "Anvar P.V. v. P.K. Basheer", cite: "(2014) 10 SCC 473", year: 2014,
      ratio: "A certificate meeting the conditions equivalent to what is now sub-section (4) is mandatory to admit an electronic record as secondary evidence -- oral testimony or an uncertified printout cannot substitute for it, even if the record is otherwise genuine.",
      url: "https://indiankanoon.org/doc/187283766/",
      decidedUnder: "Section 65B, Indian Evidence Act, 1872",
      continuityNote: "Decided before BSA existed, under the old Act's equivalent provision. BSA Section 63 carries over this framework essentially unchanged, so courts are expected to keep treating this as persuasive authority -- but no BSA-era judgment has yet confirmed that continuity." }, { name: "Arjun Panditrao Khotkar v. Kailash Kushanrao Gorantyal", cite: "AIR 2020 SC 4908", year: 2020,
      ratio: "Reaffirmed that the certificate requirement is mandatory (resolving conflicting decisions that had suggested it could be relaxed 'in the interest of justice'), while clarifying that a party unable to obtain the certificate from a non-cooperating third party can seek the court's assistance to secure it, rather than being denied the evidence altogether.",
      url: "https://indiankanoon.org/doc/172105947/",
      decidedUnder: "Section 65B, Indian Evidence Act, 1872",
      continuityNote: "Decided before BSA existed, under the old Act's equivalent provision. BSA Section 63 carries over this framework essentially unchanged, so courts are expected to keep treating this as persuasive authority -- but no BSA-era judgment has yet confirmed that continuity." }] },
  { id: "BSA-64", category: "documentary-evidence-general", title: "Rules as to notice to produce",
    text: "Secondary evidence of the contents of the documents referred to in clause (a) of section 60, shall not be given unless the party proposing to give such secondary evidence has previously given to the party in whose possession or power the document is, or to his advocate or representative, such notice to produce it as is prescribed by law; and if no notice is prescribed by law, then such notice as the Court considers reasonable under the circumstances of the case:\n\nProvided that such notice shall not be required in order to render secondary evidence admissible in any of the following cases, or in any other case in which the Court thinks fit to dispense with it:--\n(a) when the document to be proved is itself a notice;\n(b) when, from the nature of the case, the adverse party must know that he will be required to produce it;\n(c) when it appears or is proved that the adverse party has obtained possession of the original by fraud or force;\n(d) when the adverse party or his agent has the original in Court;\n(e) when the adverse party or his agent has admitted the loss of the document;\n(f) when the person in possession of the document is out of reach of, or not subject to, the process of the Court." },
  { id: "BSA-65", category: "documentary-evidence-general", title: "Proof of signature and handwriting of person alleged to have signed or written document produced",
    text: "If a document is alleged to be signed or to have been written wholly or in part by any person, the signature or the handwriting of so much of the document as is alleged to be in that person's handwriting must be proved to be in his handwriting.",
    simpleExplanation: "States the obvious-sounding requirement that if you claim a document was signed or written by someone, you have to actually prove that. Sections 41 (opinion evidence) and 72 (court's own comparison) and 92 (the thirty-year-old-document presumption) are the different routes for doing that proving." },
  { id: "BSA-66", category: "documentary-evidence-general", title: "Proof as to electronic signature",
    text: "Except in the case of a secure electronic signature, if the electronic signature of any subscriber is alleged to have been affixed to an electronic record, the fact that such electronic signature is the electronic signature of the subscriber must be proved." },
  { id: "BSA-67", category: "documentary-evidence-general", title: "Proof of execution of document required by law to be attested",
    text: "If a document is required by law to be attested, it shall not be used as evidence until one attesting witness at least has been called for the purpose of proving its execution, if there be an attesting witness alive, and subject to the process of the Court and capable of giving evidence:\n\nProvided that it shall not be necessary to call an attesting witness in proof of the execution of any document, not being a will, which has been registered in accordance with the provisions of the Indian Registration Act, 1908, unless its execution by the person by whom it purports to have been executed is specifically denied.",
    simpleExplanation: "Opens a short cluster (Ss.67-71) on documents the law requires to be attested (witnessed) -- wills being the classic example. The core rule is that at least one attesting witness must be called to prove execution, but the following sections build in practical fallbacks: if no attesting witness can be found (s.68), their handwriting can prove it instead; if a party admits they signed it (s.69), that admission alone suffices even for an attested document; if the attesting witness denies or forgets the signing (s.70), other evidence can step in; and a document that happens to be attested but wasn't legally required to be (s.71) can simply be proved as if it were an ordinary unattested document." },
  { id: "BSA-68", category: "documentary-evidence-general", title: "Proof where no attesting witness found",
    text: "If no such attesting witness can be found, it must be proved that the attestation of one attesting witness at least is in his handwriting, and that the signature of the person executing the document is in the handwriting of that person." },
  { id: "BSA-69", category: "documentary-evidence-general", title: "Admission of execution by party to attested document",
    text: "The admission of a party to an attested document of its execution by himself shall be sufficient proof of its execution as against him, though it be a document required by law to be attested." },
  { id: "BSA-70", category: "documentary-evidence-general", title: "Proof when attesting witness denies execution",
    text: "If the attesting witness denies or does not recollect the execution of the document, its execution may be proved by other evidence." },
  { id: "BSA-71", category: "documentary-evidence-general", title: "Proof of document not required by law to be attested",
    text: "An attested document not required by law to be attested may be proved as if it was unattested." },
  { id: "BSA-72", category: "documentary-evidence-general", title: "Comparison of signature, writing or seal with others admitted or proved",
    text: "(1) In order to ascertain whether a signature, writing or seal is that of the person by whom it purports to have been written or made, any signature, writing, or seal admitted or proved to the satisfaction of the Court to have been written or made by that person may be compared with the one which is to be proved, although that signature, writing or seal has not been produced or proved for any other purpose.\n\n(2) The Court may direct any person present in Court to write any words or figures for the purpose of enabling the Court to compare the words or figures so written with any words or figures alleged to have been written by such person.\n\n(3) This section applies also, with any necessary modifications, to finger impressions.",
    simpleExplanation: "Unlike Section 41 (where a witness who knows the person's handwriting gives an opinion) or Section 39 (where an outside expert gives an opinion), this section lets the judge personally compare the disputed writing against a sample and draw their own conclusion -- including by asking someone in the courtroom to write a live sample on the spot. The same power extends to fingerprints under sub-section (3).",
    cases: [{ name: "Murari Lal v. State of Madhya Pradesh", cite: "(1980) 1 SCC 704", year: 1980,
      ratio: "The court is not merely a passive recipient of expert opinion on handwriting -- it has an independent power to itself compare disputed writing with admitted or proved writing to test and appraise the value of expert testimony, not to substitute the judge for a handwriting expert but to verify the expert's reasoning.",
      url: "https://indiankanoon.org/doc/813088/",
      decidedUnder: "Section 73, Indian Evidence Act, 1872",
      continuityNote: "Decided before BSA existed, under the old Act's equivalent provision. BSA Section 72 carries over this wording essentially unchanged, so courts are expected to keep treating this as persuasive authority -- but no BSA-era judgment has yet confirmed that continuity. Note: this is the same case cited under Section 39 in the 1-50 file, but for a distinct holding -- there for expert-opinion reliability generally, here specifically for the court's own comparison power." }] },
  { id: "BSA-73", category: "documentary-evidence-general", title: "Proof as to verification of digital signature",
    text: "In order to ascertain whether a digital signature is that of the person by whom it purports to have been affixed, the Court may direct--\n(a) that person or the Controller or the Certifying Authority to produce the Digital Signature Certificate;\n(b) any other person to apply the public key listed in the Digital Signature Certificate and verify the digital signature purported to have been affixed by that person." },
  { id: "BSA-74", category: "public-documents", title: "Public and private documents",
    text: "(1) The following documents are public documents:--\n(a) documents forming the acts, or records of the acts--\n(i) of the sovereign authority;\n(ii) of official bodies and tribunals; and\n(iii) of public officers, legislative, judicial and executive of India or of a foreign country;\n(b) public records kept in any State or Union territory of private documents.\n\n(2) All other documents except the documents referred to in sub-section (1) are private.",
    simpleExplanation: "The dividing line for this whole sub-part: a 'public document' is essentially a record of an act of government, an official body, or a public officer (or a private document that a State has taken into official custody) -- everything else, including ordinary contracts between private individuals, is a private document. This classification matters because public documents get an easier proof route (certified copies suffice, under Sections 75-77) rather than needing the original produced every time." },
  { id: "BSA-75", category: "public-documents", title: "Certified copies of public documents",
    text: "Every public officer having the custody of a public document, which any person has a right to inspect, shall give that person on demand a copy of it on payment of the legal fees therefor, together with a certificate written at the foot of such copy that it is a true copy of such document or part thereof, as the case may be, and such certificate shall be dated and subscribed by such officer with his name and his official title, and shall be sealed, whenever such officer is authorised by law to make use of a seal; and such copies so certified shall be called certified copies.\n\nExplanation.--Any officer who, by the ordinary course of official duty, is authorised to deliver such copies, shall be deemed to have the custody of such documents within the meaning of this section." },
  { id: "BSA-76", category: "public-documents", title: "Proof of documents by production of certified copies",
    text: "Such certified copies may be produced in proof of the contents of the public documents or parts of the public documents of which they purport to be copies." },
  { id: "BSA-77", category: "public-documents", title: "Proof of other official documents",
    text: "The following public documents may be proved as follows:--\n(a) Acts, orders or notifications of the Central Government in any of its Ministries and Departments or of any State Government or any Department of any State Government or Union territory Administration--\n(i) by the records of the Departments, certified by the head of those Departments respectively; or\n(ii) by any document purporting to be printed by order of any such Government;\n(b) the proceedings of Parliament or a State Legislature, by the journals of those bodies respectively, or by published Acts or abstracts, or by copies purporting to be printed by order of the Government concerned;\n(c) proclamations, orders or Regulations issued by the President of India or the Governor of a State or the Administrator or Lieutenant Governor of a Union territory, by copies or extracts contained in the Official Gazette;\n(d) the Acts of the Executive or the proceedings of the Legislature of a foreign country, by journals published by their authority, or commonly received in that country as such, or by a copy certified under the seal of the country or sovereign, or by a recognition thereof in any Central Act;\n(e) the proceedings of a municipal or local body in a State, by a copy of such proceedings, certified by the legal keeper thereof, or by a printed book purporting to be published by the authority of such body;\n(f) public documents of any other class in a foreign country, by the original or by a copy certified by the legal keeper thereof, with a certificate under the seal of a Notary Public, or of an Indian Consul or diplomatic agent, that the copy is duly certified by the officer having the legal custody of the original, and upon proof of the character of the document according to the law of the foreign country." },
  { id: "BSA-78", category: "presumptions-as-to-documents", title: "Presumption as to genuineness of certified copies",
    text: "(1) The Court shall presume to be genuine every document purporting to be a certificate, certified copy or other document, which is by law declared to be admissible as evidence of any particular fact and which purports to be duly certified by any officer of the Central Government or of a State Government:\n\nProvided that such document is substantially in the form and purports to be executed in the manner directed by law in that behalf.\n\n(2) The Court shall also presume that any officer by whom any such document purports to be signed or certified, held, when he signed it, the official character which he claims in such paper.",
    simpleExplanation: "This opens a run of sections (78-93) that are all variations on the same theme: certain categories of document (certified copies, gazettes, old documents from proper custody, digitally signed records, and so on) get an automatic presumption of genuineness, so the party relying on them doesn't have to independently prove authenticity from scratch every time -- the other side has to affirmatively challenge it instead." },
  { id: "BSA-79", category: "presumptions-as-to-documents", title: "Presumption as to documents produced as record of evidence, etc.",
    text: "Whenever any document is produced before any Court, purporting to be a record or memorandum of the evidence, or of any part of the evidence, given by a witness in a judicial proceeding or before any officer authorised by law to take such evidence or to be a statement or confession by any prisoner or accused person, taken in accordance with law, and purporting to be signed by any Judge or Magistrate, or by any such officer as aforesaid, the Court shall presume that--\n(i) the document is genuine;\n(ii) any statements as to the circumstances under which it was taken, purporting to be made by the person signing it, are true; and\n(iii) such evidence, statement or confession was duly taken." },
  { id: "BSA-80", category: "presumptions-as-to-documents", title: "Presumption as to Gazettes, newspapers, and other documents",
    text: "The Court shall presume the genuineness of every document purporting to be the Official Gazette, or to be a newspaper or journal, and of every document purporting to be a document directed by any law to be kept by any person, if such document is kept substantially in the form required by law and is produced from proper custody.\n\nExplanation.--For the purposes of this section and section 92, document is said to be in proper custody if it is in the place in which, and looked after by the person with whom such document is required to be kept; but no custody is improper if it is proved to have had a legitimate origin, or if the circumstances of the particular case are such as to render that origin probable." },
  { id: "BSA-81", category: "presumptions-as-to-documents", title: "Presumption as to Gazettes in electronic or digital record",
    text: "The Court shall presume the genuineness of every electronic or digital record purporting to be the Official Gazette, or purporting to be electronic or digital record directed by any law to be kept by any person, if such electronic or digital record is kept substantially in the form required by law and is produced from proper custody.\n\nExplanation.--For the purposes of this section and section 93 electronic records are said to be in proper custody if they are in the place in which, and looked after by the person with whom such document is required to be kept; but no custody is improper if it is proved to have had a legitimate origin, or the circumstances of the particular case are such as to render that origin probable." },
  { id: "BSA-82", category: "presumptions-as-to-documents", title: "Presumption as to maps or plans made by authority of Government",
    text: "The Court shall presume that maps or plans purporting to be made by the authority of the Central Government or any State Government were so made, and are accurate; but maps or plans made for the purposes of any cause must be proved to be accurate." },
  { id: "BSA-83", category: "presumptions-as-to-documents", title: "Presumption as to collections of laws and reports of decisions",
    text: "The Court shall presume the genuineness of, every book purporting to be printed or published under the authority of the Government of any country, and to contain any of the laws of that country, and of every book purporting to contain reports of decisions of the Courts of such country." },
  { id: "BSA-84", category: "presumptions-as-to-documents", title: "Presumption as to powers-of-attorney",
    text: "The Court shall presume that every document purporting to be a power-of-attorney, and to have been executed before, and authenticated by, a Notary Public, or any Court, Judge, Magistrate, Indian Consul or Vice-Consul, or representative of the Central Government, was so executed and authenticated." },
  { id: "BSA-85", category: "presumptions-as-to-documents", title: "Presumption as to electronic agreements",
    text: "The Court shall presume that every electronic record purporting to be an agreement containing the electronic or digital signature of the parties was so concluded by affixing the electronic or digital signature of the parties." },
  { id: "BSA-86", category: "presumptions-as-to-documents", title: "Presumption as to electronic records and electronic signatures",
    text: "(1) In any proceeding involving a secure electronic record, the Court shall presume unless contrary is proved, that the secure electronic record has not been altered since the specific point of time to which the secure status relates.\n\n(2) In any proceeding, involving secure electronic signature, the Court shall presume unless the contrary is proved that--\n(a) the secure electronic signature is affixed by subscriber with the intention of signing or approving the electronic record;\n(b) except in the case of a secure electronic record or a secure electronic signature, nothing in this section shall create any presumption, relating to authenticity and integrity of the electronic record or any electronic signature." },
  { id: "BSA-87", category: "presumptions-as-to-documents", title: "Presumption as to Electronic Signature Certificates",
    text: "The Court shall presume, unless contrary is proved, that the information listed in an Electronic Signature Certificate is correct, except for information specified as subscriber information which has not been verified, if the certificate was accepted by the subscriber." },
  { id: "BSA-88", category: "presumptions-as-to-documents", title: "Presumption as to certified copies of foreign judicial records",
    text: "(1) The Court may presume that any document purporting to be a certified copy of any judicial record of any country beyond India is genuine and accurate, if the document purports to be certified in any manner which is certified by any representative of the Central Government in or for such country to be the manner commonly in use in that country for the certification of copies of judicial records.\n\n(2) An officer who, with respect to any territory or place outside India is a Political Agent therefor, as defined in clause (43) of section 3 of the General Clauses Act, 1897, shall, for the purposes of this section, be deemed to be a representative of the Central Government in and for the country comprising that territory or place." },
  { id: "BSA-89", category: "presumptions-as-to-documents", title: "Presumption as to books, maps and charts",
    text: "The Court may presume that any book to which it may refer for information on matters of public or general interest, and that any published map or chart, the statements of which are relevant facts, and which is produced for its inspection, was written and published by the person, and at the time and place, by whom or at which it purports to have been written or published." },
  { id: "BSA-90", category: "presumptions-as-to-documents", title: "Presumption as to electronic messages",
    text: "The Court may presume that an electronic message, forwarded by the originator through an electronic mail server to the addressee to whom the message purports to be addressed corresponds with the message as fed into his computer for transmission; but the Court shall not make any presumption as to the person by whom such message was sent.",
    simpleExplanation: "A narrow but important presumption: the court can assume an email arrived at the recipient's server in the same form it was sent -- but explicitly cannot presume who actually typed or sent it. That second part still has to be proved separately (e.g. through Section 63's certificate route, or other evidence linking a specific person to the account)." },
  { id: "BSA-91", category: "presumptions-as-to-documents", title: "Presumption as to due execution, etc., of documents not produced",
    text: "The Court shall presume that every document, called for and not produced after notice to produce, was attested, stamped and executed in the manner required by law." },
  { id: "BSA-92", category: "presumptions-as-to-documents", title: "Presumption as to documents thirty years old",
    text: "Where any document, purporting or proved to be thirty years old, is produced from any custody which the Court in the particular case considers proper, the Court may presume that the signature and every other part of such document, which purports to be in the handwriting of any particular person, is in that person's handwriting, and, in the case of a document executed or attested, that it was duly executed and attested by the persons by whom it purports to be executed and attested.\n\nExplanation.--The Explanation to section 80 shall also apply to this section.\n\nIllustrations.\n(a) A has been in possession of landed property for a long time. He produces from his custody deeds relating to the land showing his titles to it. The custody shall be proper.\n(b) A produces deeds relating to landed property of which he is the mortgagee. The mortgagor is in possession. The custody shall be proper.\n(c) A, a connection of B, produces deeds relating to lands in B's possession, which were deposited with him by B for safe custody. The custody shall be proper.",
    simpleExplanation: "Known as the 'ancient document' presumption -- a classic exam topic. Once a document has genuinely been around for thirty years and comes from custody the court considers plausible (not necessarily the most obvious custodian, as the illustrations show -- a mortgagee or even a trusted third party can count as proper custody), the court can presume its signatures and execution are genuine without independent proof, since after three decades direct witnesses to its signing are often unavailable." },
  { id: "BSA-93", category: "presumptions-as-to-documents", title: "Presumption as to electronic records five years old",
    text: "Where any electronic record, purporting or proved to be five years old, is produced from any custody which the Court in the particular case considers proper, the Court may presume that the electronic signature which purports to be the electronic signature of any particular person was so affixed by him or any person authorised by him in this behalf.\n\nExplanation.--The Explanation to section 81 shall also apply to this section.",
    simpleExplanation: "BSA's new electronic-era counterpart to Section 92's thirty-year rule -- but the threshold is only five years, reflecting how much faster digital records age and how much less reliable very old custody claims are for something that can be copied or altered without leaving physical traces." },
  { id: "BSA-94", category: "exclusion-oral-by-documentary", title: "Evidence of terms of contracts, grants and other dispositions of property reduced to form of document",
    text: "When the terms of a contract, or of a grant, or of any other disposition of property, have been reduced to the form of a document, and in all cases in which any matter is required by law to be reduced to the form of a document, no evidence shall be given in proof of the terms of such contract, grant or other disposition of property, or of such matter, except the document itself, or secondary evidence of its contents in cases in which secondary evidence is admissible under the provisions hereinbefore contained.\n\nException 1.--When a public officer is required by law to be appointed in writing, and when it is shown that any particular person has acted as such officer, the writing by which he is appointed need not be proved.\n\nException 2.--Wills admitted to probate in India may be proved by the probate.\n\nExplanation 1.--This section applies equally to cases in which the contracts, grants or dispositions of property referred to are contained in one document, and to cases in which they are contained in more documents than one.\n\nExplanation 2.--Where there are more originals than one, one original only need be proved.\n\nExplanation 3.--The statement, in any document whatever, of a fact other than the facts referred to in this section, shall not preclude the admission of oral evidence as to the same fact.\n\nIllustrations.\n(a) If a contract be contained in several letters, all the letters in which it is contained must be proved.\n(b) If a contract is contained in a bill of exchange, the bill of exchange must be proved.\n(c) If a bill of exchange is drawn in a set of three, one only need be proved.\n(d) A contracts, in writing, with B, for the delivery of indigo upon certain terms. The contract mentions the fact that B had paid A the price of other indigo contracted for verbally on another occasion. Oral evidence is offered that no payment was made for the other indigo. The evidence is admissible.\n(e) A gives B a receipt for money paid by B. Oral evidence is offered of the payment. The evidence is admissible.",
    simpleExplanation: "This opens the 'parol evidence rule' -- once a contract or property disposition has been put in writing, that writing is the only proof of its terms; you can't sidestep it with oral testimony about what was 'really' agreed. Explanation 3 and illustrations (d)-(e) mark the limit though: this only blocks oral evidence about the terms of the document itself, not oral evidence about some separate, incidental fact the document happens to mention in passing." },
  { id: "BSA-95", category: "exclusion-oral-by-documentary", title: "Exclusion of evidence of oral agreement",
    text: "When the terms of any such contract, grant or other disposition of property, or any matter required by law to be reduced to the form of a document, have been proved according to section 94, no evidence of any oral agreement or statement shall be admitted, as between the parties to any such instrument or their representatives in interest, for the purpose of contradicting, varying, adding to, or subtracting from, its terms:\n\nProvided that any fact may be proved which would invalidate any document, or which would entitle any person to any decree or order relating thereto; such as fraud, intimidation, illegality, want of due execution, want of capacity in any contracting party, want or failure of consideration, or mistake in fact or law:\n\nProvided further that the existence of any separate oral agreement as to any matter on which a document is silent, and which is not inconsistent with its terms, may be proved. In considering whether or not this proviso applies, the Court shall have regard to the degree of formality of the document:\n\nProvided also that the existence of any separate oral agreement, constituting a condition precedent to the attaching of any obligation under any such contract, grant or disposition of property, may be proved:\n\nProvided also that the existence of any distinct subsequent oral agreement to rescind or modify any such contract, grant or disposition of property, may be proved, except in cases in which such contract, grant or disposition of property is by law required to be in writing, or has been registered according to the law in force for the time being as to the registration of documents:\n\nProvided also that any usage or custom by which incidents not expressly mentioned in any contract are usually annexed to contracts of that description, may be proved:\n\nProvided also that the annexing of such incident would not be repugnant to, or inconsistent with, the express terms of the contract:\n\nProvided also that any fact may be proved which shows in what manner the language of a document is related to existing facts.\n\nIllustrations.\n(a) A policy of insurance is effected on goods \"in ships from Kolkata to Visakhapatnam\". The goods are shipped in a particular ship which is lost. The fact that particular ship was orally excepted from the policy, cannot be proved.\n(b) A agrees absolutely in writing to pay B one thousand rupees on the 1st March, 2023. The fact that, at the same time, an oral agreement was made that the money should not be paid till the 31st March, 2023, cannot be proved.\n(c) An estate called \"the Rampur tea estate\" is sold by a deed which contains a map of the property sold. The fact that land not included in the map had always been regarded as part of the estate and was meant to pass by the deed cannot be proved.\n(d) A enters into a written contract with B to work certain mines, the property of B, upon certain terms. A was induced to do so by a misrepresentation of B's as to their value. This fact may be proved.\n(e) A institutes a suit against B for the specific performance of a contract, and also prays that the contract may be reformed as to one of its provisions, as that provision was inserted in it by mistake. A may prove that such a mistake was made as would by law entitle him to have the contract reformed.\n(f) A orders goods of B by a letter in which nothing is said as to the time of payment, and accepts the goods on delivery. B sues A for the price. A may show that the goods were supplied on credit for a term still unexpired.\n(g) A sells B a horse and verbally warrants him sound. A gives B a paper in these words--\"Bought of A a horse for thirty thousand rupees\". B may prove the verbal warranty.\n(h) A hires lodgings of B, and gives B a card on which is written--\"Rooms, ten thousand rupees a month\". A may prove a verbal agreement that these terms were to include partial board. A hires lodging of B for a year, and a regularly stamped agreement, drawn up by an advocate, is made between them. It is silent on the subject of board. A may not prove that board was included in the term verbally.\n(i) A applies to B for a debt due to A by sending a receipt for the money. B keeps the receipt and does not send the money. In a suit for the amount, A may prove this.\n(j) A and B make a contract in writing to take effect upon the happening of a certain contingency. The writing is left with B who sues A upon it. A may show the circumstances under which it was delivered.",
    simpleExplanation: "The core of the parol evidence rule: once a document's terms are proved, oral evidence can't contradict, vary, add to, or subtract from those terms. But six provisos carve out real breathing room -- fraud and mistake can still be proved (proviso 1), a separate agreement on something the document is simply silent about can be proved (proviso 2, and illustration (g) shows a verbal warranty surviving alongside a bare receipt), a condition that had to be met before the contract even took effect can be proved (proviso 3), a later oral agreement to cancel or change the deal can be proved unless the law required writing or registration (proviso 4), trade custom can fill gaps the contract doesn't address (provisos 5-6), and facts showing how the document's words relate to reality can always be proved (proviso 7). Illustration (h) is the classic contrast pair showing how a more formal, professionally drafted document gets less benefit of the doubt for 'silent gap' arguments than a casual handwritten note.",
    cases: [{ name: "Roop Kumar v. Mohan Thedani", cite: "AIR 2003 SC 2418", year: 2003,
      ratio: "Sections 94 and 95 (then Sections 91 and 92 of the old Act) work together and reflect the same underlying policy: once parties reduce their agreement to writing precisely to remove uncertainty, the writing is treated as the final and complete statement of their bargain, and oral evidence cannot be let in to contradict it merely because one party later claims the document was a 'sham' -- a bare, unsupported sham allegation is not enough to open the door to oral variation.",
      url: "https://indiankanoon.org/doc/1063933/",
      decidedUnder: "Sections 91 and 92, Indian Evidence Act, 1872",
      continuityNote: "Decided before BSA existed, under the old Act's equivalent provisions. BSA Sections 94-95 carry over this wording essentially unchanged, so courts are expected to keep treating this as persuasive authority -- but no BSA-era judgment has yet confirmed that continuity." }] },
  { id: "BSA-96", category: "exclusion-oral-by-documentary", title: "Exclusion of evidence to explain or amend ambiguous document",
    text: "When the language used in a document is, on its face, ambiguous or defective, evidence may not be given of facts which would show its meaning or supply its defects.\n\nIllustrations.\n(a) A agrees, in writing, to sell a horse to B for \"one lakh rupees or one lakh fifty thousand rupees\". Evidence cannot be given to show which price was to be given.\n(b) A deed contains blanks. Evidence cannot be given of facts which would show how they were meant to be filled.",
    simpleExplanation: "This is 'patent ambiguity' -- a defect obvious from the face of the document itself (like an either/or price, or unfilled blanks). The rule is strict: courts won't let outside evidence patch it up, because the document itself doesn't give enough to work with. Contrast with Section 98, where the ambiguity only appears once you look at the surrounding facts -- there, outside evidence is allowed." },
  { id: "BSA-97", category: "exclusion-oral-by-documentary", title: "Exclusion of evidence against application of document to existing facts",
    text: "When language used in a document is plain in itself, and when it applies accurately to existing facts, evidence may not be given to show that it was not meant to apply to such facts.\n\nIllustration.\nA sells to B, by deed, \"my estate at Rampur containing one hundred bighas\". A has an estate at Rampur containing one hundred bighas. Evidence may not be given of the fact that the estate meant to be sold was one situated at a different place and of a different size." },
  { id: "BSA-98", category: "exclusion-oral-by-documentary", title: "Evidence as to document unmeaning in reference to existing facts",
    text: "When language used in a document is plain in itself, but is unmeaning in reference to existing facts, evidence may be given to show that it was used in a peculiar sense.\n\nIllustration.\nA sells to B, by deed, \"my house in Kolkata\". A had no house in Kolkata, but it appears that he had a house at Howrah, of which B had been in possession since the execution of the deed. These facts may be proved to show that the deed related to the house at Howrah.",
    simpleExplanation: "This is 'latent ambiguity' -- the words look perfectly clear on paper, but turn out not to correspond to reality at all once you check the facts (there's no house in Kolkata). Unlike Section 96's patent ambiguity, here outside evidence IS allowed, because the problem isn't the document's wording -- it's a mismatch with the world that extra facts can resolve." },
  { id: "BSA-99", category: "exclusion-oral-by-documentary", title: "Evidence as to application of language which can apply to one only of several persons",
    text: "When the facts are such that the language used might have been meant to apply to any one, and could not have been meant to apply to more than one, of several persons or things, evidence may be given of facts which show which of those persons or things it was intended to apply to.\n\nIllustrations.\n(a) A agrees to sell to B, for one thousand rupees, \"my white horse\". A has two white horses. Evidence may be given of facts which show which of them was meant.\n(b) A agrees to accompany B to Ramgarh. Evidence may be given of facts showing whether Ramgarh in Rajasthan or Ramgarh in Uttarakhand was meant." },
  { id: "BSA-100", category: "exclusion-oral-by-documentary", title: "Evidence as to application of language to one of two sets of facts, to neither of which the whole correctly applies",
    text: "When the language used applies partly to one set of existing facts, and partly to another set of existing facts, but the whole of it does not apply correctly to either, evidence may be given to show to which of the two it was meant to apply.\n\nIllustration.\nA agrees to sell to B \"my land at X in the occupation of Y\". A has land at X, but not in the occupation of Y, and he has land in the occupation of Y but it is not at X. Evidence may be given of facts showing which he meant to sell.",
    simpleExplanation: "Sections 99 and 100 round out the latent-ambiguity cluster: Section 99 handles a description that clearly fits only one of several candidates once you look at the facts (only one horse could be 'the white horse' actually meant), while Section 100 handles the trickier case where the description is split -- half matches one property, half matches another, and neither matches perfectly. Both let outside evidence resolve which was really meant." },
  /* ============================================================ */
  /* Sections 101-170 -- FINAL BATCH, completes BSA (170 of 170).   */
  /* Rest of Chapter VI (SS101-103), all of Chapter VII (Burden of  */
  /* Proof, SS104-120: general rules SS104-114 + the 6 specific    */
  /* criminal-law presumptions SS115-120), all of Chapter VIII      */
  /* (Estoppel, SS121-123), all of Chapter IX (Of Witnesses,        */
  /* SS124-139), all of Chapter X (Examination of Witnesses,        */
  /* SS140-168), Chapter XI (Improper Admission and Rejection of    */
  /* Evidence, S169), Chapter XII (Repeal and Savings, S170).       */
  /* Sourced from the Gazette PDF (mha.gov.in / indiacode.nic.in),  */
  /* cross-checked against onlinelawconnect.com and independent     */
  /* per-section sources where the PDF fetch truncated.             */
  /* 28 simpleExplanation entries. Cases: S109 (Shambhu Nath Mehra, */
  /* pre-BSA) and S122 (Jyoti Sharma v. Vishnu Goyal, 2025 INSC     */
  /* 1099 -- a genuine BSA-era precedent decided after the Act came */
  /* into force, so it intentionally has NO decidedUnder/           */
  /* continuityNote pair, unlike every other case cited so far.     */
  /* ============================================================ */
  { id: "BSA-101", category: "exclusion-oral-by-documentary", title: "Evidence as to meaning of illegible characters, etc.",
    text: "Evidence may be given to show the meaning of illegible or not commonly intelligible characters, of foreign, obsolete, technical, local and regional expressions, of abbreviations and of words used in a peculiar sense.\n\nIllustration.\nA, sculptor, agrees to sell to B, \"all my mods\". A has both models and modelling tools. Evidence may be given to show which he meant to sell." },
  { id: "BSA-102", category: "exclusion-oral-by-documentary", title: "Who may give evidence of agreement varying terms of document",
    text: "Persons who are not parties to a document, or their representatives in interest, may give evidence of any facts tending to show a contemporaneous agreement varying the terms of the document.\n\nIllustration.\nA and B make a contract in writing that B shall sell A certain cotton, to be paid for on delivery. At the same time, they make an oral agreement that three months' credit shall be given to A. This could not be shown as between A and B, but it might be shown by C, if it affected his interests.",
    simpleExplanation: "The parol evidence rule (Sections 94-95) only binds the actual parties to a document and those claiming through them. A stranger to the document -- someone whose own interests are affected by it, but who wasn't a party to it -- isn't bound by that restriction and can bring in oral evidence the original parties themselves couldn't use." },
  { id: "BSA-103", category: "exclusion-oral-by-documentary", title: "Saving of provisions of Indian Succession Act relating to wills",
    text: "Nothing in this Chapter shall be taken to affect any of the provisions of the Indian Succession Act, 1925 as to the construction of wills." },
  { id: "BSA-104", category: "burden-of-proof", title: "Burden of proof",
    text: "Whoever desires any Court to give judgment as to any legal right or liability dependent on the existence of facts which he asserts must prove that those facts exist, and when a person is bound to prove the existence of any fact, it is said that the burden of proof lies on that person.\n\nIllustrations.\n(a) A desires a Court to give judgment that B shall be punished for a crime which A says B has committed. A must prove that B has committed the crime.\n(b) A desires a Court to give judgment that he is entitled to certain land in the possession of B, by reason of facts which he asserts, and which B denies, to be true. A must prove the existence of those facts.",
    simpleExplanation: "The starting principle for the whole chapter: whoever wants the court to rule in their favour based on a fact has to prove that fact -- the court doesn't assume anything either way. This is the 'legal burden', and unlike the burden discussed in Section 105, it stays fixed on the same party throughout the case and never shifts." },
  { id: "BSA-105", category: "burden-of-proof", title: "On whom burden of proof lies",
    text: "The burden of proof in a suit or proceeding lies on that person who would fail if no evidence at all were given on either side.\n\nIllustrations.\n(a) A sues B for land of which B is in possession, and which, as A asserts, was left to A by the will of C, B's father. If no evidence were given on either side, B would be entitled to retain his possession. Therefore, the burden of proof is on A.\n(b) A sues B for money due on a bond. The execution of the bond is admitted, but B says that it was obtained by fraud, which A denies. If no evidence were given on either side, A would succeed, as the bond is not disputed and the fraud is not proved. Therefore, the burden of proof is on B.",
    simpleExplanation: "A practical test for figuring out who carries the burden in a specific dispute: imagine neither side presented any evidence at all -- whoever would lose in that hypothetical is the one who has to prove their case. This is sometimes called the 'onus of proof' as distinct from Section 104's fixed legal burden -- this one can shift during a case as each side makes out a prima facie point, as illustration (b) shows once the bond's execution is admitted." },
  { id: "BSA-106", category: "burden-of-proof", title: "Burden of proof as to particular fact",
    text: "The burden of proof as to any particular fact lies on that person who wishes the Court to believe in its existence, unless it is provided by any law that the proof of that fact shall lie on any particular person.\n\nIllustration.\nA prosecutes B for theft, and wishes the Court to believe that B admitted the theft to C. A must prove the admission. B wishes the Court to believe that, at the time in question, he was elsewhere. He must prove it." },
  { id: "BSA-107", category: "burden-of-proof", title: "Burden of proving fact to be proved to make evidence admissible",
    text: "The burden of proving any fact necessary to be proved in order to enable any person to give evidence of any other fact is on the person who wishes to give such evidence.\n\nIllustrations.\n(a) A wishes to prove a dying declaration by B. A must prove B's death.\n(b) A wishes to prove, by secondary evidence, the contents of a lost document. A must prove that the document has been lost." },
  { id: "BSA-108", category: "burden-of-proof", title: "Burden of proving that case of accused comes within exceptions",
    text: "When a person is accused of any offence, the burden of proving the existence of circumstances bringing the case within any of the General Exceptions in the Bharatiya Nyaya Sanhita, 2023 or within any special exception or proviso contained in any other part of the said Sanhita, or in any law defining the offence, is upon him, and the Court shall presume the absence of such circumstances.\n\nIllustrations.\n(a) A, accused of murder, alleges that, by reason of unsoundness of mind, he did not know the nature of the act. The burden of proof is on A.\n(b) A, accused of murder, alleges that, by grave and sudden provocation, he was deprived of the power of self-control. The burden of proof is on A.\n(c) Section 117 of the Bharatiya Nyaya Sanhita, 2023 provides that whoever, except in the case provided for by sub-section (2) of section 122, voluntarily causes grievous hurt, shall be subject to certain punishments. A is charged with voluntarily causing grievous hurt under section 117. The burden of proving the circumstances bringing the case under sub-section (2) of section 122 lies on A.",
    simpleExplanation: "A 'reverse onus' provision -- normally the prosecution must prove everything, but if the accused wants to rely on a defence like unsoundness of mind or grave and sudden provocation, the burden flips onto the accused to prove that defence applies. Critically, the court starts by presuming the defence does NOT apply -- so the accused isn't just raising a doubt, they have to affirmatively establish it." },
  { id: "BSA-109", category: "burden-of-proof", title: "Burden of proving fact especially within knowledge",
    text: "When any fact is especially within the knowledge of any person, the burden of proving that fact is upon him.\n\nIllustrations.\n(a) When a person does an act with some intention other than that which the character and circumstances of the act suggest, the burden of proving that intention is upon him.\n(b) A is charged with travelling on a railway without a ticket. The burden of proving that he had a ticket is on him.",
    simpleExplanation: "A narrow exception to the general rule that the prosecution proves everything. It only shifts the burden where a fact is genuinely, exceptionally within one person's own knowledge and disproportionately hard for the other side to establish -- illustration (b)'s railway ticket is the classic textbook example. It is not a general licence to make the accused prove their innocence, and courts have repeatedly stressed the word 'especially' -- see the case below.",
    cases: [{ name: "Shambhu Nath Mehra v. State of Ajmer", cite: "AIR 1956 SC 404", year: 1956,
      ratio: "This section is an exception to the general rule that the prosecution bears the burden of proof, not a substitute for it -- it applies only to facts genuinely and exceptionally within the accused's own knowledge, and cannot be stretched to mean an accused must prove their own innocence merely because, in a trivial sense, they would 'know' the relevant facts better than anyone else.",
      url: "https://indiankanoon.org/doc/1032822/",
      decidedUnder: "Section 106, Indian Evidence Act, 1872",
      continuityNote: "Decided before BSA existed, under the old Act's equivalent provision. BSA Section 109 carries over this wording essentially unchanged, so courts are expected to keep treating this as persuasive authority -- but no BSA-era judgment has yet confirmed that continuity." }] },
  { id: "BSA-110", category: "burden-of-proof", title: "Burden of proving death of person known to have been alive within thirty years",
    text: "When the question is whether a man is alive or dead, and it is shown that he was alive within thirty years, the burden of proving that he is dead is on the person who affirms it." },
  { id: "BSA-111", category: "burden-of-proof", title: "Burden of proving that person is alive who has not been heard of for seven years",
    text: "When the question is whether a man is alive or dead, and it is proved that he has not been heard of for seven years by those who would naturally have heard of him if he had been alive, the burden of proving that he is alive is shifted to the person who affirms it.",
    simpleExplanation: "Sections 110 and 111 work as a pair on the same question -- is a person alive or dead -- but push the burden in opposite directions depending on the starting facts. Known to be alive within the last thirty years? Whoever claims they're now dead has to prove it. Not heard from for seven straight years by the people who'd naturally be in contact? The burden flips -- now whoever claims they're still alive has to prove it." },
  { id: "BSA-112", category: "burden-of-proof", title: "Burden of proof as to relationship in the cases of partners, landlord and tenant, principal and agent",
    text: "When the question is whether persons are partners, landlord and tenant, or principal and agent, and it has been shown that they have been acting as such, the burden of proving that they do not stand, or have ceased to stand, to each other in those relationships respectively, is on the person who affirms it." },
  { id: "BSA-113", category: "burden-of-proof", title: "Burden of proof as to ownership",
    text: "When the question is whether any person is owner of anything of which he is shown to be in possession, the burden of proving that he is not the owner is on the person who affirms that he is not the owner.",
    simpleExplanation: "Possession itself creates a starting presumption of ownership. Anyone who wants to challenge that -- to claim the person in possession isn't actually the owner -- carries the burden of proving it, rather than the possessor having to prove their own title from scratch." },
  { id: "BSA-114", category: "burden-of-proof", title: "Proof of good faith in transactions where one party is in relation of active confidence",
    text: "Where there is a question as to the good faith of a transaction between parties, one of whom stands to the other in a position of active confidence, the burden of proving the good faith of the transaction is on the party who is in a position of active confidence.\n\nIllustrations.\n(a) The good faith of a sale by a client to an advocate is in question in a suit brought by the client. The burden of proving the good faith of the transaction is on the advocate.\n(b) The good faith of a sale by a son just come of age to a father is in question in a suit brought by the son. The burden of proving the good faith of the transaction is on the father.",
    simpleExplanation: "Where one party holds a position of trust or influence over the other -- a lawyer over a client, a parent over a newly-adult child -- and a transaction between them is challenged as unfair, the burden flips onto the more powerful party to prove they acted in good faith, rather than the vulnerable party having to prove they were taken advantage of." },
  { id: "BSA-115", category: "presumptions-criminal-offences", title: "Presumption as to certain offences",
    text: "(1) Where a person is accused of having committed any offence specified in sub-section (2), in--\n(a) any area declared to be a disturbed area under any enactment for the time being in force, making provision for the suppression of disorder and restoration and maintenance of public order; or\n(b) any area in which there has been, over a period of more than one month, extensive disturbance of the public peace,\nand it is shown that such person had been at a place in such area at a time when firearms or explosives were used at or from that place to attack or resist the members of any armed forces or the forces charged with the maintenance of public order acting in the discharge of their duties, it shall be presumed, unless the contrary is shown, that such person had committed such offence.\n\n(2) The offences referred to in sub-section (1) are the following, namely:--\n(a) an offence under section 147, section 148, section 149 or section 150 of the Bharatiya Nyaya Sanhita, 2023.\n(b) criminal conspiracy or attempt to commit, or abetment of, an offence under section 149 or section 150 of the Bharatiya Nyaya Sanhita, 2023.",
    simpleExplanation: "Opens a cluster of six specific, high-stakes presumptions (Sections 115-120) that the law builds into particular categories of criminal case, rather than leaving to Section 119's general 'may presume' discretion. This one applies narrowly: in a declared disturbed area, or an area with over a month of sustained unrest, presence at the scene when firearms or explosives were used against security forces shifts the burden onto the accused to show they weren't involved in the specific offences listed." },
  { id: "BSA-116", category: "presumptions-criminal-offences", title: "Birth during marriage, conclusive proof of legitimacy",
    text: "The fact that any person was born during the continuance of a valid marriage between his mother and any man, or within two hundred and eighty days after its dissolution, the mother remaining unmarried, shall be conclusive proof that he is the legitimate child of that man, unless it can be shown that the parties to the marriage had no access to each other at any time when he could have been begotten.",
    simpleExplanation: "A strong, deliberately narrow presumption: a child born during a valid marriage (or within 280 days -- roughly nine months -- of its end, if the mother hasn't remarried) is conclusively the husband's legitimate child. 'Conclusive' matters here -- unlike most presumptions in this chapter, this one can only be rebutted in exactly one way: proving the couple had no access to each other at any point when conception could have occurred. General suspicion or even other evidence of infidelity isn't enough to displace it." },
  { id: "BSA-117", category: "presumptions-criminal-offences", title: "Presumption as to abetment of suicide by a married woman",
    text: "When the question is whether the commission of suicide by a woman had been abetted by her husband or any relative of her husband and it is shown that she had committed suicide within a period of seven years from the date of her marriage and that her husband or such relative of her husband had subjected her to cruelty, the Court may presume, having regard to all the other circumstances of the case, that such suicide had been abetted by her husband or by such relative of her husband.\n\nExplanation.--For the purposes of this section, \"cruelty\" shall have the same meaning as in section 86 of the Bharatiya Nyaya Sanhita, 2023." },
  { id: "BSA-118", category: "presumptions-criminal-offences", title: "Presumption as to dowry death",
    text: "When the question is whether a person has committed the dowry death of a woman and it is shown that soon before her death, such woman had been subjected by such person to cruelty or harassment for, or in connection with, any demand for dowry, the Court shall presume that such person had caused the dowry death.\n\nExplanation.--For the purposes of this section, \"dowry death\" shall have the same meaning as in section 80 of the Bharatiya Nyaya Sanhita, 2023.",
    simpleExplanation: "Sections 117 and 118 are close cousins, both addressing the reality that abuse leading to a woman's death or suicide often happens with no witnesses. Note the difference in strength though: Section 117 says the court 'may presume' abetment of suicide (discretionary, weighing all circumstances), while Section 118 says the court 'shall presume' the accused caused a dowry death once cruelty or dowry harassment shortly before death is shown (closer to mandatory, though still rebuttable) -- a meaningfully stronger presumption reflecting how much of this evidence is otherwise unobtainable." },
  { id: "BSA-119", category: "presumptions-criminal-offences", title: "Court may presume existence of certain facts",
    text: "(1) The Court may presume the existence of any fact which it thinks likely to have happened, regard being had to the common course of natural events, human conduct and public and private business, in their relation to the facts of the particular case.\n\nIllustrations.\nThe Court may presume --\n(a) a man who is in possession of stolen goods soon after the theft is either the thief or has received the goods knowing them to be stolen, unless he can account for his possession;\n(b) an accomplice is unworthy of credit, unless he is corroborated in material particulars;\n(c) a bill of exchange, accepted or endorsed, was accepted or endorsed for good consideration;\n(d) a thing or state of things which has been shown to be in existence within a period shorter than that within which such things or state of things usually cease to exist, is still in existence;\n(e) judicial and official acts have been regularly performed;\n(f) the common course of business has been followed in particular cases;\n(g) evidence which could be and is not produced would, if produced, be unfavourable to the person who withholds it;\n(h) if a man refuses to answer a question which he is not compelled to answer by law, the answer, if given, would be unfavourable to him;\n(i) when a document creating an obligation is in the hands of the obligor, the obligation has been discharged.\n\n(2) The Court shall also have regard to such facts as the following, in considering whether such maxims do or do not apply to the particular case before it:--\n(i) as to Illustration (a) -- a shop-keeper has in his till a marked rupee soon after it was stolen, and cannot account for its possession specifically, but is continually receiving rupees in the course of his business;\n(ii) as to Illustration (b) -- A, a person of the highest character, is tried for causing a man's death by an act of negligence in arranging certain machinery. B, a person of equally good character, who also took part in the arrangement, describes precisely what was done, and admits and explains the common carelessness of A and himself;\n(iii) as to Illustration (b) -- a crime is committed by several persons. A, B and C, three of the criminals, are captured on the spot and kept apart from each other. Each gives an account of the crime implicating D, and the accounts corroborate each other in such a manner as to render previous concert highly improbable;\n(iv) as to Illustration (c) -- A, the drawer of a bill of exchange, was a man of business. B, the acceptor, was a young and ignorant person, completely under A's influence;\n(v) as to Illustration (d) -- it is proved that a river ran in a certain course five years ago, but it is known that there have been floods since that time which might change its course;\n(vi) as to Illustration (e) -- a judicial act, the regularity of which is in question, was performed under exceptional circumstances;\n(vii) as to Illustration (f) -- the question is, whether a letter was received. It is shown to have been posted, but the usual course of the post was interrupted by disturbances;\n(viii) as to Illustration (g) -- a man refuses to produce a document which would bear on a contract of small importance on which he is sued, but which might also injure the feelings and reputation of his family;\n(ix) as to Illustration (h) -- a man refuses to answer a question which he is not compelled by law to answer, but the answer to it might cause loss to him in matters unconnected with the matter in relation to which it is asked;\n(x) as to Illustration (i) -- a bond is in possession of the obligor, but the circumstances of the case are such that he may have stolen it.",
    simpleExplanation: "This is the general-purpose presumption power behind the specific ones in Sections 115-118 and 120 -- the court can presume ordinary, likely things based on common sense and everyday experience (someone caught with stolen goods soon after a theft is probably the thief; an uncorroborated accomplice's word alone is shaky). Sub-section (2) is just as important as the illustrations themselves: for every single presumption listed, it immediately gives a counter-scenario showing when that common-sense inference breaks down -- a shopkeeper who normally handles lots of coins, floods that could've changed a river's course, and so on. The lesson embedded in the structure: these are rebuttable common-sense defaults, never automatic conclusions." },
  { id: "BSA-120", category: "presumptions-criminal-offences", title: "Presumption as to absence of consent in certain prosecution for rape",
    text: "In a prosecution for rape under sub-section (2) of section 64 of the Bharatiya Nyaya Sanhita, 2023, where sexual intercourse by the accused is proved and the question is whether it was without the consent of the woman alleged to have been raped and such woman states in her evidence before the Court that she did not consent, the Court shall presume that she did not consent.\n\nExplanation.--In this section, \"sexual intercourse\" shall mean any of the acts mentioned in section 63 of the Bharatiya Nyaya Sanhita, 2023.",
    simpleExplanation: "Applies specifically to the aggravated category of rape under BNS Section 64(2) -- cases involving custodial, authority, or position-of-trust relationships (e.g. police officers, public servants, medical staff, and similar). Once the sexual act itself is proved, and the woman testifies she didn't consent, the court must presume absence of consent -- shifting the practical burden onto the accused to rebut it, rather than requiring the prosecution to independently prove non-consent in a situation already marked by an inherent power imbalance." },
  { id: "BSA-121", category: "estoppel", title: "Estoppel",
    text: "When one person has, by his declaration, act or omission, intentionally caused or permitted another person to believe a thing to be true and to act upon such belief, neither he nor his representative shall be allowed, in any suit or proceeding between himself and such person or his representative, to deny the truth of that thing.\n\nIllustration.\nA intentionally and falsely leads B to believe that certain land belongs to A, and thereby induces B to buy and pay for it. The land afterwards becomes the property of A, and A seeks to set aside the sale on the ground that, at the time of the sale, he had no title. He must not be allowed to prove his want of title.",
    simpleExplanation: "The general rule behind the whole chapter: if you intentionally led someone to believe something and they acted on that belief, you can't later turn around and deny it was true -- regardless of whether it was actually true at the time. The illustration makes the point sharply: A's claim was false when he made it, but that doesn't matter; having induced B to rely on it, A is stuck with the consequences. This is a rule about evidence -- what a party may deny in court -- not a standalone right you can sue on directly; it operates as a shield, not a sword. Sections 122 and 123 are just specific, named applications of this same general principle to tenancy and commercial-instrument situations." },
  { id: "BSA-122", category: "estoppel", title: "Estoppel of tenant and of licensee of person in possession",
    text: "No tenant of immovable property, or person claiming through such tenant, shall, during the continuance of the tenancy or any time thereafter, be permitted to deny that the landlord of such tenant had, at the beginning of the tenancy, a title to such immovable property; and no person who came upon any immovable property by the licence of the person in possession thereof shall be permitted to deny that such person had a title to such possession at the time when such licence was given.",
    simpleExplanation: "A tenant who entered the property on the strength of the landlord's title can't later claim, in a dispute with that same landlord, that the landlord never really owned it -- and unlike the old Indian Evidence Act version of this rule, BSA extends the bar to 'any time thereafter', not just while the tenancy is ongoing. That means a former tenant, even decades after moving out, still can't dispute the landlord's original title. The same logic extends to licensees regarding whoever granted their licence.",
    cases: [{ name: "Jyoti Sharma v. Vishnu Goyal", cite: "2025 INSC 1099", year: 2025,
      ratio: "A tenant who entered decades earlier under a rent arrangement could not, even after seventy years of continuous occupation, deny that the landlord had title at the start of the tenancy or claim ownership by adverse possession -- the Section 122 bar defeated the claim regardless of how long possession had continued.",
      url: "https://indiankanoon.org/doc/171695497/" }] },
  { id: "BSA-123", category: "estoppel", title: "Estoppel of acceptor of bill of exchange, bailee or licensee",
    text: "No acceptor of a bill of exchange shall be permitted to deny that the drawer had authority to draw such bill or to endorse it; nor shall any bailee or licensee be permitted to deny that his bailor or licensor had, at the time when the bailment or licence commenced, authority to make such bailment or grant such licence.\n\nExplanation 1.--The acceptor of a bill of exchange may deny that the bill was really drawn by the person by whom it purports to have been drawn.\n\nExplanation 2.--If a bailee delivers the goods bailed to a person other than the bailor, he may prove that such person had a right to them as against the bailor.",
    simpleExplanation: "Two commercial mirror-images of Section 122's logic: someone who accepted a bill of exchange can't later deny the drawer had authority to draw it, and a bailee or licensee can't deny their counterparty's authority to bail or license as things stood when the arrangement began. The two Explanations keep the estoppel narrow though -- an acceptor can still argue the bill was forged outright (a different question from the drawer's authority), and a bailee who handed the goods to their true owner can still prove that was the right thing to do." },
  { id: "BSA-124", category: "witnesses", title: "Who may testify",
    text: "All persons shall be competent to testify unless the Court considers that they are prevented from understanding the questions put to them, or from giving rational answers to those questions, by tender years, extreme old age, disease, whether of body or mind, or any other cause of the same kind.\n\nExplanation.--A person of unsound mind is not incompetent to testify, unless he is prevented by his unsoundness of mind from understanding the questions put to him and giving rational answers to them.",
    simpleExplanation: "The default is universal competence -- almost anyone can testify. The bar for disqualification is high and specific: it's not about age, illness, or mental health labels as such, but whether the particular person can actually understand questions and answer rationally. A diagnosis of mental illness alone doesn't disqualify someone; the test is functional, not categorical." },
  { id: "BSA-125", category: "witnesses", title: "Witness unable to communicate verbally",
    text: "A witness who is unable to speak may give his evidence in any other manner in which he can make it intelligible, as by writing or by signs; but such writing must be written and the signs made in open Court and evidence so given shall be deemed to be oral evidence:\n\nProvided that if the witness is unable to communicate verbally, the Court shall take the assistance of an interpreter or a special educator in recording the statement, and such statement shall be videographed." },
  { id: "BSA-126", category: "witnesses", title: "Competency of husband and wife as witnesses in certain cases",
    text: "(1) In all civil proceedings the parties to the suit, and the husband or wife of any party to the suit, shall be competent witnesses.\n\n(2) In criminal proceedings against any person, the husband or wife of such person, respectively, shall be a competent witness.",
    simpleExplanation: "Confirms spouses can testify for or against each other, in both civil and criminal proceedings -- this is about competence (whether they're allowed to be called at all), which is a separate question from Section 128's privilege (whether they can be compelled to reveal marital communications specifically)." },
  { id: "BSA-127", category: "witnesses", title: "Judges and Magistrates",
    text: "No Judge or Magistrate shall, except upon the special order of some Court to which he is subordinate, be compelled to answer any question as to his own conduct in Court as such Judge or Magistrate, or as to anything which came to his knowledge in Court as such Judge or Magistrate; but he may be examined as to other matters which occurred in his presence whilst he was so acting.\n\nIllustrations.\n(a) A, on his trial before the Court of Session, says that a deposition was improperly taken by B, the Magistrate. B cannot be compelled to answer questions as to this, except upon the special order of a superior Court.\n(b) A is accused before the Court of Session of having given false evidence before B, a Magistrate. B cannot be asked what A said, except upon the special order of the superior Court.\n(c) A is accused before the Court of Session of attempting to murder a police officer whilst on his trial before B, a Sessions Judge. B may be examined as to what occurred." },
  { id: "BSA-128", category: "witnesses", title: "Communications during marriage",
    text: "No person who is or has been married, shall be compelled to disclose any communication made to him during marriage by any person to whom he is or has been married; nor shall he be permitted to disclose any such communication, unless the person who made it, or his representative in interest, consents, except in suits between married persons, or proceedings in which one married person is prosecuted for any crime committed against the other.",
    simpleExplanation: "The marital-privilege rule: private communications between spouses are protected -- neither can be compelled to reveal them, and neither is even permitted to volunteer them, without the other's consent. Notably, this privilege survives even after the marriage ends (\"is or has been married\"). The two exceptions are narrow: disputes between the spouses themselves, or a prosecution where one spouse is the victim of the other's crime." },
  { id: "BSA-129", category: "witnesses", title: "Evidence as to affairs of State",
    text: "No one shall be permitted to give any evidence derived from unpublished official records relating to any affairs of State, except with the permission of the officer at the head of the department concerned, who shall give or withhold such permission as he thinks fit." },
  { id: "BSA-130", category: "witnesses", title: "Official communications",
    text: "No public officer shall be compelled to disclose communications made to him in official confidence, when he considers that the public interests would suffer by the disclosure." },
  { id: "BSA-131", category: "witnesses", title: "Information as to commission of offences",
    text: "No Magistrate or police officer shall be compelled to say when he got any information as to the commission of any offence, and no revenue officer shall be compelled to say when he got any information as to the commission of any offence against the public revenue.\n\nExplanation.--\"revenue officer\" means any officer employed in or about the business of any branch of the public revenue." },
  { id: "BSA-132", category: "witnesses", title: "Professional communications",
    text: "(1) No advocate, shall at any time be permitted, unless with his client's express consent, to disclose any communication made to him in the course and for the purpose of his service as such advocate, by or on behalf of his client, or to state the contents or condition of any document with which he has become acquainted in the course and for the purpose of his professional service, or to disclose any advice given by him to his client in the course and for the purpose of such service:\n\nProvided that nothing in this section shall protect from disclosure of--\n(a) any such communication made in furtherance of any illegal purpose;\n(b) any fact observed by any advocate, in the course of his service as such, showing that any crime or fraud has been committed since the commencement of his service.\n\n(2) It is immaterial whether the attention of such advocate referred to in the proviso to sub-section (1), was or was not directed to such fact by or on behalf of his client. Explanation.--The obligation stated in this section continues after the professional service has ceased.\n\nIllustrations.\n(a) A, a client, says to B, an advocate--\"I have committed forgery, and I wish you to defend me\". As the defence of a man known to be guilty is not a criminal purpose, this communication is protected from disclosure.\n(b) A, a client, says to B, an advocate--\"I wish to obtain possession of property by the use of a forged deed on which I request you to sue\". This communication, being made in furtherance of a criminal purpose, is not protected from disclosure.\n(c) A, being charged with embezzlement, retains B, an advocate, to defend him. In the course of the proceedings, B observes that an entry has been made in A's account book, charging A with the sum said to have been embezzled, which entry was not in the book at the commencement of his professional service. This being a fact observed by B in the course of his service, showing that a fraud has been committed since the commencement of the proceedings, it is not protected from disclosure.\n\n(3) The provisions of this section shall apply to interpreters, and the clerks or employees of advocates.",
    simpleExplanation: "This is attorney-client privilege in statutory form -- and it belongs to the client, not the lawyer, which is why only the client's express consent can waive it. Illustration (a) draws the crucial line: defending someone you know is guilty isn't itself an illegal purpose, so a confession made purely to prepare a defence stays privileged. But the moment a communication is made in furtherance of an ongoing crime or fraud (illustration (b)), or the advocate independently observes evidence of a fraud committed since they took the case (illustration (c)), the privilege doesn't cover it. The privilege also outlives the lawyer-client relationship itself, and extends to interpreters and support staff who handled the same communications." },
  { id: "BSA-133", category: "witnesses", title: "Privilege not waived by volunteering evidence",
    text: "If any party to a suit gives evidence therein at his own instance or otherwise, he shall not be deemed to have consented thereby to such disclosure as is mentioned in section 132; and, if any party to a suit or proceeding calls any such advocate, as a witness, he shall be deemed to have consented to such disclosure only if he questions such advocate, on matters which, but for such question, he would not be at liberty to disclose." },
  { id: "BSA-134", category: "witnesses", title: "Confidential communication with legal advisers",
    text: "No one shall be compelled to disclose to the Court any confidential communication which has taken place between him and his legal adviser, unless he offers himself as a witness, in which case he may be compelled to disclose any such communications as may appear to the Court necessary to be known in order to explain any evidence which he has given, but no others." },
  { id: "BSA-135", category: "witnesses", title: "Production of title-deeds of witness not a party",
    text: "No witness who is not a party to a suit shall be compelled to produce his title-deeds to any property, or any document in virtue of which he holds any property as pledgee or mortgagee or any document the production of which might tend to criminate him, unless he has agreed in writing to produce them with the person seeking the production of such deeds or some person through whom he claims." },
  { id: "BSA-136", category: "witnesses", title: "Production of documents or electronic records which another person, having possession, could refuse to produce",
    text: "No one shall be compelled to produce documents in his possession or electronic records under his control, which any other person would be entitled to refuse to produce if they were in his possession or control, unless such last-mentioned person consents to their production." },
  { id: "BSA-137", category: "witnesses", title: "Witness not excused from answering on ground that answer will criminate",
    text: "A witness shall not be excused from answering any question as to any matter relevant to the matter in issue in any suit or in any civil or criminal proceeding, upon the ground that the answer to such question will criminate, or may tend directly or indirectly to criminate, such witness, or that it will expose, or tend directly or indirectly to expose, such witness to a penalty or forfeiture of any kind:\n\nProvided that no such answer, which a witness shall be compelled to give, shall subject him to any arrest or prosecution, or be proved against him in any criminal proceeding, except a prosecution for giving false evidence by such answer.",
    simpleExplanation: "A trade-off: a witness can't dodge a relevant question just by claiming the honest answer would incriminate them -- but in exchange, that compelled answer can't then be used to arrest or prosecute them (the one exception being if they lie under oath while answering, which is its own separate offence). This balances the court's need for truthful testimony against the witness's constitutional-style protection from self-incrimination, by shifting the protection from 'you don't have to answer' to 'your answer can't be used against you'." },
  { id: "BSA-138", category: "witnesses", title: "Accomplice",
    text: "An accomplice shall be a competent witness against an accused person; and a conviction is not illegal if it proceeds upon the corroborated testimony of an accomplice.",
    simpleExplanation: "An accomplice -- someone who took part in the crime themselves -- is legally allowed to testify against a co-accused, and a conviction based on that testimony is valid, but only if the testimony is corroborated. Read alongside Section 119's illustration (b) (the court 'may presume' an accomplice unworthy of credit absent corroboration), the practical rule that has developed is that accomplice evidence, while technically competent on its own, is treated with real caution and courts look for independent supporting evidence before relying on it." },
  { id: "BSA-139", category: "witnesses", title: "Number of witnesses",
    text: "No particular number of witnesses shall in any case be required for the proof of any fact.",
    simpleExplanation: "Indian evidence law doesn't work on a headcount system -- there's no rule that a fact needs two witnesses, or five, to be proved. A single credible witness's testimony can be enough; quality matters, not quantity." },
  { id: "BSA-140", category: "examination-of-witnesses", title: "Order of production and examination of witnesses",
    text: "The order in which witnesses are produced and examined shall be regulated by the law and practice for the time being relating to civil and criminal procedure respectively, and, in the absence of any such law, by the discretion of the Court." },
  { id: "BSA-141", category: "examination-of-witnesses", title: "Judge to decide as to admissibility of evidence",
    text: "(1) When either party proposes to give evidence of any fact, the Judge may ask the party proposing to give the evidence in what manner the alleged fact, if proved, would be relevant; and the Judge shall admit the evidence if he thinks that the fact, if proved, would be relevant, and not otherwise.\n\n(2) If the fact proposed to be proved is one of which evidence is admissible only upon proof of some other fact, such last mentioned fact must be proved before evidence is given of the fact first mentioned, unless the party undertakes to give proof of such fact, and the Court is satisfied with such undertaking.\n\n(3) If the relevancy of one alleged fact depends upon another alleged fact being first proved, the Judge may, in his discretion, either permit evidence of the first fact to be given before the second fact is proved, or require evidence to be given of the second fact before evidence is given of the first fact.\n\nIllustrations.\n(a) It is proposed to prove a statement about a relevant fact by a person alleged to be dead, which statement is relevant under section 26. The fact that the person is dead must be proved by the person proposing to prove the statement, before evidence is given of the statement.\n(b) It is proposed to prove, by a copy, the contents of a document said to be lost. The fact that the original is lost must be proved by the person proposing to produce the copy, before the copy is produced.\n(c) A is accused of receiving stolen property knowing it to have been stolen. It is proposed to prove that he denied the possession of the property. The relevancy of the denial depends on the identity of the property. The Court may, in its discretion, either require the property to be identified before the denial of the possession is proved, or permit the denial of the possession to be proved before the property is identified.\n(d) It is proposed to prove a fact A which is said to have been the cause or effect of a fact in issue. There are several intermediate facts B, C and D which must be shown to exist before the fact A can be regarded as the cause or effect of the fact in issue. The Court may either permit A to be proved before B, C or D is proved, or may require proof of B, C and D before permitting proof of A.",
    simpleExplanation: "Gives the trial judge active gatekeeping control over the order and admissibility of evidence -- before letting evidence in, the judge can require the party to first explain how it's relevant, and can insist that foundational facts (like a document being lost, before secondary evidence of its contents comes in) be established first. The judge has real discretion over sequencing (sub-section 3), but not over the basic relevance gate itself (sub-section 1)." },
  { id: "BSA-142", category: "examination-of-witnesses", title: "Examination of witnesses",
    text: "(1) The examination of a witness by the party who calls him shall be called his examination-in-chief.\n\n(2) The examination of a witness by the adverse party shall be called his cross-examination.\n\n(3) The examination of a witness, subsequent to the cross-examination, by the party who called him, shall be called his re-examination." },
  { id: "BSA-143", category: "examination-of-witnesses", title: "Order of examinations",
    text: "(1) Witnesses shall be first examined-in-chief, then (if the adverse party so desires) cross-examined, then (if the party calling him so desires) re-examined.\n\n(2) The examination-in-chief and cross-examination must relate to relevant facts, but the cross-examination need not be confined to the facts to which the witness testified on his examination-in-chief.\n\n(3) The re-examination shall be directed to the explanation of matters referred to in cross-examination; and, if new matter is, by permission of the Court, introduced in re-examination, the adverse party may further cross-examine upon that matter." },
  { id: "BSA-144", category: "examination-of-witnesses", title: "Cross-examination of person called to produce a document",
    text: "A person summoned to produce a document does not become a witness by the mere fact that he produces it, and cannot be cross-examined unless and until he is called as a witness." },
  { id: "BSA-145", category: "examination-of-witnesses", title: "Witnesses to character",
    text: "Witnesses to character may be cross-examined and re-examined." },
  { id: "BSA-146", category: "examination-of-witnesses", title: "Leading questions",
    text: "(1) Any question suggesting the answer which the person putting it wishes or expects to receive, is called a leading question.\n\n(2) Leading questions must not, if objected to by the adverse party, be asked in an examination-in-chief, or in a re-examination, except with the permission of the Court.\n\n(3) The Court shall permit leading questions as to matters which are introductory or undisputed, or which have, in its opinion, been already sufficiently proved.\n\n(4) Leading questions may be asked in cross-examination.",
    simpleExplanation: "A leading question is one that suggests its own answer (\"You saw the defendant there, didn't you?\"). The rule against them exists specifically to stop a party from coaching their own witness's testimony -- which is why they're barred in examination-in-chief and re-examination (your own witness) but explicitly allowed in cross-examination, where the whole point is to test and challenge what the other side's witness said." },
  { id: "BSA-147", category: "examination-of-witnesses", title: "Evidence as to matters in writing",
    text: "Any witness may be asked, while under examination, whether any contract, grant or other disposition of property, as to which he is giving evidence, was not contained in a document, and if he says that it was, or if he is about to make any statement as to the contents of any document, which, in the opinion of the Court, ought to be produced, the adverse party may object to such evidence being given until such document is produced, or until facts have been proved which entitle the party who called the witness to give secondary evidence of it.\n\nExplanation.--A witness may give oral evidence of statements made by other persons about the contents of documents if such statements are in themselves relevant facts.\n\nIllustration.\nThe question is, whether A assaulted B. C deposes that he heard A say to D--\"B wrote a letter accusing me of theft, and I will be revenged on him\". This statement is relevant, as showing A's motive for the assault, and evidence may be given of it, though no other evidence is given about the letter." },
  { id: "BSA-148", category: "examination-of-witnesses", title: "Cross-examination as to previous statements in writing",
    text: "A witness may be cross-examined as to previous statements made by him in writing or reduced into writing, and relevant to matters in question, without such writing being shown to him, or being proved; but, if it is intended to contradict him by the writing, his attention must, before the writing can be proved, be called to those parts of it which are to be used for the purpose of contradicting him." },
  { id: "BSA-149", category: "examination-of-witnesses", title: "Questions lawful in cross-examination",
    text: "When a witness is cross-examined, he may, in addition to the questions hereinbefore referred to, be asked any questions which tend--\n(a) to test his veracity; or\n(b) to discover who he is and what is his position in life; or\n(c) to shake his credit, by injuring his character, although the answer to such questions might tend directly or indirectly to criminate him, or might expose or tend directly or indirectly to expose him to a penalty or forfeiture:\n\nProvided that in a prosecution for an offence under section 64, section 65, section 66, section 67, section 68, section 69, section 70 or section 71 of the Bharatiya Nyaya Sanhita, 2023 or for attempt to commit any such offence, where the question of consent is an issue, it shall not be permissible to adduce evidence or to put questions in the cross-examination of the victim as to the general immoral character, or previous sexual experience, of such victim with any person for proving such consent or the quality of consent.",
    simpleExplanation: "Cross-examination is deliberately given wide latitude -- questions can probe a witness's truthfulness, identity, and even their character, and the witness can't refuse just because an honest answer might incriminate them (consistent with Section 137). But the proviso carves out an important, specific limit: in sexual offence prosecutions where consent is in issue, the victim's general character or past sexual history with anyone cannot be used to attack or establish consent -- a direct statutory rejection of that line of questioning." },
  { id: "BSA-150", category: "examination-of-witnesses", title: "When witness to be compelled to answer",
    text: "If any such question relates to a matter relevant to the suit or proceeding, the provisions of section 137 shall apply thereto." },
  { id: "BSA-151", category: "examination-of-witnesses", title: "Court to decide when question shall be asked and when witness compelled to answer",
    text: "(1) If any such question relates to a matter not relevant to the suit or proceeding, except in so far as it affects the credit of the witness by injuring his character, the Court shall decide whether or not the witness shall be compelled to answer it, and may, if it thinks fit, warn the witness that he is not obliged to answer it.\n\n(2) In exercising its discretion, the Court shall have regard to the following considerations, namely:--\n(a) such questions are proper if they are of such a nature that the truth of the imputation conveyed by them would seriously affect the opinion of the Court as to the credibility of the witness on the matter to which he testifies;\n(b) such questions are improper if the imputation which they convey relates to matters so remote in time, or of such a character, that the truth of the imputation would not affect, or would affect in a slight degree, the opinion of the Court as to the credibility of the witness on the matter to which he testifies;\n(c) such questions are improper if there is a great disproportion between the importance of the imputation made against the witness's character and the importance of his evidence;\n(d) the Court may, if it sees fit, draw, from the witness's refusal to answer, the inference that the answer if given would be unfavourable." },
  { id: "BSA-152", category: "examination-of-witnesses", title: "Question not to be asked without reasonable grounds",
    text: "No such question as is referred to in section 151 ought to be asked, unless the person asking it has reasonable grounds for thinking that the imputation which it conveys is well-founded.\n\nIllustrations.\n(a) An advocate is instructed by another advocate that an important witness is a dacoit. This is a reasonable ground for asking the witness whether he is a dacoit.\n(b) An advocate is informed by a person in Court that an important witness is a dacoit. The informant, on being questioned by the advocate, gives satisfactory reasons for his statement. This is a reasonable ground for asking the witness whether he is a dacoit.\n(c) A witness, of whom nothing whatever is known, is asked at random whether he is a dacoit. There are here no reasonable grounds for the question.\n(d) A witness, of whom nothing whatever is known, being questioned as to his mode of life and means of living, gives unsatisfactory answers. This may be a reasonable ground for asking him if he is a dacoit." },
  { id: "BSA-153", category: "examination-of-witnesses", title: "Procedure of Court in case of question being asked without reasonable grounds",
    text: "If the Court is of opinion that any such question was asked without reasonable grounds, it may, if it was asked by any advocate, report the circumstances of the case to the High Court or other authority to which such advocate is subject in the exercise of his profession." },
  { id: "BSA-154", category: "examination-of-witnesses", title: "Indecent and scandalous questions",
    text: "The Court may forbid any questions or inquiries which it regards as indecent or scandalous, although such questions or inquiries may have some bearing on the questions before the Court, unless they relate to facts in issue, or to matters necessary to be known in order to determine whether or not the facts in issue existed." },
  { id: "BSA-155", category: "examination-of-witnesses", title: "Questions intended to insult or annoy",
    text: "The Court shall forbid any question which appears to it to be intended to insult or annoy, or which, though proper in itself, appears to the Court needlessly offensive in form." },
  { id: "BSA-156", category: "examination-of-witnesses", title: "Exclusion of evidence to contradict answers to questions testing veracity",
    text: "When a witness has been asked and has answered any question which is relevant to the inquiry only in so far as it tends to shake his credit by injuring his character, no evidence shall be given to contradict him; but, if he answers falsely, he may afterwards be charged with giving false evidence.\n\nException 1.--If a witness is asked whether he has been previously convicted of any crime and denies it, evidence may be given of his previous conviction.\n\nException 2.--If a witness is asked any question tending to impeach his impartiality, and answers it by denying the facts suggested, he may be contradicted.\n\nIllustrations.\n(a) A claim against an underwriter is resisted on the ground of fraud. The claimant is asked whether, in a former transaction, he had not made a fraudulent claim. He denies it. Evidence is offered to show that he did make such a claim. The evidence is inadmissible.\n(b) A witness is asked whether he was not dismissed from a situation for dishonesty. He denies it. Evidence is offered to show that he was dismissed for dishonesty. The evidence is not admissible.\n(c) A affirms that on a certain day he saw B at Goa. A is asked whether he himself was not on that day at Varanasi. He denies it. Evidence is offered to show that A was on that day at Varanasi. The evidence is admissible, not as contradicting A on a fact which affects his credit, but as contradicting the alleged fact that B was seen on the day in question in Goa. In each of these cases, the witness might, if his denial was false, be charged with giving false evidence.\n(d) A is asked whether his family has not had a blood feud with the family of B against whom he gives evidence. He denies it. He may be contradicted on the ground that the question tends to impeach his impartiality.",
    simpleExplanation: "This is the 'collateral finality rule' -- if a question is only relevant because it might shake the witness's credibility (not because it bears on the actual facts in issue), and the witness denies it, that denial is generally final: you can't bring in separate evidence to prove the denial false, only prosecute for false evidence afterward if it comes to that. Illustration (c) shows the key distinction to watch for -- that contradicting evidence there is admissible not because it attacks credibility, but because it disproves a substantive fact in the case (whether B was actually in Goa). The two Exceptions (past convictions, and questions about bias/impartiality) are the only carve-outs where contradiction is allowed even on a purely credibility-testing question." },
  { id: "BSA-157", category: "examination-of-witnesses", title: "Question by party to his own witness",
    text: "(1) The Court may, in its discretion, permit the person who calls a witness to put any question to him which might be put in cross-examination by the adverse party.\n\n(2) Nothing in this section shall disentitle the person so permitted under sub-section (1), to rely on any part of the evidence of such witness." },
  { id: "BSA-158", category: "examination-of-witnesses", title: "Impeaching credit of witness",
    text: "The credit of a witness may be impeached in the following ways by the adverse party, or, with the consent of the Court, by the party who calls him--\n(a) by the evidence of persons who testify that they, from their knowledge of the witness, believe him to be unworthy of credit;\n(b) by proof that the witness has been bribed, or has accepted the offer of a bribe, or has received any other corrupt inducement to give his evidence;\n(c) by proof of former statements inconsistent with any part of his evidence which is liable to be contradicted.\n\nExplanation.--A witness declaring another witness to be unworthy of credit may not, upon his examination-in-chief, give reasons for his belief, but he may be asked his reasons in cross-examination, and the answers which he gives cannot be contradicted, though, if they are false, he may afterwards be charged with giving false evidence.\n\nIllustrations.\n(a) A sues B for the price of goods sold and delivered to B. C says that he delivered the goods to B. Evidence is offered to show that, on a previous occasion, he said that he had not delivered goods to B. The evidence is admissible.\n(b) A is accused of the murder of B. C says that B, when dying, declared that A had given B the wound of which he died. Evidence is offered to show that, on a previous occasion, C said that B, when dying, did not declare that A had given B the wound of which he died. The evidence is admissible.",
    simpleExplanation: "Three named routes to attack a witness's credibility: bring in other people who know the witness and consider them untrustworthy, prove they were bribed or offered a bribe, or catch them in a prior inconsistent statement. This connects directly to Section 156 -- a prior inconsistent statement isn't barred by the collateral-finality rule because it's a specifically recognised impeachment method under this section, not a random collateral question." },
  { id: "BSA-159", category: "examination-of-witnesses", title: "Questions tending to corroborate evidence of relevant fact, admissible",
    text: "When a witness whom it is intended to corroborate gives evidence of any relevant fact, he may be questioned as to any other circumstances which he observed at or near to the time or place at which such relevant fact occurred, if the Court is of opinion that such circumstances, if proved, would corroborate the testimony of the witness as to the relevant fact which he testifies.\n\nIllustration.\nA, an accomplice, gives an account of a robbery in which he took part. He describes various incidents unconnected with the robbery which occurred on his way to and from the place where it was committed. Independent evidence of these facts may be given in order to corroborate his evidence as to the robbery itself." },
  { id: "BSA-160", category: "examination-of-witnesses", title: "Former statements of witness may be proved to corroborate later testimony as to same fact",
    text: "In order to corroborate the testimony of a witness, any former statement made by such witness relating to the same fact, at or about the time when the fact took place, or before any authority legally competent to investigate the fact, may be proved.",
    simpleExplanation: "Sections 159-161 give three separate routes for corroborating a witness. Section 159 lets you bring in surrounding details the witness observed to lend credibility to their core account. Section 160 lets you bring in the witness's own earlier statement about the same fact -- made close to when it happened, or before an authority investigating it -- to back up what they're saying now. Section 161 (a cross-reference back to Sections 26 and 27) extends the same corroborate-or-contradict logic to statements already admitted as hearsay exceptions." },
  { id: "BSA-161", category: "examination-of-witnesses", title: "What matters may be proved in connection with proved statement relevant under section 26 or 27",
    text: "Whenever any statement, relevant under section 26 or 27, is proved, all matters may be proved either in order to contradict or to corroborate it, or in order to impeach or confirm the credit of the person by whom it was made, which might have been proved if that person had been called as a witness and had denied upon cross-examination the truth of the matter suggested." },
  { id: "BSA-162", category: "examination-of-witnesses", title: "Refreshing memory",
    text: "(1) A witness may, while under examination, refresh his memory by referring to any writing made by himself at the time of the transaction concerning which he is questioned, or so soon afterwards that the Court considers it likely that the transaction was at that time fresh in his memory:\n\nProvided that the witness may also refer to any such writing made by any other person, and read by the witness within the time aforesaid, if when he read it, he knew it to be correct.\n\n(2) Whenever a witness may refresh his memory by reference to any document, he may, with the permission of the Court, refer to a copy of such document:\n\nProvided that the Court be satisfied that there is sufficient reason for the non-production of the original:\n\nProvided further that an expert may refresh his memory by reference to professional treatises.",
    simpleExplanation: "Lets a witness look at contemporaneous notes to jog their memory while testifying -- but the notes have to actually be contemporaneous (written at the time, or soon enough afterward that the events were still fresh) to qualify. Sections 162-164 work as a set: this section lets the witness refresh memory from a document, Section 163 lets them testify to facts recorded in it even without independent recollection as long as they trust the record's accuracy, and Section 164 gives the other side the right to see and cross-examine on whatever document was used this way." },
  { id: "BSA-163", category: "examination-of-witnesses", title: "Testimony to facts stated in document mentioned in section 162",
    text: "A witness may also testify to facts mentioned in any such document as is mentioned in section 162, although he has no specific recollection of the facts themselves, if he is sure that the facts were correctly recorded in the document.\n\nIllustration.\nA book-keeper may testify to facts recorded by him in books regularly kept in the course of business, if he knows that the books were correctly kept, although he has forgotten the particular transactions entered." },
  { id: "BSA-164", category: "examination-of-witnesses", title: "Right of adverse party as to writing used to refresh memory",
    text: "Any writing referred to under the provisions of the two last preceding sections shall be produced and shown to the adverse party if he requires it; such party may, if he pleases, cross-examine the witness thereupon." },
  { id: "BSA-165", category: "examination-of-witnesses", title: "Production of documents",
    text: "(1) A witness summoned to produce a document shall, if it is in his possession or power, bring it to Court, notwithstanding any objection which there may be to its production or to its admissibility:\n\nProvided that the validity of any such objection shall be decided on by the Court.\n\n(2) The Court, if it sees fit, may inspect the document, unless it refers to matters of State, or take other evidence to enable it to determine on its admissibility.\n\n(3) If for such a purpose it is necessary to cause any document to be translated, the Court may, if it thinks fit, direct the translator to keep the contents secret, unless the document is to be given in evidence and, if the interpreter disobeys such direction, he shall be held to have committed an offence under section 198 of the Bharatiya Nyaya Sanhita, 2023:\n\nProvided that no Court shall require any communication between the Ministers and the President of India to be produced before it." },
  { id: "BSA-166", category: "examination-of-witnesses", title: "Giving, as evidence, of document called for and produced on notice",
    text: "When a party calls for a document which he has given the other party notice to produce, and such document is produced and inspected by the party calling for its production, he is bound to give it as evidence if the party producing it requires him to do so." },
  { id: "BSA-167", category: "examination-of-witnesses", title: "Using, as evidence, of document production of which was refused on notice",
    text: "When a party refuses to produce a document which he has had notice to produce, he cannot afterwards use the document as evidence without the consent of the other party or the order of the Court.\n\nIllustration.\nA sues B on an agreement and gives B notice to produce it. At the trial, A calls for the document and B refuses to produce it. A gives secondary evidence of its contents. B seeks to produce the document itself to contradict the secondary evidence given by A, or in order to show that the agreement is not stamped. He cannot do so." },
  { id: "BSA-168", category: "examination-of-witnesses", title: "Judge's power to put questions or order production",
    text: "The Judge may, in order to discover or obtain proof of relevant facts, ask any question he considers necessary, in any form, at any time, of any witness, or of the parties about any fact; and may order the production of any document or thing; and neither the parties nor their representatives shall be entitled to make any objection to any such question or order, nor, without the leave of the Court, to cross-examine any witness upon any answer given in reply to any such question:\n\nProvided that the judgment must be based upon facts declared by this Adhiniyam to be relevant, and duly proved:\n\nProvided further that this section shall not authorise any Judge to compel any witness to answer any question, or to produce any document which such witness would be entitled to refuse to answer or produce under sections 127 to 136, both inclusive, if the question were asked or the document were called for by the adverse party; nor shall the Judge ask any question which it would be improper for any other person to ask under section 151 or 152; nor shall he dispense with primary evidence of any document, except in the cases hereinbefore excepted.",
    simpleExplanation: "One of the widest powers in the whole Act: an Indian trial judge isn't a passive umpire between two sides -- this section gives the judge an active, almost inquisitorial power to question any witness or party about any fact, at any time, in any form, in order to get at the truth, and neither side can object to it or freely cross-examine on the answers. The two provisos keep it bounded, though: the eventual judgment still has to rest on facts this Act actually treats as relevant and properly proved, and the judge can't use this power to strip away privileges (Sections 127-136) or ask improper character-attacking questions that a party themselves couldn't ask." },
  { id: "BSA-169", category: "improper-admission-rejection", title: "No new trial for improper admission or rejection of evidence",
    text: "The improper admission or rejection of evidence shall not be ground of itself for a new trial or reversal of any decision in any case, if it shall appear to the Court before which such objection is raised that, independently of the evidence objected to and admitted, there was sufficient evidence to justify the decision, or that, if the rejected evidence had been received, it ought not to have varied the decision.",
    simpleExplanation: "The 'harmless error' rule -- a mistake in admitting evidence that shouldn't have come in, or excluding evidence that should have, isn't automatically grounds to overturn a decision on appeal. The appellate court asks a practical question instead: setting the disputed evidence aside entirely, was there still enough evidence to support the decision, or would the wrongly-excluded evidence actually have changed the outcome? Only if the error was genuinely outcome-determinative does it justify a new trial or reversal." },
  { id: "BSA-170", category: "repeal-and-savings", title: "Repeal and savings",
    text: "(1) The Indian Evidence Act, 1872 is hereby repealed.\n\n(2) Notwithstanding such repeal, if, immediately before the date on which this Adhiniyam comes into force, there is any application, trial, inquiry, investigation, proceeding or appeal pending, then, such application, trial, inquiry, investigation, proceeding or appeal shall be dealt with under the provisions of the Indian Evidence Act, 1872, as in force immediately before such commencement, as if this Adhiniyam had not come into force.",
    simpleExplanation: "The Act's final provision: it formally repeals the Indian Evidence Act, 1872 -- the law BSA replaces -- but with a crucial transition rule. Anything already underway (an application, trial, inquiry, investigation, or appeal) when BSA came into force on 1 July 2024 keeps running under the old 1872 Act to its conclusion, exactly as if BSA had never been enacted. Only genuinely new matters, begun on or after that date, are governed by BSA. This is why, even years after BSA's commencement, some ongoing cases and their appeals may still cite Indian Evidence Act section numbers rather than BSA ones." },

];

const DEFINITIONS = {
  "good faith": { source: "Section 2(11), BNS 2023",
    text: "Nothing is said to be done or believed in \u2018good faith\u2019 which is done or believed without due care and attention. It sets an objective standard — honest belief alone is not enough." },
  "mental illness": { source: "Mental Healthcare Act, 2017 (definition adopted by BNS 2023)",
    text: "Broadly: a substantial disorder of thinking, mood, perception, orientation or memory that grossly impairs judgment, behaviour, or the ability to meet the ordinary demands of life. Does not include mental retardation." },
  "dishonestly": { source: "Section 2(7), BNS 2023",
    text: "Doing an act with the intention of causing wrongful gain to one person, or wrongful loss to another person." },
  "fraudulently": { source: "Section 2(9), BNS 2023",
    text: "A person does a thing 'fraudulently' if it is done with intent to defraud — and not otherwise." },
  "voluntarily": { source: "Section 2(33), BNS 2023",
    text: "A person causes an effect 'voluntarily' when they cause it by means they intended, or by means which, at the time, they knew or had reason to believe were likely to cause it. Intent to cause the exact effect isn't required — foreseeing it as likely is enough." },
  "wrongful gain": { source: "Section 2(36), BNS 2023",
    text: "Gain, by unlawful means, of property to which the person gaining it is not legally entitled." },
  "wrongful loss": { source: "Section 2(37), BNS 2023",
    text: "The loss, by unlawful means, of property to which the person losing it is legally entitled." },
  "public servant": { source: "Section 2(28), BNS 2023",
    text: "A long, specific list — commissioned armed-forces officers, judges, government officers who investigate offences or handle government property, election officials, and anyone in government service or pay for a public duty, among others. It is a defined technical category, not just 'anyone who works for the government.'" },
  "harbour": { source: "Section 2(13), BNS 2023",
    text: "Includes supplying a person with shelter, food, drink, money, clothes, arms, ammunition, or transport, or otherwise assisting a person to evade apprehension." },
  "counterfeit": { source: "Section 2(4), BNS 2023",
    text: "A person 'counterfeits' who causes one thing to resemble another, intending to practise deception by that resemblance, or knowing deception is likely. The imitation need not be exact." },
  "valuable security": { source: "Section 2(31), BNS 2023",
    text: "A document that is, or purports to be, one by which a legal right is created, extended, transferred, restricted, extinguished, or released, or by which a person acknowledges a legal liability." },
  "document": { source: "Section 2(8), BNS 2023",
    text: "Any matter expressed or described on any substance by letters, figures, or marks, intended to be used (or usable) as evidence of that matter — e.g. a contract, a cheque, a power-of-attorney, a map." },
  "child": { source: "Section 2(3), BNS 2023",
    text: "Any person below the age of eighteen years." },
  "animal": { source: "Section 2(2), BNS 2023",
    text: "Any living creature other than a human being." },
};

const SECTION_MAP = Object.fromEntries(SECTIONS.map((s) => [s.id, s]));
const DEF_KEYS = Object.keys(DEFINITIONS).sort((a, b) => b.length - a.length);
const DEF_REGEX = new RegExp(`(${DEF_KEYS.join("|")})`, "gi");

function chapterOf(section) {
  return CHAPTERS.find((ch) => ch.id === CATEGORIES.find((cat) => cat.id === section.category)?.chapter);
}

// Strips an act-namespace prefix (e.g. "SRA-14A" -> "14A") for compact display;
// plain numeric ids (BNS) pass through unchanged since they have no "-" prefix.
function sectionNumber(id) {
  const s = String(id);
  const dash = s.indexOf("-");
  return dash === -1 ? s : s.slice(dash + 1);
}

// Coverage stats derived from CHAPTERS/SECTIONS so the header/footer never need manual updates.
// Works for any act id — used for BNS today and any future act (SRA, BNSS, ...) added to ACTS.
function actStats(actId) {
  const chapters = CHAPTERS.filter((c) => c.act === actId);
  const numericMax = Math.max(0, ...chapters.flatMap((c) => c.range.split(/[–-]/).map(Number)).filter((n) => !isNaN(n)));
  const sections = SECTIONS.filter((s) => chapterOf(s)?.act === actId);
  const liveChapterIds = [...new Set(sections.map((s) => chapterOf(s)?.id))];
  return {
    chapters,
    totalSections: Math.max(numericMax, sections.length),
    liveSectionCount: sections.length,
    liveChapterCount: liveChapterIds.length,
    remainingChapters: chapters.filter((c) => !liveChapterIds.includes(c.id)),
  };
}

const BNS_CHAPTERS = CHAPTERS.filter((c) => c.act === "BNS");
const BNS_TOTAL_SECTIONS = actStats("BNS").totalSections;
const BNS_LIVE_SECTION_COUNT = actStats("BNS").liveSectionCount;
const BNS_LIVE_CHAPTER_COUNT = actStats("BNS").liveChapterCount;
const BNS_REMAINING_CHAPTERS = actStats("BNS").remainingChapters;

/* ------------------------------------------------------------------ */

function renderWithDefs(text, onOpenDef) {
  const parts = text.split(DEF_REGEX);
  return parts.map((part, i) => {
    const key = part.toLowerCase();
    if (DEFINITIONS[key]) {
      return (
        <button key={i} className="defterm" onClick={() => onOpenDef(key)}>
          {part}
        </button>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export default function BareActNavigator() {
  const [selectedAct, setSelectedAct] = useState("BNS");
  const [selectedId, setSelectedId] = useState(14);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState(null); // { type: 'section'|'def', id }
  const [noteDraft, setNoteDraft] = useState("");
  const [noteStatus, setNoteStatus] = useState("idle"); // idle | loading | saving | saved | error
  const mainRef = useRef(null);

  const currentActMeta = ACTS.find((a) => a.id === selectedAct);
  const currentActStats = useMemo(() => actStats(selectedAct), [selectedAct]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 880px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const section = SECTION_MAP[selectedId];

  // The reading pane's own scroll container can be `.main`, or — on the current layout,
  // where `.app` merely sets a min-height — the document itself. Reset both so the top of
  // the newly-selected section is always what the reader sees, regardless of which scrolls.
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [selectedId]);

  const [noteError, setNoteError] = useState("");
  const storageAvailable = typeof window !== "undefined" && !!window.localStorage;

  useEffect(() => {
    let cancelled = false;
    setNoteError("");
    if (!storageAvailable) {
      setNoteStatus("unavailable");
      return;
    }
    setNoteStatus("loading");
    (async () => {
      try {
        const res = await storage.get(`bns-note-${selectedId}`);
        if (!cancelled) {
          setNoteDraft(res && typeof res.value === "string" ? res.value : "");
          setNoteStatus("idle");
        }
      } catch (e) {
        // A missing key throws here — that just means no note yet, not a real error.
        if (!cancelled) {
          setNoteDraft("");
          setNoteStatus("idle");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [selectedId, storageAvailable]);

  async function saveNote() {
    if (!storageAvailable) {
      setNoteStatus("unavailable");
      return;
    }
    setNoteStatus("saving");
    setNoteError("");
    try {
      const result = await storage.set(`bns-note-${selectedId}`, noteDraft);
      if (!result) throw new Error("Storage returned no confirmation — the save may not have persisted.");
      setNoteStatus("saved");
      setTimeout(() => setNoteStatus((s) => (s === "saved" ? "idle" : s)), 1800);
    } catch (e) {
      setNoteStatus("error");
      setNoteError((e && e.message) || "Unknown error while saving.");
    }
  }

  function exportSection() {
    const s = section;
    const act = ACTS.find((a) => a.id === chapterOf(s)?.act);
    const lines = [
      `${act?.label.toUpperCase() || ""} — ${chapterOf(s)?.label || ""}`,
      `Section ${sectionNumber(s.id)}. ${s.title}${s.ipc ? `  (≈ IPC §${s.ipc})` : ""}`,
      "",
      s.text,
      "",
    ];
    if (s.ingredients) lines.push("ESSENTIAL INGREDIENTS", ...s.ingredients.map((i) => `- ${i}`), "");
    if (s.provisos) lines.push("PROVIDED THAT (exceptions):", ...s.provisos.map((p) => `- ${p}`), "");
    if (s.explanations) lines.push("EXPLANATION:", ...s.explanations, "");
    if (s.illustrations && s.illustrations.length) lines.push("ILLUSTRATIONS:", ...s.illustrations.map((il, i) => `${i + 1}. ${il}`), "");
    if (s.cases && s.cases.length) {
      lines.push("LANDMARK PRECEDENT:");
      s.cases.forEach((c) => {
        lines.push(`- ${c.name}, ${c.cite} (${c.year}): ${c.ratio}${c.url ? " " + c.url : ""}`);
        if (c.decidedUnder) lines.push(`  (Decided under ${c.decidedUnder}, pre-BSA)`);
      });
      lines.push("");
    }
    if (noteDraft && noteDraft.trim()) lines.push("MY NOTES:", noteDraft, "");
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${act?.id || "Section"}-Section-${sectionNumber(s.id)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const actSections = useMemo(() => {
    return SECTIONS.filter((s) => {
      const cat = CATEGORIES.find((c) => c.id === s.category);
      const chap = CHAPTERS.find((ch) => ch.id === cat?.chapter);
      return chap?.act === selectedAct;
    });
  }, [selectedAct]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actSections;
    return actSections.filter((s) => {
      const chap = CHAPTERS.find((ch) => ch.id === CATEGORIES.find((c) => c.id === s.category)?.chapter);
      return (
        String(s.id).includes(q) ||
        s.title.toLowerCase().includes(q) ||
        String(s.ipc || "").toLowerCase().includes(q) ||
        (s.text && s.text.toLowerCase().includes(q)) ||
        (s.simpleExplanation && s.simpleExplanation.toLowerCase().includes(q)) ||
        (s.punishment && s.punishment.toLowerCase().includes(q)) ||
        (chap && chap.label.toLowerCase().includes(q))
      );
    });
  }, [query, actSections]);

  function goTo(id) {
    setSelectedId(id);
    setDrawer(null);
    if (!isDesktop) setSidebarOpen(false);
  }

  function switchAct(actId) {
    setSelectedAct(actId);
    const firstSection = SECTIONS.find((s) => {
      const cat = CATEGORIES.find((c) => c.id === s.category);
      const chap = CHAPTERS.find((ch) => ch.id === cat?.chapter);
      return chap?.act === actId;
    });
    if (firstSection) setSelectedId(firstSection.id);
    setDrawer(null);
    if (!isDesktop) setSidebarOpen(false);
  }

  return (
    <div className="app">
      <style>{`
        :root {
          --ink: #211b16;
          --ink-soft: #4a4038;
          --parchment: #f6f1e6;
          --parchment-deep: #efe7d5;
          --oxblood: #7c2233;
          --oxblood-deep: #591825;
          --gold: #a5813c;
          --line: #ddd0b3;
        }
        * { box-sizing: border-box; }
        .app {
          font-family: Georgia, 'Iowan Old Style', 'Palatino Linotype', serif;
          color: var(--ink);
          background: var(--parchment);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .topbar {
          background: var(--ink);
          color: var(--parchment);
          padding: 14px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 3px double var(--gold);
        }
        .topbar .menu-btn {
          display: none;
          background: none; border: 1px solid rgba(246,241,230,0.35);
          color: var(--parchment); border-radius: 6px; padding: 6px;
          cursor: pointer;
        }
        .topbar-titles { flex: 1; }
        .eyebrow {
          font-family: -apple-system, 'Segoe UI', sans-serif;
          font-size: 10.5px; letter-spacing: 2.5px; text-transform: uppercase;
          color: var(--gold); margin: 0 0 2px;
        }
        .topbar h1 {
          margin: 0; font-size: 17px; font-weight: 600; letter-spacing: 0.5px;
        }
        .topbar .sub {
          font-family: -apple-system, 'Segoe UI', sans-serif;
          font-size: 11.5px; color: rgba(246,241,230,0.65); margin-top: 2px;
        }
        .body-wrap { flex: 1; display: flex; min-height: 0; position: relative; }

        .thread {
          width: 14px; flex-shrink: 0;
          background-image: repeating-linear-gradient(
            115deg, var(--oxblood) 0px, var(--oxblood) 2px,
            transparent 2px, transparent 9px
          );
          opacity: 0.55;
        }

        .sidebar {
          width: 300px; flex-shrink: 0; background: var(--parchment-deep);
          border-right: 1px solid var(--line);
          overflow-y: auto; padding: 14px 12px 40px;
        }
        .lib-label {
          font-family: -apple-system, 'Segoe UI', sans-serif;
          font-size: 10.5px; letter-spacing: 1.6px; text-transform: uppercase;
          color: var(--gold); font-weight: 800; margin: 0 6px 8px;
        }
        .act-list { display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px; }
        .act-btn {
          display: flex; align-items: center; justify-content: space-between;
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 13px; font-weight: 600;
          background: none; border: none; text-align: left; padding: 8px 10px; border-radius: 7px;
          cursor: pointer; color: var(--ink);
        }
        .act-btn.active { background: var(--oxblood); color: var(--parchment); }
        .act-btn.disabled { color: var(--ink-soft); cursor: default; opacity: 0.65; }
        .soon-badge {
          font-size: 9.5px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
          background: var(--parchment); border: 1px solid var(--line); border-radius: 10px;
          padding: 1px 7px; color: var(--ink-soft);
        }
        .search-box {
          display: flex; align-items: center; gap: 6px;
          background: var(--parchment); border: 1px solid var(--line);
          border-radius: 8px; padding: 7px 10px; margin-bottom: 14px;
        }
        .search-box input {
          border: none; background: none; outline: none; flex: 1;
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 13.5px;
          color: var(--ink);
        }
        .cat-label {
          font-family: -apple-system, 'Segoe UI', sans-serif;
          font-size: 10.5px; letter-spacing: 1.6px; text-transform: uppercase;
          color: var(--oxblood-deep); font-weight: 700;
          margin: 18px 6px 6px;
        }
        .chapter-heading {
          font-family: -apple-system, 'Segoe UI', sans-serif;
          font-size: 12.5px; font-weight: 800; color: var(--ink);
          border-top: 2px solid var(--oxblood); padding-top: 10px; margin-top: 18px;
        }
        .chapter-heading:first-child { border-top: none; margin-top: 0; padding-top: 0; }
        .cat-range {
          font-weight: 400; color: var(--ink-soft); letter-spacing: 0;
          text-transform: none; font-size: 10.5px;
        }
        .sec-btn {
          display: flex; align-items: baseline; gap: 9px; width: 100%;
          text-align: left; background: none; border: none; cursor: pointer;
          padding: 7px 8px; border-radius: 7px; margin-bottom: 1px;
          font-family: -apple-system, 'Segoe UI', sans-serif;
        }
        .sec-btn:hover { background: rgba(124,34,51,0.07); }
        .sec-btn.active { background: var(--oxblood); }
        .sec-btn.active .sec-num, .sec-btn.active .sec-title { color: var(--parchment); }
        .sec-num {
          font-family: Georgia, serif; font-weight: 700; font-size: 13px;
          color: var(--oxblood); min-width: 20px;
        }
        .sec-title { font-size: 12.5px; color: var(--ink-soft); line-height: 1.3; }

        .main {
          flex: 1; overflow-y: auto; padding: 26px 30px 80px;
          min-width: 0;
        }
        .breadcrumb {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 11.5px;
          color: var(--ink-soft); margin-bottom: 14px;
        }
        .breadcrumb span { margin: 0 6px; color: var(--gold); }
        .meta-chips { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
        .meta-chip {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 11px; font-weight: 700;
          background: var(--parchment-deep); border: 1px solid var(--line); color: var(--ink-soft);
          border-radius: 20px; padding: 4px 11px;
        }
        .meta-chip.gold { background: rgba(165,129,60,0.15); border-color: var(--gold); color: var(--oxblood-deep); }
        .export-btn {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 12px; font-weight: 700;
          background: none; border: 1.5px solid var(--oxblood); color: var(--oxblood);
          border-radius: 7px; padding: 6px 13px; cursor: pointer; margin-bottom: 20px;
        }
        .export-btn:hover { background: rgba(124,34,51,0.08); }
        .ingredients-box {
          background: rgba(37,99,80,0.06); border: 1px solid #8ed7bc; border-radius: 10px;
          padding: 14px 16px; margin-bottom: 20px;
        }
        .ingredients-title {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 11px; font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase; color: #0d6b4f; margin-bottom: 8px;
        }
        .ingredients-box ul { margin: 0; padding-left: 20px; }
        .ingredients-box li { font-size: 14px; line-height: 1.6; margin-bottom: 4px; }
        .plain-box {
          background: rgba(37,99,235,0.06); border: 1px solid #9bb9ff; border-radius: 10px;
          padding: 14px 16px; margin-bottom: 16px;
        }
        .plain-title {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 11px; font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase; color: #2545b8; margin-bottom: 6px;
        }
        .plain-box p { font-size: 14.5px; line-height: 1.65; margin: 0; color: var(--ink); }
        .punishment-box {
          background: rgba(165,129,60,0.1); border: 1px solid var(--gold); border-radius: 10px;
          padding: 12px 16px; margin-bottom: 20px;
        }
        .punishment-title {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 11px; font-weight: 800;
          letter-spacing: 1px; text-transform: uppercase; color: var(--oxblood-deep); margin-bottom: 5px;
        }
        .punishment-box p { font-size: 14px; line-height: 1.55; margin: 0; font-weight: 600; color: var(--ink); }
        .stamp-row { display: flex; align-items: center; gap: 14px; margin-bottom: 6px; }
        .stamp {
          width: 46px; height: 46px; border-radius: 50%;
          border: 2px solid var(--oxblood); color: var(--oxblood);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 17px; flex-shrink: 0;
        }
        .ipc-tag {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 11px;
          color: var(--ink-soft); background: var(--parchment-deep);
          border: 1px solid var(--line); border-radius: 20px; padding: 3px 10px;
          display: inline-block;
        }
        .sec-heading { font-size: 22px; font-weight: 700; line-height: 1.3; margin: 12px 0 18px; }
        .body-text { font-size: 16px; line-height: 1.75; color: var(--ink); margin-bottom: 18px; }
        .defterm {
          background: none; border: none; padding: 0; cursor: pointer;
          color: var(--oxblood); text-decoration: underline dotted;
          text-underline-offset: 3px; font: inherit; font-weight: 600;
        }
        .block-label {
          font-family: -apple-system, 'Segoe UI', sans-serif;
          font-size: 10.5px; letter-spacing: 1.6px; text-transform: uppercase;
          color: var(--gold); font-weight: 700; margin: 22px 0 8px;
        }
        .proviso-list, .expl-list { margin: 0 0 18px; padding-left: 0; list-style: none; }
        .proviso-list li, .expl-list li {
          font-size: 14.5px; line-height: 1.6; padding: 8px 12px;
          background: var(--parchment-deep); border-left: 3px solid var(--gold);
          margin-bottom: 6px; border-radius: 0 6px 6px 0;
        }
        .illus-card {
          font-size: 14.5px; line-height: 1.65; font-style: italic;
          color: var(--ink-soft); padding: 10px 14px; border: 1px dashed var(--line);
          border-radius: 8px; margin-bottom: 8px; background: rgba(255,255,255,0.35);
        }
        .chip-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 8px 0 20px; }
        .chip {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 12.5px;
          font-weight: 600; color: var(--oxblood); background: rgba(124,34,51,0.08);
          border: 1px solid rgba(124,34,51,0.25); border-radius: 20px;
          padding: 5px 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
        }
        .chip:hover { background: rgba(124,34,51,0.15); }
        .case-card {
          border: 1px solid var(--gold); background: rgba(165,129,60,0.08);
          border-radius: 10px; padding: 14px 16px; margin-bottom: 10px;
        }
        .case-name { font-weight: 700; font-style: italic; font-size: 15px; }
        .case-cite {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 11.5px;
          color: var(--ink-soft); margin: 2px 0 8px;
        }
        .case-ratio { font-size: 14px; line-height: 1.6; }
        .case-continuity {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 11.5px;
          color: var(--ink-soft); font-style: italic; margin-top: 8px;
        }
        .case-continuity summary {
          cursor: pointer; display: inline; color: var(--oxblood); font-style: normal;
          font-weight: 600; margin-left: 4px;
        }
        .case-continuity p { margin: 4px 0 0; font-style: normal; }
        .judgment-link {
          display: inline-block; margin-top: 10px; font-family: -apple-system, 'Segoe UI', sans-serif;
          font-size: 12px; font-weight: 700; color: var(--oxblood); text-decoration: none;
          border-bottom: 1.5px solid var(--oxblood); padding-bottom: 1px;
        }
        .judgment-link:hover { opacity: 0.75; }
        .notes-box {
          margin-top: 26px; border-top: 2px double var(--line); padding-top: 16px;
        }
        .notes-box textarea {
          width: 100%; min-height: 90px; font-family: -apple-system, 'Segoe UI', sans-serif;
          font-size: 13.5px; border: 1px solid var(--line); border-radius: 8px;
          padding: 10px; resize: vertical; background: white; color: var(--ink);
        }
        .notes-actions { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
        .save-btn {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 12.5px;
          font-weight: 700; background: var(--oxblood); color: var(--parchment);
          border: none; border-radius: 7px; padding: 7px 16px; cursor: pointer;
        }
        .save-btn:disabled { opacity: 0.6; cursor: default; }
        .status-text { font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 11.5px; color: var(--ink-soft); }
        .disclaimer {
          font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 11px;
          color: var(--ink-soft); border-top: 1px solid var(--line); margin-top: 30px;
          padding-top: 12px; line-height: 1.5;
        }

        .overlay {
          position: fixed; inset: 0; background: rgba(33,27,22,0.45);
          z-index: 40;
        }
        .drawer {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 50;
          background: var(--parchment); border-top: 3px double var(--gold);
          border-radius: 16px 16px 0 0; max-height: 65vh; overflow-y: auto;
          padding: 18px 20px 26px; box-shadow: 0 -8px 30px rgba(0,0,0,0.25);
        }
        .drawer-close {
          position: absolute; top: 12px; right: 14px; background: none; border: none;
          cursor: pointer; color: var(--ink-soft);
        }
        .side-mobile-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 82%; max-width: 320px;
          z-index: 50; background: var(--parchment-deep); overflow-y: auto;
          padding: 14px 12px 40px; box-shadow: 6px 0 24px rgba(0,0,0,0.3);
        }

        @media (max-width: 879px) {
          .topbar .menu-btn { display: inline-flex; }
          .sidebar { display: none; }
          .thread { display: none; }
          .main { padding: 20px 16px 70px; }
        }
        @media (min-width: 880px) {
          .drawer { left: auto; right: 40px; bottom: 40px; width: 380px;
            border-radius: 14px; max-height: 60vh; }
        }
      `}</style>

      <div className="topbar">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)} aria-label="Open section list">
          <Menu size={18} />
        </button>
        <div className="topbar-titles">
          <p className="eyebrow">Bare Act &amp; Statute Navigator · Prototype</p>
          <h1>{currentActMeta?.label}</h1>
          <div className="sub">{currentActStats.liveChapterCount} chapters live · {currentActStats.liveSectionCount} of {currentActStats.totalSections} {currentActMeta?.short} sections</div>
        </div>
        <Scale size={22} color="#a5813c" style={{ flexShrink: 0 }} />
      </div>

      <div className="body-wrap">
        {isDesktop && (
          <nav className="sidebar">
            <SidebarContents query={query} setQuery={setQuery} filtered={filtered} selectedId={selectedId} goTo={goTo} selectedAct={selectedAct} setSelectedAct={switchAct} />
          </nav>
        )}
        {!isDesktop && sidebarOpen && (
          <>
            <div className="overlay" onClick={() => setSidebarOpen(false)} />
            <nav className="side-mobile-drawer">
              <button className="drawer-close" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
              <SidebarContents query={query} setQuery={setQuery} filtered={filtered} selectedId={selectedId} goTo={goTo} selectedAct={selectedAct} setSelectedAct={switchAct} />
            </nav>
          </>
        )}

        {isDesktop && <div className="thread" />}

        <main className="main" ref={mainRef}>
          <div className="breadcrumb">
            {ACTS.find((a) => a.id === chapterOf(section)?.act)?.label} <span>›</span> {chapterOf(section)?.label} <span>›</span> Section {sectionNumber(section.id)}
          </div>
          <div className="stamp-row">
            <div className="stamp">{sectionNumber(section.id)}</div>
            {chapterOf(section)?.act === "BNS" && (
              <span className="ipc-tag">{section.ipc ? `≈ IPC Section ${section.ipc}` : "New provision — no direct IPC equivalent"}</span>
            )}
          </div>
          <h2 className="sec-heading">{section.title}</h2>

          <div className="meta-chips">
            <span className="meta-chip">{CATEGORIES.find((c) => c.id === section.category)?.label}</span>
            {section.crossRefs && section.crossRefs.length > 0 && (
              <span className="meta-chip">{section.crossRefs.length} related provision{section.crossRefs.length > 1 ? "s" : ""}</span>
            )}
            {section.cases && section.cases.length > 0 && (
              <span className="meta-chip gold">Landmark case available</span>
            )}
          </div>

          <button className="export-btn" onClick={exportSection}>Export section as text ↓</button>

          <div className="block-label">Official Bare Act Text</div>
          <p className="body-text">{renderWithDefs(section.text, (key) => setDrawer({ type: "def", id: key }))}</p>

          {section.simpleExplanation && (
            <div className="plain-box">
              <div className="plain-title">In Plain English</div>
              <p>{section.simpleExplanation}</p>
            </div>
          )}

          {section.ingredients && (
            <div className="ingredients-box">
              <div className="ingredients-title">Essential Ingredients</div>
              <ul>
                {section.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
              </ul>
            </div>
          )}

          {section.punishment && (
            <div className="punishment-box">
              <div className="punishment-title">Punishment</div>
              <p>{section.punishment}</p>
            </div>
          )}

          {section.provisos && (
            <>
              <div className="block-label">Provided that this exception does not extend to —</div>
              <ul className="proviso-list">
                {section.provisos.map((p, i) => <li key={i}>{renderWithDefs(p, (key) => setDrawer({ type: "def", id: key }))}</li>)}
              </ul>
            </>
          )}

          {section.explanations && (
            <>
              <div className="block-label">Explanation</div>
              <ul className="expl-list">
                {section.explanations.map((p, i) => <li key={i}>{renderWithDefs(p, (key) => setDrawer({ type: "def", id: key }))}</li>)}
              </ul>
            </>
          )}

          {section.illustrations && section.illustrations.length > 0 && (
            <>
              <div className="block-label">Illustrations</div>
              {section.illustrations.map((il, i) => <div className="illus-card" key={i}>{il}</div>)}
            </>
          )}

          {section.crossRefs && section.crossRefs.length > 0 && (
            <>
              <div className="block-label">Related Sections</div>
              <div className="chip-row">
                {section.crossRefs.map((rid) => (
                  <button key={rid} className="chip" onClick={() => setDrawer({ type: "section", id: rid })}>
                    <Link2 size={12} /> §{sectionNumber(rid)} · {SECTION_MAP[rid].title.length > 34 ? SECTION_MAP[rid].title.slice(0, 34) + "…" : SECTION_MAP[rid].title}
                  </button>
                ))}
              </div>
            </>
          )}

          {section.cases && section.cases.length > 0 && (
            <>
              <div className="block-label"><BookMarked size={12} style={{ verticalAlign: -2 }} /> Landmark Precedent</div>
              {section.cases.map((c, i) => (
                <div className="case-card" key={i}>
                  <div className="case-name">{c.name}</div>
                  <div className="case-cite">{c.cite} · {c.year}</div>
                  <div className="case-ratio">{c.ratio}</div>
                  {c.decidedUnder && (
                    <div className="case-continuity">
                      Decided under {c.decidedUnder} (pre-BSA)
                      {c.continuityNote && (
                        <details>
                          <summary>why this still applies</summary>
                          <p>{c.continuityNote}</p>
                        </details>
                      )}
                    </div>
                  )}
                  {c.url && (
                    <a className="judgment-link" href={c.url} target="_blank" rel="noopener noreferrer">
                      Read full judgment ↗
                    </a>
                  )}
                </div>
              ))}
            </>
          )}

          <div className="notes-box">
            <div className="block-label"><StickyNote size={12} style={{ verticalAlign: -2 }} /> Your Notes on Section {sectionNumber(section.id)}</div>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Jot exam points, mnemonics, or a case you want to add here…"
            />
            <div className="notes-actions">
              <button className="save-btn" onClick={saveNote} disabled={noteStatus === "saving" || !storageAvailable}>
                {noteStatus === "saving" ? "Saving…" : "Save note"}
              </button>
              {noteStatus === "saved" && <span className="status-text">Saved ✓</span>}
              {noteStatus === "loading" && <span className="status-text">Loading…</span>}
              {noteStatus === "unavailable" && (
                <span className="status-text">Storage isn't available in this preview — notes won't persist here.</span>
              )}
            </div>
            {noteStatus === "error" && (
              <div className="status-text" style={{ color: "#7c2233", marginTop: 6 }}>
                Couldn't save: {noteError}
              </div>
            )}
          </div>

          <p className="disclaimer">
            Content last verified against source: <strong>{CONTENT_LAST_VERIFIED}</strong>. Live scope: {currentActStats.liveSectionCount} of {currentActStats.totalSections} {currentActMeta?.short} sections
            across {currentActStats.liveChapterCount} of {currentActStats.chapters.length} chapters.
            {currentActStats.remainingChapters.length > 0 && ` Remaining: Chapters ${currentActStats.remainingChapters.map((c) => c.id).join(", ")}.`}
            {" "}Landmark cases are curated only for a deliberately small set of sections as a demonstration of the accuracy bar —
            statute text takes priority, cases are being enriched progressively. Statutes and case law can change after this
            date — if you know of an amendment or a newer ruling on a section here, flag it so it can be re-verified.
          </p>
        </main>
      </div>

      {drawer && drawer.type === "section" && (
        <>
          <div className="overlay" onClick={() => setDrawer(null)} />
          <div className="drawer">
            <button className="drawer-close" onClick={() => setDrawer(null)}><X size={18} /></button>
            <div className="ipc-tag" style={{ marginBottom: 10 }}>Quick Preview</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18 }}>§{sectionNumber(drawer.id)}. {SECTION_MAP[drawer.id].title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.6 }}>{SECTION_MAP[drawer.id].text}</p>
            <button className="save-btn" onClick={() => goTo(drawer.id)}>Open full section →</button>
          </div>
        </>
      )}

      {drawer && drawer.type === "def" && (
        <>
          <div className="overlay" onClick={() => setDrawer(null)} />
          <div className="drawer">
            <button className="drawer-close" onClick={() => setDrawer(null)}><X size={18} /></button>
            <div className="ipc-tag" style={{ marginBottom: 10 }}>Statutory Definition</div>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, textTransform: "capitalize" }}>{drawer.id}</h3>
            <div className="case-cite" style={{ marginBottom: 10 }}>{DEFINITIONS[drawer.id].source}</div>
            <p style={{ fontSize: 14.5, lineHeight: 1.6 }}>{DEFINITIONS[drawer.id].text}</p>
          </div>
        </>
      )}
    </div>
  );
}

function SidebarContents({ query, setQuery, filtered, selectedId, goTo, selectedAct, setSelectedAct }) {
  const chapterGroups = CHAPTERS.filter((ch) => ch.act === selectedAct).map((ch) => {
    const cats = CATEGORIES.filter((c) => c.chapter === ch.id).map((cat) => ({
      ...cat,
      items: filtered.filter((s) => s.category === cat.id),
    })).filter((c) => c.items.length > 0);
    return { ...ch, cats };
  }).filter((ch) => ch.cats.length > 0);

  return (
    <>
      <div className="lib-label">Library</div>
      <div className="act-list">
        {ACTS.map((a) => (
          <button
            key={a.id}
            className={"act-btn" + (a.id === selectedAct ? " active" : "") + (a.status === "soon" ? " disabled" : "")}
            disabled={a.status === "soon"}
            onClick={() => a.status === "active" && setSelectedAct(a.id)}
          >
            {a.short}
            {a.status === "soon" && <span className="soon-badge">soon</span>}
          </button>
        ))}
      </div>
      <div className="search-box">
        <span style={{ color: "#a5813c", fontSize: 16 }}>⌕</span>
        <input
          placeholder="Search section, number, IPC §…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {chapterGroups.map((ch) => (
        <div key={ch.id}>
          <div className="chapter-heading">{ch.label}</div>
          {ch.cats.map((cat) => (
            <div key={cat.id}>
              <div className="cat-label">{cat.label} <span className="cat-range">§§{cat.range}</span></div>
              {cat.items.map((s) => (
                <button
                  key={s.id}
                  className={"sec-btn" + (s.id === selectedId ? " active" : "")}
                  onClick={() => goTo(s.id)}
                >
                  <span className="sec-num">{sectionNumber(s.id)}</span>
                  <span className="sec-title">{s.title}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      ))}
      {chapterGroups.length === 0 && <div style={{ padding: 12, fontSize: 13, color: "#4a4038" }}>No sections match.</div>}
    </>
  );
}
