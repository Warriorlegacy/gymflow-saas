import Link from "next/link";
import { Button } from "@gymflow/ui";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-50 px-4">
      <div className="text-center">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-4xl font-bold text-brand-600">
            404
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline">Go home</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Open dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
