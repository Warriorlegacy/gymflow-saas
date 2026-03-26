import { Card, CardDescription, CardTitle } from "@gymflow/ui";

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <Card className="space-y-2">
      <CardDescription>{label}</CardDescription>
      <CardTitle className="text-3xl">{value}</CardTitle>
      <p className="text-sm text-slate-500">{helper}</p>
    </Card>
  );
}

