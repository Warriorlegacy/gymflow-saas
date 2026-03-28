import Link from "next/link";
import { navigationItems } from "@gymflow/lib";
import { Badge, Button, Card } from "@gymflow/ui";
import { LogoutButton } from "./logout-button";

export function AppShell({
  heading,
  subheading,
  children
}: {
  heading: string;
  subheading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-50">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-6 md:flex-row md:px-6 lg:px-8">
        <aside className="md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-72 md:shrink-0">
          <div className="flex h-full flex-col justify-between rounded-2xl bg-slate-950 p-6 shadow-2xl ring-1 ring-white/10">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                    GF
                  </div>
                  <Badge className="bg-white/10 text-white ring-white/10">SaaS</Badge>
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-white">GymFlow</h1>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">
                    Multi-tenant gym operations
                  </p>
                </div>
              </div>
              <nav className="grid gap-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600 transition-colors group-hover:bg-brand-400" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-brand-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="text-xs font-semibold">Tenant Secure</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  Every query is filtered by gym_id for complete data isolation.
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">{heading}</h2>
              <p className="text-sm leading-relaxed text-slate-500">{subheading}</p>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
