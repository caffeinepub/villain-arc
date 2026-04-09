import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Milestone } from "../backend";
import { Layout } from "../components/Layout";
import { OutlinedButton } from "../components/OutlinedButton";
import { PageHeader } from "../components/PageHeader";
import { TagBadge } from "../components/TagBadge";
import { UnderlineInput } from "../components/UnderlineInput";
import { Skeleton } from "../components/ui/skeleton";
import {
  useGetJournalMilestone,
  useListJournalEntries,
  useSearchJournalEntries,
} from "../hooks/useQueries";
import type { JournalEntry } from "../types";

const MILESTONE_LABELS: Record<Milestone, string> = {
  [Milestone.Associate]: "Associate",
  [Milestone.Bachelor]: "Bachelor",
  [Milestone.Master]: "Master",
  [Milestone.Licensure]: "Licensure",
};

const MILESTONE_ORDER = [
  Milestone.Associate,
  Milestone.Bachelor,
  Milestone.Master,
  Milestone.Licensure,
];

const MILESTONE_THRESHOLDS: Record<Milestone, number> = {
  [Milestone.Associate]: 0,
  [Milestone.Bachelor]: 11,
  [Milestone.Master]: 31,
  [Milestone.Licensure]: 61,
};

type MilestoneNext = { label: string; threshold: number } | null;

function getMilestoneNext(m: Milestone): MilestoneNext {
  const idx = MILESTONE_ORDER.indexOf(m);
  if (idx >= MILESTONE_ORDER.length - 1) return null;
  const next = MILESTONE_ORDER[idx + 1];
  return {
    label: MILESTONE_LABELS[next],
    threshold: MILESTONE_THRESHOLDS[next],
  };
}

function formatDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent ?? tmp.innerText ?? "";
}

// ─── Milestone Tracker ────────────────────────────────────────────────────────

function MilestoneTracker({
  milestone,
  entryCount,
}: {
  milestone: Milestone;
  entryCount: number;
}) {
  const current = MILESTONE_THRESHOLDS[milestone];
  const next = getMilestoneNext(milestone);
  const progress = next
    ? Math.min(((entryCount - current) / (next.threshold - current)) * 100, 100)
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-border p-6 mb-10 bg-card"
      data-ocid="milestone-tracker"
    >
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        {/* Current milestone */}
        <div className="shrink-0">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-1">
            Degree Milestone
          </p>
          <h3 className="font-display italic text-3xl text-foreground leading-none">
            {MILESTONE_LABELS[milestone]}
          </h3>
          <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-2">
            {entryCount} {entryCount === 1 ? "entry" : "entries"} logged
          </p>
        </div>

        <div className="h-px md:h-12 w-full md:w-px bg-border" />

        {/* Progress toward next */}
        <div className="flex-1 min-w-0">
          {next ? (
            <>
              <div className="flex justify-between items-baseline mb-2">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                  Path to {next.label}
                </p>
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
                  {Math.max(0, next.threshold - entryCount)} more needed
                </p>
              </div>
              <div className="w-full h-px bg-border relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute top-0 left-0 h-px bg-foreground"
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {entryCount}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {next.threshold}
                </span>
              </div>
            </>
          ) : (
            <p className="font-mono text-xs text-foreground tracking-[0.2em] uppercase">
              Maximum milestone achieved
            </p>
          )}
        </div>

        {/* Step indicators */}
        <div className="hidden md:flex items-center gap-0 shrink-0">
          {MILESTONE_ORDER.map((m, i) => {
            const active = m === milestone;
            const passed = MILESTONE_ORDER.indexOf(milestone) >= i;
            return (
              <div key={m} className="flex items-center">
                <div
                  className={`w-2 h-2 border transition-colors duration-300 ${
                    active
                      ? "bg-foreground border-foreground"
                      : passed
                        ? "bg-muted-foreground border-muted-foreground"
                        : "bg-transparent border-border"
                  }`}
                />
                {i < MILESTONE_ORDER.length - 1 && (
                  <div
                    className={`w-5 h-px transition-colors duration-300 ${
                      passed && !active ? "bg-muted-foreground" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Entry Card ───────────────────────────────────────────────────────────────

function EntryCard({ entry, index }: { entry: JournalEntry; index: number }) {
  const excerpt = stripHtml(entry.body).slice(0, 220);

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="border-b border-border group"
      data-ocid={`journal-entry-${entry.id}`}
    >
      <Link
        to="/journal/$id"
        params={{ id: entry.id.toString() }}
        className="block py-6 cursor-pointer"
      >
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
          <p className="shrink-0 font-mono text-[10px] tracking-widest uppercase text-muted-foreground pt-0.5 whitespace-nowrap">
            {formatDate(entry.createdAt)}
          </p>
          <div className="flex-1 min-w-0">
            <h3 className="font-display italic text-xl md:text-2xl text-foreground leading-tight mb-2 group-hover:text-muted-foreground transition-colors duration-200 break-words">
              {entry.title || "Untitled Entry"}
            </h3>
            {excerpt && (
              <p className="font-body text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                {excerpt}
              </p>
            )}
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {entry.tags.map((t) => (
                  <TagBadge key={t} label={t} />
                ))}
              </div>
            )}
          </div>
          <div className="shrink-0 self-start md:self-center">
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              Open →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function EntrySkeleton() {
  return (
    <div className="space-y-0">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border-b border-border py-6 flex gap-8">
          <Skeleton className="h-3 w-28 mt-1 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JournalPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [filterTag, setFilterTag] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword), 350);
    return () => clearTimeout(t);
  }, [keyword]);

  const isSearching = debouncedKeyword !== "" || filterTag !== "";

  const listQuery = useListJournalEntries(0n, 50n);
  const searchQuery = useSearchJournalEntries(
    null,
    null,
    filterTag || null,
    debouncedKeyword || null,
  );
  const milestoneQuery = useGetJournalMilestone();

  const entries: JournalEntry[] = isSearching
    ? (searchQuery.data ?? [])
    : (listQuery.data?.entries ?? []);

  const isLoading = isSearching ? searchQuery.isLoading : listQuery.isLoading;

  const totalCount = Number(listQuery.data?.totalCount ?? 0n);
  const milestone = milestoneQuery.data ?? Milestone.Associate;

  const allTags = Array.from(
    new Set((listQuery.data?.entries ?? []).flatMap((e) => e.tags)),
  );

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <PageHeader title="Research Archive" subtitle="Study Journal">
          <OutlinedButton
            onClick={() => navigate({ to: "/journal/new" })}
            data-ocid="journal-new"
          >
            <Plus className="w-3 h-3 mr-2 inline-block" />
            New Entry
          </OutlinedButton>
        </PageHeader>

        {/* Milestone Tracker */}
        {!milestoneQuery.isLoading && (
          <MilestoneTracker milestone={milestone} entryCount={totalCount} />
        )}

        {/* Search + Tag Filters */}
        <div
          className="flex flex-col md:flex-row gap-4 mb-8"
          data-ocid="journal-search-row"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-0 bottom-2.5 w-3 h-3 text-muted-foreground pointer-events-none" />
            <UnderlineInput
              placeholder="Search entries..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-5"
              data-ocid="journal-search"
            />
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-end pb-1">
              <button
                type="button"
                onClick={() => setFilterTag("")}
                className={`font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 transition-colors duration-200 ${
                  filterTag === ""
                    ? "border-foreground text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
                data-ocid="filter-all"
              >
                All
              </button>
              {allTags.slice(0, 7).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFilterTag(filterTag === tag ? "" : tag)}
                  className={`font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 transition-colors duration-200 ${
                    filterTag === tag
                      ? "border-foreground text-foreground"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                  data-ocid={`filter-tag-${tag}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* List */}
        {isLoading ? (
          <EntrySkeleton />
        ) : entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="py-24 text-center border-t border-border"
            data-ocid="journal-empty"
          >
            <div className="h-px w-12 bg-border mx-auto mb-8" />
            <p className="font-display italic text-2xl text-muted-foreground mb-3">
              {isSearching
                ? "No entries match your query."
                : "Your research log is empty."}
            </p>
            {!isSearching && (
              <>
                <p className="font-body text-sm text-muted-foreground mb-8">
                  Begin your first entry.
                </p>
                <OutlinedButton
                  onClick={() => navigate({ to: "/journal/new" })}
                  data-ocid="journal-empty-cta"
                >
                  Begin Your First Entry
                </OutlinedButton>
              </>
            )}
            <div className="h-px w-12 bg-border mx-auto mt-8" />
          </motion.div>
        ) : (
          <div className="border-t border-border" data-ocid="journal-list">
            {entries.map((entry, i) => (
              <EntryCard key={entry.id.toString()} entry={entry} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
