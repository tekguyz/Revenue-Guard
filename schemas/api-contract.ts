import { z } from 'zod';

/**
 * AIResponseSchema
 * Strictly validates the JSON_DATA block extracted from Gemini responses.
 * Uses .catch() to provide safe defaults if the AI generates illegal values.
 */
export const AIResponseSchema = z.object({
  score: z.number()
    .int()
    .min(0)
    .max(10)
    .catch(0), // Default to 0 if AI hallucinates a score like 11 or -1
  
  bottleneck: z.string()
    .min(1)
    .max(100)
    .optional()
    .catch("Unspecified Friction"),
  
  ready_for_phase_1: z.boolean()
    .catch(false),
  
  estimated_savings: z.number()
    .optional(),
  
  company: z.string()
    .min(1)
    .max(100)
    .optional()
    .catch("Unknown Organization"),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

/**
 * WebhookPayloadSchema
 * Contract for intermediate dispatches during the chat session.
 */
export const WebhookPayloadSchema = z.object({
  leadData: z.object({
    company: z.string(),
    bottleneck: z.string(),
    estimatedWastedHours: z.number(),
    qualificationScore: z.number(),
  }),
  transcript: z.array(z.object({
    role: z.string(),
    content: z.string(),
    timestamp: z.number(),
  })),
  timestamp: z.string().datetime(),
});