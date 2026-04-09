import { useNavigate } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { EditorialCard, SeverityBar } from "../components/EditorialCard";
import { Layout } from "../components/Layout";
import { LoadingScreen } from "../components/LoadingBar";
import { OutlinedButton } from "../components/OutlinedButton";
import { PageHeader } from "../components/PageHeader";
import { TagBadge } from "../components/TagBadge";
import { useListCases, useSearchCases } from "../hooks/useQueries";
import type { Case } from "../types";

const CRIME_CATEGORIES = [
  "All",
  "Serial Homicide",
  "Mass Violence",
  "Fraud",
  "Cybercrime",
  "Terrorism",
  "Organized Crime",
  "Domestic Violence",
  "Child Abuse",
];

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function CaseCard({ caseData, index }: { caseData: Case; index: number }) {
  const navigate = useNavigate();
  const excerpt =
    caseData.summary.length > 180
      ? `${caseData.summary.slice(0, 180)}…`
      : caseData.summary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
    >
      <EditorialCard
        onClick={() =>
          navigate({ to: "/cases/$id", params: { id: caseData.id.toString() } })
        }
        data-ocid={`case-card-${caseData.id}`}
        className="h-full flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground">
            CASE — {caseData.id.toString().padStart(4, "0")}
          </span>
          <h2 className="font-display italic text-xl md:text-2xl tracking-tight text-foreground leading-tight break-words">
            {caseData.name}
          </h2>
          {caseData.alias && (
            <span className="font-mono text-xs text-muted-foreground tracking-wide">
              "{caseData.alias}"
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <TagBadge label={caseData.category} />
          <TagBadge label={caseData.year.toString()} />
        </div>

        <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {excerpt}
        </p>

        <div className="flex flex-col gap-3 pt-2 border-t border-border">
          <SeverityBar value={Number(caseData.severity)} label="Severity" />
          <SeverityBar value={Number(caseData.notoriety)} label="Notoriety" />
        </div>
      </EditorialCard>
    </motion.div>
  );
}

interface FilterPanelProps {
  nameQuery: string;
  setNameQuery: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  yearFrom: string;
  setYearFrom: (v: string) => void;
  yearTo: string;
  setYearTo: (v: string) => void;
  minSeverity: number;
  setMinSeverity: (v: number) => void;
  onReset: () => void;
}

function FilterPanel({
  nameQuery,
  setNameQuery,
  category,
  setCategory,
  yearFrom,
  setYearFrom,
  yearTo,
  setYearTo,
  minSeverity,
  setMinSeverity,
  onReset,
}: FilterPanelProps) {
  const hasFilters =
    !!nameQuery ||
    category !== "All" ||
    !!yearFrom ||
    !!yearTo ||
    minSeverity > 0;

  return (
    <div className="border border-border bg-card p-6 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={12} className="text-muted-foreground" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Filter Cases
          </span>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="font-mono text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            data-ocid="filter-reset"
          >
            <X size={10} />
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col gap-1 md:col-span-2">
          <label
            htmlFor="filter-name-input"
            className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground"
          >
            Search by Name
          </label>
          <div className="flex items-center gap-2 border-b border-border">
            <Search size={12} className="text-muted-foreground shrink-0" />
            <input
              id="filter-name-input"
              type="text"
              value={nameQuery}
              onChange={(e) => setNameQuery(e.target.value)}
              placeholder="e.g. Bundy, Zodiac…"
              className="input-underline flex-1 text-sm border-0"
              data-ocid="filter-name"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-category-select"
            className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground"
          >
            Crime Category
          </label>
          <select
            id="filter-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-underline text-sm bg-transparent appearance-none"
            data-ocid="filter-category"
          >
            {CRIME_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-card text-foreground">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-year-from-input"
            className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground"
          >
            Year Range
          </label>
          <div className="flex items-center gap-2">
            <input
              id="filter-year-from-input"
              type="number"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              placeholder="From"
              className="input-underline text-sm w-full"
              data-ocid="filter-year-from"
            />
            <span className="font-mono text-[10px] text-muted-foreground">
              —
            </span>
            <input
              id="filter-year-to-input"
              type="number"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              placeholder="To"
              className="input-underline text-sm w-full"
              data-ocid="filter-year-to"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="filter-severity-range"
            className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground"
          >
            Minimum Severity
          </label>
          <span className="font-mono text-[10px] text-muted-foreground">
            {minSeverity}/10
          </span>
        </div>
        <input
          id="filter-severity-range"
          type="range"
          min={0}
          max={10}
          value={minSeverity}
          onChange={(e) => setMinSeverity(Number(e.target.value))}
          className="w-full accent-foreground h-px cursor-pointer"
          data-ocid="filter-severity"
        />
        <div className="flex justify-between">
          <span className="font-mono text-[9px] text-muted-foreground tracking-wider">
            ALL
          </span>
          <span className="font-mono text-[9px] text-muted-foreground tracking-wider">
            10
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CasesPage() {
  const [nameQuery, setNameQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [minSeverity, setMinSeverity] = useState(0);

  const debouncedName = useDebounce(nameQuery, 350);

  const isFiltering =
    !!debouncedName ||
    category !== "All" ||
    !!yearFrom ||
    !!yearTo ||
    minSeverity > 0;

  const { data: allCases, isLoading: allLoading } = useListCases();
  const { data: filteredCases, isLoading: searchLoading } = useSearchCases(
    debouncedName || null,
    category !== "All" ? category : null,
    yearFrom ? BigInt(yearFrom) : null,
    yearTo ? BigInt(yearTo) : null,
    minSeverity > 0 ? BigInt(minSeverity) : null,
  );

  const cases: Case[] = isFiltering ? (filteredCases ?? []) : (allCases ?? []);
  const isLoading = isFiltering ? searchLoading : allLoading;

  const handleReset = useCallback(() => {
    setNameQuery("");
    setCategory("All");
    setYearFrom("");
    setYearTo("");
    setMinSeverity(0);
  }, []);

  if (allLoading && !isFiltering) return <LoadingScreen />;

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
        <PageHeader
          title="Case File Archive"
          subtitle="Criminal Psychology — Case Studies"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            {cases.length} {cases.length === 1 ? "case" : "cases"}
          </span>
        </PageHeader>

        <FilterPanel
          nameQuery={nameQuery}
          setNameQuery={setNameQuery}
          category={category}
          setCategory={setCategory}
          yearFrom={yearFrom}
          setYearFrom={setYearFrom}
          yearTo={yearTo}
          setYearTo={setYearTo}
          minSeverity={minSeverity}
          setMinSeverity={setMinSeverity}
          onReset={handleReset}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <div
                key={k}
                className="border border-border bg-card p-6 h-64 animate-pulse"
              />
            ))}
          </div>
        ) : cases.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 border border-border"
            data-ocid="cases-empty"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
              No Results
            </p>
            <p className="font-display italic text-2xl text-foreground mb-6">
              No cases match your criteria.
            </p>
            <OutlinedButton variant="ghost" onClick={handleReset}>
              Clear Filters
            </OutlinedButton>
          </motion.div>
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            data-ocid="cases-grid"
          >
            {cases.map((c, i) => (
              <CaseCard key={c.id.toString()} caseData={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
