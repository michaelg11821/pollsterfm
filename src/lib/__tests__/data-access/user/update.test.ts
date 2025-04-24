import { redirect } from "next/navigation";

import { prismaMock } from "../../../__mocks__/prisma";
import { supabaseMock } from "../../../__mocks__/supabase";

import { auth } from "../../../auth";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { type MockedFunction } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("../../../supabase", () => ({
  __esModule: true,
  supabase: supabaseMock,
}));

vi.mock("../../../prisma", () => ({
  __esModule: true,
  prisma: prismaMock,
}));

vi.mock("../../../auth", () => ({
  __esModule: true,
  auth: vi.fn(),
}));

describe("updateProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated user", async () => {
    const mockedAuth = vi.mocked(auth);
    mockedAuth.mockResolvedValueOnce(() => new Response(null));

    // dynamic import required
    // (prisma needs to be mocked before this is imported)
    const { updateProfile } = await import("../../../data-access/user/update");

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

  describe("images", () => {
    it("deletes existing header image", async () => {
      const mockedAuth = vi.mocked(
        auth as unknown as MockedFunction<
          () => Promise<{ user: { username: string } } | null>
        >
      );
      mockedAuth.mockResolvedValueOnce({ user: { username: "mock-user" } });

      const { updateProfile } = await import(
        "../../../data-access/user/update"
      );

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

      await updateProfile({
        newHeaderImg: null,
        newProfileIcon: null,
        newName: mockUser.name,
        newUsername: mockUser.username,
        newAboutMe: mockUser.aboutMe,
        oldHeaderImg: existingHeaderImageUrl,
        oldProfileIcon: mockUser.image,
        deleteHeaderImg: true,
        deleteProfileIcon: false,
      });

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

    it("deletes existing profile icon", async () => {
      const mockedAuth = vi.mocked(
        auth as unknown as MockedFunction<
          () => Promise<{ user: { username: string } } | null>
        >
      );
      mockedAuth.mockResolvedValueOnce({ user: { username: "mock-user" } });

      const { updateProfile } = await import(
        "../../../data-access/user/update"
      );

      const existingProfileIconUrl =
        "https://cdn.supabase.mock/profileIcon.png";

      const mockUser = {
        id: "clurtkqhd000008l5dz8b70ei",
        username: "mock-user",
        email: "mockuser@mock.com",
        headerImage: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "mock",
        aboutMe: null,
        emailVerified: null,
        image: existingProfileIconUrl,
      };

      await updateProfile({
        newHeaderImg: null,
        newProfileIcon: null,
        newName: mockUser.name,
        newUsername: mockUser.username,
        newAboutMe: mockUser.aboutMe,
        oldHeaderImg: mockUser.headerImage,
        oldProfileIcon: existingProfileIconUrl,
        deleteHeaderImg: false,
        deleteProfileIcon: true,
      });

      expect(supabaseMock.storage.from).toHaveBeenCalledWith("profile-icons");
      expect(supabaseMock.storage.from().remove).toHaveBeenCalledWith([
        "profileIcon.png",
      ]);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: {
          username: mockUser.username,
        },
        data: {
          name: mockUser.name,
          username: mockUser.username,
          aboutMe: mockUser.aboutMe,
          image: null,
          headerImage: mockUser.headerImage,
        },
      });
    });

    it("deletes existing images simultaneously", async () => {
      const mockedAuth = vi.mocked(
        auth as unknown as MockedFunction<
          () => Promise<{ user: { username: string } } | null>
        >
      );
      mockedAuth.mockResolvedValueOnce({ user: { username: "mock-user" } });

      const { updateProfile } = await import(
        "../../../data-access/user/update"
      );

      const existingHeaderImageUrl = "https://cdn.supabase.mock/headerImg.png";
      const existingProfileIconUrl =
        "https://cdn.supabase.mock/profileIcon.png";

      const mockUser = {
        id: "clurtkqhd000008l5dz8b70ei",
        username: "mock-user",
        email: "mockuser@mock.com",
        headerImage: existingHeaderImageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: "mock",
        aboutMe: null,
        emailVerified: null,
        image: existingProfileIconUrl,
      };

      await updateProfile({
        newHeaderImg: null,
        newProfileIcon: null,
        newName: mockUser.name,
        newUsername: mockUser.username,
        newAboutMe: mockUser.aboutMe,
        oldHeaderImg: mockUser.headerImage,
        oldProfileIcon: mockUser.image,
        deleteHeaderImg: true,
        deleteProfileIcon: true,
      });

      expect(supabaseMock.storage.from).toHaveBeenCalledWith("header-images");
      expect(supabaseMock.storage.from().remove).toHaveBeenCalledWith([
        "headerImg.png",
      ]);

      expect(supabaseMock.storage.from).toHaveBeenCalledWith("profile-icons");
      expect(supabaseMock.storage.from().remove).toHaveBeenCalledWith([
        "profileIcon.png",
      ]);

      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: {
          username: mockUser.username,
        },
        data: {
          name: mockUser.name,
          username: mockUser.username,
          aboutMe: mockUser.aboutMe,
          image: null,
          headerImage: null,
        },
      });
    });
  });

  describe("username", () => {
    it("error when username is taken", async () => {
      const mockedAuth = vi.mocked(
        auth as unknown as MockedFunction<
          () => Promise<{ user: { username: string } } | null>
        >
      );
      mockedAuth.mockResolvedValueOnce({ user: { username: "mock-user" } });

      const uniqueError = new PrismaClientKnownRequestError(
        "Unique constraint failed on the fields: (`username`)",
        {
          code: "P2002",
          clientVersion: "latest",
        }
      );

      prismaMock.user.update.mockRejectedValueOnce(uniqueError);

      const { updateProfile } = await import(
        "../../../data-access/user/update"
      );

      const result = await updateProfile({
        newHeaderImg: null,
        newProfileIcon: null,
        newName: "same-as-before",
        newUsername: "dupe",
        newAboutMe: "🙃",
        oldHeaderImg: null,
        oldProfileIcon: null,
        deleteHeaderImg: false,
        deleteProfileIcon: false,
      });

      expect(result).toStrictEqual({
        success: false,
        errors: [
          {
            path: ["newUsername"],
            message: "Username already taken.",
          },
        ],
      });
    });
  });
});
