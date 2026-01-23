import { z } from 'zod';

/**
 * FinalPayloadSchema
 * Enforces strict object integrity for final dispatch to the TEKGUYZ Vault.
 * Prevents "Junk Property Injection" using .strict().
 */
export const FinalPayloadSchema = z.object({
  id: z.string().uuid(),
  
  // Enforces ISO-8601 UTC format
  timestamp: z.string().datetime({ message: "Invalid ISO-8601 Timestamp" }),
  
  lead: z.object({
    company: z.string().min(1).max(100),
    email: z.string().email(),
    metrics: z.object({
      wastedHours: z.number().max(168),
      potentialSavings: z.number().nonnegative(),
      score: z.number().min(0).max(10)
    })
  }),

  // Cryptographic hash of the conversation for audit trails
  transcript_hash: z.string().startsWith("sha256-", "Integrity hash must be SHA-256 encoded"),

}).strict(); // REVENUE GUARD: Block any unmapped properties from reaching the backend.

export type FinalPayload = z.infer<typeof FinalPayloadSchema>;