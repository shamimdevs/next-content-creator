// Smart Creator Engine — Shared Type Definitions

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface GenerationPayload {
  videoTitle: string;
  description: string;
  tags: string[];
  imageUrl: string;
  prompt: string;
  id: string;
  createdAt: Date;
}

export interface GenerateInput {
  prompt: string;
}

export interface MetadataResult {
  videoTitle: string;
  description: string;
  tags: string[];
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  credits: number;
  geminiApiKey: string | null;
  role: "USER" | "ADMIN";
}
