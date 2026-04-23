import { v } from "convex/values";
import { query } from "../_generated/server";

import { affinities } from "@/lib/constants/affinities";
import { affinityDescriptions } from "@/lib/constants/affinity-descriptions";
import { capitalize } from "@/lib/convex-utils";
import type {
  Affinity,
  AffinityAlbum,
  AffinityArtist,
  AffinityTrack,
} from "@/lib/types/pollster";

export const getAffinities = query({
  args: {},
  handler: async () => {
    return affinities;
  },
});

export const getRandomAffinities = query({
  args: { amount: v.number(), upper: v.boolean() },
  handler: async (_, args) => {
    const shuffled = [...affinities].sort(() => Math.random() - 0.5);

    const selected = shuffled.slice(0, Math.min(args.amount, shuffled.length));

    if (args.upper) {
      return selected.map((affinity) => capitalize(affinity) as Affinity);
    }

    return selected;
  },
});

export const getAffinity = query({
  args: { name: v.string() },
  handler: async (_, args) => {
    const affinity = decodeURIComponent(args.name).toLowerCase() as Affinity;

    if (!affinities.includes(affinity)) {
      return null;
    }

    return {
      name: capitalize(affinity),
      slug: affinity,
      description: affinityDescriptions[affinity],
    };
  },
});

export const getItemsByAffinity = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const normalized = decodeURIComponent(args.name).toLowerCase() as Affinity;

    if (!affinities.includes(normalized)) {
      return { artists: [], albums: [], tracks: [] };
    }

    const choices = await ctx.db.query("pollChoices").collect();

    const artistMap = new Map<string, AffinityArtist>();
    const albumMap = new Map<string, AffinityAlbum>();
    const trackMap = new Map<string, AffinityTrack>();

    for (const choice of choices) {
      const hasAffinity = choice.affinities.some(
        (a) => a.toLowerCase() === normalized,
      );

      if (!hasAffinity) continue;

      if (choice.track && choice.album) {
        const key = `${choice.artist}|${choice.album}|${choice.track}`;
        const existing = trackMap.get(key);

        if (existing) {
          existing.count += 1;
        } else {
          trackMap.set(key, {
            artist: choice.artist,
            album: choice.album,
            track: choice.track,
            image: choice.image,
            count: 1,
          });
        }
      } else if (choice.album) {
        const key = `${choice.artist}|${choice.album}`;
        const existing = albumMap.get(key);

        if (existing) {
          existing.count += 1;
        } else {
          albumMap.set(key, {
            artist: choice.artist,
            album: choice.album,
            image: choice.image,
            count: 1,
          });
        }
      } else {
        const key = choice.artist;
        const existing = artistMap.get(key);

        if (existing) {
          existing.count += 1;
        } else {
          artistMap.set(key, {
            artist: choice.artist,
            image: choice.image,
            count: 1,
          });
        }
      }
    }

    const sortItems = <T extends { count: number }>(
      items: T[],
      getName: (item: T) => string,
    ): T[] =>
      items.sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;

        return getName(a).localeCompare(getName(b));
      });

    return {
      artists: sortItems(Array.from(artistMap.values()), (a) => a.artist),
      albums: sortItems(Array.from(albumMap.values()), (a) => a.album),
      tracks: sortItems(Array.from(trackMap.values()), (t) => t.track),
    };
  },
});
