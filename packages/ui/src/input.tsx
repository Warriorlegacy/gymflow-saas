import * as React from "react";
import { cn } from "@gymflow/lib";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none ring-brand-200 transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-300 focus:ring-2 focus:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
