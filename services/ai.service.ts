import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { deductCredit } from "@/services/credit.service";
import { APP_CONFIG } from "@/config/app.config";
import type { MetadataResult } from "@/types";

async function getGeminiClient(userId: string): Promise<{
  client: GoogleGenerativeAI;
  isByok: boolean;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { geminiApiKey: true },
  });

  if (user?.geminiApiKey) {
    const decryptedKey = decrypt(user.geminiApiKey);
    return { client: new GoogleGenerativeAI(decryptedKey), isByok: true };
  }

  const adminKey = process.env.GEMINI_ADMIN_KEY;
  if (!adminKey) throw new Error("GEMINI_ADMIN_KEY is not configured");

  return { client: new GoogleGenerativeAI(adminKey), isByok: false };
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = APP_CONFIG.maxRetries,
  delayMs = APP_CONFIG.retryDelayMs,
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, delayMs * 2 ** attempt));
    }
  }
  throw new Error("unreachable");
}

export async function generateMetadata(
  userId: string,
  prompt: string,
): Promise<MetadataResult> {
  const { client, isByok } = await getGeminiClient(userId);

  // Deduct credit before generation when using system key
  if (!isByok) {
    await deductCredit(userId);
  }

  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  const systemPrompt = `You are an expert YouTube SEO specialist. Given a video topic or script excerpt, generate:
1. An engaging, click-worthy video title (max 70 characters)
2. A compelling SEO-optimized description (150-300 words, include keywords naturally)
3. A list of 10-15 relevant hashtag-free tags (comma separated, lowercase)

Respond ONLY with valid JSON in this exact format:
{
  "videoTitle": "string",
  "description": "string",
  "tags": ["string", "string"]
}`;

  const result = await withRetry(() =>
    model.generateContent([systemPrompt, `Video topic/script: ${prompt}`]),
  );

  const text = result.response.text().trim();

  // Strip potential markdown code fences
  const jsonStr = text.replace(/^```json?\s*/i, "").replace(/\s*```$/, "");

  let parsed: MetadataResult;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("AI returned malformed JSON. Please try again.");
  }

  if (!parsed.videoTitle || !parsed.description || !Array.isArray(parsed.tags)) {
    throw new Error("AI response is missing required fields.");
  }

  return parsed;
}
