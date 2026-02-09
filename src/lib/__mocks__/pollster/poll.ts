import { Id } from "@/lib/convex/_generated/dataModel";

export function create(): Id<"polls"> {
  return "mock-poll-id" as Id<"polls">;
}
