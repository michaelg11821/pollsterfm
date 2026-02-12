import type { Track } from "@/lib/types/spotify";

export function search(): Track[] {
  return [
    {
      album: {
        artists: [{ name: "Radiohead" }],
        external_urls: { spotify: "https://open.spotify.com/album/1" },
        id: "album-1",
        images: [{ url: "https://i.scdn.co/image/track1.jpg" }],
        name: "OK Computer",
        release_date: "1997-05-21",
      },
      duration_ms: 260000,
      external_urls: { spotify: "https://open.spotify.com/track/1" },
      is_local: false,
      name: "Paranoid Android",
    },
    {
      album: {
        artists: [{ name: "Aphex Twin" }],
        external_urls: { spotify: "https://open.spotify.com/album/2" },
        id: "album-2",
        images: [{ url: "https://i.scdn.co/image/track2.jpg" }],
        name: "Selected Ambient Works",
        release_date: "1992-11-09",
      },
      duration_ms: 300000,
      external_urls: { spotify: "https://open.spotify.com/track/2" },
      is_local: false,
      name: "Xtal",
    },
  ];
}
