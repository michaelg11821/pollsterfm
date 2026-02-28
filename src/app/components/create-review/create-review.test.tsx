import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConvexReactClientFake } from "@/lib/__mocks__/convex-react-client";
import { search as mockAlbumSearch } from "@/lib/__mocks__/pollster/album";
import { search as mockArtistSearch } from "@/lib/__mocks__/pollster/artist";
import { create as mockCreateReview } from "@/lib/__mocks__/pollster/review";
import { search as mockTrackSearch } from "@/lib/__mocks__/pollster/track";
import { currentUser as mockCurrentUser } from "@/lib/__mocks__/user";
import { api } from "@/lib/convex/_generated/api";
import TestToastWrapper from "@/lib/test-toast-wrapper";
import type { PollType } from "@/lib/types/pollster";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import CreateReview from "./create-review";

const mockPush = vi.fn();

vi.mock("next/navigation", () => {
  const actual = vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: mockPush,
    })),
  };
});

const mockClient = new ConvexReactClientFake();

mockClient.registerActionFake(api.pollster.artist.search, mockArtistSearch);
mockClient.registerActionFake(api.pollster.album.search, mockAlbumSearch);
mockClient.registerActionFake(api.pollster.track.search, mockTrackSearch);
mockClient.registerQueryFake(api.user.currentUser, mockCurrentUser);

const mockCreateReviewMutation = vi.fn(mockCreateReview);
mockClient.registerMutationFake(
  api.pollster.review.create,
  mockCreateReviewMutation,
);

type SetupProps = {
  itemType: PollType;
  initArtist?: string;
  initAlbum?: string;
  initTrack?: string;
  initImage?: string;
};

const setup = ({
  itemType,
  initArtist,
  initAlbum,
  initTrack,
  initImage,
}: SetupProps) =>
  render(
    <ConvexProvider client={mockClient as unknown as ConvexReactClient}>
      <TestToastWrapper>
        <CreateReview
          initItemType={itemType}
          initArtist={initArtist}
          initAlbum={initAlbum}
          initTrack={initTrack}
          initImage={initImage}
        />
      </TestToastWrapper>
    </ConvexProvider>,
  );

describe("CreateReview", () => {
  beforeEach(() => {
    mockCreateReviewMutation.mockClear();
    mockPush.mockClear();
  });

  it("item type switch works", async () => {
    const { getByRole } = setup({ itemType: "artist" });
    const user = userEvent.setup();

    const albumsTab = getByRole("tab", { name: /albums/i });
    await user.click(albumsTab);
    expect(getByRole("textbox", { name: /search album/i })).toBeInTheDocument();

    const tracksTab = getByRole("tab", { name: /tracks/i });
    await user.click(tracksTab);
    expect(getByRole("textbox", { name: /search track/i })).toBeInTheDocument();

    const artistsTab = getByRole("tab", { name: /artists/i });
    await user.click(artistsTab);
    expect(
      getByRole("textbox", { name: /search artist/i }),
    ).toBeInTheDocument();
  });

  it("selecting an artist populates the search field", async () => {
    const { getByRole, findByRole } = setup({ itemType: "artist" });
    const user = userEvent.setup();

    const searchInput = getByRole("textbox", { name: /search artist/i });
    await user.type(searchInput, "elliott");

    const option = await findByRole("option", {
      name: /select artist elliott smith/i,
    });
    await user.click(option);

    expect(searchInput).toHaveValue("Elliott Smith");
  });

  it("selecting an album populates the search field with album name", async () => {
    const { getByRole, findByRole } = setup({ itemType: "album" });
    const user = userEvent.setup();

    const searchInput = getByRole("textbox", { name: /search album/i });
    await user.type(searchInput, "ok computer");

    const option = await findByRole("option", {
      name: /select album ok computer by radiohead/i,
    });
    await user.click(option);

    expect(searchInput).toHaveValue("OK Computer — Radiohead");
  });

  it("selecting a track populates the search field with track name", async () => {
    const { getByRole, findByRole } = setup({ itemType: "track" });
    const user = userEvent.setup();

    const searchInput = getByRole("textbox", { name: /search track/i });
    await user.type(searchInput, "paranoid");

    const option = await findByRole("option", {
      name: /select track paranoid android/i,
    });
    await user.click(option);

    expect(searchInput).toHaveValue("Paranoid Android — Radiohead");
  });

  it("submits successfully with valid data", async () => {
    const { getByRole, getByLabelText, findByRole, findByText } = setup({
      itemType: "artist",
    });
    const user = userEvent.setup();

    const searchInput = getByRole("textbox", { name: /search artist/i });
    await user.type(searchInput, "elliott");
    const option = await findByRole("option", {
      name: /select artist elliott smith/i,
    });
    await user.click(option);

    const star4 = getByRole("button", { name: /rate 4 stars/i });
    await user.click(star4);

    const textArea = getByLabelText(/review/i);
    await user.type(textArea, "This is a great artist with amazing music!");

    const submitBtn = getByRole("button", { name: /submit review/i });
    await user.click(submitBtn);

    expect(
      await findByText(/review submitted successfully\./i),
    ).toBeInTheDocument();
    expect(mockCreateReviewMutation).toHaveBeenCalled();
  });

  it("fails submission when no music item is selected", async () => {
    const { getByRole, getByLabelText } = setup({ itemType: "artist" });
    const user = userEvent.setup();

    const star3 = getByRole("button", { name: /rate 3 stars/i });
    await user.click(star3);

    const textArea = getByLabelText(/review/i);
    await user.type(textArea, "This is a review with enough characters.");

    const submitBtn = getByRole("button", { name: /submit review/i });
    await user.click(submitBtn);

    expect(mockCreateReviewMutation).not.toHaveBeenCalled();
  });

  it("fails submission when review text is too short", async () => {
    const { getByRole, getByLabelText, findByRole } = setup({
      itemType: "artist",
    });
    const user = userEvent.setup();

    const searchInput = getByRole("textbox", { name: /search artist/i });
    await user.type(searchInput, "elliott");
    const option = await findByRole("option", {
      name: /select artist elliott smith/i,
    });
    await user.click(option);

    const star4 = getByRole("button", { name: /rate 4 stars/i });
    await user.click(star4);

    const textArea = getByLabelText(/review/i);
    await user.type(textArea, "Short");

    const submitBtn = getByRole("button", { name: /submit review/i });
    await user.click(submitBtn);

    expect(mockCreateReviewMutation).not.toHaveBeenCalled();
  });

  it("fails submission when rating is not set", async () => {
    const { getByRole, getByLabelText, findByRole } = setup({
      itemType: "artist",
    });
    const user = userEvent.setup();

    const searchInput = getByRole("textbox", { name: /search artist/i });
    await user.type(searchInput, "elliott");
    const option = await findByRole("option", {
      name: /select artist elliott smith/i,
    });
    await user.click(option);

    const textArea = getByLabelText(/review/i);
    await user.type(textArea, "This is a review with enough characters.");

    const submitBtn = getByRole("button", { name: /submit review/i });
    await user.click(submitBtn);

    expect(mockCreateReviewMutation).not.toHaveBeenCalled();
  });

  it.each([
    {
      itemType: "artist" as const,
      initArtist: "Elliott Smith",
      expectedValue: "Elliott Smith",
    },
    {
      itemType: "album" as const,
      initArtist: "Radiohead",
      initAlbum: "OK Computer",
      expectedValue: "OK Computer — Radiohead",
    },
    {
      itemType: "track" as const,
      initArtist: "Radiohead",
      initAlbum: "OK Computer",
      initTrack: "Paranoid Android",
      expectedValue: "Paranoid Android — Radiohead",
    },
  ])(
    "prefills subject from initial params for $itemType reviews",
    ({ itemType, initArtist, initAlbum, initTrack, expectedValue }) => {
      const { getByRole } = setup({
        itemType,
        initArtist,
        initAlbum,
        initTrack,
      });

      expect(
        getByRole("textbox", {
          name: new RegExp(`search ${itemType}`, "i"),
        }),
      ).toHaveValue(expectedValue);
    },
  );
});
