import { c as createLucideIcon, b as useParams, u as useNavigate, j as jsxRuntimeExports, L as LoadingScreen, a as Layout, O as OutlinedButton, m as motion } from "./index-Dc4Qvpv5.js";
import { S as SeverityBar } from "./EditorialCard-BIEJiUvN.js";
import { T as TagBadge } from "./TagBadge-BrjC3oSW.js";
import { b as useGetCase, c as useListTheories } from "./useQueries-CW8XzbIE.js";
import { A as ArrowLeft } from "./arrow-left-dv8XnGwW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode);
function SectionDivider({ label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 my-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground shrink-0", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
  ] });
}
function TheoryLink({
  theory,
  onNavigate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: onNavigate,
      className: "group border border-border bg-card p-4 text-left hover:border-foreground transition-all duration-200 w-full",
      "data-ocid": `theory-link-${theory.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors", children: theory.id }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 11, className: "text-muted-foreground shrink-0 mt-0.5" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display italic text-base text-foreground leading-tight", children: theory.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2", children: theory.description })
      ]
    }
  );
}
function CaseDossier({ caseData }) {
  const navigate = useNavigate();
  const { data: theories } = useListTheories();
  const linkedTheories = (theories == null ? void 0 : theories.filter((t) => caseData.theories.includes(t.id))) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card sticky top-14 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/cases" }),
              className: "flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors",
              "data-ocid": "back-to-cases",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 12 }),
                "Archive"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] tracking-[0.4em] uppercase text-muted-foreground", children: [
            "FILE — ",
            caseData.id.toString().padStart(6, "0")
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_300px] border border-border mb-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b lg:border-b-0 lg:border-r border-border p-8 md:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, delay: 0.1 },
                className: "flex flex-col gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TagBadge, { label: caseData.category }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TagBadge, { label: caseData.year.toString() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display italic text-4xl md:text-6xl lg:text-7xl tracking-tight text-foreground leading-none break-words", children: caseData.name }),
                  caseData.alias && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm text-muted-foreground tracking-widest", children: [
                    '"',
                    caseData.alias,
                    '"'
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.5, delay: 0.25 },
                className: "p-8 flex flex-col justify-between gap-8",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground mb-3 block", children: "Threat Assessment" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SeverityBar,
                        {
                          value: Number(caseData.severity),
                          label: "Severity"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SeverityBar,
                        {
                          value: Number(caseData.notoriety),
                          label: "Notoriety"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground block mb-1", children: "Theories Applied" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display italic text-4xl text-foreground", children: caseData.theories.length })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionDivider, { label: "DSM-Adjacent Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4 },
              className: "border border-border bg-card p-8 md:p-10",
              "data-ocid": "dsm-profile",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground block mb-4", children: "Clinical Profile" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-foreground leading-loose max-w-3xl", children: caseData.dsmProfile })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SectionDivider, { label: "Editorial Summary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 8 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4 },
              className: "max-w-3xl",
              "data-ocid": "case-summary",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-base text-foreground leading-loose tracking-wide", children: caseData.summary })
            }
          ),
          caseData.quotes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionDivider, { label: "Key Statements" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex flex-col gap-6 max-w-2xl",
                "data-ocid": "case-quotes",
                children: caseData.quotes.map((quote, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.blockquote,
                  {
                    initial: { opacity: 0, x: -8 },
                    whileInView: { opacity: 1, x: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.35, delay: i * 0.08 },
                    className: "border-l border-foreground pl-6",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-xs text-foreground tracking-wide leading-relaxed", children: [
                      '"',
                      quote,
                      '"'
                    ] })
                  },
                  quote.slice(0, 20)
                ))
              }
            )
          ] }),
          caseData.theories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SectionDivider, { label: "Applicable Criminology Theories" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
                "data-ocid": "case-theories",
                children: linkedTheories.length > 0 ? linkedTheories.map((theory, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 8 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.35, delay: i * 0.08 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TheoryLink,
                      {
                        theory,
                        onNavigate: () => navigate({ to: "/theory-match" })
                      }
                    )
                  },
                  theory.id
                )) : caseData.theories.map((tid, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 8 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.35, delay: i * 0.08 },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(TagBadge, { label: tid })
                  },
                  tid
                ))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-14 pt-8 border-t border-border flex flex-wrap gap-3 items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              OutlinedButton,
              {
                variant: "ghost",
                onClick: () => navigate({ to: "/cases" }),
                "data-ocid": "footer-back-btn",
                children: "← All Cases"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              OutlinedButton,
              {
                onClick: () => navigate({ to: "/theory-match" }),
                "data-ocid": "footer-theory-btn",
                children: "Explore Theory Matcher"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function CaseDetailPage() {
  const { id } = useParams({ from: "/cases/$id" });
  const navigate = useNavigate();
  const caseId = (() => {
    try {
      return BigInt(id);
    } catch {
      return null;
    }
  })();
  const { data: caseData, isLoading, isError } = useGetCase(caseId);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingScreen, {});
  if (isError || caseData === null || caseData === void 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "max-w-[1400px] mx-auto px-6 md:px-10 py-24 text-center",
        "data-ocid": "case-not-found",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground block mb-3", children: "404 — File Not Found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display italic text-4xl text-foreground mb-8", children: "This case does not exist." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(OutlinedButton, { onClick: () => navigate({ to: "/cases" }), children: "Return to Archive" })
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CaseDossier, { caseData }) });
}
export {
  CaseDetailPage as default
};
