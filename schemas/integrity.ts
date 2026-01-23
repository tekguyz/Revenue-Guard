import { z } from 'zod';

export const LeadSanitySchema = z.object({
  estimatedWastedHours: z.number().max(168, "Hours wasted cannot exceed 168 hours/week"),
  qualificationScore: z.number().min(0).max(10),
}).superRefine((data, ctx) => {
  // Logic: Anomaly detection
  if (data.estimatedWastedHours > 100 && data.qualificationScore < 3) {
     ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "High wasted hours reported but qualification score is low. Verify inputs.",
        path: ["estimatedWastedHours"]
     });
  }
});