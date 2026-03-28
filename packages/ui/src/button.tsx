import * as React from "react";
import { cn } from "@gymflow/lib";

const variants = {
  default:
    "bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow-md active:scale-[0.98]",
  secondary:
    "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]",
  outline:
    "border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]",
  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  danger:
    "bg-red-500 text-white shadow-sm hover:bg-red-600 hover:shadow-md active:scale-[0.98]",
};

const sizes = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-sm gap-2.5",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export function Button({
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
