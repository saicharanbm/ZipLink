import {z} from "zod";

export const userSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(3),
  password: z.string().min(6),
});
