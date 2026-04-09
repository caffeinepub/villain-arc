import { j as jsxRuntimeExports } from "./index-Dc4Qvpv5.js";
function EditorialCard({
  children,
  className = "",
  onClick,
  featured = false,
  "data-ocid": dataOcid
}) {
  const base = "border border-border bg-card transition-all duration-300 fade-in";
  const hover = onClick ? "cursor-pointer hover:-translate-y-0.5 hover:border-foreground" : "";
  const size = featured ? "p-8 md:p-12" : "p-6";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `${base} ${hover} ${size} ${className}`,
      onClick,
      onKeyDown: onClick ? (e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      } : void 0,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      "data-ocid": dataOcid,
      children
    }
  );
}
function SeverityBar({ value, max = 10, label }) {
  const pct = Math.min(100, Math.round(value / max * 100));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[10px] text-muted-foreground", children: [
        value,
        "/",
        max
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border w-full relative overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-px bg-foreground transition-all duration-700",
        style: { width: `${pct}%` }
      }
    ) })
  ] });
}
export {
  EditorialCard as E,
  SeverityBar as S
};
