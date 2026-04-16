import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "History — Smart Creator Engine",
};

export default async function HistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const generations = await prisma.generation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  if (generations.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          History
        </h1>
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="text-4xl">🎬</div>
          <div className="text-center">
            <p className="font-medium text-zinc-700 dark:text-zinc-300">
              No generations yet
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Start creating content to see your history here.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/generate">
              <Sparkles className="mr-2 h-4 w-4" />
              Create your first generation
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            History
          </h1>
          <p className="mt-1 text-zinc-500 dark:text-zinc-400">
            {generations.length} generation{generations.length !== 1 ? "s" : ""}{" "}
            total
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/generate">
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            New
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {generations.map((gen: { id: string; videoTitle: string; description: string; tags: string[]; imageUrl: string; createdAt: Date }) => (
          <Card key={gen.id} className="overflow-hidden group">
            <div className="relative aspect-video w-full bg-zinc-100 dark:bg-zinc-900">
              <Image
                src={gen.imageUrl}
                alt={gen.videoTitle}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <CardContent className="p-4">
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {gen.videoTitle}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                {gen.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {gen.tags.slice(0, 4).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {gen.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{gen.tags.length - 4}
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-xs text-zinc-400">
                {new Date(gen.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
