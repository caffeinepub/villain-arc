import { r as reactExports, M as MotionConfigContext, j as jsxRuntimeExports, i as isHTMLElement, d as useConstant, P as PresenceContext, e as usePresence, f as useIsomorphicLayoutEffect, g as LayoutGroupContext, a as Layout, O as OutlinedButton, m as motion, h as LoadingBar, u as useNavigate } from "./index-Dc4Qvpv5.js";
import { P as PageHeader } from "./PageHeader-D00jYG-L.js";
import { U as UnderlineTextarea } from "./UnderlineInput-CkjfvvuA.js";
import { d as useMatchTheories } from "./useQueries-CW8XzbIE.js";
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const MIN_CHARS = 300;
function ConfidenceBar({ value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border w-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      className: "h-full bg-foreground",
      initial: { width: 0 },
      animate: { width: `${value}%` },
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }
    }
  ) });
}
function CaseChip({
  caseId,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground border-b border-border hover:text-foreground hover:border-foreground transition-smooth pb-px",
      "data-ocid": `theory-case-link-${caseId}`,
      children: [
        "Case #",
        caseId.toString()
      ]
    }
  );
}
function TheoryResultCard({
  result,
  index
}) {
  const navigate = useNavigate();
  const confidence = Number(result.confidence);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 28 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.55,
        ease: [0.4, 0, 0.2, 1],
        delay: index * 0.1
      },
      className: "border border-border bg-card p-6 md:p-8 group hover:border-muted-foreground transition-smooth",
      "data-ocid": `theory-result-${result.theoryId}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2", children: [
              "Match #",
              index + 1,
              " · ",
              result.theoryId
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display italic text-2xl md:text-3xl leading-tight text-foreground", children: result.theoryName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-right leading-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-4xl md:text-5xl tracking-tight text-foreground", children: confidence }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground", children: "%" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] tracking-widest uppercase text-muted-foreground mt-1", children: "Confidence" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ConfidenceBar, { value: confidence }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body text-sm text-muted-foreground leading-relaxed", children: result.explanation }),
        result.matchedCaseIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 pt-3 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground", children: "Matched Cases" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4", children: result.matchedCaseIds.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CaseChip,
            {
              caseId: id,
              onClick: () => navigate({
                to: "/cases/$id",
                params: { id: id.toString() }
              })
            },
            id.toString()
          )) })
        ] })
      ] })
    }
  );
}
function EmptyState({ type }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.4 },
      className: "border border-border p-16 text-center",
      "data-ocid": type === "idle" ? "theory-idle-state" : "theory-empty-state",
      children: type === "idle" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display italic text-2xl text-foreground mb-3", children: "Describe a scenario." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground max-w-xs mx-auto leading-relaxed", children: "The engine cross-references behavioral indicators against eight criminological frameworks" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display italic text-2xl text-foreground mb-3", children: "No theories matched this scenario." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground max-w-xs mx-auto leading-relaxed", children: "Try elaborating on behavioral context, motive, or social environment" })
      ] })
    }
  );
}
function TheoryMatchPage() {
  const [scenario, setScenario] = reactExports.useState("");
  const [results, setResults] = reactExports.useState(null);
  const [hasSubmitted, setHasSubmitted] = reactExports.useState(false);
  const cacheRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const { mutateAsync: matchTheories, isPending } = useMatchTheories();
  const charCount = scenario.trim().length;
  const isReady = charCount >= MIN_CHARS;
  const remaining = Math.max(0, MIN_CHARS - charCount);
  async function handleAnalyze() {
    const key = scenario.trim();
    if (!key || !isReady) return;
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
        (a, b) => Number(b.confidence) - Number(a.confidence)
      );
      cacheRef.current.set(key, sorted);
      setResults(sorted);
    } catch {
      setResults([]);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[900px] mx-auto px-6 md:px-10 py-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Theory Matcher",
        subtitle: "Criminological Analysis Engine"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-10 flex flex-col gap-6",
        "data-ocid": "theory-input-zone",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            UnderlineTextarea,
            {
              label: "Describe the crime scenario",
              placeholder: "Detail the offender's behavior, background, motive, social environment, victim relationship, and circumstances of the crime. Minimum 300 characters for accurate theory matching...",
              value: scenario,
              onChange: (e) => setScenario(e.target.value),
              rows: 7,
              "data-ocid": "theory-scenario-input",
              "aria-label": "Crime scenario description"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest text-muted-foreground tabular-nums", children: charCount < MIN_CHARS ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              remaining,
              " characters remaining"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-foreground", children: [
              charCount,
              " characters — ready"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              OutlinedButton,
              {
                size: "lg",
                disabled: !isReady || isPending,
                onClick: handleAnalyze,
                "data-ocid": "theory-analyze-btn",
                children: isPending ? "Analyzing..." : "Analyze Scenario"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "mb-10",
        "data-ocid": "theory-loading",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingBar, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground mt-4 text-center", children: "Cross-referencing behavioral indicators against criminological frameworks" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4", "data-ocid": "theory-results", children: [
      !isPending && !hasSubmitted && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { type: "idle" }),
      !isPending && hasSubmitted && results !== null && results.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { type: "no-match" }),
      !isPending && results !== null && results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground shrink-0", children: [
            results.length,
            " theor",
            results.length === 1 ? "y" : "ies",
            " matched"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-[10px] tracking-widest uppercase text-muted-foreground shrink-0", children: "Sorted by confidence" })
        ] }),
        results.map((result, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          TheoryResultCard,
          {
            result,
            index
          },
          result.theoryId
        ))
      ] })
    ] })
  ] }) });
}
export {
  TheoryMatchPage as default
};
