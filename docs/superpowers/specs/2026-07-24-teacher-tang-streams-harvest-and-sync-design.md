# Teacher Tang Streams Harvest And Sync Skill Design

## Goal

Expand the existing repository-local Teacher Tang sync skill so it first harvests completed stream videos from YouTube, merges new links into the local dataset, and only then syncs concrete differences into Notion.

## Scope

- Repository-local skill only.
- YouTube source page: `https://www.youtube.com/@jessetang1113/streams`
- Local dataset: `src/data/videos.json`
- Notion target:
  - Database title: `唐綺陽 Live 影片資料庫`
  - Database ID: `50436c25-8185-4716-b9b0-6dc6a02ffc4f`
  - Data source ID: `6d89c71a-0978-4181-a936-a532c253b203`
- Chrome session remains required because the workflow depends on the user's logged-in YouTube state.

## Approved Behavior

- The skill uses the YouTube `streams` page, not the channel home page, as the harvest source.
- It scrolls until the full page has been harvested, not just the initially visible rows.
- It only includes completed stream replays.
- It does not include live-now or scheduled-upcoming stream entries.
- It updates `src/data/videos.json` before any Notion sync work.
- Local updates are conservative:
  - add missing entries
  - fill missing fields on existing entries
  - never delete local entries as part of routine sync
  - never overwrite existing curated fields when the local value is already non-empty
- Minimum inclusion rule: if a completed stream has a usable YouTube link, list it.

## Local Merge Rules

- Use normalized YouTube watch URL as the primary key.
- Derive local `id` from the video ID as `yt-<videoId>`.
- Prefer visible title from YouTube.
- If title is unavailable but URL exists, still create a record with a placeholder title derived from the video ID.
- If date cannot be determined from the stream card or linked metadata, store `null`.
- If topics cannot be determined, store `["其他"]`.
- If membership status cannot be determined:
  - infer from visible title prefixes such as `【全會員】`, `【小聚落】`, `【會員專屬】`
  - otherwise default to `一般公開`

## Sync Flow

1. Verify Chrome / YouTube session before any write.
2. Open `https://www.youtube.com/@jessetang1113/streams`.
3. Scroll until no additional completed stream links appear.
4. Extract completed stream entries and exclude live / upcoming entries.
5. Merge harvested entries into `src/data/videos.json`.
6. Inspect Notion schema.
7. Compare local dataset against Notion.
8. Create or update only concrete differences in Notion.

## Failure Cases To Prevent

- Syncing Notion without first harvesting the current `streams` page.
- Treating the first visible screen as the full stream history.
- Importing live-now or upcoming entries into the local dataset.
- Replacing curated local metadata with sparse harvested values.
- Skipping entries only because date, topics, or status could not be fully derived.

## Output Expectations

- State whether the Chrome / YouTube session was valid.
- State how many completed stream entries were harvested.
- State whether new local entries were added or existing local entries were enriched.
- State whether Notion differences were found and written.
- If blocked by auth, tell the user to sign in in Chrome and retry.
