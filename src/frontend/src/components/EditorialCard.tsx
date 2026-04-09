import type { ReactNode } from "react";

interface EditorialCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  featured?: boolean;
  "data-ocid"?: string;
}

export function EditorialCard({
  children,
  className = "",
  onClick,
  featured = false,
  "data-ocid": dataOcid,
}: EditorialCardProps) {
  const base =
    "border border-border bg-card transition-all duration-300 fade-in";
  const hover = onClick
    ? "cursor-pointer hover:-translate-y-0.5 hover:border-foreground"
    : "";
  const size = featured ? "p-8 md:p-12" : "p-6";

  return (
    <div
      className={`${base} ${hover} ${size} ${className}`}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick();
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      data-ocid={dataOcid}
    >
      {children}
    </div>
  );
}

interface SeverityBarProps {
  value: number;
  max?: number;
  label?: string;
}

export function SeverityBar({ value, max = 10, label }: SeverityBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <div className="flex justify-between items-center">
          <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {value}/{max}
          </span>
        </div>
      )}
      <div className="h-px bg-border w-full relative overflow-hidden">
        <div
          className="h-px bg-foreground transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
