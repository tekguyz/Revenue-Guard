import { z } from 'zod';

/**
 * TEKGUYZ FINANCIAL CONSTANTS
 * Locked at the schema level to prevent frontend manipulation.
 */
export const ROI_CONSTANTS = {
  HOURLY_RATE_OPS: 65,    // Blended Corporate Rate (Ops/Admin)
  HOURLY_RATE_EXEC: 125,  // Executive Strategy Rate
  EFFICIENCY_FACTOR: 0.70 // Conservative 70% recovery target
} as const;

/**
 * Business Email Regex
 * Rejects common public providers (Gmail, Yahoo, Hotmail, etc.)
 */
const BUSINESS_EMAIL_REGEX = /^(?!(.*(gmail|yahoo|hotmail|outlook|icloud|aol|protonmail|mail|zoho)))([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/i;

/**
 * LeadSanitySchema
 * The primary integrity check for the Strategic Brief.
 * Enforces the "168-Hour Rule" and B2B email validation.
 */
export const LeadSanitySchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .regex(BUSINESS_EMAIL_REGEX, "Please use a valid business email address. Generic providers (Gmail/Yahoo/etc) are restricted."),
  
  staffCount: z.number()
    .int("Staff count must be a whole number")
    .min(1, "At least 1 staff member required")
    .max(50000, "For teams over 50,000, please contact Enterprise Relations directly"),

  estimatedWastedHours: z.number()
    .min(0.5, "Minimum 0.5 hours required for analysis")
    .max(168, "Input Error: A week only has 168 hours. Please verify weekly wasted hours per person."),

  qualificationScore: z.number()
    .min(0)
    .max(10)
    .default(0),

}).superRefine((data, ctx) => {
  // Anomaly Detection: Impossible Efficiency Metrics
  // If reported wasted hours per person > 60 AND qualification score is very low, flag for manual review.
  if (data.estimatedWastedHours > 60 && data.qualificationScore < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "High friction reported but low strategic alignment detected. Data marked for manual verification.",
      path: ["estimatedWastedHours"]
    });
  }
});

export type LeadSanity = z.infer<typeof LeadSanitySchema>;