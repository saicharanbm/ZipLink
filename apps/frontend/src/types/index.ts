import {
  userSignupSchema,
  userLoginSchema,
  zipLinkSchema,
} from "@repo/zod-schemas/types";
import { z } from "zod";

export type SigninPayload = z.infer<typeof userLoginSchema>;
export type SignupPayload = z.infer<typeof userSignupSchema>;
export type zipLinkPayload = z.infer<typeof zipLinkSchema>;
