import type { PollType } from "@/lib/types/pollster";
import { render } from "@testing-library/react";
import CreatePoll from "./create-poll";

import { ConvexReactClientFake } from "@/lib/__mocks__/convex-react-client";
import { search as mockAlbumSearch } from "@/lib/__mocks__/pollster/album";
import { search as mockArtistSearch } from "@/lib/__mocks__/pollster/artist";
import { search as mockTrackSearch } from "@/lib/__mocks__/pollster/track";
import { api } from "@/lib/convex/_generated/api";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { getAffinities as mockGetAffinities } from "../../../lib/__mocks__/pollster/affinity";
import { create as mockCreatePoll } from "../../../lib/__mocks__/pollster/poll";
import { currentUser as mockCurrentUser } from "../../../lib/__mocks__/user";

vi.mock("next/navigation", () => {
  const actual = vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
    })),
  };
});

const mockClient = new ConvexReactClientFake();

mockClient.registerActionFake(api.pollster.artist.search, mockArtistSearch);
mockClient.registerActionFake(api.pollster.album.search, mockAlbumSearch);
mockClient.registerActionFake(api.pollster.track.search, mockTrackSearch);

mockClient.registerQueryFake(
  api.pollster.affinity.getAffinities,
  mockGetAffinities,
);
mockClient.registerQueryFake(api.user.currentUser, mockCurrentUser);

mockClient.registerMutationFake(api.pollster.poll.create, mockCreatePoll);

const setup = (pollType: PollType) =>
  render(
    <ConvexProvider client={mockClient as unknown as ConvexReactClient}>
      <CreatePoll initPollType={pollType} />
    </ConvexProvider>,
  );

describe("CreatePoll", () => {
  it("renders CreatePoll", async () => {
    const { getByText } = setup("artist");
    expect(getByText("Details")).not.toBeNull();
  });
});
