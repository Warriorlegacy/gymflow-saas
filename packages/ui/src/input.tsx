import * as React from "react";
import { cn } from "@gymflow/lib";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-brand-200 transition placeholder:text-slate-400 focus:ring-2",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

