"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type ClientDiscographyProps = {
  artistName: string;
};

function ClientDiscography({ artistName }: ClientDiscographyProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    const query = params !== "" ? `?${params}` : "";

    window.history.replaceState(
      null,
      "",
      `/catalog/${encodeURIComponent(artistName)}/discography${query}`,
    );
  }, [artistName, searchParams]);

  return null;
}

export default ClientDiscography;
