import { useCallback, useState } from "react";
import { CardCategory, ReviewQuality } from "../backend";
import { Layout } from "../components/Layout";
import { LoadingBar } from "../components/LoadingBar";
import { OutlinedButton } from "../components/OutlinedButton";
import { PageHeader } from "../components/PageHeader";
import {
  useGetDueCards,
  useGetSessionSummary,
  useListCards,
  useListCardsByCategory,
  useReviewCard,
} from "../hooks/useQueries";
import type { Flashcard } from "../types";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "due" | "fresh";

interface CategoryTab {
  label: string;
  value: CardCategory | "All";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS: CategoryTab[] = [
  { label: "All", value: "All" },
  { label: "Terms", value: CardCategory.Terms },
  { label: "Theorists", value: CardCategory.Theorists },
  { label: "Studies", value: CardCategory.Studies },
  { label: "Disorders", value: CardCategory.Disorders },
  { label: "Cases", value: CardCategory.Cases },
  { label: "Research Methods", value: CardCategory.ResearchMethods },
  { label: "Terminology", value: CardCategory.Terminology },
];

// ─── Session Summary ──────────────────────────────────────────────────────────

function SessionSummaryView({ onRestart }: { onRestart: () => void }) {
  const { data: summary } = useGetSessionSummary();

  const formatDate = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="flex-1 flex items-center justify-center px-6 fade-in py-20"
      data-ocid="session-summary"
    >
      <div className="max-w-lg w-full">
        <div className="h-px bg-border mb-12" />
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-4">
          Session Complete
        </p>
        <h2 className="font-display italic text-5xl text-foreground mb-10 leading-none">
          Review archived.
        </h2>
        <div className="h-px bg-border mb-10" />

        {summary && (
          <div className="grid grid-cols-3 gap-0 mb-10">
            <div className="border-r border-border pr-6">
              <p className="font-display italic text-4xl text-foreground">
                {String(summary.cardsReviewed)}
              </p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-2">
                Reviewed
              </p>
            </div>
            <div className="border-r border-border px-6">
              <p className="font-display italic text-4xl text-foreground">
                {String(summary.retentionPct)}%
              </p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-2">
                Retention
              </p>
            </div>
            <div className="pl-6">
              <p className="font-display italic text-4xl text-foreground">
                {String(summary.dueCount)}
              </p>
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-2">
                Still Due
              </p>
            </div>
          </div>
        )}

        {summary && summary.nextReviewDates.length > 0 && (
          <div className="mb-10">
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-3">
              Next Review Dates
            </p>
            <div className="flex flex-wrap gap-2">
              {summary.nextReviewDates.slice(0, 6).map((ts) => (
                <span
                  key={ts.toString()}
                  className="font-mono text-[10px] tracking-wider uppercase border border-border px-2 py-1 text-muted-foreground"
                >
                  {formatDate(ts)}
                </span>
              ))}
              {summary.nextReviewDates.length > 6 && (
                <span className="font-mono text-[10px] tracking-wider uppercase border border-border px-2 py-1 text-muted-foreground">
                  +{summary.nextReviewDates.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="h-px bg-border mb-10" />
        <OutlinedButton
          onClick={onRestart}
          size="lg"
          data-ocid="restart-session-btn"
        >
          Begin New Session
        </OutlinedButton>
      </div>
    </div>
  );
}

// ─── Flashcard Component ──────────────────────────────────────────────────────

function FlashCard({
  card,
  isFlipped,
  onFlip,
}: {
  card: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  const categoryLabel = card.category
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toUpperCase();

  return (
    <button
      type="button"
      className="relative w-full cursor-pointer select-none text-left"
      style={{
        perspective: "1200px",
        background: "transparent",
        border: "none",
        padding: 0,
      }}
      onClick={onFlip}
      onKeyDown={(e) =>
        e.key === "Enter" || e.key === " " ? onFlip() : undefined
      }
      aria-pressed={isFlipped}
      aria-label={
        isFlipped
          ? "Card showing answer — click to flip back"
          : "Card showing question — click to reveal answer"
      }
      data-ocid="flashcard"
    >
      <div
        className="relative w-full"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          minHeight: "340px",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 flex flex-col border border-border bg-card p-10 md:p-14"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              {categoryLabel}
            </span>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              Tap to reveal
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="font-display italic text-3xl md:text-4xl text-foreground text-center leading-snug">
              {card.question}
            </p>
          </div>
          {card.hint && (
            <p className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground text-center mt-6 border-t border-border pt-4">
              Hint: {card.hint}
            </p>
          )}
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col border border-border bg-card p-10 md:p-14"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              {categoryLabel}
            </span>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
              Answer
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="font-body text-lg md:text-xl text-foreground text-center leading-relaxed">
              {card.answer}
            </p>
          </div>
          <div className="h-px bg-border mt-6" />
        </div>
      </div>
    </button>
  );
}

// ─── Main Quiz Page ───────────────────────────────────────────────────────────

export default function QuizPage() {
  const [mode, setMode] = useState<Mode>("due");
  const [activeTab, setActiveTab] = useState<CardCategory | "All">("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const dueCardsQuery = useGetDueCards();
  const allCardsQuery = useListCards();
  const categoryCardsQuery = useListCardsByCategory(
    activeTab !== "All" ? (activeTab as CardCategory) : null,
  );
  const reviewCard = useReviewCard();

  const freshCards: Flashcard[] =
    activeTab === "All"
      ? (allCardsQuery.data ?? [])
      : (categoryCardsQuery.data ?? []);

  const cards: Flashcard[] =
    mode === "due" ? (dueCardsQuery.data ?? []) : freshCards;

  const isLoading =
    mode === "due"
      ? dueCardsQuery.isLoading
      : activeTab === "All"
        ? allCardsQuery.isLoading
        : categoryCardsQuery.isLoading;

  const currentCard = cards[currentIndex] ?? null;
  const progress = cards.length > 0 ? (currentIndex / cards.length) * 100 : 0;

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => !f);
  }, []);

  const handleReview = useCallback(
    async (quality: ReviewQuality) => {
      if (!currentCard) return;
      await reviewCard.mutateAsync({ cardId: currentCard.id, quality });
      setIsFlipped(false);
      if (currentIndex + 1 >= cards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentCard, currentIndex, cards.length, reviewCard],
  );

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
  };

  const switchCategory = (tab: CardCategory | "All") => {
    setActiveTab(tab);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
  };

  if (sessionComplete) {
    return (
      <Layout>
        <SessionSummaryView onRestart={handleRestart} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-10 fade-in">
        <PageHeader title="Flashcard Quiz" subtitle="Study Archive">
          {/* Mode toggle */}
          <div className="flex border border-border" data-ocid="mode-toggle">
            <button
              type="button"
              onClick={() => switchMode("due")}
              className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 transition-all duration-200 ${
                mode === "due"
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="mode-due-btn"
            >
              Due
            </button>
            <div className="w-px bg-border" />
            <button
              type="button"
              onClick={() => switchMode("fresh")}
              className={`font-mono text-[10px] tracking-widest uppercase px-4 py-2 transition-all duration-200 ${
                mode === "fresh"
                  ? "bg-foreground text-background"
                  : "bg-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="mode-fresh-btn"
            >
              Browse
            </button>
          </div>
        </PageHeader>

        {/* Category tabs — only in fresh/browse mode */}
        {mode === "fresh" && (
          <div
            className="flex flex-wrap gap-0 border-b border-border mb-8 -mt-2"
            data-ocid="category-tabs"
          >
            {TABS.map((tab) => {
              const tabKey =
                tab.value === "All"
                  ? "all"
                  : (tab.value as string).toLowerCase().replace(/\s+/g, "-");
              return (
                <button
                  type="button"
                  key={tab.value}
                  onClick={() => switchCategory(tab.value)}
                  className={`font-mono text-[10px] tracking-widest uppercase px-4 py-3 border-b-2 transition-all duration-200 ${
                    activeTab === tab.value
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`tab-${tabKey}`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div
            className="py-24 flex flex-col items-center gap-6"
            data-ocid="quiz-loading"
          >
            <LoadingBar />
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Loading cards…
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && cards.length === 0 && (
          <div
            className="py-24 flex flex-col items-center gap-4 text-center"
            data-ocid="quiz-empty"
          >
            <div className="h-px bg-border w-16 mb-4" />
            <p className="font-display italic text-3xl text-foreground">
              {mode === "due"
                ? "No cards due for review."
                : "No cards in this category."}
            </p>
            <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-2">
              {mode === "due"
                ? "Switch to Browse mode to study all cards."
                : "Select a different category or browse all."}
            </p>
            <div className="h-px bg-border w-16 mt-4" />
            {mode === "due" && (
              <OutlinedButton
                size="md"
                className="mt-6"
                onClick={() => switchMode("fresh")}
                data-ocid="empty-browse-btn"
              >
                Browse All Cards
              </OutlinedButton>
            )}
          </div>
        )}

        {/* Active card session */}
        {!isLoading && currentCard && (
          <div className="flex flex-col gap-6">
            {/* Progress */}
            <div className="flex items-center gap-4" data-ocid="progress-bar">
              <div className="flex-1 h-px bg-border relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-foreground transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground shrink-0">
                {currentIndex + 1} / {cards.length}
              </span>
            </div>

            {/* Flashcard */}
            <FlashCard
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={handleFlip}
            />

            {/* Actions — reveal after flip */}
            <div
              className={`flex gap-4 justify-center transition-all duration-300 ${
                isFlipped
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none"
              }`}
              data-ocid="card-actions"
            >
              <OutlinedButton
                size="md"
                variant="ghost"
                onClick={() => handleReview(ReviewQuality.NeedsReview)}
                disabled={reviewCard.isPending}
                data-ocid="needs-review-btn"
              >
                Needs Review
              </OutlinedButton>
              <OutlinedButton
                size="md"
                onClick={() => handleReview(ReviewQuality.Known)}
                disabled={reviewCard.isPending}
                data-ocid="known-btn"
              >
                Known
              </OutlinedButton>
            </div>

            {/* Flip hint */}
            {!isFlipped && (
              <p
                className="text-center font-mono text-[10px] tracking-widest uppercase text-muted-foreground"
                data-ocid="flip-hint"
              >
                Click card to reveal answer
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
