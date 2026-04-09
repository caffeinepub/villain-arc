interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="mb-10 fade-in">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
            {subtitle}
          </h1>
          <h2 className="font-display italic text-4xl md:text-5xl tracking-tight text-foreground leading-none">
            {title}
          </h2>
        </div>
        {children && <div className="shrink-0 pt-1">{children}</div>}
      </div>
      <div className="h-px bg-border w-full" />
    </div>
  );
}
