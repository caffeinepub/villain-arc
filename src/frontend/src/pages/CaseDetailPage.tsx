import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { motion } from "motion/react";
import { SeverityBar } from "../components/EditorialCard";
import { Layout } from "../components/Layout";
import { LoadingScreen } from "../components/LoadingBar";
import { OutlinedButton } from "../components/OutlinedButton";
import { TagBadge } from "../components/TagBadge";
import { useGetCase, useListTheories } from "../hooks/useQueries";
import type { Case, Theory } from "../types";

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-10">
      <div className="h-px flex-1 bg-border" />
      <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground shrink-0">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function TheoryLink({
  theory,
  onNavigate,
}: {
  theory: Theory;
  onNavigate: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      className="group border border-border bg-card p-4 text-left hover:border-foreground transition-all duration-200 w-full"
      data-ocid={`theory-link-${theory.id}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
          {theory.id}
        </span>
        <BookOpen size={11} className="text-muted-foreground shrink-0 mt-0.5" />
      </div>
      <p className="font-display italic text-base text-foreground leading-tight">
        {theory.name}
      </p>
      <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
        {theory.description}
      </p>
    </button>
  );
}

function CaseDossier({ caseData }: { caseData: Case }) {
  const navigate = useNavigate();
  const { data: theories } = useListTheories();

  const linkedTheories: Theory[] =
    theories?.filter((t) => caseData.theories.includes(t.id)) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Sticky breadcrumb bar */}
      <div className="border-b border-border bg-card sticky top-14 z-10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate({ to: "/cases" })}
            className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="back-to-cases"
          >
            <ArrowLeft size={12} />
            Archive
          </button>
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
            FILE — {caseData.id.toString().padStart(6, "0")}
          </span>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Hero grid — asymmetric editorial */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] border border-border mb-0">
          <div className="border-b lg:border-b-0 lg:border-r border-border p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-wrap gap-2">
                <TagBadge label={caseData.category} />
                <TagBadge label={caseData.year.toString()} />
              </div>

              <h1 className="font-display italic text-4xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-none break-words">
                {caseData.name}
              </h1>

              {caseData.alias && (
                <span className="font-mono text-sm text-muted-foreground tracking-widest">
                  "{caseData.alias}"
                </span>
              )}
            </motion.div>
          </div>

          {/* Metrics sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="p-8 flex flex-col justify-between gap-8"
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground mb-3 block">
                Threat Assessment
              </span>
              <div className="flex flex-col gap-5">
                <SeverityBar
                  value={Number(caseData.severity)}
                  label="Severity"
                />
                <SeverityBar
                  value={Number(caseData.notoriety)}
                  label="Notoriety"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground block mb-1">
                Theories Applied
              </span>
              <span className="font-display italic text-4xl text-foreground">
                {caseData.theories.length}
              </span>
            </div>
          </motion.div>
        </div>

        {/* DSM-Adjacent Profile */}
        <SectionDivider label="DSM-Adjacent Profile" />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="border border-border bg-card p-8 md:p-10"
          data-ocid="dsm-profile"
        >
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground block mb-4">
            Clinical Profile
          </span>
          <p className="font-body text-sm text-foreground leading-loose max-w-3xl">
            {caseData.dsmProfile}
          </p>
        </motion.div>

        {/* Editorial Summary */}
        <SectionDivider label="Editorial Summary" />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl"
          data-ocid="case-summary"
        >
          <p className="font-body text-base text-foreground leading-loose tracking-wide">
            {caseData.summary}
          </p>
        </motion.div>

        {/* Key Quotes */}
        {caseData.quotes.length > 0 && (
          <>
            <SectionDivider label="Key Statements" />
            <div
              className="flex flex-col gap-6 max-w-2xl"
              data-ocid="case-quotes"
            >
              {caseData.quotes.map((quote, i) => (
                <motion.blockquote
                  key={quote.slice(0, 20)}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="border-l border-foreground pl-6"
                >
                  <p className="font-mono text-xs text-foreground tracking-wide leading-relaxed">
                    "{quote}"
                  </p>
                </motion.blockquote>
              ))}
            </div>
          </>
        )}

        {/* Applicable Theories */}
        {caseData.theories.length > 0 && (
          <>
            <SectionDivider label="Applicable Criminology Theories" />
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
              data-ocid="case-theories"
            >
              {linkedTheories.length > 0
                ? linkedTheories.map((theory, i) => (
                    <motion.div
                      key={theory.id}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                    >
                      <TheoryLink
                        theory={theory}
                        onNavigate={() => navigate({ to: "/theory-match" })}
                      />
                    </motion.div>
                  ))
                : caseData.theories.map((tid, i) => (
                    <motion.div
                      key={tid}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.08 }}
                    >
                      <TagBadge label={tid} />
                    </motion.div>
                  ))}
            </div>
          </>
        )}

        {/* Footer actions */}
        <div className="mt-14 pt-8 border-t border-border flex flex-wrap gap-3 items-center justify-between">
          <OutlinedButton
            variant="ghost"
            onClick={() => navigate({ to: "/cases" })}
            data-ocid="footer-back-btn"
          >
            ← All Cases
          </OutlinedButton>
          <OutlinedButton
            onClick={() => navigate({ to: "/theory-match" })}
            data-ocid="footer-theory-btn"
          >
            Explore Theory Matcher
          </OutlinedButton>
        </div>
      </div>
    </motion.div>
  );
}

export default function CaseDetailPage() {
  const { id } = useParams({ from: "/cases/$id" });
  const navigate = useNavigate();

  const caseId: bigint | null = (() => {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  })();

  const { data: caseData, isLoading, isError } = useGetCase(caseId);

  if (isLoading) return <LoadingScreen />;

  if (isError || caseData === null || caseData === undefined) {
    return (
      <Layout>
        <div
          className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 text-center"
          data-ocid="case-not-found"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-3">
            404 — File Not Found
          </span>
          <h1 className="font-display italic text-4xl text-foreground mb-8">
            This case does not exist.
          </h1>
          <OutlinedButton onClick={() => navigate({ to: "/cases" })}>
            Return to Archive
          </OutlinedButton>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CaseDossier caseData={caseData} />
    </Layout>
  );
}
