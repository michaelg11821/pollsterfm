import { getRecentlyPlayedTracks } from "@/lib/data-access/user/spotify";
import { act, render, screen } from "@testing-library/react";
import SpotifyListeningHistory from "./spotify";
// import { simulateIntersection } from "@/lib/__mocks__/IntersectionObserver";
import { SpotifyRecentlyPlayedResponse } from "@/lib/types/spotifyResponses";

import {
  IntersectionObserverMock,
  mockDisconnect,
  mockObserve,
  mockUnobserve,
  simulateIntersection,
} from "@/lib/__mocks__/IntersectionObserver";
import { PlayHistory } from "@/lib/types/spotify";
import { useParams } from "next/navigation";
import { MAX_TRACKS_WITHOUT_IMPORT, TRACK_CHUNK_SIZE } from "./config";

vi.mock("@/lib/data-access/user/spotify", () => ({
  getRecentlyPlayedTracks: vi.fn(),
  __esModule: true,
}));

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
}));

beforeAll(() => {
  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
});

describe("spotify listening history", () => {
  beforeEach(() => {
    IntersectionObserverMock.mockClear();
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
  });

  const testTracks = [
    {
      track: {
        id: "2394jg09jvr0",
        name: "weeknd song",
        album: {
          artists: [
            {
              name: "The Weeknd",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/2ODvWsOgouMbaA5xf0RkJe",
          },
          images: [
            {
              url: "https://i.scdn.co/image/ab67616d0000b2738863995f16bb110017c68888",
            },
            {
              url: "https://i.scdn.co/image/ab67616d00001e028863995f16bb110017c68888",
            },
          ],
          name: "Starboy",
          release_date: "2016-11-25",
          id: "fjngjiedjeoiw23",
        },
        artists: [
          {
            name: "The Weeknd",
          },
        ],
        is_local: false,
      },
      played_at: "2025-05-30T18:55:00.000Z",
    },
    {
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
    },
    {
      track: {
        id: "rji0wrkg2f",
        name: "dua lipa song",
        album: {
          id: "0eiwrj903rjfiw",
          artists: [
            {
              name: "Dua Lipa",
            },
          ],
          external_urls: {
            spotify: "https://open.spotify.com/album/6LdG0rOmYQ3gbtjS4vH6F8",
          },
          images: [
            {
              url: "https://i.scdn.co/image/ab67616d0000b27325c0b93f99f01ac745a9f21d",
            },
          ],
          name: "Future Nostalgia",
          release_date: "2020-03-27",
        },
        artists: [
          {
            name: "Dua Lipa",
          },
        ],
        is_local: false,
      },
      played_at: "2025-05-30T18:45:00.000Z",
    },
  ];

  it("renders initial tracks without scroll", async () => {
    const initialTracksData: SpotifyRecentlyPlayedResponse = {
      next: "some-url",
      progress_ms: 123456,
      items: testTracks,
    };

    const mockUseParams = vi.mocked(useParams<{ username: string }>);
    mockUseParams.mockReturnValue({ username: "mock-user" });

    const mockRecentlyPlayed = vi.mocked(getRecentlyPlayedTracks);
    mockRecentlyPlayed.mockResolvedValueOnce(initialTracksData);

    act(() => {
      render(<SpotifyListeningHistory />);
    });

    expect(getRecentlyPlayedTracks).toHaveBeenCalledOnce();

    const trackOne = await screen.findByText(/starboy/i);
    const trackTwo = await screen.findByText(/lover/i);
    const trackThree = await screen.findByText(/future nostalgia/i);

    expect(trackOne).toBeInTheDocument();
    expect(trackTwo).toBeInTheDocument();
    expect(trackThree).toBeInTheDocument();
  });

  describe("no import", () => {
    it(`renders ${MAX_TRACKS_WITHOUT_IMPORT} tracks`, async () => {
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

      const mockUseParams = vi.mocked(useParams<{ username: string }>);
      mockUseParams.mockReturnValue({ username: "mock-user" });

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
        render(<SpotifyListeningHistory />);
      });

      const initialTracks = await screen.findAllByText("taylor swift song");
      expect(initialTracks.length).toBe(TRACK_CHUNK_SIZE);

      const loaderElement = screen.getByTestId("loader-ref");

      act(() => {
        simulateIntersection(loaderElement, true);
      });

      const tracks = await screen.findAllByText("taylor swift song");

      expect(tracks.length).toBe(MAX_TRACKS_WITHOUT_IMPORT);
      expect(getRecentlyPlayedTracks).toHaveBeenCalledTimes(2);
    });
  });
});
