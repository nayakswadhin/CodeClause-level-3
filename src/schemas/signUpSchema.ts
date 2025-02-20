import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be atleast 2 character" }),
  email: z.string().email(),
  address: z.string(),
  phone: z.string().regex(/^[0-9]{10}$/, {
    message: "Phone number must be exactly 10 digits.",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
  dob: z.date(),
  department: z.string(),
  designation: z.enum(["manager", "developer"]),
});
