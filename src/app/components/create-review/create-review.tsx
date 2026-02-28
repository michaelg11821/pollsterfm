"use client";

import { getChoiceItemName } from "@/lib/convex-utils";
import { api } from "@/lib/convex/_generated/api";
import { cn } from "@/lib/next-utils";
import { toastManager } from "@/lib/toast";
import type { Album } from "@/lib/types/lastfm";
import type { PollType } from "@/lib/types/pollster";
import type { Artist, Track } from "@/lib/types/spotify";
import {
  createReviewSchema,
  type createReviewSchemaType,
} from "@/lib/zod/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  Disc,
  Loader2,
  Music2,
  PenLine,
  Search,
  Star,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import AlbumResults from "../create-poll/album-results";
import ArtistResults from "../create-poll/artist-results";
import TrackResults from "../create-poll/track-results";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Tabs, TabsIndicator, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";

import * as Sentry from "@sentry/nextjs";

type CreateReviewProps = {
  initItemType: PollType;
  initArtist?: string;
  initAlbum?: string;
  initTrack?: string;
  initImage?: string;
};

function getInitialItem(
  itemType: PollType,
  artist?: string,
  album?: string,
  track?: string,
  image?: string,
) {
  return {
    image: image ?? "",
    artist: artist ?? "",
    album:
      itemType === "album"
        ? (album ?? "")
        : itemType === "track"
          ? (album ?? "")
          : null,
    track: itemType === "track" ? (track ?? "") : null,
  };
}

function CreateReview({
  initItemType,
  initArtist,
  initAlbum,
  initTrack,
  initImage,
}: CreateReviewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Artist[] | Album[] | Track[]
  >([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<createReviewSchemaType>({
    resolver: zodResolver(createReviewSchema),
    mode: "onChange",
    defaultValues: {
      itemType: initItemType,
      item: getInitialItem(
        initItemType,
        initArtist,
        initAlbum,
        initTrack,
        initImage,
      ),
      rating: 0,
      text: "",
    },
  });

  const artistSearch = useAction(api.pollster.artist.search);
  const albumSearch = useAction(api.pollster.album.search);
  const trackSearch = useAction(api.pollster.track.search);
  const currentUser = useQuery(api.user.currentUser);
  const createReview = useMutation(api.pollster.review.create);
  const router = useRouter();

  const itemType = useWatch({ control: form.control, name: "itemType" });
  const item = useWatch({ control: form.control, name: "item" });
  const rating = useWatch({ control: form.control, name: "rating" });

  const handleItemTypeChange = (val: PollType) => {
    form.setValue("itemType", val);
    form.setValue("item", { image: "", artist: "", album: null, track: null });
    form.clearErrors("item");

    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(false);
  };

  const debouncedSearch = useCallback(
    (query: string) => {
      const timeoutId = setTimeout(async () => {
        if (query.length > 0) {
          let results: Artist[] | Album[] | Track[] | null = null;

          switch (itemType) {
            case "artist":
              results = await artistSearch({ query });
              break;
            case "album":
              results = await albumSearch({ query });
              break;
            case "track":
              results = await trackSearch({ query });
              break;
          }

          if (!results) {
            return toastManager.add({
              title: "Error",
              description: "Search failed. Please retry.",
            });
          }

          setSearchResults(results);
          setSearchOpen(true);
        } else {
          setSearchResults([]);
          setSearchOpen(false);
        }
      }, 600);

      return () => clearTimeout(timeoutId);
    },
    [albumSearch, artistSearch, itemType, trackSearch],
  );

  const onSubmit = async (values: createReviewSchemaType) => {
    if (!currentUser) {
      return router.push(
        `/sign-in?redirectTo=${encodeURIComponent("/create-review")}`,
      );
    }

    try {
      setSubmitting(true);

      const result = await createReview({
        artist: values.item.artist,
        album: values.item.album,
        track: values.item.track,
        image: values.item.image,
        rating: values.rating,
        text: values.text,
      });

      if (result === null) throw new Error("Failed to create review.");

      router.push("/reviews");

      return toastManager.add({
        title: "Success",
        description: "Review submitted successfully.",
      });
    } catch (err: unknown) {
      Sentry.captureException(err);

      return toastManager.add({
        title: "Error",
        description: "Failed to submit review. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h3 className="text-xl font-semibold">Subject</h3>
            <Tabs value={itemType} onValueChange={handleItemTypeChange}>
              <TabsList className="border">
                <TabsTrigger value="artist">
                  <User className="mr-1 h-4 w-4" />
                  <span className="inline">Artists</span>
                </TabsTrigger>
                <TabsTrigger value="album">
                  <Disc className="mr-1 h-4 w-4" />
                  <span className="inline">Albums</span>
                </TabsTrigger>
                <TabsTrigger value="track">
                  <Music2 className="mr-1 h-4 w-4" />
                  <span className="inline">Tracks</span>
                </TabsTrigger>
                <TabsIndicator />
              </TabsList>
            </Tabs>
          </div>

          <FormField
            control={form.control}
            name={`item.${itemType}`}
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="mx-auto h-40 w-40 flex-shrink-0 overflow-hidden rounded-md bg-white/5 sm:mx-0 sm:h-12 sm:w-12">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt=""
                        sizes="100%"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        {itemType === "artist" ? (
                          <User className="text-muted-foreground h-6 w-6" />
                        ) : itemType === "album" ? (
                          <Disc className="text-muted-foreground h-6 w-6" />
                        ) : (
                          <Music2 className="text-muted-foreground h-6 w-6" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative flex-1">
                    <div className="bg-foreground/10 border-muted-foreground/20 focus-within:ring-foreground/60 flex h-full items-center rounded-md border py-1.5 pl-3 transition focus-within:ring-1">
                      <Search className="mr-2 h-4 w-4" />
                      <FormControl>
                        <input
                          type="text"
                          value={getChoiceItemName(item) ?? searchQuery}
                          aria-label={`Search ${itemType}`}
                          placeholder={`Search for ${itemType === "track" ? "a" : "an"} ${itemType}...`}
                          className="placeholder:text-muted-foreground h-full flex-1 border-none bg-transparent p-1.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:p-0"
                          onChange={(e) => {
                            if (item.artist !== "") return;

                            setSearchQuery(e.target.value);
                            debouncedSearch(e.target.value);
                          }}
                          onFocus={() => {
                            if (item.artist !== "") return;

                            setSearchOpen(true);
                          }}
                          onBlur={() => {
                            if (searchResults.length > 0) return;

                            setSearchOpen(false);
                          }}
                        />
                      </FormControl>
                      {item.artist && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="focus-visible:ring-foreground/60 mr-2 h-6 w-6 cursor-pointer hover:bg-transparent"
                          onClick={() => {
                            form.setValue("item", {
                              image: "",
                              artist: "",
                              album: null,
                              track: null,
                            });
                            setSearchQuery("");
                            setSearchResults([]);
                            setSearchOpen(false);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {searchResults.length > 0 && searchOpen && (
                      <div
                        role="listbox"
                        aria-label={`${itemType} search results`}
                        className="bg-popover text-popover-foreground absolute top-full z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border shadow-md backdrop-blur-md"
                      >
                        {itemType === "artist" && (
                          <ArtistResults
                            results={searchResults as Artist[]}
                            selectResult={(artist, image) => {
                              form.setValue("item", {
                                artist,
                                album: null,
                                track: null,
                                image,
                              });
                              field.onChange(artist);
                              setSearchQuery("");
                              setSearchResults([]);
                              setSearchOpen(false);
                            }}
                          />
                        )}
                        {itemType === "album" && (
                          <AlbumResults
                            results={searchResults as Album[]}
                            selectResult={(artist, album, image) => {
                              form.setValue("item", {
                                artist,
                                album,
                                track: null,
                                image,
                              });

                              field.onChange(album);
                              setSearchQuery("");
                              setSearchResults([]);
                              setSearchOpen(false);
                            }}
                          />
                        )}
                        {itemType === "track" && (
                          <TrackResults
                            results={searchResults as Track[]}
                            selectResult={(artist, album, track, image) => {
                              form.setValue("item", {
                                artist,
                                album,
                                track,
                                image,
                              });

                              field.onChange(track);
                              setSearchQuery("");
                              setSearchResults([]);
                              setSearchOpen(false);
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="min-h-[1.25rem]">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </Card>

        <Card className="p-6">
          <h3 className="mb-6 text-xl font-semibold">Review</h3>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground mb-2">
                    Rating
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          aria-label={`Rate ${star} stars`}
                          className="cursor-pointer rounded p-1 transition-colors hover:bg-white/10"
                          onClick={() => field.onChange(star)}
                        >
                          <Star
                            className={cn(
                              "h-7 w-7",
                              star <= rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/30",
                            )}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="text-muted-foreground ml-2 text-sm">
                          {rating}/5
                        </span>
                      )}
                    </div>
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground mb-2">
                    Review
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-[1.25rem]">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </Card>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="default"
            className="flex-1 cursor-pointer"
            disabled={submitting}
            type="submit"
          >
            {submitting ? (
              <Loader2 className="h-5 w-62 animate-spin" />
            ) : (
              <>
                <PenLine className="h-4 w-4" />
                Submit Review
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreateReview;
