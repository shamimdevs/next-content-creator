export const APP_CONFIG = {
  name: "Smart Creator Engine",
  description: "AI-powered YouTube content generation platform",
  defaultCredits: 5,
  maxRetries: 3,
  retryDelayMs: 1000,
  rateLimits: {
    generationsPerMinute: 5,
    generationsPerDay: 50,
  },
} as const;

export const CREDIT_COST = {
  generation: 1,
} as const;

export const CREDIT_REASONS = {
  generation: "generation",
  signupBonus: "signup_bonus",
  adminGrant: "admin_grant",
} as const;
