import type { Doc } from "../convex/_generated/dataModel";

export function currentUser() {
  return {
    _id: "mock-user-id",
    _creationTime: Date.now(),
    username: "mock-user",
    name: "Mock User",
  } as Doc<"users">;
}
