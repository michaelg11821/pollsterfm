// will extend as i go

export interface SimplifiedArtist {
  name: string;
}

export interface Image {
  url: string;
}

export interface Album {
  name: string;
  artists: SimplifiedArtist[];
  images: Image[];
}

export interface Track {
  album: Album;
  duration_ms: number;
  name: string;
  is_local: boolean;
}

export interface PlayHistory {
  track: {
    album: Album;
    artists: SimplifiedArtist[];
    id: string;
    name: string;
    is_local: boolean;
  };
  /**
   * A string in the ISO 8601 format.
   */
  played_at: string;
}
