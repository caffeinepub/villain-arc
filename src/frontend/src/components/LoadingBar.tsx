interface LoadingBarProps {
  className?: string;
}

export function LoadingBar({ className = "" }: LoadingBarProps) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div className="loading-bar w-full" />
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-8 z-50">
      <div className="text-center">
        <span className="font-display italic text-2xl tracking-widest text-foreground">
          VILLAIN ARC
        </span>
      </div>
      <div className="w-32">
        <LoadingBar />
      </div>
    </div>
  );
}
