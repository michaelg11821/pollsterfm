import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { vi } from "vitest";

import EditProfile from "./edit-profile";

import { ConvexReactClientFake } from "@/lib/__mocks__/convex-react-client";
import { api } from "@/lib/convex/_generated/api";
import TestToastWrapper from "@/lib/test-toast-wrapper";

const { mockReplace } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
}));

vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      replace: mockReplace,
    }),
  };
});

vi.mock("next/image", () => ({
  default: (props: { alt?: string; src?: string }) => {
    const testId =
      props.alt === "Header image preview"
        ? "header-preview-image"
        : "profile-preview-image";

    return <div data-testid={testId} data-src={String(props.src ?? "")} />;
  },
}));

vi.mock("@sentry/nextjs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@sentry/nextjs")>();

  return {
    ...actual,
    captureException: vi.fn(),
  };
});

const mockClient = new ConvexReactClientFake();

const mockCurrentUserQuery = vi.fn();
const mockExistingUserQuery = vi.fn();
const mockProfileIconStorageIdQuery = vi.fn();
const mockHeaderImageStorageIdQuery = vi.fn();
const mockGenerateUploadUrlMutation = vi.fn();
const mockUpdateProfileMutation = vi.fn();

mockClient.registerQueryFake(api.user.currentUser, (args) =>
  mockCurrentUserQuery(args),
);
mockClient.registerQueryFake(api.user.checkForExisting, (args) =>
  mockExistingUserQuery(args),
);
mockClient.registerQueryFake(api.files.getProfileIconStorageId, (args) =>
  mockProfileIconStorageIdQuery(args),
);
mockClient.registerQueryFake(api.files.getHeaderImageStorageId, (args) =>
  mockHeaderImageStorageIdQuery(args),
);
mockClient.registerMutationFake(api.files.generateUploadUrl, (args) =>
  mockGenerateUploadUrlMutation(args),
);
mockClient.registerMutationFake(api.user.updateProfile, (args) =>
  mockUpdateProfileMutation(args),
);

type SetupProps = {
  headerImage?: string | null;
  profileIcon?: string;
  name?: string;
  username?: string;
  aboutMe?: string;
};

const defaultProps: Required<SetupProps> = {
  headerImage: "https://example.com/header.webp",
  profileIcon: "https://example.com/profile.webp",
  name: "Test User",
  username: "testuser",
  aboutMe: "I like music.",
};

const setup = (props: SetupProps = {}) =>
  render(
    <ConvexProvider client={mockClient as unknown as ConvexReactClient}>
      <TestToastWrapper>
        <EditProfile {...defaultProps} {...props} />
      </TestToastWrapper>
    </ConvexProvider>,
  );

async function openDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /edit profile/i }));
  expect(
    await screen.findByRole("heading", { name: /edit profile/i }),
  ).toBeInTheDocument();
}

describe("EditProfile", () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockCurrentUserQuery.mockReset();
    mockExistingUserQuery.mockReset();
    mockProfileIconStorageIdQuery.mockReset();
    mockHeaderImageStorageIdQuery.mockReset();
    mockGenerateUploadUrlMutation.mockReset();
    mockUpdateProfileMutation.mockReset();

    mockCurrentUserQuery.mockReturnValue({
      _id: "mock-user-id",
      _creationTime: Date.now(),
      username: "testuser",
      name: "Test User",
      image: "https://example.com/profile.webp",
      headerImage: "https://example.com/header.webp",
    });
    mockExistingUserQuery.mockReturnValue(false);
    mockProfileIconStorageIdQuery.mockReturnValue(null);
    mockHeaderImageStorageIdQuery.mockReturnValue(null);
    mockGenerateUploadUrlMutation.mockResolvedValue("https://upload.mock");
    mockUpdateProfileMutation.mockResolvedValue(null);
  });

  it("opens the dialog and prefills current profile fields", async () => {
    setup();
    const user = userEvent.setup();

    await openDialog(user);

    expect(screen.getByLabelText(/^name$/i)).toHaveValue(defaultProps.name);
    expect(screen.getByLabelText(/^username$/i)).toHaveValue(
      defaultProps.username,
    );
    expect(screen.getByLabelText(/about me/i)).toHaveValue(
      defaultProps.aboutMe,
    );
    expect(screen.getByTestId("header-preview-image")).toHaveAttribute(
      "data-src",
      defaultProps.headerImage,
    );
    expect(screen.getByTestId("profile-preview-image")).toHaveAttribute(
      "data-src",
      defaultProps.profileIcon,
    );
  });

  it("submits updated profile fields successfully", async () => {
    setup();
    const user = userEvent.setup();

    await openDialog(user);

    const nameInput = screen.getByLabelText(/^name$/i);
    const usernameInput = screen.getByLabelText(/^username$/i);
    const aboutMeInput = screen.getByLabelText(/about me/i);

    await user.clear(nameInput);
    await user.type(nameInput, "Renamed User");
    await user.clear(usernameInput);
    await user.type(usernameInput, "renameduser");
    await user.clear(aboutMeInput);
    await user.type(aboutMeInput, "Updated profile blurb.");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await vi.waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: /edit profile/i }),
      ).not.toBeInTheDocument();
    });
  });

  it("shows username already taken error and does not submit", async () => {
    mockExistingUserQuery.mockImplementation(
      ({ username }: { username: string }) => username === "takenuser",
    );
    setup();
    const user = userEvent.setup();

    await openDialog(user);

    const usernameInput = screen.getByLabelText(/^username$/i);
    await user.clear(usernameInput);
    await user.type(usernameInput, "takenuser");
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(/username already taken\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /edit profile/i }),
    ).toBeInTheDocument();
  });

  it("requires authentication before saving profile updates", async () => {
    mockCurrentUserQuery.mockReturnValue(null);
    setup();
    const user = userEvent.setup();

    await openDialog(user);
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(/please log in to make changes\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /edit profile/i }),
    ).toBeInTheDocument();
  });

  it.each([
    {
      label: "profile picture",
      inputTestId: "profile-picture-upload",
      previewTestId: "profile-preview-image",
      expectedSrc: defaultProps.profileIcon,
      invalidMimeType: "image/bmp",
    },
    {
      label: "header image",
      inputTestId: "header-upload",
      previewTestId: "header-preview-image",
      expectedSrc: defaultProps.headerImage,
      invalidMimeType: "image/gif",
    },
  ])(
    "silently ignores unsupported file type for $label upload",
    async ({ inputTestId, previewTestId, expectedSrc, invalidMimeType }) => {
      setup();
      const user = userEvent.setup();

      await openDialog(user);

      const uploadInput = screen.getByTestId(inputTestId) as HTMLInputElement;
      const unsupportedFile = new File(["unsupported"], "unsupported-file", {
        type: invalidMimeType,
      });

      await user.upload(uploadInput, unsupportedFile);

      expect(uploadInput.files).toHaveLength(0);
      expect(screen.getByTestId(previewTestId)).toHaveAttribute(
        "data-src",
        expectedSrc,
      );
      expect(screen.getByTestId(previewTestId)).not.toHaveAttribute(
        "data-src",
        "blob:fake-url",
      );
    },
  );

  it("uploads a new profile image and still saves successfully", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ storageId: "storage-profile-id" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    setup();
    const user = userEvent.setup();

    await openDialog(user);

    const profileUploadInput = screen.getByTestId(
      "profile-picture-upload",
    ) as HTMLInputElement;
    const file = new File(["avatar-content"], "avatar.png", {
      type: "image/png",
    });

    await user.upload(profileUploadInput, file);

    await vi.waitFor(() => {
      expect(screen.getByTestId("profile-preview-image")).toHaveAttribute(
        "data-src",
        "blob:fake-url",
      );
    });

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(/profile updated successfully\./i),
    ).toBeInTheDocument();
  });

  it("captures errors and shows failure toast when submit fails", async () => {
    const submitError = new Error("submit failed");
    mockUpdateProfileMutation.mockRejectedValueOnce(submitError);

    setup();
    const user = userEvent.setup();

    await openDialog(user);
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(
        /failed to submit changes to profile\. please try again\./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /edit profile/i }),
    ).toBeInTheDocument();
  });

  it("keeps header preview removed when save fails after removing header image", async () => {
    mockUpdateProfileMutation.mockRejectedValueOnce(new Error("save failed"));
    setup();
    const user = userEvent.setup();

    await openDialog(user);

    await user.click(screen.getByRole("button", { name: /upload header image/i }));
    await user.click(await screen.findByTestId("header-remove"));
    expect(screen.queryByTestId("header-preview-image")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(
        /failed to submit changes to profile\. please try again\./i,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("header-preview-image")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /edit profile/i }),
    ).toBeInTheDocument();
  });

  it("shows failure output when header image upload fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("upload failed")));
    setup();
    const user = userEvent.setup();

    await openDialog(user);

    const headerUploadInput = screen.getByTestId(
      "header-upload",
    ) as HTMLInputElement;
    const headerFile = new File(["header-content"], "header.png", {
      type: "image/png",
    });

    await user.upload(headerUploadInput, headerFile);
    await vi.waitFor(() => {
      expect(screen.getByTestId("header-preview-image")).toHaveAttribute(
        "data-src",
        "blob:fake-url",
      );
    });

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(
        /failed to submit changes to profile\. please try again\./i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /edit profile/i }),
    ).toBeInTheDocument();
  });

  it("does not persist unsaved header preview changes across dialog reopen", async () => {
    setup();
    const user = userEvent.setup();

    await openDialog(user);

    await user.click(screen.getByRole("button", { name: /upload header image/i }));
    await user.click(await screen.findByTestId("header-remove"));

    expect(screen.queryByTestId("header-preview-image")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(
      screen.queryByRole("heading", { name: /edit profile/i }),
    ).not.toBeInTheDocument();

    await openDialog(user);
    expect(screen.getByTestId("header-preview-image")).not.toHaveAttribute(
      "data-src",
      "blob:fake-url",
    );
    expect(screen.getByTestId("header-preview-image")).toHaveAttribute(
      "data-src",
      defaultProps.headerImage,
    );
  });
});
