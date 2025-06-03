import { Platform } from "@/config";
import { spotifyHistoryImported } from "@/lib/data-access/user/read";
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { MAX_TRACKS_WITHOUT_IMPORT } from "./spotify/config";
import SpotifyListeningHistory from "./spotify/spotify";

type ListeningHistoryProps = {
  username: string;
};

async function ListeningHistory({ username }: ListeningHistoryProps) {
  const platform: Platform = "spotify";
  const hasImported = await spotifyHistoryImported(username);

  return platform === "spotify" ? (
    <div className="pt-5">
      {!hasImported && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>
            Only showing {MAX_TRACKS_WITHOUT_IMPORT} recent tracks.
          </AlertTitle>
          <AlertDescription>
            Import your Spotify or Apple Music streaming history to see more!
          </AlertDescription>
        </Alert>
      )}
      <SpotifyListeningHistory historyImported={hasImported} />
    </div>
  ) : (
    <p>not implemented yet</p>
  );
}

export default ListeningHistory;
