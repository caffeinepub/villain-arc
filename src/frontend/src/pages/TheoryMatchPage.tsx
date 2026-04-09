import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import type { TheoryMatchResult } from "../backend.d.ts";
import { Layout } from "../components/Layout";
import { LoadingBar } from "../components/LoadingBar";
import { OutlinedButton } from "../components/OutlinedButton";
import { PageHeader } from "../components/PageHeader";
import { UnderlineTextarea } from "../components/UnderlineInput";
import { useMatchTheories } from "../hooks/useQueries";

const MIN_CHARS = 300;

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="h-px bg-border w-full overflow-hidden">
      <motion.div
        className="h-full bg-foreground"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
      />
    </div>
  );
}

function CaseChip({
  caseId,
  onClick,
}: {
  caseId: bigint;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground border-b border-border hover:text-foreground hover:border-foreground transition-smooth pb-px"
      data-ocid={`theory-case-link-${caseId}`}
    >
      Case #{caseId.toString()}
    </button>
  );
}

function TheoryResultCard({
  result,
  index,
}: {
  result: TheoryMatchResult;
  index: number;
}) {
  const navigate = useNavigate();
  const confidence = Number(result.confidence);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.1,
      }}
      className="border border-border bg-card p-6 md:p-8 group hover:border-muted-foreground transition-smooth"
      data-ocid={`theory-result-${result.theoryId}`}
    >
      <div className="flex flex-col gap-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Match #{index + 1} &middot; {result.theoryId}
            </p>
            <h3 className="font-display italic text-2xl md:text-3xl leading-tight text-foreground">
              {result.theoryName}
            </h3>
          </div>
          <div className="shrink-0 text-right leading-none">
            <span className="font-mono text-4xl md:text-5xl tracking-tight text-foreground">
              {confidence}
            </span>
            <span className="font-mono text-sm text-muted-foreground">%</span>
            <p className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mt-1">
              Confidence
            </p>
          </div>
        </div>

        {/* Confidence bar */}
        <ConfidenceBar value={confidence} />

        {/* Explanation */}
        <p className="font-body text-sm text-muted-foreground leading-relaxed">
          {result.explanation}
        </p>

        {/* Matched cases */}
        {result.matchedCaseIds.length > 0 && (
          <div className="flex flex-col gap-2 pt-3 border-t border-border">
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
              Matched Cases
            </p>
            <div className="flex flex-wrap gap-4">
              {result.matchedCaseIds.map((id) => (
                <CaseChip
                  key={id.toString()}
                  caseId={id}
                  onClick={() =>
                    navigate({
                      to: "/cases/$id",
                      params: { id: id.toString() },
                    })
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ type }: { type: "idle" | "no-match" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="border border-border p-16 text-center"
      data-ocid={type === "idle" ? "theory-idle-state" : "theory-empty-state"}
    >
      {type === "idle" ? (
        <>
          <p className="font-display italic text-2xl text-foreground mb-3">
            Describe a scenario.
          </p>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground max-w-xs mx-auto leading-relaxed">
            The engine cross-references behavioral indicators against eight
            criminological frameworks
          </p>
        </>
      ) : (
        <>
          <p className="font-display italic text-2xl text-foreground mb-3">
            No theories matched this scenario.
          </p>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground max-w-xs mx-auto leading-relaxed">
            Try elaborating on behavioral context, motive, or social environment
          </p>
        </>
      )}
    </motion.div>
  );
}

export default function TheoryMatchPage() {
  const [scenario, setScenario] = useState("");
  const [results, setResults] = useState<TheoryMatchResult[] | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const cacheRef = useRef<Map<string, TheoryMatchResult[]>>(new Map());

  const { mutateAsync: matchTheories, isPending } = useMatchTheories();

  const charCount = scenario.trim().length;
  const isReady = charCount >= MIN_CHARS;
  const remaining = Math.max(0, MIN_CHARS - charCount);

  async function handleAnalyze() {
    const key = scenario.trim();
    if (!key || !isReady) return;

    // Cache hit — skip re-fetch
    const cached = cacheRef.current.get(key);
    if (cached) {
      setResults(cached);
      setHasSubmitted(true);
      return;
    }

    setHasSubmitted(true);
    setResults(null);

    try {
      const data = await matchTheories(key);
      const sorted = [...data].sort(
        (a, b) => Number(b.confidence) - Number(a.confidence),
      );
      cacheRef.current.set(key, sorted);
      setResults(sorted);
    } catch {
      setResults([]);
    }
  }

  return (
    <Layout>
      <div className="max-w-[900px] mx-auto px-6 md:px-10 py-16">
        <PageHeader
          title="Theory Matcher"
          subtitle="Criminological Analysis Engine"
        />

        {/* Input zone */}
        <div
          className="mb-10 flex flex-col gap-6"
          data-ocid="theory-input-zone"
        >
          <UnderlineTextarea
            label="Describe the crime scenario"
            placeholder="Detail the offender's behavior, background, motive, social environment, victim relationship, and circumstances of the crime. Minimum 300 characters for accurate theory matching..."
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            rows={7}
            data-ocid="theory-scenario-input"
            aria-label="Crime scenario description"
          />

          {/* Char counter + submit */}
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground tabular-nums">
              {charCount < MIN_CHARS ? (
                <>{remaining} characters remaining</>
              ) : (
                <span className="text-foreground">
                  {charCount} characters &mdash; ready
                </span>
              )}
            </p>

            <OutlinedButton
              size="lg"
              disabled={!isReady || isPending}
              onClick={handleAnalyze}
              data-ocid="theory-analyze-btn"
            >
              {isPending ? "Analyzing..." : "Analyze Scenario"}
            </OutlinedButton>
          </div>
        </div>

        {/* Loading */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-10"
              data-ocid="theory-loading"
            >
              <LoadingBar />
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-4 text-center">
                Cross-referencing behavioral indicators against criminological
                frameworks
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results area */}
        <div className="flex flex-col gap-4" data-ocid="theory-results">
          {!isPending && !hasSubmitted && <EmptyState type="idle" />}

          {!isPending &&
            hasSubmitted &&
            results !== null &&
            results.length === 0 && <EmptyState type="no-match" />}

          {!isPending && results !== null && results.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-2">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground shrink-0">
                  {results.length} theor
                  {results.length === 1 ? "y" : "ies"} matched
                </p>
                <div className="h-px bg-border flex-1" />
                <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground shrink-0">
                  Sorted by confidence
                </p>
              </div>
              {results.map((result, index) => (
                <TheoryResultCard
                  key={result.theoryId}
                  result={result}
                  index={index}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
