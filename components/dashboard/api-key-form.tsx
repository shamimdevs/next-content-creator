"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Loader2, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveApiKey } from "@/actions/user.action";

interface ApiKeyFormProps {
  hasExistingKey: boolean;
}

export function ApiKeyForm({ hasExistingKey }: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleSave() {
    startTransition(async () => {
      const result = await saveApiKey({ geminiApiKey: apiKey });
      if (result.success) {
        setMessage({ type: "success", text: "API key saved successfully." });
        setApiKey("");
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await saveApiKey({ geminiApiKey: "" });
      if (result.success) {
        setMessage({ type: "success", text: "API key removed." });
        setApiKey("");
      } else {
        setMessage({ type: "error", text: result.error });
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">
          {hasExistingKey ? "Replace API Key" : "Add API Key"}
        </Label>
        <div className="relative">
          <Input
            id="apiKey"
            type={showKey ? "text" : "password"}
            placeholder={hasExistingKey ? "Enter new key to replace..." : "AIzaSy..."}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            aria-label={showKey ? "Hide API key" : "Show API key"}
          >
            {showKey ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-500">
          Your key is encrypted with AES-256-GCM and never returned to the client.
        </p>
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === "success"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          disabled={isPending || apiKey.trim().length < 20}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Key
        </Button>

        {hasExistingKey && (
          <Button
            variant="destructive"
            onClick={handleRemove}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove Key
          </Button>
        )}
      </div>
    </div>
  );
}
