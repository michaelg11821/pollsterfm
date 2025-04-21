// check to see if username in db exists! (somehow handle that error from prisma)

import { redirect } from "next/navigation";
import { supabaseMock } from "../../../lib/__mocks__/supabase";
import { prismaMock } from "../../../lib/__mocks__/prisma";

// expect redirect to have been called on invalid session

// test deletion of header and profile imgs
// test upload errors

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("../../../lib/auth", async () => ({
  auth: vi.fn(() => {
    return { username: "mock-user" };
  }),
}));

vi.mock("../../../lib/supabase", () => ({
  supabase: supabaseMock,
}));

describe("updateProfile", () => {
  // must be mocked before each test
  // (updateProfile is defined after other methods that use prisma)
  beforeEach(() => {
    vi.doMock("../../../lib/prisma", async () => ({
      prisma: prismaMock,
    }));
  });

  it("redirects unauthenticated user", async () => {
    vi.doMock("../../../lib/auth", () => ({
      auth: vi.fn().mockResolvedValue(null),
    }));

    // dynamic import required
    // (prisma needs to be mocked before this is imported)
    const { updateProfile } = await import("../../../lib/data-access/user");

    const mockFormData = {
      newHeaderImg: null,
      newProfileIcon: null,
      newName: "",
      newUsername: "",
      newAboutMe: "",
      oldHeaderImg: "",
      oldProfileIcon: "",
      deleteHeaderImg: false,
      deleteProfileIcon: false,
    };

    await updateProfile(mockFormData);

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });
});
