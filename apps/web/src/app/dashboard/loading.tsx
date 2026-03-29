import { AppShell } from "@/components/app-shell";
import { LoadingTable } from "@/components/loading";

export default function Loading() {
  return (
    <AppShell heading="Dashboard" subheading="Loading dashboard metrics...">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card"
          >
            <div className="space-y-3">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-8 w-32 rounded bg-slate-200" />
              <div className="h-3 w-40 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
