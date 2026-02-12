import type { Album } from "@/lib/types/lastfm";

export function search(): Album[] {
  return [
    {
      artist: "Radiohead",
      image: [
        { "#text": "https://lastfm.freetls.fastly.net/album1_sm.jpg", size: "small" },
        { "#text": "https://lastfm.freetls.fastly.net/album1_md.jpg", size: "medium" },
        { "#text": "https://lastfm.freetls.fastly.net/album1_lg.jpg", size: "large" },
      ],
      name: "OK Computer",
      url: "https://www.last.fm/music/Radiohead/OK+Computer",
    },
    {
      artist: "Aphex Twin",
      image: [
        { "#text": "https://lastfm.freetls.fastly.net/album2_sm.jpg", size: "small" },
        { "#text": "https://lastfm.freetls.fastly.net/album2_md.jpg", size: "medium" },
        { "#text": "https://lastfm.freetls.fastly.net/album2_lg.jpg", size: "large" },
      ],
      name: "Selected Ambient Works",
      url: "https://www.last.fm/music/Aphex+Twin/Selected+Ambient+Works",
    },
  ];
}
