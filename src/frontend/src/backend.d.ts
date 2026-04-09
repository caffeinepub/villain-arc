import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type CardId = bigint;
export type Timestamp = bigint;
export type CrimeCategory = string;
export type TheoryId = string;
export interface Theory {
    id: TheoryId;
    name: string;
    keyTheorists: Array<string>;
    description: string;
    keywords: Array<string>;
}
export type JournalEntryId = bigint;
export type CaseId = bigint;
export interface SessionSummary {
    retentionPct: bigint;
    totalCards: bigint;
    nextReviewDates: Array<Timestamp>;
    dueCount: bigint;
    cardsReviewed: bigint;
}
export interface JournalEntry {
    id: JournalEntryId;
    title: string;
    caseRefs: Array<CaseId>;
    body: string;
    createdAt: Timestamp;
    tags: Array<string>;
    updatedAt: Timestamp;
    theoryRefs: Array<TheoryId>;
}
export interface TheoryMatchResult {
    explanation: string;
    theoryId: TheoryId;
    matchedCaseIds: Array<CaseId>;
    confidence: bigint;
    theoryName: string;
}
export interface Flashcard {
    id: CardId;
    question: string;
    hint: string;
    answer: string;
    category: CardCategory;
}
export interface JournalEntryInput {
    title: string;
    caseRefs: Array<CaseId>;
    body: string;
    tags: Array<string>;
    theoryRefs: Array<TheoryId>;
}
export interface JournalPage {
    page: bigint;
    totalCount: bigint;
    pageSize: bigint;
    entries: Array<JournalEntry>;
}
export interface Case {
    id: CaseId;
    alias: string;
    name: string;
    year: bigint;
    theories: Array<TheoryId>;
    summary: string;
    notoriety: bigint;
    category: CrimeCategory;
    severity: bigint;
    quotes: Array<string>;
    dsmProfile: string;
}
export enum CardCategory {
    ResearchMethods = "ResearchMethods",
    Theorists = "Theorists",
    Disorders = "Disorders",
    Studies = "Studies",
    Terms = "Terms",
    Terminology = "Terminology",
    Cases = "Cases"
}
export enum Milestone {
    Licensure = "Licensure",
    Bachelor = "Bachelor",
    Associate = "Associate",
    Master = "Master"
}
export enum ReviewQuality {
    Known = "Known",
    NeedsReview = "NeedsReview"
}
export interface backendInterface {
    createJournalEntry(input: JournalEntryInput): Promise<JournalEntry>;
    deleteJournalEntry(id: JournalEntryId): Promise<boolean>;
    getCase(id: CaseId): Promise<Case | null>;
    getDueCards(): Promise<Array<Flashcard>>;
    getJournalEntry(id: JournalEntryId): Promise<JournalEntry | null>;
    getJournalMilestone(): Promise<Milestone>;
    getSessionSummary(): Promise<SessionSummary>;
    getTheory(id: TheoryId): Promise<Theory | null>;
    listCards(): Promise<Array<Flashcard>>;
    listCardsByCategory(category: CardCategory): Promise<Array<Flashcard>>;
    listCases(): Promise<Array<Case>>;
    listJournalEntries(page: bigint, pageSize: bigint): Promise<JournalPage>;
    listTheories(): Promise<Array<Theory>>;
    matchTheories(scenario: string): Promise<Array<TheoryMatchResult>>;
    reviewCard(cardId: CardId, quality: ReviewQuality): Promise<void>;
    searchCases(name: string | null, category: string | null, yearFrom: bigint | null, yearTo: bigint | null, minSeverity: bigint | null): Promise<Array<Case>>;
    searchJournalEntries(fromDate: Timestamp | null, toDate: Timestamp | null, tag: string | null, keyword: string | null): Promise<Array<JournalEntry>>;
    updateJournalEntry(id: JournalEntryId, input: JournalEntryInput): Promise<JournalEntry | null>;
}
