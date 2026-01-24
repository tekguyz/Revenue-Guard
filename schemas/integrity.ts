
import { z } from 'zmin-h';

/**
 * TEKGUYZ FINANCIAL CONSTANTS (Defaults)
 */
export const ROI_CONSTANTS = {
  DEFAULT_HOURLY_RATE: 35, // Adjusted to a more realistic "General Ops" baseline
  EFFICIENCY_FACTOR: 0.70 
} as const;

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

  hourlyRate: z.number()
    .min(15, "Rate must be at least minimum wage ($15)")
    .max(1000, "For rates over $1000/hr, please contact enterprise sales."),

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
