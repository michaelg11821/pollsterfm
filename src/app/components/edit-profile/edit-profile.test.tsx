import userEvent from "@testing-library/user-event";

import { act, render, screen, waitFor } from "@testing-library/react";

import TestToastWrapper from "../../../lib/__tests__/utils/test-toast-wrapper";
import EditProfile from "./edit-profile";

import type { ReactNode } from "react";

// https://floating-ui.com/docs/react#testing
const waitForPosition = () => act(async () => {});

function setup(jsx: ReactNode) {
  return {
    user: userEvent.setup(),
    ...render(jsx, { wrapper: TestToastWrapper }),
  };
}

let failure = false;

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../../../lib/data-access/user/update", () => ({
  updateProfile: vi.fn(async () => {
    if (failure) {
      return {
        success: false,
        errors: [{ path: ["formInputName"], message: "some error" }],
      };
    }

    return { success: true };
  }),
}));

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
        />,
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

      const uploadHeaderBtn = screen.getByLabelText(
        "Upload header image",
      ) as HTMLButtonElement;
      const headerImageInput = screen.getByTestId(
        "header-upload",
      ) as HTMLInputElement;

      await user.click(uploadHeaderBtn);

      await waitForPosition();

      await user.upload(headerImageInput, headerImage);

      const uploadPfpBtn = screen.getByLabelText(
        "Upload profile picture",
      ) as HTMLButtonElement;
      const profilePictureInput = screen.getByTestId(
        "profile-picture-upload",
      ) as HTMLInputElement;

      await user.click(uploadPfpBtn);

      await waitForPosition();

      await user.upload(profilePictureInput, profilePicture);

      const headerImagePreview = screen.getByAltText(
        "Header image preview",
      ) as HTMLImageElement;
      const profilePicturePreview = screen.getByAltText(
        "Profile picture preview",
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
        />,
      );

      const editProfileBtn = screen.getByRole("button", {
        name: "Edit Profile",
      });

      await user.click(editProfileBtn);

      await waitForPosition();

      const suspiciousFile = new File(["suspiciousFile"], "hi.bin", {
        type: "application/octet-stream",
      });

      const uploadHeaderBtn = screen.getByLabelText(
        "Upload header image",
      ) as HTMLButtonElement;
      const headerImageInput = screen.getByTestId(
        "header-upload",
      ) as HTMLInputElement;

      await user.click(uploadHeaderBtn);

      await waitForPosition();

      // attempt to bypass
      headerImageInput.removeAttribute("accept");

      await user.upload(headerImageInput, suspiciousFile);

      expect(headerImageInput.value).toBe("");

      await waitFor(() => {
        expect(
          screen.getByText(
            "Invalid file type. Accepted file types: .png, .jpeg, and .webp.",
          ),
        ).toBeInTheDocument();
      });
    });

    it("reset button works", async () => {
      const { user } = setup(
        <EditProfile
          headerImage="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1986552930%2Fvector%2Feaster-chicks-and-ducklings.jpg%3Fs%3D612x612%26w%3D0%26k%3D20%26c%3DAUYEWDCd8qtrF0WzCrVdIyasIfdEywobVOCkEtLcwfE%3D&f=1&nofb=1&ipt=40555252a70e49b71c8a9a153bd946d1d5ffed54a45c889494094c37e4450edb"
          profileIcon=""
          name=""
          username=""
          aboutMe=""
        />,
      );

      const editProfileBtn = screen.getByRole("button", {
        name: "Edit Profile",
      });

      await user.click(editProfileBtn);
      await waitForPosition();

      const uploadHeaderBtn = screen.getByLabelText(
        "Upload header image",
      ) as HTMLButtonElement;

      const headerImageInput = screen.getByTestId(
        "header-upload",
      ) as HTMLInputElement;

      await user.click(uploadHeaderBtn);
      await waitForPosition();

      const headerImage = new File(["headerImage"], "header.png", {
        type: "image/png",
      });

      await user.upload(headerImageInput, headerImage);

      await user.click(uploadHeaderBtn);
      await waitForPosition();

      const removeHeaderImgBtn = screen.getByTestId("header-remove");

      await user.click(removeHeaderImgBtn);

      expect(
        screen.queryByAltText("Header image preview"),
      ).not.toBeInTheDocument();
    });
  });

  it("makes a toast for updateProfile errors", async () => {
    failure = true;

    const { user } = setup(
      <EditProfile
        headerImage=""
        profileIcon=""
        name=""
        username=""
        aboutMe=""
      />,
    );

    const editProfileBtn = screen.getByRole("button", {
      name: "Edit Profile",
    });

    await user.click(editProfileBtn);

    await waitForPosition();

    const saveChgsBtn = screen.getByRole("button", {
      name: "Save Changes",
    });

    await user.click(saveChgsBtn);

    await waitFor(() => {
      expect(screen.getByText("some error")).toBeInTheDocument();
    });
  });
});
