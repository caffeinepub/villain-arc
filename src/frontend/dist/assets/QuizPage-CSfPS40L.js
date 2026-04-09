import { r as reactExports, j as jsxRuntimeExports, a as Layout, h as LoadingBar, O as OutlinedButton } from "./index-Dc4Qvpv5.js";
import { e as useGetDueCards, f as useListCards, g as useListCardsByCategory, h as useReviewCard, C as CardCategory, R as ReviewQuality, i as useGetSessionSummary } from "./useQueries-CW8XzbIE.js";
import { P as PageHeader } from "./PageHeader-D00jYG-L.js";
const TABS = [
  { label: "All", value: "All" },
  { label: "Terms", value: CardCategory.Terms },
  { label: "Theorists", value: CardCategory.Theorists },
  { label: "Studies", value: CardCategory.Studies },
  { label: "Disorders", value: CardCategory.Disorders },
  { label: "Cases", value: CardCategory.Cases },
  { label: "Research Methods", value: CardCategory.ResearchMethods },
  { label: "Terminology", value: CardCategory.Terminology }
];
function SessionSummaryView({ onRestart }) {
  const { data: summary } = useGetSessionSummary();
  const formatDate = (ts) => {
    const ms = Number(ts) / 1e6;
    return new Date(ms).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex-1 flex items-center justify-center px-6 fade-in py-20",
      "data-ocid": "session-summary",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border mb-12" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-4", children: "Session Complete" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display italic text-5xl text-foreground mb-10 leading-none", children: "Review archived." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border mb-10" }),
        summary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-0 mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-r border-border pr-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display italic text-4xl text-foreground", children: String(summary.cardsReviewed) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-2", children: "Reviewed" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-r border-border px-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display italic text-4xl text-foreground", children: [
              String(summary.retentionPct),
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-2", children: "Retention" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display italic text-4xl text-foreground", children: String(summary.dueCount) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-2", children: "Still Due" })
          ] })
        ] }),
        summary && summary.nextReviewDates.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-3", children: "Next Review Dates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
            summary.nextReviewDates.slice(0, 6).map((ts) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[10px] tracking-wider uppercase border border-border px-2 py-1 text-muted-foreground",
                children: formatDate(ts)
              },
              ts.toString()
            )),
            summary.nextReviewDates.length > 6 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] tracking-wider uppercase border border-border px-2 py-1 text-muted-foreground", children: [
              "+",
              summary.nextReviewDates.length - 6,
              " more"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border mb-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          OutlinedButton,
          {
            onClick: onRestart,
            size: "lg",
            "data-ocid": "restart-session-btn",
            children: "Begin New Session"
          }
        )
      ] })
    }
  );
}
function FlashCard({
  card,
  isFlipped,
  onFlip
}) {
  const categoryLabel = card.category.replace(/([A-Z])/g, " $1").trim().toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: "relative w-full cursor-pointer select-none text-left",
      style: {
        perspective: "1200px",
        background: "transparent",
        border: "none",
        padding: 0
      },
      onClick: onFlip,
      onKeyDown: (e) => e.key === "Enter" || e.key === " " ? onFlip() : void 0,
      "aria-pressed": isFlipped,
      "aria-label": isFlipped ? "Card showing answer — click to flip back" : "Card showing question — click to reveal answer",
      "data-ocid": "flashcard",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative w-full",
          style: {
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            minHeight: "340px"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "absolute inset-0 flex flex-col border border-border bg-card p-10 md:p-14",
                style: { backfaceVisibility: "hidden" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground", children: categoryLabel }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground", children: "Tap to reveal" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display italic text-3xl md:text-4xl text-foreground text-center leading-snug", children: card.question }) }),
                  card.hint && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] tracking-wider uppercase text-muted-foreground text-center mt-6 border-t border-border pt-4", children: [
                    "Hint: ",
                    card.hint
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "absolute inset-0 flex flex-col border border-border bg-card p-10 md:p-14",
                style: {
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start mb-8", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground", children: categoryLabel }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground", children: "Answer" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-lg md:text-xl text-foreground text-center leading-relaxed", children: card.answer }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border mt-6" })
                ]
              }
            )
          ]
        }
      )
    }
  );
}
function QuizPage() {
  const [mode, setMode] = reactExports.useState("due");
  const [activeTab, setActiveTab] = reactExports.useState("All");
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const [isFlipped, setIsFlipped] = reactExports.useState(false);
  const [sessionComplete, setSessionComplete] = reactExports.useState(false);
  const dueCardsQuery = useGetDueCards();
  const allCardsQuery = useListCards();
  const categoryCardsQuery = useListCardsByCategory(
    activeTab !== "All" ? activeTab : null
  );
  const reviewCard = useReviewCard();
  const freshCards = activeTab === "All" ? allCardsQuery.data ?? [] : categoryCardsQuery.data ?? [];
  const cards = mode === "due" ? dueCardsQuery.data ?? [] : freshCards;
  const isLoading = mode === "due" ? dueCardsQuery.isLoading : activeTab === "All" ? allCardsQuery.isLoading : categoryCardsQuery.isLoading;
  const currentCard = cards[currentIndex] ?? null;
  const progress = cards.length > 0 ? currentIndex / cards.length * 100 : 0;
  const handleFlip = reactExports.useCallback(() => {
    setIsFlipped((f) => !f);
  }, []);
  const handleReview = reactExports.useCallback(
    async (quality) => {
      if (!currentCard) return;
      await reviewCard.mutateAsync({ cardId: currentCard.id, quality });
      setIsFlipped(false);
      if (currentIndex + 1 >= cards.length) {
        setSessionComplete(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [currentCard, currentIndex, cards.length, reviewCard]
  );
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
  };
  const switchMode = (newMode) => {
    setMode(newMode);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
  };
  const switchCategory = (tab) => {
    setActiveTab(tab);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
  };
  if (sessionComplete) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SessionSummaryView, { onRestart: handleRestart }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 md:px-6 py-10 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Flashcard Quiz", subtitle: "Study Archive", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border border-border", "data-ocid": "mode-toggle", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => switchMode("due"),
          className: `font-mono text-[10px] tracking-widest uppercase px-4 py-2 transition-all duration-200 ${mode === "due" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"}`,
          "data-ocid": "mode-due-btn",
          children: "Due"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => switchMode("fresh"),
          className: `font-mono text-[10px] tracking-widest uppercase px-4 py-2 transition-all duration-200 ${mode === "fresh" ? "bg-foreground text-background" : "bg-transparent text-muted-foreground hover:text-foreground"}`,
          "data-ocid": "mode-fresh-btn",
          children: "Browse"
        }
      )
    ] }) }),
    mode === "fresh" && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-wrap gap-0 border-b border-border mb-8 -mt-2",
        "data-ocid": "category-tabs",
        children: TABS.map((tab) => {
          const tabKey = tab.value === "All" ? "all" : tab.value.toLowerCase().replace(/\s+/g, "-");
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => switchCategory(tab.value),
              className: `font-mono text-[10px] tracking-widest uppercase px-4 py-3 border-b-2 transition-all duration-200 ${activeTab === tab.value ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
              "data-ocid": `tab-${tabKey}`,
              children: tab.label
            },
            tab.value
          );
        })
      }
    ),
    isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "py-24 flex flex-col items-center gap-6",
        "data-ocid": "quiz-loading",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBar, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground", children: "Loading cards…" })
        ]
      }
    ),
    !isLoading && cards.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "py-24 flex flex-col items-center gap-4 text-center",
        "data-ocid": "quiz-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border w-16 mb-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display italic text-3xl text-foreground", children: mode === "due" ? "No cards due for review." : "No cards in this category." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-2", children: mode === "due" ? "Switch to Browse mode to study all cards." : "Select a different category or browse all." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border w-16 mt-4" }),
          mode === "due" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            OutlinedButton,
            {
              size: "md",
              className: "mt-6",
              onClick: () => switchMode("fresh"),
              "data-ocid": "empty-browse-btn",
              children: "Browse All Cards"
            }
          )
        ]
      }
    ),
    !isLoading && currentCard && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", "data-ocid": "progress-bar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute left-0 top-0 h-full bg-foreground transition-all duration-500",
            style: { width: `${progress}%` }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground shrink-0", children: [
          currentIndex + 1,
          " / ",
          cards.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FlashCard,
        {
          card: currentCard,
          isFlipped,
          onFlip: handleFlip
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex gap-4 justify-center transition-all duration-300 ${isFlipped ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`,
          "data-ocid": "card-actions",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              OutlinedButton,
              {
                size: "md",
                variant: "ghost",
                onClick: () => handleReview(ReviewQuality.NeedsReview),
                disabled: reviewCard.isPending,
                "data-ocid": "needs-review-btn",
                children: "Needs Review"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              OutlinedButton,
              {
                size: "md",
                onClick: () => handleReview(ReviewQuality.Known),
                disabled: reviewCard.isPending,
                "data-ocid": "known-btn",
                children: "Known"
              }
            )
          ]
        }
      ),
      !isFlipped && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-center font-mono text-[10px] tracking-widest uppercase text-muted-foreground",
          "data-ocid": "flip-hint",
          children: "Click card to reveal answer"
        }
      )
    ] })
  ] }) });
}
export {
  QuizPage as default
};
