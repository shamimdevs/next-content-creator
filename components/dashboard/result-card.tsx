"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Check,
  Copy,
  Download,
  Tag,
  FileText,
  Heading1,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GenerationPayload } from "@/types";

interface ResultCardProps {
  result: GenerationPayload;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="h-7 gap-1 text-xs"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-500" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {label}
        </>
      )}
    </Button>
  );
}

export function ResultCard({ result }: ResultCardProps) {
  const tagsText = result.tags.join(", ");

  async function handleDownload() {
    const response = await fetch(result.imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `thumbnail-${result.id}.webp`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {/* Thumbnail Preview */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={result.imageUrl}
            alt={result.videoTitle}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 700px"
          />
          <div className="absolute bottom-3 right-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleDownload}
              className="gap-1.5 shadow-lg"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>
      </Card>

      {/* Video Title */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Heading1 className="h-4 w-4 text-violet-600" />
              Video Title
            </CardTitle>
            <CopyButton text={result.videoTitle} label="Copy Title" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {result.videoTitle}
          </p>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-violet-600" />
              Description
            </CardTitle>
            <CopyButton text={result.description} label="Copy Description" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-zinc-700 whitespace-pre-line dark:text-zinc-300">
            {result.description}
          </p>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Tag className="h-4 w-4 text-violet-600" />
              Tags
            </CardTitle>
            <CopyButton text={tagsText} label="Copy Tags" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {result.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
