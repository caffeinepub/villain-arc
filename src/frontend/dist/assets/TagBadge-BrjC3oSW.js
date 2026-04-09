import { j as jsxRuntimeExports } from "./index-Dc4Qvpv5.js";
function TagBadge({ label, className = "" }) {
  const text = label.startsWith("#") ? label : `#${label}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-block font-mono text-[10px] tracking-widest uppercase text-muted-foreground border border-border px-2 py-0.5 ${className}`,
      children: text
    }
  );
}
export {
  TagBadge as T
};
