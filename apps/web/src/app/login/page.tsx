import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-surface-50 bg-dots px-4 py-10">
      <div className="absolute inset-0 bg-hero-glow opacity-60" />
      <div className="relative w-full max-w-md animate-fade-in-up">
        <LoginForm />
      </div>
    </main>
  );
}
