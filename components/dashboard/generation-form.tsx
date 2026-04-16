"use client";

import { useState, useTransition } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generateContent } from "@/actions/generate.action";
import type { GenerationPayload } from "@/types";

interface GenerationFormProps {
  onResult: (result: GenerationPayload) => void;
  onError: (error: string) => void;
}

export function GenerationForm({ onResult, onError }: GenerationFormProps) {
  const [prompt, setPrompt] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const result = await generateContent({ prompt });

      if (result.success) {
        onResult(result.data);
        setPrompt("");
      } else {
        onError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt">
          Video Topic or Script Excerpt
        </Label>
        <Textarea
          id="prompt"
          placeholder="e.g. 'Top 10 productivity tools for developers in 2025 — showing VSCode extensions, terminal tips, and AI assistants...'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[140px] resize-none"
          disabled={isPending}
          maxLength={1000}
        />
        <p className="text-xs text-zinc-500 text-right">
          {prompt.length}/1000
        </p>
      </div>

      <Button
        type="submit"
        disabled={isPending || prompt.trim().length < 10}
        className="w-full"
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Content
          </>
        )}
      </Button>
    </form>
  );
}
