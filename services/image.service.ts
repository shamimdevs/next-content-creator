import "server-only";
import { cloudinary } from "@/lib/cloudinary";
import { APP_CONFIG } from "@/config/app.config";

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";

function buildPollinationsUrl(prompt: string): string {
  const encoded = encodeURIComponent(
    `YouTube thumbnail, ${prompt}, vibrant colors, professional design, 16:9 aspect ratio`,
  );
  return `${POLLINATIONS_BASE}/${encoded}?width=1280&height=720&nologo=true&enhance=true`;
}

async function fetchImageWithRetry(
  url: string,
  retries = APP_CONFIG.maxRetries,
): Promise<Buffer> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
      if (!response.ok) {
        throw new Error(`Pollinations returned ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) =>
        setTimeout(r, APP_CONFIG.retryDelayMs * 2 ** attempt),
      );
    }
  }
  throw new Error("unreachable");
}

export async function generateAndUploadThumbnail(
  prompt: string,
  userId: string,
): Promise<string> {
  const pollinationsUrl = buildPollinationsUrl(prompt);
  const imageBuffer = await fetchImageWithRetry(pollinationsUrl);

  const cloudinaryResult = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `smart-creator/${userId}`,
            resource_type: "image",
            format: "webp",
            transformation: [{ width: 1280, height: 720, crop: "fill" }],
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Cloudinary upload failed"));
            } else {
              resolve(result as { secure_url: string });
            }
          },
        )
        .end(imageBuffer);
    },
  );

  return cloudinaryResult.secure_url;
}
