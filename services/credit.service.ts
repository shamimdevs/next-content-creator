import "server-only";
import { prisma } from "@/lib/prisma";
import { CREDIT_COST, CREDIT_REASONS } from "@/config/app.config";

export class InsufficientCreditsError extends Error {
  constructor() {
    super("You have no credits remaining. Add your own API key or purchase more credits.");
    this.name = "InsufficientCreditsError";
  }
}

/**
 * Atomically check and deduct 1 credit.
 * Uses a findOneAndUpdate-style conditional update to prevent race conditions.
 * Throws InsufficientCreditsError if the user is out of credits.
 */
export async function deductCredit(userId: string): Promise<void> {
  const result = await prisma.user.updateMany({
    where: {
      id: userId,
      credits: { gte: CREDIT_COST.generation },
    },
    data: {
      credits: { decrement: CREDIT_COST.generation },
    },
  });

  if (result.count === 0) {
    throw new InsufficientCreditsError();
  }

  // Append audit log (fire-and-forget acceptable here — non-critical path)
  await prisma.creditLog.create({
    data: {
      userId,
      delta: -CREDIT_COST.generation,
      reason: CREDIT_REASONS.generation,
    },
  });
}

export async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  return user?.credits ?? 0;
}
