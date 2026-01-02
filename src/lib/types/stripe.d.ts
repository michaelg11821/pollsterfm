import { Infer } from "convex/values";
import { stripePaymentValidator } from "../convex/validators";

export type Payment = Infer<typeof stripePaymentValidator>;
