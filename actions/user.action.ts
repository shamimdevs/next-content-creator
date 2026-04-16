"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/encryption";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { ActionResult, UserProfile } from "@/types";

const ApiKeySchema = z.object({
  geminiApiKey: z
    .string()
    .min(20, "API key appears too short")
    .max(200, "API key appears too long")
    .optional()
    .or(z.literal("")),
});

export async function saveApiKey(
  input: unknown,
): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = ApiKeySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const rawKey = parsed.data.geminiApiKey;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        geminiApiKey: rawKey ? encrypt(rawKey) : null,
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Failed to save API key" };
  }
}

export async function getCurrentUser(): Promise<ActionResult<UserProfile>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        credits: true,
        geminiApiKey: true,
        role: true,
      },
    });

    if (!user) return { success: false, error: "User not found" };

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        credits: user.credits,
        // Only signal presence, never return the encrypted key to the client
        geminiApiKey: user.geminiApiKey ? "••••••••••••••••" : null,
        role: user.role,
      },
    };
  } catch {
    return { success: false, error: "Failed to load user profile" };
  }
}
