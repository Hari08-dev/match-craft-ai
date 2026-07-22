import { z } from "zod";

export const MatchRequestSchema = z.object({
  resumeText: z.string().min(20, "Resume text must be at least 20 characters"),
  jobDescription: z.string().min(20, "Job description must be at least 20 characters"),
});
