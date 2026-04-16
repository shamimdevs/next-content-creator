import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Sparkles, Image, Tag, Shield, ArrowRight } from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Nav */}
      <nav className="flex h-16 items-center justify-between border-b border-zinc-100 px-6 dark:border-zinc-900">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            Smart Creator Engine
          </span>
        </div>
        <Button asChild size="sm">
          <Link href="/login">Get started free</Link>
        </Button>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Badge variant="secondary" className="mb-6">
          Powered by Gemini 1.5 Flash + Pollinations AI
        </Badge>
        <h1 className="text-5xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50">
          AI Content Engine for
          <span className="text-violet-600"> YouTube Creators</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
          Generate eye-catching thumbnails, SEO-optimized titles, descriptions,
          and tags in seconds. Freemium credits or bring your own API key.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/login">
              Start creating for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-zinc-400">
          5 free generations. No credit card required.
        </p>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 bg-zinc-50 px-6 py-20 dark:border-zinc-900 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Everything you need to grow your channel
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Image,
                title: "AI Thumbnails",
                description:
                  "Stunning 1280×720 thumbnails uploaded to Cloudinary for fast global delivery.",
                color: "text-violet-600",
                bg: "bg-violet-50 dark:bg-violet-950/40",
              },
              {
                icon: Sparkles,
                title: "SEO Titles",
                description:
                  "Click-worthy titles under 70 characters, optimized for YouTube search.",
                color: "text-amber-600",
                bg: "bg-amber-50 dark:bg-amber-950/40",
              },
              {
                icon: Tag,
                title: "Tags & Metadata",
                description:
                  "Auto-generated descriptions and tags to maximize discoverability.",
                color: "text-emerald-600",
                bg: "bg-emerald-50 dark:bg-emerald-950/40",
              },
              {
                icon: Shield,
                title: "BYOK Model",
                description:
                  "Use your own Gemini key for unlimited, zero-credit generations.",
                color: "text-blue-600",
                bg: "bg-blue-50 dark:bg-blue-950/40",
              },
            ].map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className={`mb-3 inline-flex rounded-lg p-2 ${bg}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
                  {title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Ready to scale your YouTube channel?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-zinc-500 dark:text-zinc-400">
          Join creators using Smart Creator Engine to ship content faster.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/login">
            Get started free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 px-6 py-6 text-center text-xs text-zinc-400 dark:border-zinc-900">
        © {new Date().getFullYear()} Smart Creator Engine. Built with Next.js,
        Gemini &amp; Cloudinary.
      </footer>
    </main>
  );
}
