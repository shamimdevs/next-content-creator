import { getCurrentUser } from "@/actions/user.action";
import { redirect } from "next/navigation";
import { ApiKeyForm } from "@/components/dashboard/api-key-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Smart Creator Engine",
};

export default async function SettingsPage() {
  const result = await getCurrentUser();
  if (!result.success) redirect("/login");
  const user = result.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Settings
        </h1>
        <p className="mt-1 text-zinc-500 dark:text-zinc-400">
          Manage your account and API configuration.
        </p>
      </div>

      {/* BYOK Info Card */}
      <Card className="border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/20">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
          <div className="text-sm text-violet-800 dark:text-violet-300">
            <p className="font-medium">Bring Your Own Key (BYOK)</p>
            <p className="mt-1 text-violet-700 dark:text-violet-400">
              Add your Gemini API key to get unlimited generations at no credit cost.
              Your key is encrypted with AES-256-GCM before storage.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Key Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-violet-600" />
                Gemini API Key
              </CardTitle>
              <CardDescription className="mt-1">
                Get your free API key from Google AI Studio.
              </CardDescription>
            </div>
            <Badge variant={user.geminiApiKey ? "success" : "secondary"}>
              {user.geminiApiKey ? "Active" : "Not set"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ApiKeyForm hasExistingKey={!!user.geminiApiKey} />
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-violet-600" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Name", value: user.name ?? "—" },
            { label: "Email", value: user.email },
            { label: "Role", value: user.role },
            {
              label: "Credits",
              value: user.geminiApiKey ? "Unlimited (BYOK)" : String(user.credits),
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-zinc-100 pb-2 last:border-0 last:pb-0 dark:border-zinc-800"
            >
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {label}
              </span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
