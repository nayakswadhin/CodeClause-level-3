import { z } from "zod";

export const addTaskSchema = z.object({
  taskName: z
    .string()
    .min(2, { message: "Task name must be atleast 2 character" }),
  taskDescription: z
    .string()
    .min(2, { message: "Task description must be atleast 2 character" }),
  deadline: z.date(),
  project: z.string(),
  assignedTo: z.string(),
});

export const updateTaskSchema = z.object({
  taskId: z.string(),
  isComplete: z.boolean(),
});
