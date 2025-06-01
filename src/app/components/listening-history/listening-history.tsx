import { Platform } from "@/config";
import { spotifyHistoryImported } from "@/lib/data-access/user/read";
import SpotifyListeningHistory from "./spotify/spotify";

type ListeningHistoryProps = {
  username: string;
};

async function ListeningHistory({ username }: ListeningHistoryProps) {
  const platform: Platform = "spotify";
  const hasImported = await spotifyHistoryImported(username);

  return platform === "spotify" ? (
    <SpotifyListeningHistory historyImported={hasImported} />
  ) : (
    <p>not implemented yet</p>
  );
}

export default ListeningHistory;
