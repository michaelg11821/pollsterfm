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

type SetupProps = {
  pollType: PollType;
  initArtist?: string;
  initAlbum?: string;
  initTrack?: string;
  initImage?: string;
};

type PollTypeSelectionCase = {
  pollType: PollType;
  searchQuery: string;
  firstOptionLabel: RegExp;
  secondOptionLabel: RegExp;
  selectedValue: string;
  switchTabName: RegExp;
  clearedInputLabel: RegExp;
};

const setup = ({
  pollType,
  initArtist,
  initAlbum,
  initTrack,
  initImage,
}: SetupProps) =>
  render(
    <ConvexProvider client={mockClient as unknown as ConvexReactClient}>
      <TestToastWrapper>
        <CreatePoll
          initPollType={pollType}
          initArtist={initArtist}
          initAlbum={initAlbum}
          initTrack={initTrack}
          initImage={initImage}
        />
      </TestToastWrapper>
    </ConvexProvider>,
  );

const pollTypeSelectionCases: PollTypeSelectionCase[] = [
  {
    pollType: "artist",
    searchQuery: "elliott",
    firstOptionLabel: /select artist elliott smith/i,
    secondOptionLabel: /select artist heatmiser/i,
    selectedValue: "Elliott Smith",
    switchTabName: /albums/i,
    clearedInputLabel: /search album for choice/i,
  },
  {
    pollType: "album",
    searchQuery: "ok",
    firstOptionLabel: /select album ok computer by radiohead/i,
    secondOptionLabel: /select album selected ambient works by aphex twin/i,
    selectedValue: "OK Computer — Radiohead",
    switchTabName: /tracks/i,
    clearedInputLabel: /search track for choice/i,
  },
  {
    pollType: "track",
    searchQuery: "paranoid",
    firstOptionLabel: /select track paranoid android from ok computer by radiohead/i,
    secondOptionLabel: /select track xtal from selected ambient works by aphex twin/i,
    selectedValue: "Paranoid Android — Radiohead",
    switchTabName: /artists/i,
    clearedInputLabel: /search artist for choice/i,
  },
];

describe("CreatePoll", () => {
  beforeEach(() => {
    mockCreatePollMutation.mockClear();
    mockPush.mockClear();
  });

  it("poll type switch works", async () => {
    const { getByRole } = setup({ pollType: "artist" });
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

  it.each(["artist", "album", "track"] as const)(
    "add a choice for %s polls",
    async (pollType) => {
      const { getByRole } = setup({ pollType });
      const user = userEvent.setup();

      const addChoiceBtn = getByRole("button", { name: /add choice/i });
      await user.click(addChoiceBtn);

      const newChoiceItemInput = getByRole("textbox", {
        name: new RegExp(`search ${pollType} for choice ${MIN_CHOICE_COUNT + 1}`, "i"),
      });
      expect(newChoiceItemInput).toBeInTheDocument();
    },
  );

  it.each(["artist", "album", "track"] as const)(
    "remove a choice for %s polls",
    async (pollType) => {
      const { getByRole } = setup({ pollType });
      const user = userEvent.setup();

      const addChoiceBtn = getByRole("button", { name: /add choice/i });
      await user.click(addChoiceBtn);

      const newChoiceItemInput = getByRole("textbox", {
        name: new RegExp(`search ${pollType} for choice ${MIN_CHOICE_COUNT + 1}`, "i"),
      });
      expect(newChoiceItemInput).toBeInTheDocument();

      const removeNewChoiceBtn = getByRole("button", {
        name: new RegExp(`remove choice ${MIN_CHOICE_COUNT + 1}`, "i"),
      });
      await user.click(removeNewChoiceBtn);

      expect(newChoiceItemInput).not.toBeInTheDocument();
    },
  );

  it.each(["artist", "album", "track"] as const)(
    `add choice btn disappears at ${MAX_CHOICE_COUNT} choices for %s polls`,
    async (pollType) => {
      const { getByRole } = setup({ pollType });
      const user = userEvent.setup();

      const addChoiceBtn = getByRole("button", { name: /add choice/i });

      for (let i = 0; i < MAX_CHOICE_COUNT - MIN_CHOICE_COUNT; i++) {
        await user.click(addChoiceBtn);
      }

      expect(addChoiceBtn).not.toBeInTheDocument();
    },
  );

  it("creates a poll", async () => {
    const { getByLabelText, getByRole, findByRole, findByText } = setup({
      pollType: "artist",
    });
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

  it.each([
    {
      pollType: "artist" as const,
      initArtist: "Elliott Smith",
      expectedChoiceItem: "Elliott Smith",
    },
    {
      pollType: "album" as const,
      initArtist: "Radiohead",
      initAlbum: "OK Computer",
      expectedChoiceItem: "OK Computer — Radiohead",
    },
    {
      pollType: "track" as const,
      initArtist: "Radiohead",
      initAlbum: "OK Computer",
      initTrack: "Paranoid Android",
      expectedChoiceItem: "Paranoid Android — Radiohead",
    },
  ])(
    "prefills first choice from initial params for $pollType polls",
    ({ pollType, initArtist, initAlbum, initTrack, expectedChoiceItem }) => {
      const { getByRole } = setup({
        pollType,
        initArtist,
        initAlbum,
        initTrack,
      });

      expect(
        getByRole("textbox", {
          name: new RegExp(`search ${pollType} for choice 1`, "i"),
        }),
      ).toHaveValue(expectedChoiceItem);
      expect(
        getByRole("textbox", {
          name: new RegExp(`search ${pollType} for choice 2`, "i"),
        }),
      ).toHaveValue("");
    },
  );

  it.each(pollTypeSelectionCases)(
    "poll type switch clears existing selected choices for $pollType polls",
    async ({
      pollType,
      searchQuery,
      firstOptionLabel,
      selectedValue,
      switchTabName,
      clearedInputLabel,
    }) => {
      const { getByRole, findByRole } = setup({ pollType });
      const user = userEvent.setup();

      const firstChoiceInput = getByRole("textbox", {
        name: new RegExp(`search ${pollType} for choice 1`, "i"),
      });
      await user.type(firstChoiceInput, searchQuery);
      const firstOption = await findByRole("option", {
        name: firstOptionLabel,
      });
      await user.click(firstOption);

      expect(
        await findByRole("textbox", {
          name: new RegExp(`search ${pollType} for choice 1`, "i"),
        }),
      ).toHaveValue(selectedValue);

      await user.click(getByRole("tab", { name: switchTabName }));

      expect(
        getByRole("textbox", {
          name: new RegExp(`${clearedInputLabel.source} 1`, "i"),
        }),
      ).toHaveValue("");
      expect(
        getByRole("textbox", {
          name: new RegExp(`${clearedInputLabel.source} 2`, "i"),
        }),
      ).toHaveValue("");
    },
  );

  it.each(pollTypeSelectionCases)(
    "shows duplicate error when selecting an existing option for $pollType polls",
    async ({ pollType, searchQuery, firstOptionLabel }) => {
      const { getByRole, findByRole, findByText } = setup({ pollType });
      const user = userEvent.setup();

      const firstChoiceInput = getByRole("textbox", {
        name: new RegExp(`search ${pollType} for choice 1`, "i"),
      });
      await user.type(firstChoiceInput, searchQuery);
      const firstChoiceOption = await findByRole("option", {
        name: firstOptionLabel,
      });
      await user.click(firstChoiceOption);

      const secondChoiceInput = getByRole("textbox", {
        name: new RegExp(`search ${pollType} for choice 2`, "i"),
      });
      await user.type(secondChoiceInput, searchQuery);
      const duplicateOption = await findByRole("option", {
        name: firstOptionLabel,
      });
      await user.click(duplicateOption);

      expect(
        await findByText(/duplicates are not allowed\./i),
      ).toBeInTheDocument();
    },
  );
});

describe("CreatePoll fails", () => {
  beforeEach(() => {
    mockCreatePollMutation.mockClear();
  });

  it("fail attempt creation without details and without choice items", async () => {
    const { getByRole } = setup({ pollType: "track" });
    const user = userEvent.setup();

    const createPollBtn = getByRole("button", { name: /create poll/i });
    await user.click(createPollBtn);

    expect(createPollBtn).toBeInTheDocument();
  });

  it("fail attempt creation with details and without choice items", async () => {
    const { getByLabelText, getByRole } = setup({ pollType: "track" });
    const user = userEvent.setup();

    const questionInput = getByLabelText(/question/i);
    await user.type(questionInput, "question");

    const createPollBtn = getByRole("button", { name: /create poll/i });
    await user.click(createPollBtn);

    expect(createPollBtn).toBeInTheDocument();
  });

  it.each(["artist", "album", "track"] as const)(
    "does not create a poll when question and affinities are set but choices are missing for %s polls",
    async (pollType) => {
      const { getByLabelText, getByRole, findByRole, queryByText } = setup({
        pollType,
      });
      const user = userEvent.setup();

      await user.type(getByLabelText(/question/i), "which one is best?");

      for (let i = 0; i < MIN_CHOICE_COUNT; i++) {
        const choiceAffinityInput = getByRole("textbox", {
          name: new RegExp(`search affinities for choice ${i + 1}`, "i"),
        });
        await user.type(choiceAffinityInput, affinities[0]);
        const affinityOption = await findByRole("option", {
          name: new RegExp(`add affinity ${affinities[0]}`, "i"),
        });
        await user.click(affinityOption);
      }

      await user.click(getByRole("button", { name: /create poll/i }));

      expect(mockCreatePollMutation).not.toHaveBeenCalled();
      expect(queryByText(/poll created successfully\./i)).not.toBeInTheDocument();
    },
  );

  it.each(pollTypeSelectionCases)(
    "does not create a poll when question and choices are set but affinities are missing for $pollType polls",
    async ({ pollType, searchQuery, firstOptionLabel, secondOptionLabel }) => {
      const {
        getByLabelText,
        getByRole,
        findByRole,
        findAllByText,
        queryByText,
      } = setup({ pollType });
      const user = userEvent.setup();

      await user.type(getByLabelText(/question/i), "which one is best?");

      const choiceOptionLabels = [firstOptionLabel, secondOptionLabel];
      for (let i = 0; i < MIN_CHOICE_COUNT; i++) {
        const choiceItemInput = getByRole("textbox", {
          name: new RegExp(`search ${pollType} for choice ${i + 1}`, "i"),
        });
        await user.type(choiceItemInput, searchQuery);
        const choiceOption = await findByRole("option", {
          name: choiceOptionLabels[i],
        });
        await user.click(choiceOption);
      }

      await user.click(getByRole("button", { name: /create poll/i }));

      const affinityErrors = await findAllByText(
        /at least 1 affinity is required\./i,
      );
      expect(affinityErrors.length).toBeGreaterThanOrEqual(MIN_CHOICE_COUNT);
      expect(mockCreatePollMutation).not.toHaveBeenCalled();
      expect(queryByText(/poll created successfully\./i)).not.toBeInTheDocument();
    },
  );
});
