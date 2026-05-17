"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-50 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Something went wrong
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {process.env.NODE_ENV === "production"
                ? "An unexpected error occurred. Please try again."
                : error.message || "An unexpected error occurred"}
            </p>
          </div>
          <button
            onClick={reset}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
