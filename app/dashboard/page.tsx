import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Image, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Smart Creator Engine",
};

export default async function DashboardPage() {
  const session = await auth();
  const userResult = await getCurrentUser();
  if (!userResult.success) return null;
  const user = userResult.data;

  const [totalGenerations, recentGenerations] = await Promise.all([
    prisma.generation.count({ where: { userId: session!.user!.id! } }),
    prisma.generation.findMany({
      where: { userId: session!.user!.id! },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const stats = [
    {
      label: "Total Generations",
      value: totalGenerations,
      icon: Sparkles,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/40",
    },
    {
      label: "Credits Remaining",
      value: user.geminiApiKey ? "∞" : user.credits,
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      label: "Thumbnails Created",
      value: totalGenerations,
      icon: Image,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      label: "BYOK Status",
      value: user.geminiApiKey ? "Active" : "Not set",
      icon: TrendingUp,
      color: user.geminiApiKey ? "text-emerald-600" : "text-zinc-400",
      bg: user.geminiApiKey
        ? "bg-emerald-50 dark:bg-emerald-950/40"
        : "bg-zinc-100 dark:bg-zinc-800",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Welcome back, {user.name?.split(" ")[0]}!
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Here&apos;s an overview of your content creation activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {label}
                  </p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button asChild>
            <Link href="/dashboard/generate">
              <Sparkles className="mr-2 h-4 w-4" />
              New Generation
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/settings">Configure BYOK</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Generations */}
      {recentGenerations.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Recent Generations
            </h2>
            <Button variant="link" size="sm" asChild className="h-auto p-0">
              <Link href="/dashboard/history">View all →</Link>
            </Button>
          </div>

          <div className="space-y-2">
            {recentGenerations.map((gen: { id: string; videoTitle: string; description: string; tags: string[]; imageUrl: string; createdAt: Date }) => (
              <Card key={gen.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={gen.imageUrl}
                    alt={gen.videoTitle}
                    className="h-16 w-28 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {gen.videoTitle}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-1">
                      {gen.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs text-zinc-400">
                    {new Date(gen.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
