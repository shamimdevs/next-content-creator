"use client";

import { useState } from "react";
import { AlertCircle, Lightbulb } from "lucide-react";
import { GenerationForm } from "@/components/dashboard/generation-form";
import { ResultCard } from "@/components/dashboard/result-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { GenerationPayload } from "@/types";

const EXAMPLE_PROMPTS = [
  "Top 10 VS Code extensions every developer needs in 2025",
  "How to make $10,000/month as a freelance developer — full roadmap",
  "I built an AI SaaS in 7 days — here's everything I learned",
];

export default function GeneratePage() {
  const [result, setResult] = useState<GenerationPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleResult(data: GenerationPayload) {
    setResult(data);
    setError(null);
  }

  function handleError(msg: string) {
    setError(msg);
    setResult(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Generate Content
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Enter your video topic and let AI generate a thumbnail, title,
          description, and tags.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Video Details</CardTitle>
              <CardDescription>
                Be specific for better results. Include your target audience,
                main topic, and tone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenerationForm onResult={handleResult} onError={handleError} />
            </CardContent>
          </Card>

          {/* Example prompts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Example Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    // Note: in a real app you'd lift this state or use a ref
                    // For now just show as inspiration
                  }}
                  className="block w-full rounded-lg border border-zinc-200 px-3 py-2 text-left text-xs text-zinc-600 transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-violet-950/30"
                >
                  {prompt}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Result */}
        <div>
          {error && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result ? (
            <ResultCard result={result} />
          ) : (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
              <div className="text-center text-zinc-400">
                <div className="text-4xl mb-3">🎨</div>
                <p className="text-sm font-medium">Your results will appear here</p>
                <p className="text-xs mt-1">
                  Thumbnail, title, description &amp; tags
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
