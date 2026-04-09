import type { ButtonHTMLAttributes } from "react";

interface OutlinedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function OutlinedButton({
  variant = "default",
  size = "md",
  className = "",
  children,
  ...props
}: OutlinedButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1 text-xs",
    md: "px-5 py-2 text-xs",
    lg: "px-8 py-3 text-sm",
  };

  const variantClasses = {
    default:
      "border border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background",
    ghost:
      "border border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground",
    danger:
      "border border-destructive bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground",
  };

  return (
    <button
      className={`font-mono tracking-widest uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
