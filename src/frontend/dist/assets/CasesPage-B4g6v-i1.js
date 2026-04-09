import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, L as LoadingScreen, a as Layout, m as motion, O as OutlinedButton, X, u as useNavigate } from "./index-Dc4Qvpv5.js";
import { E as EditorialCard, S as SeverityBar } from "./EditorialCard-BIEJiUvN.js";
import { P as PageHeader } from "./PageHeader-D00jYG-L.js";
import { T as TagBadge } from "./TagBadge-BrjC3oSW.js";
import { u as useListCases, a as useSearchCases } from "./useQueries-CW8XzbIE.js";
import { S as Search } from "./search-DgGeyPzd.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
const CRIME_CATEGORIES = [
  "All",
  "Serial Homicide",
  "Mass Violence",
  "Fraud",
  "Cybercrime",
  "Terrorism",
  "Organized Crime",
  "Domestic Violence",
  "Child Abuse"
];
function useDebounce(value, delay) {
  const [debounced, setDebounced] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
function CaseCard({ caseData, index }) {
  const navigate = useNavigate();
  const excerpt = caseData.summary.length > 180 ? `${caseData.summary.slice(0, 180)}…` : caseData.summary;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay: index * 0.06, ease: "easeOut" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        EditorialCard,
        {
          onClick: () => navigate({ to: "/cases/$id", params: { id: caseData.id.toString() } }),
          "data-ocid": `case-card-${caseData.id}`,
          className: "h-full flex flex-col gap-5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground", children: [
                "CASE — ",
                caseData.id.toString().padStart(4, "0")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display italic text-xl md:text-2xl tracking-tight text-foreground leading-tight break-words", children: caseData.name }),
              caseData.alias && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground tracking-wide", children: [
                '"',
                caseData.alias,
                '"'
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TagBadge, { label: caseData.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TagBadge, { label: caseData.year.toString() })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1", children: excerpt }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 pt-2 border-t border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBar, { value: Number(caseData.severity), label: "Severity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SeverityBar, { value: Number(caseData.notoriety), label: "Notoriety" })
            ] })
          ]
        }
      )
    }
  );
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
  onReset
}) {
  const hasFilters = !!nameQuery || category !== "All" || !!yearFrom || !!yearTo || minSeverity > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border border-border bg-card p-6 mb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { size: 12, className: "text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground", children: "Filter Cases" })
      ] }),
      hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: onReset,
          className: "font-mono text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1",
          "data-ocid": "filter-reset",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 }),
            "Clear"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-name-input",
            className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground",
            children: "Search by Name"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 12, className: "text-muted-foreground shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "filter-name-input",
              type: "text",
              value: nameQuery,
              onChange: (e) => setNameQuery(e.target.value),
              placeholder: "e.g. Bundy, Zodiac…",
              className: "input-underline flex-1 text-sm border-0",
              "data-ocid": "filter-name"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-category-select",
            className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground",
            children: "Crime Category"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            id: "filter-category-select",
            value: category,
            onChange: (e) => setCategory(e.target.value),
            className: "input-underline text-sm bg-transparent appearance-none",
            "data-ocid": "filter-category",
            children: CRIME_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c, className: "bg-card text-foreground", children: c }, c))
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-year-from-input",
            className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground",
            children: "Year Range"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "filter-year-from-input",
              type: "number",
              value: yearFrom,
              onChange: (e) => setYearFrom(e.target.value),
              placeholder: "From",
              className: "input-underline text-sm w-full",
              "data-ocid": "filter-year-from"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-muted-foreground", children: "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "filter-year-to-input",
              type: "number",
              value: yearTo,
              onChange: (e) => setYearTo(e.target.value),
              placeholder: "To",
              className: "input-underline text-sm w-full",
              "data-ocid": "filter-year-to"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "label",
          {
            htmlFor: "filter-severity-range",
            className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground",
            children: "Minimum Severity"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
          minSeverity,
          "/10"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id: "filter-severity-range",
          type: "range",
          min: 0,
          max: 10,
          value: minSeverity,
          onChange: (e) => setMinSeverity(Number(e.target.value)),
          className: "w-full accent-foreground h-px cursor-pointer",
          "data-ocid": "filter-severity"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] text-muted-foreground tracking-wider", children: "ALL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] text-muted-foreground tracking-wider", children: "10" })
      ] })
    ] })
  ] });
}
function CasesPage() {
  const [nameQuery, setNameQuery] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("All");
  const [yearFrom, setYearFrom] = reactExports.useState("");
  const [yearTo, setYearTo] = reactExports.useState("");
  const [minSeverity, setMinSeverity] = reactExports.useState(0);
  const debouncedName = useDebounce(nameQuery, 350);
  const isFiltering = !!debouncedName || category !== "All" || !!yearFrom || !!yearTo || minSeverity > 0;
  const { data: allCases, isLoading: allLoading } = useListCases();
  const { data: filteredCases, isLoading: searchLoading } = useSearchCases(
    debouncedName || null,
    category !== "All" ? category : null,
    yearFrom ? BigInt(yearFrom) : null,
    yearTo ? BigInt(yearTo) : null,
    minSeverity > 0 ? BigInt(minSeverity) : null
  );
  const cases = isFiltering ? filteredCases ?? [] : allCases ?? [];
  const isLoading = isFiltering ? searchLoading : allLoading;
  const handleReset = reactExports.useCallback(() => {
    setNameQuery("");
    setCategory("All");
    setYearFrom("");
    setYearTo("");
    setMinSeverity(0);
  }, []);
  if (allLoading && !isFiltering) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingScreen, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Case File Archive",
        subtitle: "Criminal Psychology — Case Studies",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground", children: [
          cases.length,
          " ",
          cases.length === 1 ? "case" : "cases"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FilterPanel,
      {
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
        onReset: handleReset
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: ["a", "b", "c", "d", "e", "f"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "border border-border bg-card p-6 h-64 animate-pulse"
      },
      k
    )) }) : cases.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "text-center py-24 border border-border",
        "data-ocid": "cases-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3", children: "No Results" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display italic text-2xl text-foreground mb-6", children: "No cases match your criteria." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(OutlinedButton, { variant: "ghost", onClick: handleReset, children: "Clear Filters" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        "data-ocid": "cases-grid",
        children: cases.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(CaseCard, { caseData: c, index: i }, c.id.toString()))
      }
    )
  ] }) });
}
export {
  CasesPage as default
};
