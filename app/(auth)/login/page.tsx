import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginButton } from "@/components/shared/login-button";
import { Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Smart Creator Engine",
  description: "Sign in to start generating AI-powered YouTube content",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="w-full max-w-md space-y-8 px-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-500/30">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Smart Creator Engine
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            AI-powered YouTube thumbnails &amp; SEO metadata
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-4">
            <div className="space-y-1 text-center">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Get started for free
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                5 free credits on signup. No credit card required.
              </p>
            </div>

            <LoginButton />

            <p className="text-center text-xs text-zinc-400">
              By signing in, you agree to our{" "}
              <span className="underline underline-offset-2">Terms of Service</span>
              {" "}and{" "}
              <span className="underline underline-offset-2">Privacy Policy</span>.
            </p>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs text-zinc-500">
          {[
            { icon: "🎨", label: "AI Thumbnails" },
            { icon: "📝", label: "SEO Titles" },
            { icon: "🔑", label: "BYOK Support" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="text-xl mb-1">{icon}</div>
              {label}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
