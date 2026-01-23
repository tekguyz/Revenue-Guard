import { z } from 'zod';

export const AIResponseSchema = z.object({
  score: z.number().min(0).max(10),
  bottleneck: z.string().optional(),
  ready_for_phase_1: z.boolean(),
  estimated_savings: z.number().optional(),
  company: z.string().optional(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

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
  timestamp: z.string(),
});