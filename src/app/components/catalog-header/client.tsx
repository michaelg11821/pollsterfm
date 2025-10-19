"use client";

import type {
  AlbumData,
  CatalogData,
  TrackData,
} from "@/lib/types/internalResponses";
import type { CatalogItemType } from "@/lib/types/pollster";
import { useEffect, useMemo } from "react";
import CatalogImage from "../catalog-image/catalog-image";
import CatalogInfo from "../catalog-info/catalog-info";

type ClientCatalogHeaderProps = {
  itemType: CatalogItemType;
  data: CatalogData;
};

function ClientCatalogHeader({ itemType, data }: ClientCatalogHeaderProps) {
  const url = useMemo(() => {
    switch (itemType) {
      case "artist":
        return `/catalog/${encodeURIComponent(data.name)}`;
      case "album":
        const albumData = data as AlbumData;

        return `/catalog/${encodeURIComponent(albumData.artists[0])}/discography/${encodeURIComponent(albumData.name)}`;
      case "track":
        const trackData = data as TrackData;

        return `/catalog/${encodeURIComponent(trackData.artists[0])}/discography/${encodeURIComponent(trackData.albumName)}/${encodeURIComponent(trackData.name)}`;
    }
  }, [itemType, data]);

  useEffect(() => {
    window.history.replaceState(null, "", url);
  }, [url]);

  return (
    <div className="content-wrapper px-5 py-0 xl:p-0">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <CatalogImage image={data.image} alt={data.name} itemType={itemType} />
        <CatalogInfo itemType={itemType} data={data} />
      </div>
    </div>
  );
}

export default ClientCatalogHeader;
