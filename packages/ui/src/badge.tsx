import * as React from "react";
import { cn } from "@gymflow/lib";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700",
        className
      )}
      {...props}
    />
  );
}

