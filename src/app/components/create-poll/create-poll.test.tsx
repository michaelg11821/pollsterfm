import type { PollType } from "@/lib/types/pollster";
import { render } from "@testing-library/react";
import CreatePoll from "./create-poll";

import userEvent from "@testing-library/user-event";

import { ConvexReactClientFake } from "@/lib/__mocks__/convex-react-client";
import { search as mockAlbumSearch } from "@/lib/__mocks__/pollster/album";
import { search as mockArtistSearch } from "@/lib/__mocks__/pollster/artist";
import { search as mockTrackSearch } from "@/lib/__mocks__/pollster/track";
import { affinities } from "@/lib/constants/affinities";
import { MAX_CHOICE_COUNT, MIN_CHOICE_COUNT } from "@/lib/constants/polls";
import { api } from "@/lib/convex/_generated/api";
import TestToastWrapper from "@/lib/test-toast-wrapper";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { getAffinities as mockGetAffinities } from "../../../lib/__mocks__/pollster/affinity";
import { create as mockCreatePoll } from "../../../lib/__mocks__/pollster/poll";
import { currentUser as mockCurrentUser } from "../../../lib/__mocks__/user";

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

mockClient.registerQueryFake(
  api.pollster.affinity.getAffinities,
  mockGetAffinities,
);
mockClient.registerQueryFake(api.user.currentUser, mockCurrentUser);

const mockCreatePollMutation = vi.fn(mockCreatePoll);
mockClient.registerMutationFake(
  api.pollster.poll.create,
  mockCreatePollMutation,
);

const setup = (pollType: PollType) =>
  render(
    <ConvexProvider client={mockClient as unknown as ConvexReactClient}>
      <TestToastWrapper>
        <CreatePoll initPollType={pollType} />
      </TestToastWrapper>
    </ConvexProvider>,
  );

describe("CreatePoll", () => {
  it("poll type switch works", async () => {
    const { getByRole } = setup("artist");
    const user = userEvent.setup();

    const albumsTab = getByRole("tab", { name: /albums/i });
    await user.click(albumsTab);
    expect(
      getByRole("textbox", { name: /search album for choice 1/i }),
    ).toBeInTheDocument();

    const tracksTab = getByRole("tab", { name: /tracks/i });
    await user.click(tracksTab);
    expect(
      getByRole("textbox", { name: /search track for choice 1/i }),
    ).toBeInTheDocument();

    const artistsTab = getByRole("tab", { name: /artists/i });
    await user.click(artistsTab);
    expect(
      getByRole("textbox", { name: /search artist for choice 1/i }),
    ).toBeInTheDocument();

    await user.click(albumsTab);
    expect(
      getByRole("textbox", { name: /search album for choice 1/i }),
    ).toBeInTheDocument();

    await user.click(tracksTab);
    expect(
      getByRole("textbox", { name: /search track for choice 1/i }),
    ).toBeInTheDocument();
  });

  it("add a choice", async () => {
    const { getByRole } = setup("album");
    const user = userEvent.setup();

    const addChoiceBtn = getByRole("button", { name: /add choice/i });
    await user.click(addChoiceBtn);

    const newChoiceItemInput = getByRole("textbox", {
      name: new RegExp(`search album for choice ${MIN_CHOICE_COUNT + 1}`, "i"),
    });
    expect(newChoiceItemInput).toBeInTheDocument();
  });

  it("remove a choice", async () => {
    const { getByRole } = setup("track");
    const user = userEvent.setup();

    const addChoiceBtn = getByRole("button", { name: /add choice/i });
    await user.click(addChoiceBtn);

    const newChoiceItemInput = getByRole("textbox", {
      name: new RegExp(`search track for choice ${MIN_CHOICE_COUNT + 1}`, "i"),
    });
    expect(newChoiceItemInput).toBeInTheDocument();

    const removeNewChoiceBtn = getByRole("button", {
      name: new RegExp(`remove choice ${MIN_CHOICE_COUNT + 1}`, "i"),
    });
    await user.click(removeNewChoiceBtn);

    expect(newChoiceItemInput).not.toBeInTheDocument();
  });

  it(`add choice btn disappears at ${MAX_CHOICE_COUNT} choices`, async () => {
    const { getByRole } = setup("album");
    const user = userEvent.setup();

    const addChoiceBtn = getByRole("button", { name: /add choice/i });

    for (let i = 0; i < MAX_CHOICE_COUNT - MIN_CHOICE_COUNT; i++) {
      await user.click(addChoiceBtn);
    }

    expect(addChoiceBtn).not.toBeInTheDocument();
  });

  it("fail attempt creation without details and without choice items", async () => {
    const { getByRole } = setup("track");
    const user = userEvent.setup();

    const createPollBtn = getByRole("button", { name: /create poll/i });
    await user.click(createPollBtn);

    expect(createPollBtn).toBeInTheDocument();
  });

  it("fail attempt creation with details and without choice items", async () => {
    const { getByLabelText, getByRole } = setup("track");
    const user = userEvent.setup();

    const questionInput = getByLabelText(/question/i);
    await user.type(questionInput, "question");

    const createPollBtn = getByRole("button", { name: /create poll/i });
    await user.click(createPollBtn);

    expect(createPollBtn).toBeInTheDocument();
  });

  it("creates a poll", async () => {
    const { getByLabelText, getByRole, findByRole, findByText } =
      setup("artist");
    const user = userEvent.setup();
    // aligns with mock
    const artistsToPick = [
      "Elliott Smith",
      "Heatmiser",
      "Elliott Yamin",
      "Elliott Skinner",
      "Elliot Smythe",
    ];

    const questionInput = getByLabelText(/question/i);
    await user.type(questionInput, "question");

    for (let i = 0; i < MIN_CHOICE_COUNT; i++) {
      const choiceItemInput = getByRole("textbox", {
        name: new RegExp(`search artist for choice ${i + 1}`, "i"),
      });
      await user.type(choiceItemInput, `artist name ${i + 1}`);
      const artistOption = await findByRole("option", {
        name: new RegExp(`select artist ${artistsToPick[i]}`, "i"),
      });
      await user.click(artistOption);

      const choiceAffinityInput = getByRole("textbox", {
        name: new RegExp(`search affinities for choice ${i + 1}`, "i"),
      });
      await user.type(choiceAffinityInput, affinities[0]);
      const affinityOption = await findByRole("option", {
        name: new RegExp(`add affinity ${affinities[0]}`, "i"),
      });
      await user.click(affinityOption);
    }

    const createPollBtn = getByRole("button", { name: /create poll/i });
    await user.click(createPollBtn);

    expect(
      await findByText(/poll created successfully\./i),
    ).toBeInTheDocument();
  });
});
