import { AppShell } from "@/components/app-shell";
import { LoadingTable } from "@/components/loading";

export default function Loading() {
  return (
    <AppShell heading="Attendance" subheading="Loading attendance...">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6 shadow-card">
          <div className="space-y-4">
            <div className="h-6 w-32 rounded bg-slate-200" />
            <div className="h-3 w-48 rounded bg-slate-200" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-16 rounded bg-slate-200" />
                <div className="h-10 w-full rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
        <LoadingTable rows={5} cols={4} />
      </div>
    </AppShell>
  );
}
