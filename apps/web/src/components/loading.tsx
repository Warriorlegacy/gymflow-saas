export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50">
      <div className="space-y-4 text-center">
        <LoadingSpinner className="h-12 w-12" />
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
      <div className="space-y-4">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-8 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function LoadingTable({
  rows = 5,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200">
      <div className="bg-slate-50 p-4">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 w-24 rounded bg-slate-200" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 p-4">
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 rounded bg-slate-100"
                style={{ width: `${Math.random() * 40 + 60}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
