"use client";

import { oneDayMs, oneMonthMs, oneWeekMs } from "@/lib/constants/time";
import { createPollSchema } from "@/lib/zod/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Platform } from "@/config";
import { PollType } from "@/lib/zod/pollster";
import { Clock, Disc, Music, Music2, Plus, Trash2, User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
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

const createEmptyChoice = () => ({
  image: "",
  pollsterUrl: "",
  affinities: [] as string[],
});

function CreatePoll() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchSource, setSearchSource] = useState<Platform>("spotify");

  const form = useForm<z.infer<typeof createPollSchema>>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      duration: oneWeekMs,
      pollType: "artist",
      choices: [createEmptyChoice(), createEmptyChoice()],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "choices",
  });

  const pollType = form.watch("pollType");

  const handlePollTypeChange = (val: string) => {
    form.setValue("pollType", val as z.infer<typeof PollType>);

    // setPollOptions(pollOptions.map((option) => ({ ...option, title: "", image: "", searchQuery: "" })))
    // setSearchResults([])
    // setActiveSearchOption(null)
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
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                  Search via:
                </span>
                <Tabs defaultValue="spotify" onValueChange={setSearchSource}>
                  <TabsList className="border">
                    <TabsTrigger value="spotify">Spotify</TabsTrigger>
                    <TabsTrigger value="lastfm">Last.fm</TabsTrigger>
                    <TabsIndicator />
                  </TabsList>
                </Tabs>
              </div>
              <Tabs value={pollType} onValueChange={handlePollTypeChange}>
                <TabsList className="border border-white/10 bg-white/5">
                  <TabsTrigger value="artist">
                    <User className="mr-0 h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Artists</span>
                  </TabsTrigger>
                  <TabsTrigger value="album">
                    <Disc className="mr-0 h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Albums</span>
                  </TabsTrigger>
                  <TabsTrigger value="track">
                    <Music2 className="mr-0 h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Tracks</span>
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
                className="rounded-lg border border-white/10 bg-white/5 p-4 sm:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium text-gray-300">
                    Option {index + 1}
                  </h3>
                  {fields.length > 2 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-gray-400 hover:bg-white/10 hover:text-white"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="relative">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                    <div className="mx-auto h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-white/5 sm:mx-0 sm:h-12 sm:w-12">
                      {field.image ? (
                        <Image
                          src={field.image}
                          alt={field.pollsterUrl}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Music className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    {/* <div className="flex-1 min-w-0">
                            <Input
                              placeholder={`Search ${searchSource} for ${pollType === "track" ? "a" : "an"} ${pollType}...`}
                              value={option.title || option.searchQuery}
                              onChange={(e) => {
                                if (option.title) {
                                  // If there's already a selected title, allow editing it
                                  setPollOptions(
                                    pollOptions.map((o) => (o.id === option.id ? { ...o, title: e.target.value } : o)),
                                  )
                                } else {
                                  // If no title selected, this is a search
                                  handleSearch(e.target.value, option.id)
                                }
                              }}
                              onFocus={() => {
                                if (!option.title) {
                                  setActiveSearchOption(option.id)
                                }
                              }}
                              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-rose-400"
                            />
                            {option.title && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-6 text-xs text-gray-400 hover:text-white p-1"
                                onClick={() => {
                                  setPollOptions(
                                    pollOptions.map((o) =>
                                      o.id === option.id ? { ...o, title: "", image: "", searchQuery: "" } : o,
                                    ),
                                  )
                                  clearSearch()
                                }}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Clear selection
                              </Button>
                            )}
                          </div> */}
                  </div>
                  {/* 
                        {searchResults.length > 0 && activeSearchOption === option.id && (
                          <div className="absolute z-10 w-full bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                            {searchResults.map((result) => (
                              <div
                                key={result.id}
                                className="p-3 hover:bg-white/10 cursor-pointer flex items-center gap-3 border-b border-white/10 last:border-b-0"
                                onClick={() => selectSearchResult(result, option.id)}
                              >
                                <div className="h-10 w-10 bg-white/5 rounded-md overflow-hidden flex-shrink-0">
                                  <Image
                                    src={result.image || "/placeholder.svg"}
                                    alt={result.title}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-white text-sm truncate">{result.title}</p>
                                  <p className="text-xs text-gray-400 truncate">
                                    {pollType === "track" && `${result.artist} • ${result.album}`}
                                    {pollType === "album" && result.artist}
                                    {pollType === "artist" && (result.followers || result.playcount)}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                  <Badge
                                    variant="outline"
                                    className="bg-rose-500/10 text-rose-300 border-rose-500/30 text-xs"
                                  >
                                    {result.source}
                                  </Badge>
                                  {result.playcount && (
                                    <span className="text-xs text-gray-500">{result.playcount}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )} */}

                  {/* Option-specific affinities */}
                  <div className="mt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-gray-300">
                        Affinities for this option
                      </span>
                      <span className="text-xs text-gray-500">
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
                Add Option
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
