import { Card, CardDescription, CardTitle } from "@gymflow/ui";

export function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="group card-hover space-y-3 border-slate-200/80">
      <CardDescription className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-brand-400" />
        {label}
      </CardDescription>
      <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </CardTitle>
      <p className="text-xs leading-relaxed text-slate-400">{helper}</p>
    </Card>
  );
}
