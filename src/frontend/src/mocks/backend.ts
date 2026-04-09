import type { backendInterface } from "../backend";
import { CardCategory, Milestone, ReviewQuality } from "../backend";

export const mockBackend: backendInterface = {
  createJournalEntry: async (input) => ({
    id: BigInt(1),
    title: input.title,
    body: input.body,
    tags: input.tags,
    caseRefs: input.caseRefs,
    theoryRefs: input.theoryRefs,
    createdAt: BigInt(Date.now()),
    updatedAt: BigInt(Date.now()),
  }),

  deleteJournalEntry: async (_id) => true,

  getCase: async (_id) => ({
    id: BigInt(1),
    name: "Ted Bundy",
    alias: "The Lady Killer",
    category: "Serial Homicide",
    year: BigInt(1974),
    summary:
      "Theodore Robert Bundy was an American serial killer who kidnapped, raped, and murdered numerous young women and girls during the 1970s.",
    dsmProfile: "Antisocial Personality Disorder, Narcissistic traits",
    theories: ["rational-choice", "psychodynamic"],
    severity: BigInt(10),
    notoriety: BigInt(10),
    quotes: [
      "I'm the most cold-hearted son of a bitch you'll ever meet.",
      "We serial killers are your sons, we are your husbands, we are everywhere.",
    ],
  }),

  getDueCards: async () => [
    {
      id: BigInt(1),
      question: "What is the central claim of Strain Theory?",
      answer:
        "When individuals cannot achieve culturally approved goals through legitimate means, they experience strain that may lead to deviant behavior.",
      hint: "Think about goals vs. means",
      category: CardCategory.Terms,
    },
    {
      id: BigInt(2),
      question: "Who developed Social Learning Theory?",
      answer:
        "Albert Bandura, later applied to criminology by Ronald Akers as Social Learning Theory of Crime.",
      hint: "Observation and imitation",
      category: CardCategory.Theorists,
    },
  ],

  getJournalEntry: async (_id) => ({
    id: BigInt(1),
    title: "Analysis of Bundy's Narcissistic Profile",
    body: "This entry explores the intersection of Bundy's documented narcissistic traits with Psychodynamic theory...",
    tags: ["narcissism", "psychodynamic", "bundy"],
    caseRefs: [BigInt(1)],
    theoryRefs: ["psychodynamic"],
    createdAt: BigInt(Date.now() - 86400000),
    updatedAt: BigInt(Date.now()),
  }),

  getJournalMilestone: async () => Milestone.Associate,

  getSessionSummary: async () => ({
    retentionPct: BigInt(72),
    totalCards: BigInt(48),
    nextReviewDates: [BigInt(Date.now() + 86400000)],
    dueCount: BigInt(7),
    cardsReviewed: BigInt(12),
  }),

  getTheory: async (_id) => ({
    id: "strain",
    name: "Strain Theory",
    description:
      "Robert Merton's theory positing that social structures may pressure citizens to commit crimes.",
    keyTheorists: ["Robert Merton", "Robert Agnew"],
    keywords: ["anomie", "strain", "goals", "means", "deviance"],
  }),

  listCards: async () => [
    {
      id: BigInt(1),
      question: "What is the central claim of Strain Theory?",
      answer:
        "When individuals cannot achieve culturally approved goals through legitimate means, they experience strain that may lead to deviant behavior.",
      hint: "Think about goals vs. means",
      category: CardCategory.Terms,
    },
    {
      id: BigInt(2),
      question: "Who developed Social Learning Theory?",
      answer:
        "Albert Bandura, later applied to criminology by Ronald Akers as Social Learning Theory of Crime.",
      hint: "Observation and imitation",
      category: CardCategory.Theorists,
    },
    {
      id: BigInt(3),
      question: "Define 'Psychopathy' as distinct from ASPD",
      answer:
        "Psychopathy is a personality construct defined by affective, interpersonal, and behavioral features including callousness, lack of empathy, and manipulation — assessed via PCL-R.",
      hint: "PCL-R assessment",
      category: CardCategory.Disorders,
    },
    {
      id: BigInt(4),
      question: "What are the core tenets of Routine Activity Theory?",
      answer:
        "Crime occurs when a motivated offender, a suitable target, and the absence of a capable guardian converge in time and space.",
      hint: "Three-element convergence",
      category: CardCategory.Terms,
    },
  ],

  listCardsByCategory: async (category) => [
    {
      id: BigInt(1),
      question: `Sample question for ${category}`,
      answer: `Sample answer for ${category} category`,
      hint: "Sample hint",
      category: category,
    },
  ],

  listCases: async () => [
    {
      id: BigInt(1),
      name: "Ted Bundy",
      alias: "The Lady Killer",
      category: "Serial Homicide",
      year: BigInt(1974),
      summary:
        "Theodore Robert Bundy was an American serial killer who kidnapped, raped, and murdered numerous young women and girls during the 1970s. His case remains a landmark study in psychopathy and manipulation.",
      dsmProfile: "Antisocial Personality Disorder, Narcissistic Personality Disorder traits",
      theories: ["rational-choice", "psychodynamic", "social-learning"],
      severity: BigInt(10),
      notoriety: BigInt(10),
      quotes: ["We serial killers are your sons, we are your husbands, we are everywhere."],
    },
    {
      id: BigInt(2),
      name: "John Wayne Gacy",
      alias: "The Killer Clown",
      category: "Serial Homicide",
      year: BigInt(1972),
      summary:
        "John Wayne Gacy Jr. was an American serial killer who sexually assaulted and murdered at least 33 young men and boys. His case is a key study in compartmentalization and social masking.",
      dsmProfile: "Antisocial Personality Disorder, potential Borderline traits",
      theories: ["psychodynamic", "labeling"],
      severity: BigInt(10),
      notoriety: BigInt(9),
      quotes: [],
    },
    {
      id: BigInt(3),
      name: "Jeffrey Dahmer",
      alias: "The Milwaukee Cannibal",
      category: "Serial Homicide / Necrophilia",
      year: BigInt(1978),
      summary:
        "Jeffrey Lionel Dahmer was an American serial killer who committed the murder and dismemberment of 17 men and boys. His case examines severe paraphilic disorders and systemic failures.",
      dsmProfile: "Borderline Personality Disorder, Schizotypal traits, Necrophilia",
      theories: ["biosocial", "psychodynamic"],
      severity: BigInt(10),
      notoriety: BigInt(10),
      quotes: [],
    },
    {
      id: BigInt(4),
      name: "The Zodiac Killer",
      alias: "Zodiac",
      category: "Serial Homicide / Unsolved",
      year: BigInt(1968),
      summary:
        "An unidentified American serial killer who operated in Northern California in the late 1960s and early 1970s. The Zodiac's encrypted letters remain a subject of academic cryptographic and psychological study.",
      dsmProfile: "Speculative: Narcissistic Personality Disorder, Sadistic traits",
      theories: ["rational-choice", "routine-activity"],
      severity: BigInt(9),
      notoriety: BigInt(10),
      quotes: ["I like killing people because it is so much fun."],
    },
  ],

  listJournalEntries: async (_page, _pageSize) => ({
    page: BigInt(1),
    pageSize: BigInt(10),
    totalCount: BigInt(3),
    entries: [
      {
        id: BigInt(1),
        title: "Analysis of Bundy's Narcissistic Profile",
        body: "This entry explores the intersection of Bundy's documented narcissistic traits with Psychodynamic theory and how childhood trauma shaped a manipulative personality construct...",
        tags: ["narcissism", "psychodynamic", "bundy"],
        caseRefs: [BigInt(1)],
        theoryRefs: ["psychodynamic"],
        createdAt: BigInt(Date.now() - 86400000 * 3),
        updatedAt: BigInt(Date.now() - 86400000 * 2),
      },
      {
        id: BigInt(2),
        title: "Strain Theory Applied to White-Collar Crime",
        body: "Examining how General Strain Theory (Agnew, 1992) extends beyond traditional street crime to explain motivations in corporate fraud and embezzlement...",
        tags: ["strain-theory", "white-collar", "agnew"],
        caseRefs: [],
        theoryRefs: ["general-strain"],
        createdAt: BigInt(Date.now() - 86400000 * 7),
        updatedAt: BigInt(Date.now() - 86400000 * 6),
      },
      {
        id: BigInt(3),
        title: "Routine Activity Theory: Urban Crime Patterns",
        body: "A comparative analysis of how Felson and Cohen's Routine Activity Theory maps to contemporary urban crime distributions in metropolitan areas...",
        tags: ["routine-activity", "urban", "felson"],
        caseRefs: [],
        theoryRefs: ["routine-activity"],
        createdAt: BigInt(Date.now() - 86400000 * 14),
        updatedAt: BigInt(Date.now() - 86400000 * 14),
      },
    ],
  }),

  listTheories: async () => [
    {
      id: "strain",
      name: "Strain Theory",
      description:
        "Robert Merton's theory positing that social structures may pressure citizens to commit crimes when legitimate means to achieve goals are blocked.",
      keyTheorists: ["Robert Merton"],
      keywords: ["anomie", "strain", "goals", "means", "deviance"],
    },
    {
      id: "rational-choice",
      name: "Rational Choice Theory",
      description:
        "Criminals are rational actors who weigh costs and benefits before committing crimes. Offenders choose crime when expected benefits exceed expected costs.",
      keyTheorists: ["Gary Becker", "Ronald Clarke", "Derek Cornish"],
      keywords: ["rational", "cost-benefit", "deterrence", "choice"],
    },
    {
      id: "biosocial",
      name: "Biosocial Theory",
      description:
        "Crime results from the interaction between biological factors (genetics, neurochemistry) and social environment.",
      keyTheorists: ["Adrian Raine", "C. Ray Jeffery"],
      keywords: ["genetics", "neurochemistry", "biology", "environment"],
    },
    {
      id: "social-learning",
      name: "Social Learning Theory",
      description:
        "Criminal behavior is learned through observation, imitation, and reinforcement within social groups.",
      keyTheorists: ["Ronald Akers", "Albert Bandura"],
      keywords: ["learning", "imitation", "reinforcement", "peers"],
    },
    {
      id: "labeling",
      name: "Labeling Theory",
      description:
        "Being labeled as a criminal by society creates a self-fulfilling prophecy that leads to further criminal behavior.",
      keyTheorists: ["Howard Becker", "Edwin Lemert"],
      keywords: ["labeling", "stigma", "deviance", "identity"],
    },
    {
      id: "routine-activity",
      name: "Routine Activity Theory",
      description:
        "Crime occurs when a motivated offender, a suitable target, and the absence of a capable guardian converge in time and space.",
      keyTheorists: ["Marcus Felson", "Lawrence Cohen"],
      keywords: ["opportunity", "guardian", "target", "convergence"],
    },
    {
      id: "psychodynamic",
      name: "Psychodynamic Theory",
      description:
        "Criminal behavior stems from unconscious conflicts, early childhood trauma, and unresolved psychological tensions.",
      keyTheorists: ["Sigmund Freud", "August Aichhorn"],
      keywords: ["unconscious", "trauma", "childhood", "id", "superego"],
    },
    {
      id: "general-strain",
      name: "General Strain Theory",
      description:
        "An extension of Strain Theory that includes multiple types of strain beyond economic — including loss of valued stimuli and exposure to negative stimuli.",
      keyTheorists: ["Robert Agnew"],
      keywords: ["strain", "anger", "negative affect", "coping", "agnew"],
    },
  ],

  matchTheories: async (_scenario) => [
    {
      theoryId: "rational-choice",
      theoryName: "Rational Choice Theory",
      confidence: BigInt(87),
      explanation:
        "The described scenario strongly aligns with rational choice patterns: the offender demonstrates calculated decision-making, target selection based on vulnerability, and risk assessment prior to action.",
      matchedCaseIds: [BigInt(1), BigInt(4)],
    },
    {
      theoryId: "routine-activity",
      theoryName: "Routine Activity Theory",
      confidence: BigInt(74),
      explanation:
        "The convergence of a motivated offender with a suitable target in the absence of capable guardianship is evident in the described circumstances.",
      matchedCaseIds: [BigInt(4)],
    },
    {
      theoryId: "psychodynamic",
      theoryName: "Psychodynamic Theory",
      confidence: BigInt(62),
      explanation:
        "Behavioral patterns suggest unresolved psychological conflicts and potential early trauma exposure, consistent with psychodynamic explanations of criminal conduct.",
      matchedCaseIds: [BigInt(1), BigInt(2)],
    },
  ],

  reviewCard: async (_cardId, _quality) => undefined,

  searchCases: async (_name, _category, _yearFrom, _yearTo, _minSeverity) => [
    {
      id: BigInt(1),
      name: "Ted Bundy",
      alias: "The Lady Killer",
      category: "Serial Homicide",
      year: BigInt(1974),
      summary: "Theodore Robert Bundy was an American serial killer who kidnapped, raped, and murdered numerous young women and girls during the 1970s.",
      dsmProfile: "Antisocial Personality Disorder",
      theories: ["rational-choice", "psychodynamic"],
      severity: BigInt(10),
      notoriety: BigInt(10),
      quotes: [],
    },
  ],

  searchJournalEntries: async (_fromDate, _toDate, _tag, _keyword) => [
    {
      id: BigInt(1),
      title: "Analysis of Bundy's Narcissistic Profile",
      body: "This entry explores the intersection of Bundy's documented narcissistic traits with Psychodynamic theory...",
      tags: ["narcissism", "psychodynamic", "bundy"],
      caseRefs: [BigInt(1)],
      theoryRefs: ["psychodynamic"],
      createdAt: BigInt(Date.now() - 86400000 * 3),
      updatedAt: BigInt(Date.now() - 86400000 * 2),
    },
  ],

  updateJournalEntry: async (id, input) => ({
    id,
    title: input.title,
    body: input.body,
    tags: input.tags,
    caseRefs: input.caseRefs,
    theoryRefs: input.theoryRefs,
    createdAt: BigInt(Date.now() - 86400000),
    updatedAt: BigInt(Date.now()),
  }),
};
