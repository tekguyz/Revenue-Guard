
import { z } from 'zod';

/**
 * TEKGUYZ FINANCIAL CONSTANTS (Defaults)
 */
export const ROI_CONSTANTS = {
  DEFAULT_HOURLY_RATE: 35, 
  EFFICIENCY_FACTOR: 0.70 
} as const;

// Allowing all valid email formats. No more generic provider blocking.
export const LeadSanitySchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please provide a valid email address (e.g. name@domain.com)"),
  
  staffCount: z.number()
    .int()
    .min(1, "Team size must be at least 1")
    .max(100000),

  estimatedWastedHours: z.number()
    .min(0.1, "Minimum 0.1 hours per person")
    .max(168, "Input exceeds weekly limit"),

  hourlyRate: z.number()
    .min(1, "Rate must be at least $1")
    .max(5000, "Maximum rate threshold exceeded"),

  qualificationScore: z.number().optional(),
  
  scheduledTime: z.string().min(1, "Please select a briefing window"),

}).superRefine((data, ctx) => {
  // Logic remains for high-level anomaly detection, but does not block email providers.
  if (data.estimatedWastedHours > 120) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Anomalous hour count detected. Proceeding with manual audit.",
      path: ["estimatedWastedHours"]
    });
  }
});

export type LeadSanity = z.infer<typeof LeadSanitySchema>;
