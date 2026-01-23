import { z } from 'zod';

export const FinalPayloadSchema = z.object({
  id: z.string().uuid(),
  timestamp: z.string().datetime(),
  lead: z.object({
    company: z.string(),
    email: z.string().email(),
    metrics: z.object({
      wastedHours: z.number(),
      potentialSavings: z.number(),
      score: z.number()
    })
  }),
  transcript_hash: z.string() // Security check for the conversation integrity
});

export type FinalPayload = z.infer<typeof FinalPayloadSchema>;