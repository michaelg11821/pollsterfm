import { api } from "@/lib/convex/_generated/api";
import { spotifyHistoryImported } from "@/lib/data-access/user/read";
import { toastManager } from "@/lib/toast";
import type { Platform } from "@/lib/types/pollster";
import { fetchQuery } from "convex/nextjs";
import { Info } from "lucide-react";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import LoadingIndicator from "../ui/loading-indicator";
import { MAX_TRACKS_WITHOUT_IMPORT } from "./config";
import LastfmListeningHistory from "./lastfm";
import SpotifyListeningHistory from "./spotify";

type ListeningHistoryProps = {
  username: string;
  page: number;
};

async function ListeningHistory({ username, page }: ListeningHistoryProps) {
  const platform: Platform | null = await fetchQuery(
    api.user.getAccountPlatform,
    { username },
  );
  const hasImported = await spotifyHistoryImported(username);

  if (!platform) {
    return toastManager.add({
      title: "Error",
      description: "This user does not have a platform associated with them.",
    });
  }

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
      <SpotifyListeningHistory
        historyImported={hasImported}
        username={username}
      />
    </div>
  ) : platform === "lastfm" ? (
    <Suspense fallback={<LoadingIndicator loading={true} />}>
      <LastfmListeningHistory username={username} page={page} />
    </Suspense>
  ) : null;
}

export default ListeningHistory;
