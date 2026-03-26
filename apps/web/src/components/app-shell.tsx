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
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 md:flex-row md:px-6">
        <aside className="md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-72">
          <Card className="flex h-full flex-col justify-between bg-slate-950 text-white">
            <div className="space-y-8">
              <div className="space-y-3">
                <Badge className="bg-white/10 text-white">GymFlow SaaS</Badge>
                <div>
                  <h1 className="text-2xl font-semibold">Run your gym from one control room.</h1>
                  <p className="mt-2 text-sm text-slate-300">Multi-tenant operations, AI, WhatsApp, billing demos, and mobile tracking.</p>
                </div>
              </div>
              <nav className="grid gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-slate-300">Demo tenant safety: every data path is filtered by `gym_id` in SQL and service logic.</p>
              <Button className="mt-4 w-full" variant="secondary">
                Demo billing active
              </Button>
            </div>
          </Card>
        </aside>
        <main className="flex-1 space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-slate-950">{heading}</h2>
              <p className="text-sm text-slate-600">{subheading}</p>
            </div>
            <LogoutButton />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

