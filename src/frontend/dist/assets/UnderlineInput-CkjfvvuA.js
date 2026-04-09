import { r as reactExports, j as jsxRuntimeExports } from "./index-Dc4Qvpv5.js";
const UnderlineInput = reactExports.forwardRef(
  ({ label, error, className = "", id: propId, ...props }, ref) => {
    const autoId = reactExports.useId();
    const id = propId ?? autoId;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: id,
          className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          id,
          ref,
          className: `input-underline w-full text-sm ${error ? "border-destructive" : ""} ${className}`,
          ...props
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-destructive tracking-wide", children: error })
    ] });
  }
);
UnderlineInput.displayName = "UnderlineInput";
const UnderlineTextarea = reactExports.forwardRef(({ label, error, className = "", id: propId, ...props }, ref) => {
  const autoId = reactExports.useId();
  const id = propId ?? autoId;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "label",
      {
        htmlFor: id,
        className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground",
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        id,
        ref,
        className: `input-underline w-full text-sm resize-none ${error ? "border-destructive" : ""} ${className}`,
        ...props
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-destructive tracking-wide", children: error })
  ] });
});
UnderlineTextarea.displayName = "UnderlineTextarea";
export {
  UnderlineTextarea as U,
  UnderlineInput as a
};
