import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  forwardRef,
  useId,
} from "react";

interface UnderlineInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const UnderlineInput = forwardRef<HTMLInputElement, UnderlineInputProps>(
  ({ label, error, className = "", id: propId, ...props }, ref) => {
    const autoId = useId();
    const id = propId ?? autoId;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`input-underline w-full text-sm ${error ? "border-destructive" : ""} ${className}`}
          {...props}
        />
        {error && (
          <span className="font-mono text-[10px] text-destructive tracking-wide">
            {error}
          </span>
        )}
      </div>
    );
  },
);
UnderlineInput.displayName = "UnderlineInput";

interface UnderlineTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const UnderlineTextarea = forwardRef<
  HTMLTextAreaElement,
  UnderlineTextareaProps
>(({ label, error, className = "", id: propId, ...props }, ref) => {
  const autoId = useId();
  const id = propId ?? autoId;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        className={`input-underline w-full text-sm resize-none ${error ? "border-destructive" : ""} ${className}`}
        {...props}
      />
      {error && (
        <span className="font-mono text-[10px] text-destructive tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
});
UnderlineTextarea.displayName = "UnderlineTextarea";
