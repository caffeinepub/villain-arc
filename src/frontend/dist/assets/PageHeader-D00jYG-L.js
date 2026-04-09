import { j as jsxRuntimeExports } from "./index-Dc4Qvpv5.js";
function PageHeader({ title, subtitle, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10 fade-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2", children: subtitle }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display italic text-4xl md:text-5xl tracking-tight text-foreground leading-none", children: title })
      ] }),
      children && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 pt-1", children })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border w-full" })
  ] });
}
export {
  PageHeader as P
};
