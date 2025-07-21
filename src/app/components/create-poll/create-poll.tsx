"use client";

import { oneDayMs, oneMonthMs, oneWeekMs } from "@/lib/constants/time";
import { api } from "@/lib/convex/_generated/api";
import { toastManager } from "@/lib/toast";
import type { Album } from "@/lib/types/lastfm";
import type { Artist, Track } from "@/lib/types/spotify";
import { createPollSchema } from "@/lib/zod/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "convex/react";
import {
  Clock,
  Disc,
  Music2,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
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

const createEmptyChoice = () => ({
  image: "",
  artist: "",
  album: null,
  track: null,
  affinities: [] as string[],
});

function CreatePoll() {
  const [searchResults, setSearchResults] = useState<
    Artist[] | Album[] | Track[]
  >([]);
  const [activeSearchOption, setActiveSearchOption] = useState<number | null>(
    null,
  );

  const form = useForm<z.infer<typeof createPollSchema>>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      duration: oneWeekMs,
      pollType: "artist",
      choices: [createEmptyChoice(), createEmptyChoice()],
    },
  });

  const { fields, append, remove, update, replace } = useFieldArray({
    control: form.control,
    name: "choices",
  });

  const artistSearch = useAction(api.pollster.artist.search);
  const albumSearch = useAction(api.pollster.album.search);
  const trackSearch = useAction(api.pollster.track.search);

  const pollType = form.watch("pollType");

  const handlePollTypeChange = (val: string) => {
    form.setValue("pollType", val);

    replace(fields.map(() => createEmptyChoice()));

    setSearchResults([]);
    setActiveSearchOption(null);
  };

  const debouncedMusicSearch = useCallback(
    (query: string, optionIndex: number) => {
      const timeoutId = setTimeout(async () => {
        if (query.length > 2) {
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

          setSearchResults(results);
          setActiveSearchOption(optionIndex);
        } else {
          setSearchResults([]);
          setActiveSearchOption(null);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [albumSearch, artistSearch, pollType, trackSearch],
  );

  const clearSearch = () => {
    setSearchResults([]);
    setActiveSearchOption(null);
  };

  const createChoiceInputValue = (
    artist: string,
    album: string | null,
    track: string | null,
  ) => {
    if (artist === "") return undefined;

    let value = "";

    if (track || album) {
      value += `${track || album} - `;
    }

    value += artist;

    return value;
  };

  function onSubmit(values: z.infer<typeof createPollSchema>) {
    console.log(values);
  }

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
              <Badge
                variant="outline"
                className="border-rose-500/30 bg-rose-500/10 text-rose-300"
              >
                {fields.length}/5 options
              </Badge>
            </div>
          </div>
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-muted rounded-lg border p-4 sm:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Choice {index + 1}</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`hover:text-accent-foreground hover:bg-foreground/10 h-8 w-8 cursor-pointer ${fields.length <= 2 ? "invisible" : ""}`}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                    <div className="mx-auto h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white/5 sm:mx-0 sm:h-12 sm:w-12">
                      {field.image ? (
                        <Image
                          src={field.image}
                          alt=""
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
                    <div className="bg-foreground/10 hover:border-muted-foreground/40 border-muted-foreground/20 focus-within:ring-foreground/60 flex flex-1 items-center rounded-md border-1 py-1.5 pl-3 transition-[border-color] focus-within:ring-1 sm:py-0">
                      <Search className="mr-2 h-4 w-4" />
                      <input
                        type="text"
                        value={createChoiceInputValue(
                          field.artist,
                          field.album,
                          field.track,
                        )}
                        placeholder={`Search for ${pollType === "track" ? "a" : "an"} ${pollType}...`}
                        className="placeholder:text-muted-foreground flex-1 border-none bg-transparent text-sm outline-none"
                        onChange={(e) => {
                          if (field.artist !== "") return;

                          debouncedMusicSearch(e.target.value, index);
                        }}
                        onFocus={() => {
                          if (field.artist !== "") return;

                          setActiveSearchOption(index);
                        }}
                        onBlur={() => {
                          if (searchResults.length > 0) return;

                          setActiveSearchOption(null);
                        }}
                        name={`option-${index}-query`}
                      />
                      {field.artist && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="focus-visible:ring-foreground/60 h-6 w-6 cursor-pointer hover:bg-transparent"
                          onClick={() => {
                            update(index, {
                              ...field,
                              artist: "",
                              album: null,
                              track: null,
                              image: "",
                            });

                            clearSearch();
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {searchResults.length > 0 && activeSearchOption === index && (
                    <div className="bg-popover text-popover-foreground absolute z-10 -mt-2 max-h-60 w-full overflow-y-auto rounded-md border shadow-md backdrop-blur-md">
                      {pollType === "artist" ? (
                        <ArtistResults
                          results={searchResults as Artist[]}
                          selectResult={(artist: string, image: string) => {
                            update(index, {
                              artist,
                              album: null,
                              track: null,
                              image,
                              affinities: [] as string[],
                            });

                            clearSearch();
                          }}
                        />
                      ) : pollType === "album" ? (
                        <AlbumResults
                          results={searchResults as Album[]}
                          selectResult={(
                            artist: string,
                            album: string,
                            image: string,
                          ) => {
                            update(index, {
                              artist,
                              album,
                              track: null,
                              image,
                              affinities: [] as string[],
                            });

                            clearSearch();
                          }}
                        />
                      ) : (
                        <TrackResults
                          results={searchResults as Track[]}
                          selectResult={(
                            artist: string,
                            album: string,
                            track: string,
                            image: string,
                          ) => {
                            update(index, {
                              artist,
                              album,
                              track,
                              image,
                              affinities: [] as string[],
                            });

                            clearSearch();
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Option-specific affinities */}
                  <div className="mt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Affinities for this option
                      </span>
                      <span className="text-muted-foreground/50 text-xs">
                        {field.affinities.length}/3
                      </span>
                    </div>

                    {/* {option.affinities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {option.affinities.map((affinity, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="bg-rose-500/10 text-rose-300 border-rose-500/30 text-xs"
                                >
                                  {affinity}
                                  <button
                                    className="ml-1 text-rose-300/70 hover:text-rose-300"
                                    onClick={() => removeAffinityFromOption(option.id, affinity)}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}

                          {option.affinities.length < 3 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                              {availableAffinities
                                .filter((affinity) => !option.affinities.includes(affinity))
                                .slice(0, 8)
                                .map((affinity) => (
                                  <button
                                    key={affinity}
                                    onClick={() => addAffinityToOption(option.id, affinity)}
                                    className="px-2 py-1 rounded text-xs bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 border border-white/10 text-center truncate"
                                  >
                                    + {affinity}
                                  </button>
                                ))}
                            </div>
                          )} */}
                  </div>
                </div>
              </div>
            ))}

            {fields.length < 5 && (
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer bg-transparent"
                onClick={() => append(createEmptyChoice())}
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
            type="submit"
          >
            Create Poll
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CreatePoll;
