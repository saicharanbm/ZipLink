import { z } from "zod";

export const userSignupSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(3),
  password: z.string().min(6),
});

export const userLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export const zipLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .refine((val) => /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[^\s]*)?$/.test(val), {
      message:
        "Invalid URL format. Example: https://example.com or www.example.com",
    }),
  slug: z
    .string()
    .trim()
    .min(5, "Slug must be at least 5 characters long.")
    .optional(),
});
