interface TagBadgeProps {
  label: string;
  className?: string;
}

export function TagBadge({ label, className = "" }: TagBadgeProps) {
  const text = label.startsWith("#") ? label : `#${label}`;
  return (
    <span
      className={`inline-block font-mono text-[10px] tracking-widest uppercase text-muted-foreground border border-border px-2 py-0.5 ${className}`}
    >
      {text}
    </span>
  );
}
