import { AppShell } from "@/components/app-shell";

export default function Loading() {
  return (
    <AppShell heading="Billing" subheading="Loading billing information...">
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-5 w-32 rounded bg-slate-200" />
                <div className="h-3 w-48 rounded bg-slate-200" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-10 rounded bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
