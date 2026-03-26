import { Badge, Card, CardDescription, CardTitle } from "@gymflow/ui";
import { OnboardingForm } from "@/components/onboarding-form";

export default function OnboardingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-5 bg-slate-950 text-white">
          <Badge className="bg-white/10 text-white">New gym setup</Badge>
          <div className="space-y-3">
            <CardTitle className="text-3xl text-white">Provision a new gym tenant in minutes.</CardTitle>
            <CardDescription className="text-slate-300">
              This creates the gym record and owner profile with a starter trial path, ready for Supabase-backed onboarding.
            </CardDescription>
          </div>
          <ul className="space-y-3 text-sm text-slate-300">
            <li>Free-tier friendly tenant provisioning</li>
            <li>Starter, growth, and scale demo plan assignment</li>
            <li>Owner contact and city metadata captured up front</li>
          </ul>
        </Card>
        <OnboardingForm />
      </div>
    </main>
  );
}

