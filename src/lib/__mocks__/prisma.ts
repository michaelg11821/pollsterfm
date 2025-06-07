import { mockDeep, mockReset } from "vitest-mock-extended";
import { PrismaClient } from "../prisma/client";

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = mockDeep<PrismaClient>();
