import userEvent from "@testing-library/user-event";

import { act, render, screen, waitFor } from "@testing-library/react";

// import { prismaMock } from "@/lib/mocks/prisma";

import EditProfile from "./edit-profile";

import type { ReactNode } from "react";

// https://floating-ui.com/docs/react#testing
const waitForPosition = () => act(async () => {});

function setup(jsx: ReactNode) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

describe("EditProfile", () => {
  describe("file uploads", () => {
    it("preview images update", async () => {
      const { user } = setup(
        <EditProfile
          headerImage=""
          profileIcon=""
          name=""
          username=""
          aboutMe=""
        />
      );

      const editProfileBtn = screen.getByRole("button", {
        name: "Edit Profile",
      });

      await user.click(editProfileBtn);

      await waitForPosition();

      const headerImage = new File(["headerImage"], "header.png", {
        type: "image/png",
      });
      const profilePicture = new File(["profilePicture"], "pfp.png", {
        type: "image/png",
      });

      const headerImageInput = screen.getByLabelText(
        "Upload header image"
      ) as HTMLInputElement;
      const profilePictureInput = screen.getByLabelText(
        "Upload profile picture"
      ) as HTMLInputElement;

      await user.upload(headerImageInput, headerImage);
      await user.upload(profilePictureInput, profilePicture);

      const headerImagePreview = screen.getByAltText(
        "Header image preview"
      ) as HTMLImageElement;
      const profilePicturePreview = screen.getByAltText(
        "Profile picture preview"
      ) as HTMLImageElement;

      // mock createObjectUrl return value
      expect(headerImagePreview.src).toBe("blob:fake-url");
      expect(profilePicturePreview.src).toBe("blob:fake-url");
    });

    it("non-image file fail", async () => {
      const { user } = setup(
        <EditProfile
          headerImage=""
          profileIcon=""
          name=""
          username=""
          aboutMe=""
        />
      );

      const editProfileBtn = screen.getByRole("button", {
        name: "Edit Profile",
      });

      await user.click(editProfileBtn);

      await waitForPosition();

      const suspiciousFile = new File(["suspiciousFile"], "hi.bin", {
        type: "application/octet-stream",
      });

      const headerImageInput = screen.getByLabelText(
        "Upload header image"
      ) as HTMLInputElement;

      // attempt to bypass
      headerImageInput.removeAttribute("accept");

      await user.upload(headerImageInput, suspiciousFile);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Invalid file type. Accepted file types: .png, .jpeg, and .webp."
          )
        ).toBeInTheDocument();
      });

      expect(headerImageInput.value).toBe("");
    });
  });
});
