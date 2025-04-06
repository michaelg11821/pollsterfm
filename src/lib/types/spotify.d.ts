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
