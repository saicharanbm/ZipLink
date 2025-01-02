import {z} from "zod";

export const userSignupSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(3),
  password: z.string().min(6),
});

export const userLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});