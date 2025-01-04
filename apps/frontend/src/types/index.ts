import {
  userSignupSchema,
  userLoginSchema,
  shortLinkSchema,
} from "@repo/zod-schemas/types";
import { z } from "zod";

export type SigninPayload = z.infer<typeof userLoginSchema>;
export type SignupPayload = z.infer<typeof userSignupSchema>;
export type ShortLinkPayload = z.infer<typeof shortLinkSchema>;
