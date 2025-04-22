// check to see if username in db exists! (somehow handle that error from prisma)

import { redirect } from "next/navigation";
import { supabaseMock } from "../../__mocks__/supabase";

import { prismaMock } from "../../__mocks__/prisma";
import { auth } from "../../auth";
import { type MockedFunction } from "vitest";

// expect redirect to have been called on invalid session

// test deletion of header and profile imgs
// test upload errors

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("../../supabase", () => ({
  __esModule: true,
  supabase: supabaseMock,
}));

vi.mock("../../prisma", () => ({
  __esModule: true,
  prisma: prismaMock,
}));

vi.mock("../../auth", () => ({
  __esModule: true,
  auth: vi.fn(),
}));

describe("user data access", () => {
  describe("updateProfile", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("redirects unauthenticated user", async () => {
      const mockedAuth = vi.mocked(auth);
      mockedAuth.mockResolvedValueOnce(() => new Response(null));

      // dynamic import required
      // (prisma needs to be mocked before this is imported)
      const { updateProfile } = await import("../../data-access/user");

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

    it("deletes existing header image", async () => {
      const mockedAuth = vi.mocked(
        auth as unknown as MockedFunction<
          () => Promise<{ user: { username: string } } | null>
        >
      );
      mockedAuth.mockResolvedValueOnce({ user: { username: "mock-user" } });

      const { updateProfile } = await import("../../data-access/user");

      const existingHeaderImageUrl = "https://cdn.supabase.mock/headerImg.png";

      const mockUser = {
        id: "clurtkqhd000008l5dz8b70ei", // random cuid
        username: "mock-user",
        email: "mockuser@mock.com",
        headerImage: existingHeaderImageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "mock",
        aboutMe: null,
        emailVerified: null,
        image: null,
      };

      const mockFormData = {
        newHeaderImg: null,
        newProfileIcon: null,
        newName: mockUser.name,
        newUsername: mockUser.username,
        newAboutMe: mockUser.aboutMe,
        oldHeaderImg: existingHeaderImageUrl,
        oldProfileIcon: mockUser.image,
        deleteHeaderImg: true,
        deleteProfileIcon: false,
      };

      await updateProfile(mockFormData);

      expect(supabaseMock.storage.from).toHaveBeenCalledWith("header-images");
      expect(supabaseMock.storage.from().remove).toHaveBeenCalledWith([
        "headerImg.png",
      ]);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: {
          username: mockUser.username,
        },
        data: {
          name: mockUser.name,
          username: mockUser.username,
          aboutMe: mockUser.aboutMe,
          image: mockUser.image,
          headerImage: null,
        },
      });
    });
  });
});
