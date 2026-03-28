import * as React from "react";
import { cn } from "@gymflow/lib";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-700 ring-1 ring-brand-100/60",
        className
      )}
      {...props}
    />
  );
}
