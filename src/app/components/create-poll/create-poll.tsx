"use client";

import { oneDayMs, oneMonthMs, oneWeekMs } from "@/lib/constants/time";
import { api } from "@/lib/convex/_generated/api";
import { toastManager } from "@/lib/toast";
import type { Album } from "@/lib/types/lastfm";
import type { Affinity, PollType } from "@/lib/types/pollster";
import type { Artist, Track } from "@/lib/types/spotify";
import { createPollSchema, createPollSchemaType } from "@/lib/zod/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  Clock,
  Disc,
  Loader2,
  Music2,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { Badge } from "../ui/badge";
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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsIndicator, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import AlbumResults from "./album-results/album-results";
import ArtistResults from "./artist-results/artist-results";
import TrackResults from "./track-results/track-results";

import { getChoiceItemName } from "@/lib/utils";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";

const createArtistChoice = (initArtist?: string, initImage?: string) => ({
  image: initImage ?? "",
  artist: initArtist ?? "",
  album: null,
  track: null,
  affinities: [] as Affinity[],
  totalVotes: 0,
});

const createAlbumChoice = (
  initArtist?: string,
  initAlbum?: string,
  initImage?: string,
) => ({
  image: initImage ?? "",
  artist: initArtist ?? "",
  album: initAlbum ?? "",
  track: null,
  affinities: [] as Affinity[],
  totalVotes: 0,
});

const createTrackChoice = (
  initArtist?: string,
  initAlbum?: string,
  initTrack?: string,
  initImage?: string,
) => ({
  image: initImage ?? "",
  artist: initArtist ?? "",
  album: initAlbum ?? "",
  track: initTrack ?? "",
  affinities: [] as Affinity[],
  totalVotes: 0,
});

type CreatePollProps = {
  initPollType: PollType;
  initArtist: string | undefined;
  initAlbum: string | undefined;
  initTrack: string | undefined;
  initImage: string | undefined;
};

function CreatePoll({
  initPollType,
  initArtist,
  initAlbum,
  initTrack,
  initImage,
}: CreatePollProps) {
  const [musicSearchResults, setMusicSearchResults] = useState<
    Artist[] | Album[] | Track[]
  >([]);
  const [activeMusicSearchOption, setActiveMusicSearchOption] = useState<
    number | null
  >(null);

  const [affinitySearchResults, setAffinitySearchResults] = useState<
    Affinity[]
  >([]);
  const [activeAffinitySearchOption, setActiveAffinitySearchOption] = useState<
    number | null
  >(null);

  const [creatingPoll, setCreatingPoll] = useState<boolean>(false);

  const form = useForm<createPollSchemaType>({
    resolver: zodResolver(createPollSchema),
    mode: "onChange",
    defaultValues:
      initPollType === "artist"
        ? {
            question: "",
            description: "",
            duration: String(oneWeekMs),
            pollType: "artist",
            choices: [
              createArtistChoice(initArtist, initImage),
              createArtistChoice(),
            ],
            totalVotes: 0,
          }
        : initPollType === "album"
          ? {
              question: "",
              description: "",
              duration: String(oneWeekMs),
              pollType: "album",
              choices: [
                createAlbumChoice(initArtist, initAlbum, initImage),
                createAlbumChoice(),
              ],
              totalVotes: 0,
            }
          : {
              question: "",
              description: "",
              duration: String(oneWeekMs),
              pollType: "track",
              choices: [
                createTrackChoice(initArtist, initAlbum, initTrack, initImage),
                createTrackChoice(),
              ],
              totalVotes: 0,
            },
  });

  const { fields, append, remove, update, replace } = useFieldArray({
    control: form.control,
    name: "choices",
    rules: { minLength: 2, maxLength: 5 },
  });

  const artistSearch = useAction(api.pollster.artist.search);
  const albumSearch = useAction(api.pollster.album.search);
  const trackSearch = useAction(api.pollster.track.search);

  const affinities = useQuery(api.pollster.affinity.getAffinities);
  const currentUser = useQuery(api.user.currentUser);

  const createPoll = useMutation(api.pollster.poll.create);

  const router = useRouter();

  const pollType = useWatch({
    control: form.control,
    name: "pollType",
  });

  const handlePollTypeChange = (val: PollType) => {
    form.setValue("pollType", val);

    for (let i = 0; i < fields.length; i++) {
      form.clearErrors(`choices.${i}`);
    }

    switch (val) {
      case "artist":
        replace(fields.map(() => createArtistChoice()));
        break;
      case "album":
        replace(fields.map(() => createAlbumChoice()));
        break;
      case "track":
        replace(fields.map(() => createTrackChoice()));
        break;
    }

    setMusicSearchResults([]);
    setActiveMusicSearchOption(null);
  };

  const debouncedMusicSearch = useCallback(
    (query: string, choiceIndex: number) => {
      const timeoutId = setTimeout(async () => {
        if (query.length > 0) {
          let results: Artist[] | Album[] | Track[] | null = null;

          switch (pollType) {
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

          setMusicSearchResults(results);
          setActiveMusicSearchOption(choiceIndex);
        } else {
          setMusicSearchResults([]);
          setActiveMusicSearchOption(null);
        }
      }, 600);

      return () => clearTimeout(timeoutId);
    },
    [albumSearch, artistSearch, pollType, trackSearch],
  );

  const debouncedAffinitySearch = useCallback(
    (query: string, choiceIndex: number, selectedAffinities: Affinity[]) => {
      const timeoutId = setTimeout(() => {
        if (!affinities) return;

        if (query.length > 0) {
          const filteredAffinities = affinities.filter(
            (affinity) => !selectedAffinities.includes(affinity),
          );

          const fuse = new Fuse(filteredAffinities);
          const results = fuse.search(query);

          if (results.length > 0) {
            const filteredResults = results.map((result) => result.item);

            setAffinitySearchResults(filteredResults.slice(0, 50));
            setActiveAffinitySearchOption(choiceIndex);
          }
        } else {
          setAffinitySearchResults([]);
          setActiveAffinitySearchOption(null);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [affinities],
  );

  const clearSearch = () => {
    setMusicSearchResults([]);
    setActiveMusicSearchOption(null);
  };

  const onSubmit = async (values: createPollSchemaType) => {
    if (!currentUser)
      return router.push(
        `/sign-in?redirectTo=${encodeURIComponent("/create-poll")}`,
      );

    try {
      setCreatingPoll(true);

      const result = await createPoll({
        ...values,
        duration: Number(values.duration),
        author: currentUser.username,
        expiresAt: Date.now() + Number(values.duration),
      });

      router.push(`/polls/${result}`);

      return toastManager.add({
        title: "Success",
        description: "Poll created successfully.",
      });
    } catch (err: unknown) {
      console.error("error creating poll:", err);

      return toastManager.add({
        title: "Error",
        description: "Failed to create poll. Please try again.",
      });
    } finally {
      setCreatingPoll(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold">Details</h3>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground mb-2">
                    Question
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex. Which album has the best production?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground mb-2">
                    Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add some context to your poll..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                    name="duration"
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={String(oneDayMs)}>1 day</SelectItem>
                      <SelectItem value={String(oneDayMs * 3)}>
                        3 days
                      </SelectItem>
                      <SelectItem value={String(oneWeekMs)}>1 week</SelectItem>
                      <SelectItem value={String(oneWeekMs * 2)}>
                        2 weeks
                      </SelectItem>
                      <SelectItem value={String(oneMonthMs)}>
                        1 month
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h3 className="text-xl font-semibold">Choices</h3>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Tabs value={pollType} onValueChange={handlePollTypeChange}>
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
              <Badge variant="default" className="border-primary/30">
                {fields.length}/5 choices
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            {fields.map((choice, index) => (
              <div
                className="bg-muted rounded-lg border p-4 sm:p-6"
                key={choice.id}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-medium">Choice {index + 1}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`hover:text-accent-foreground hover:bg-foreground/10 h-8 w-8 cursor-pointer ${fields.length <= 2 ? "invisible" : ""}`}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`choices.${index}.${pollType}` as const}
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-2 flex flex-col gap-4 sm:flex-row">
                        <div className="mx-auto h-40 w-40 flex-shrink-0 overflow-hidden rounded-md bg-white/5 sm:mx-0 sm:h-12 sm:w-12">
                          {choice.image ? (
                            <Image
                              src={choice.image}
                              alt=""
                              sizes="100%"
                              width={64}
                              height={64}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              {pollType === "artist" ? (
                                <User className="text-muted-foreground h-6 w-6" />
                              ) : pollType === "album" ? (
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
                                value={getChoiceItemName(choice)}
                                placeholder={`Search for ${pollType === "track" ? "a" : "an"} ${pollType}...`}
                                className="placeholder:text-muted-foreground h-full flex-1 border-none bg-transparent p-1.5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:p-0"
                                onChange={(e) => {
                                  if (choice.artist !== "") return;

                                  debouncedMusicSearch(e.target.value, index);
                                }}
                                onFocus={() => {
                                  if (choice.artist !== "") return;

                                  setActiveMusicSearchOption(index);
                                }}
                                onBlur={() => {
                                  if (musicSearchResults.length > 0) return;

                                  setActiveMusicSearchOption(null);
                                }}
                                name={`option-${index}-query`}
                              />
                            </FormControl>
                            {choice.artist && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="focus-visible:ring-foreground/60 mr-2 h-6 w-6 cursor-pointer hover:bg-transparent"
                                onClick={() => {
                                  update(index, {
                                    ...choice,
                                    artist: "",
                                    album: null,
                                    track: null,
                                    image: "",
                                  });

                                  clearSearch();
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {musicSearchResults.length > 0 &&
                            activeMusicSearchOption === index && (
                              <div className="bg-popover text-popover-foreground absolute top-full z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border shadow-md backdrop-blur-md">
                                {pollType === "artist" && (
                                  <ArtistResults
                                    results={musicSearchResults as Artist[]}
                                    selectResult={(artist, image) => {
                                      update(index, {
                                        ...choice,
                                        artist,
                                        album: null,
                                        track: null,
                                        image,
                                      });

                                      field.onChange(artist);

                                      setMusicSearchResults([]);
                                      setActiveMusicSearchOption(null);
                                    }}
                                  />
                                )}
                                {pollType === "album" && (
                                  <AlbumResults
                                    results={musicSearchResults as Album[]}
                                    selectResult={(artist, album, image) => {
                                      update(index, {
                                        ...choice,
                                        artist,
                                        album,
                                        track: null,
                                        image,
                                      });

                                      field.onChange(album);

                                      setMusicSearchResults([]);
                                      setActiveMusicSearchOption(null);
                                    }}
                                  />
                                )}
                                {pollType === "track" && (
                                  <TrackResults
                                    results={musicSearchResults as Track[]}
                                    selectResult={(
                                      artist,
                                      album,
                                      track,
                                      image,
                                    ) => {
                                      update(index, {
                                        ...choice,
                                        artist,
                                        album,
                                        track,
                                        image,
                                      });

                                      field.onChange(track);

                                      setMusicSearchResults([]);
                                      setActiveMusicSearchOption(null);
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

                <FormField
                  control={form.control}
                  name={`choices.${index}.affinities`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="mt-4">
                        <div className="mb-3 flex justify-between">
                          <span className="text-muted-foreground text-sm">
                            Affinities
                          </span>
                          <span className="text-muted-foreground/50 text-xs">
                            {field.value.length}/3
                          </span>
                        </div>

                        {field.value.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {field.value.map((affinity, affinityIndex) => (
                              <button
                                key={`choice-${index}-affinity-${affinityIndex}`}
                                className="[a&]:hover:bg-accent [a&]:hover:text-accent-foreground focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-md border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-rose-300 transition-[color,box-shadow,background-color] hover:bg-rose-500/20 focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3"
                                onClick={() =>
                                  field.onChange(
                                    field.value.filter((a) => a !== affinity),
                                  )
                                }
                              >
                                {affinity}
                                <X className="ml-1 h-3 w-3" />
                              </button>
                            ))}
                          </div>
                        )}

                        {field.value.length < 3 && (
                          <div className="relative">
                            <div className="bg-foreground/10 border-muted-foreground/20 focus-within:ring-foreground/60 flex items-center rounded-md border py-1.5 pl-3 focus-within:ring-1">
                              <Search className="mr-2 h-4 w-4" />
                              <FormControl>
                                <input
                                  className="placeholder:text-muted-foreground flex-1 bg-transparent p-1 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:p-1.5"
                                  placeholder="Search affinities..."
                                  onFocus={() => {
                                    if (activeMusicSearchOption !== null)
                                      return;

                                    setActiveAffinitySearchOption(index);
                                  }}
                                  onBlur={() =>
                                    setTimeout(
                                      () => setActiveAffinitySearchOption(null),
                                      150,
                                    )
                                  }
                                  onChange={(e) =>
                                    debouncedAffinitySearch(
                                      e.target.value,
                                      index,
                                      field.value,
                                    )
                                  }
                                />
                              </FormControl>
                            </div>

                            {affinitySearchResults.length > 0 &&
                              activeAffinitySearchOption === index &&
                              activeMusicSearchOption === null && (
                                <div className="bg-popover text-popover-foreground absolute top-full z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-md border shadow-md backdrop-blur-md">
                                  {affinitySearchResults.map((affinity) => (
                                    <div
                                      key={affinity}
                                      className="border-border hover:bg-accent hover:text-accent-foreground cursor-pointer border-b p-3 text-sm last:border-b-0"
                                      onClick={() => {
                                        field.onChange([
                                          ...field.value,
                                          affinity,
                                        ]);

                                        setAffinitySearchResults([]);
                                        setActiveAffinitySearchOption(null);
                                      }}
                                    >
                                      {affinity}
                                    </div>
                                  ))}
                                </div>
                              )}
                          </div>
                        )}
                      </div>
                      <div className="min-h-[1.25rem]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            ))}

            {fields.length < 5 && (
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer bg-transparent"
                onClick={() => {
                  switch (pollType) {
                    case "artist":
                      append(createArtistChoice());
                      break;
                    case "album":
                      append(createAlbumChoice());
                      break;
                    case "track":
                      append(createTrackChoice());
                      break;
                  }
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Choice
              </Button>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="default"
            className="flex-1 cursor-pointer"
            disabled={creatingPoll}
            type="submit"
          >
            {creatingPoll ? (
              <Loader2 className="h-5 w-62 animate-spin" />
            ) : (
              "Create Poll"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreatePoll;
