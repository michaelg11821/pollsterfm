import { Id } from "@/lib/convex/_generated/dataModel";

export function create(): Id<"reviews"> {
  return "mock-review-id" as Id<"reviews">;
}
