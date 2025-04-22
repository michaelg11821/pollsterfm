import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset } from "vitest-mock-extended";

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = mockDeep<PrismaClient>();
