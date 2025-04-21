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

describe("user data access", () => {
  describe("updateProfile", () => {
    beforeEach(() => {
      vi.doMock("../../../lib/supabase", () => ({
        supabase: supabaseMock,
      }));

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

    // it("deletes existing header image", async () => {
    //     const { updateProfile } = await import("../../../lib/data-access/user");

    //     const mockFormData = {
    //       newHeaderImg: null,
    //       newProfileIcon: null,
    //       newName: "",
    //       newUsername: "",
    //       newAboutMe: "",
    //       oldHeaderImg: "https://cdn.supabase.mock/storage/v1/object/public/header-images//reviews-web-1-0-elliott-smith-show-website-v0-pvb2jucu3oob1.webp",
    //       oldProfileIcon: "",
    //       deleteHeaderImg: true,
    //       deleteProfileIcon: false,
    //     };

    //     await updateProfile(mockFormData);

    //     expect(redirect).toHaveBeenCalledWith("/sign-in");
    //   });
  });
});
