"use client";

import { Button } from "@/app/components/ui/button";
import { UploadCloud } from "lucide-react";

function ListeningHistoryImport() {
  return (
    <section className="space-y-6 rounded-xl border p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Upload Spotify listening history</h2>
        <p className="text-muted-foreground text-sm">
          Import your Spotify Extended Streaming History JSON files to unlock
          deeper listening insights.
        </p>
      </div>

      <div className="space-y-2 rounded-lg border border-dashed p-8 text-center">
        <div className="flex justify-center">
          <UploadCloud className="text-muted-foreground h-6 w-6" />
        </div>
        <p className="text-sm font-medium">Upload export files</p>
        <p className="text-muted-foreground text-xs">
          Accepted format: Spotify Extended Streaming History JSON.
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm font-medium">Coming next</p>
        <p className="text-muted-foreground mt-1 text-xs">
          File validation, background import processing, and import status
          tracking will be added in a follow-up.
        </p>
      </div>

      <Button disabled className="w-full">
        Start import
      </Button>
    </section>
  );
}

export default ListeningHistoryImport;
