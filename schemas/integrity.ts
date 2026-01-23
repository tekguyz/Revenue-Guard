
import { z } from 'zod';

/**
 * TEKGUYZ FINANCIAL CONSTANTS
 */
export const ROI_CONSTANTS = {
  HOURLY_RATE_OPS: 65,    
  HOURLY_RATE_EXEC: 125,  
  EFFICIENCY_FACTOR: 0.70 
} as const;

// UPDATED: More precise B2B filtering that targets only the domain portion
const BUSINESS_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(?!((gmail|yahoo|hotmail|outlook|icloud|aol|protonmail|zoho|mail|yandex|gmx)\.))([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/i;

export const LeadSanitySchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .regex(BUSINESS_EMAIL_REGEX, "Please use a valid business email address. Generic providers are restricted."),
  
  staffCount: z.number()
    .int()
    .min(1, "Team size must be at least 1")
    .max(50000),

  estimatedWastedHours: z.number()
    .min(0.5, "Minimum 0.5 hours per person")
    .max(168, "A week only has 168 hours."),

  qualificationScore: z.number().optional(),
  
  scheduledTime: z.string().min(1, "Please select a briefing window"),

}).superRefine((data, ctx) => {
  if (data.estimatedWastedHours > 60 && (data.qualificationScore || 0) < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "High friction reported. Data marked for manual verification.",
      path: ["estimatedWastedHours"]
    });
  }
});

export type LeadSanity = z.infer<typeof LeadSanitySchema>;
