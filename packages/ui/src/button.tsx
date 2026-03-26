import * as React from "react";
import { cn } from "@gymflow/lib";

const variants = {
  default: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-white text-slate-900 hover:bg-slate-100",
  outline: "border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-100"
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
}

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

