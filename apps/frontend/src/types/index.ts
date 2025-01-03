import { userSignupSchema, userLoginSchema } from "@repo/zod-schemas/types";
import { z } from "zod";

export type SigninPayload = z.infer<typeof userLoginSchema>;
export type SignupPayload = z.infer<typeof userSignupSchema>;
