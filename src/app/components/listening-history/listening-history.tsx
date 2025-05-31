import { Platform } from "@/config";
import SpotifyListeningHistory from "./spotify/spotify";

function ListeningHistory() {
  // TEMP
  const platform: Platform = "spotify";

  return platform === "spotify" ? (
    <SpotifyListeningHistory />
  ) : (
    <p>not implemented yet</p>
  );
}

export default ListeningHistory;
