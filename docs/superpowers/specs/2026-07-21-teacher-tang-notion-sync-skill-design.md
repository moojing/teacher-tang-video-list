# Teacher Tang Notion Sync Skill Design

## Goal

Create a project-local skill that standardizes the workflow for checking the latest Teacher Tang video list and syncing differences into Notion.

## Scope

- Repository-local skill only.
- Source of truth for the current list: `src/data/videos.json`.
- Notion target:
  - Database title: `唐綺陽 Live 影片資料庫`
  - Database ID: `50436c25-8185-4716-b9b0-6dc6a02ffc4f`
  - Data source ID: `6d89c71a-0978-4181-a936-a532c253b203`
- Chrome session is required for any workflow that depends on the user's logged-in YouTube context.

## Baseline Failure To Prevent

Without a dedicated skill, an agent can:

- compare local data and Notion data without first checking whether the Chrome / YouTube session is still valid
- continue a sync flow after the browser session has expired
- risk writing partial or stale updates into Notion even though the user needs to re-authenticate first

The skill must block that behavior.

## Required Workflow

1. Confirm the task is the Teacher Tang list sync workflow for this repository.
2. Check Chrome session state before any Notion update:
   - reuse an existing YouTube tab when available
   - otherwise open the Teacher Tang YouTube channel page in Chrome
   - verify the page still shows a signed-in state
3. If the Chrome / YouTube session is not signed in:
   - stop immediately
   - do not compare for write purposes
   - do not create or update anything in Notion
   - tell the user to sign in in Chrome and retry
4. If session is valid:
   - read `src/data/videos.json`
   - inspect the target Notion database schema before writing
   - compare recent items first
   - if recent items match and the user did not request full reconciliation, stop there
5. Only write to Notion when a concrete difference is found:
   - create missing pages
   - update mismatched title, date, URL, or tags
6. If there is no difference, report that no update was needed.

## Sync Rules

- Prefer exact title and YouTube URL matching when checking existing Notion pages.
- Treat these fields as canonical:
  - `影片名稱`
  - `直播日期`
  - `YouTube 連結`
  - `Tags`
- Map local `topics` plus local `status` into Notion `Tags`.
- Never perform bulk destructive replacement.
- Never update Notion if browser auth is missing.

## Output Expectations

- Clear statement whether session is valid.
- Clear statement whether differences were found.
- Clear statement whether Notion was updated.
- If blocked by auth, explicitly instruct the user to sign in in Chrome and retry.
