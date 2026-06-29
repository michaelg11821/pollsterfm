# Listening History Import Architecture

## Goals

- Ship Spotify import end-to-end with reliable status reporting.
- Keep provider integration extensible for Apple Music and future imports.
- Avoid replacing current live Spotify/Last.fm playback reads; this import pipeline supplements long-term history.

## Non-goals (Phase 1)

- Apple Music parser implementation.
- Advanced deduplication across providers with fuzzy matching.
- User-visible import history analytics beyond status and track count.

## Data Model

### `listeningHistoryImportJobs`

Stores lifecycle metadata for each import request.

- `userId`: `Id<"users">`
- `provider`: `"spotify" | "appleMusic"`
- `status`: `"queued" | "processing" | "succeeded" | "failed"`
- `sourceFileId`: `Id<"_storage">`
- `totalRows`: `number` (optional until parsed)
- `processedRows`: `number`
- `insertedRows`: `number`
- `duplicateRows`: `number`
- `error`: `string` (optional)
- `startedAt`: `number`
- `completedAt`: `number` (optional)

Indexes:

- `by_userId_and_creationTime`: `["userId", "_creationTime"]`
- `by_userId_and_status`: `["userId", "status"]`

### `importedListeningHistory`

Normalized listening events used to remove the 50-track cap and support history views.

- `userId`: `Id<"users">`
- `provider`: `"spotify" | "appleMusic"`
- `providerTrackId`: `string | null`
- `trackName`: `string`
- `artistName`: `string`
- `albumName`: `string | null`
- `playedAt`: `number`
- `durationMs`: `number | null`
- `importJobId`: `Id<"listeningHistoryImportJobs">`

Indexes:

- `by_userId_and_playedAt`: `["userId", "playedAt"]`
- `by_userId_and_provider_and_playedAt`: `["userId", "provider", "playedAt"]`
- `by_userId_and_providerTrackId_and_playedAt`: `["userId", "providerTrackId", "playedAt"]`

## Provider Adapter Contract

Each provider parser returns canonical events and metadata.

```ts
type ImportProvider = "spotify" | "appleMusic";

type NormalizedListenEvent = {
  providerTrackId: string | null;
  trackName: string;
  artistName: string;
  albumName: string | null;
  playedAt: number;
  durationMs: number | null;
};

type ParseResult = {
  rows: NormalizedListenEvent[];
  totalRows: number;
};
```

Adapter entrypoint shape:

```ts
parse(provider: ImportProvider, fileText: string): ParseResult
```

## Pipeline

1. User uploads import file (currently Spotify extended streaming history JSON).
2. Backend creates `queued` job row and schedules processing action.
3. Processing action:
   - transitions status to `processing`,
   - reads uploaded file from Convex storage,
   - parses through provider adapter,
   - normalizes to canonical events,
   - inserts events in chunks with dedupe guard,
   - updates progress counters.
4. On success, marks job `succeeded` with `completedAt`.
5. On failure, marks job `failed` with error summary.

## Deduplication and Idempotency

- Unique-event approximation key: `(userId, provider, providerTrackId, playedAt)` when `providerTrackId` exists.
- Fallback key when `providerTrackId` missing: `(userId, provider, trackName, artistName, playedAt)`.
- Processing action must be retry-safe:
  - only process jobs in `queued`/`processing`,
  - insert in small batches and persist counters after each batch.

## Status Model for UI

Current status query should return:

```ts
type ListeningImportStatus =
  | { status: "not_imported" }
  | { status: "queued" | "processing"; progress: number; jobId: string }
  | { status: "imported"; importedAt: number; latestJobId: string }
  | { status: "failed"; error: string; latestJobId: string };
```

`spotifyHistoryImported(username)` should read this model and return `true` only for `imported`.

## API Surface (Phase 1)

- `mutation importHistory.createJob(provider, sourceFileId)`
- `action importHistory.processJob(jobId)`
- `query importHistory.getCurrentStatus()`
- `query importHistory.getLatestJob()`

## Rollout

1. Ship schema and status query.
2. Replace `spotifyHistoryImported` temporary stub with real status-backed check.
3. Enable upload CTA only after `createJob` + `processJob` path is live.
4. Add background retry behavior and admin observability.
