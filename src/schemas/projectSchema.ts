import { z } from "zod";

export const projectSchema = z.object({
  projectName: z
    .string()
    .min(2, { message: "Project name must be atleast 2 character" }),
  description: z.string(),
  deadline: z.date(),
  teamMembers: z.array(z.string()),
});
