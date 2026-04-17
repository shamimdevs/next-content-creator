'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateMetadata } from '@/services/ai.service';
import { generateAndUploadThumbnail } from '@/services/image.service';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { ActionResult, GenerationPayload } from '@/types';

const GenerateSchema = z.object({
  prompt: z
    .string()
    .min(10, 'Prompt must be at least 10 characters')
    .max(1000, 'Prompt must be under 1000 characters'),
});

export async function generateContent(input: unknown): Promise<ActionResult<GenerationPayload>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }
    const userId = session.user.id;

    const parsed = GenerateSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
    }
    const { prompt } = parsed.data;

    // Run AI metadata + image generation in parallel.
    // Credit deduction happens inside generateMetadata when using system key.
    const [metadata, imageUrl] = await Promise.all([
      generateMetadata(userId, prompt),
      generateAndUploadThumbnail(prompt, userId),
    ]);
    console.log(metadata, 'metadata');
    console.log(imageUrl, 'imageUrl');

    const generation = await prisma.generation.create({
      data: {
        userId,
        prompt,
        videoTitle: metadata.videoTitle,
        description: metadata.description,
        tags: metadata.tags,
        imageUrl,
      },
    });

    revalidatePath('/dashboard/history');

    return {
      success: true,
      data: {
        id: generation.id,
        videoTitle: generation.videoTitle,
        description: generation.description,
        tags: generation.tags,
        imageUrl: generation.imageUrl,
        prompt: generation.prompt,
        createdAt: generation.createdAt,
      },
    };
  } catch (err) {
    console.error('Generation error:', err);
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return { success: false, error: message };
  }
}

export async function getGenerationHistory(): Promise<ActionResult<GenerationPayload[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const generations = await prisma.generation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      success: true,
      data: generations.map(
        (g: {
          id: string;
          videoTitle: string;
          description: string;
          tags: string[];
          imageUrl: string;
          prompt: string;
          createdAt: Date;
        }) => ({
          id: g.id,
          videoTitle: g.videoTitle,
          description: g.description,
          tags: g.tags,
          imageUrl: g.imageUrl,
          prompt: g.prompt,
          createdAt: g.createdAt,
        }),
      ),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load history';
    return { success: false, error: message };
  }
}
