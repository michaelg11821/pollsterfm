import { getRecentlyPlayedTracks } from "@/lib/data-access/user/spotify";
import type { PlayHistory } from "@/lib/types/spotify";
// import type { SpotifyRecentlyPlayedResponse } from "@/lib/types/spotifyResponses";
import { act, render, screen } from "@testing-library/react";
import {
  MAX_TRACKS_WITHOUT_IMPORT,
  TRACK_CHUNK_SIZE,
  trackFetchingError,
} from "./config";
import SpotifyListeningHistory from "./spotify";

import TestToastWrapper from "@/lib/__tests__/utils/test-toast-wrapper";
import { mockIntersectionObserver } from "jsdom-testing-mocks";

const trackTemplate: PlayHistory = {
  track: {
    id: "2394jg09jvr0",
    name: "taylor swift song",
    album: {
      artists: [
        {
          name: "Taylor Swift",
        },
      ],
      external_urls: {
        spotify: "https://open.spotify.com/album/1NAmidJlEaVgA3MpcPFYGq",
      },
      images: [
        {
          url: "https://i.scdn.co/image/ab67616d0000b273bce4a07d72f7087a10b3ebd0",
        },
      ],
      name: "Lover",
      release_date: "2019-08-23",
      id: "bbb",
    },
    artists: [
      {
        name: "Taylor Swift",
      },
    ],
    is_local: false,
  },
  played_at: "2025-05-30T18:50:00.000Z",
};

const firstBatch = Array.from({ length: TRACK_CHUNK_SIZE }, (_, i) => ({
  ...trackTemplate,
  track: { ...trackTemplate.track, id: `first_batch_${i}` },
}));

const secondBatch = Array.from({ length: TRACK_CHUNK_SIZE }, (_, i) => ({
  ...trackTemplate,
  track: { ...trackTemplate.track, id: `second_batch_${i}` },
}));

const thirdBatch = Array.from({ length: TRACK_CHUNK_SIZE }, (_, i) => ({
  ...trackTemplate,
  track: { ...trackTemplate.track, id: `third_batch_${i}` },
}));

const fourthBatch = Array.from({ length: TRACK_CHUNK_SIZE }, (_, i) => ({
  ...trackTemplate,
  track: { ...trackTemplate.track, id: `fourth_batch_${i}` },
}));

vi.mock("@/lib/data-access/user/spotify", () => ({
  getRecentlyPlayedTracks: vi.fn(),
  __esModule: true,
}));

vi.mock("next/navigation", () => ({
  useParams: vi.fn(() => ({
    username: "mock-user",
  })),
  __esModule: true,
}));

describe("spotify listening history", () => {
  describe("no streaming history imported", async () => {
    it(`renders ${MAX_TRACKS_WITHOUT_IMPORT} tracks only`, async () => {
      const io = mockIntersectionObserver();

      const mockRecentlyPlayed = vi.mocked(getRecentlyPlayedTracks);
      mockRecentlyPlayed
        .mockResolvedValueOnce({
          items: firstBatch,
          next: "url-for-page-2",
          progress_ms: 123,
        })
        .mockResolvedValueOnce({
          items: secondBatch,
          next: "url-for-page-3",
          progress_ms: 456,
        });

      act(() => {
        render(<SpotifyListeningHistory historyImported={false} />);
      });

      const initialTracks = await screen.findAllByText("taylor swift song");
      expect(initialTracks.length).toBe(TRACK_CHUNK_SIZE);

      const loaderElement = screen.getByTestId("loader-ref");

      act(() => {
        io.enterNode(loaderElement);
      });

      const moreTracks = await screen.findAllByText("taylor swift song");
      expect(moreTracks.length).toBe(MAX_TRACKS_WITHOUT_IMPORT);

      act(() => {
        io.enterNode(loaderElement);
      });

      const sameAsMoreTracks = await screen.findAllByText("taylor swift song");
      expect(sameAsMoreTracks.length).toBe(MAX_TRACKS_WITHOUT_IMPORT);
    });
  });

  describe("streaming history imported", () => {
    it(`renders ${MAX_TRACKS_WITHOUT_IMPORT + TRACK_CHUNK_SIZE} tracks`, async () => {
      const io = mockIntersectionObserver();

      const mockRecentlyPlayed = vi.mocked(getRecentlyPlayedTracks);
      mockRecentlyPlayed
        .mockResolvedValueOnce({
          items: firstBatch,
          next: "url-for-page-2",
          progress_ms: 123,
        })
        .mockResolvedValueOnce({
          items: secondBatch,
          next: "url-for-page-3",
          progress_ms: 456,
        })
        .mockResolvedValueOnce({
          items: thirdBatch,
          next: "url-for-page-4",
          progress_ms: 789,
        })
        .mockResolvedValueOnce({
          items: fourthBatch,
          next: "url-for-page-5",
          progress_ms: 142,
        });

      act(() => {
        render(<SpotifyListeningHistory historyImported={true} />);
      });

      const initialTracks = await screen.findAllByText("taylor swift song");
      expect(initialTracks.length).toBe(TRACK_CHUNK_SIZE);

      const loaderElement = screen.getByTestId("loader-ref");

      act(() => {
        io.enterNode(loaderElement);
      });

      const moreTracks = await screen.findAllByText("taylor swift song");
      expect(moreTracks.length).toBe(MAX_TRACKS_WITHOUT_IMPORT);

      act(() => {
        io.enterNode(loaderElement);
      });

      const evenMoreTracks = await screen.findAllByText("taylor swift song");

      expect(evenMoreTracks.length).toBe(
        MAX_TRACKS_WITHOUT_IMPORT + TRACK_CHUNK_SIZE,
      );
    });
  });

  it("stops when next(url) is null", async () => {
    const io = mockIntersectionObserver();

    const mockRecentlyPlayed = vi.mocked(getRecentlyPlayedTracks);
    mockRecentlyPlayed.mockResolvedValueOnce({
      items: firstBatch,
      next: null,
      progress_ms: 123,
    });

    act(() => {
      render(<SpotifyListeningHistory historyImported={true} />);
    });

    const loaderElement = screen.getByTestId("loader-ref");

    act(() => {
      io.enterNode(loaderElement);
    });

    const tracks = await screen.findAllByText("taylor swift song");
    expect(tracks.length).toBe(TRACK_CHUNK_SIZE);
  });

  it("stops rendering on error", async () => {
    const mockRecentlyPlayed = vi.mocked(getRecentlyPlayedTracks);
    mockRecentlyPlayed.mockResolvedValueOnce(null).mockResolvedValueOnce({
      items: secondBatch,
      next: null,
      progress_ms: 123,
    });

    act(() => {
      render(<SpotifyListeningHistory historyImported={true} />, {
        wrapper: TestToastWrapper,
      });
    });

    const errorMsg = await screen.findByText(trackFetchingError);
    expect(errorMsg).toBeInTheDocument();
  });
});
