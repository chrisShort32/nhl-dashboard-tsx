# NHL Dashboard: Current Project State

## What this project currently does
- Runs a React + TypeScript + Vite single-page app with Tailwind CSS and React Router.
- Uses TanStack Query for server-state fetching and caching.
- Shows a sidebar layout (`Dashboard`, `Players`) through `AppShell`.
- Supports a player detail route (`/player/:playerId`) that fetches and renders game-log stats.

## Current routes
- `/` redirects to `/dashboard`.
- `/dashboard` shows:
  - app title/subtitle
  - a single hardcoded `PlayerCard` test entry (Connor McDavid)
- `/player/:playerId` shows:
  - loading/error/empty states
  - player card (name, headshot, number, position, team)
  - a computed stat snapshot (goals/assists/points/shots/shot attempts totals + per-game rates)
  - tabs for `Last 5`, `Last 10`, and `Season` filtering
  - a stat table for each game in the selected horizon
- `/players` currently displays a placeholder text only.

## Data flow (current)
- API base URL comes from `VITE_API_BASE_URL`.
- All network calls use a shared `ApiClient` (`src/lib/apiClient.ts`) with normalized error handling.
- Query hooks in `src/features/queries.ts`:
  - `useGamelog(playerId)` is actively used by `PlayerPage`.
  - `usePredictionsToday()` and `useGameLatest()` exist but are not currently rendered by active pages.

## Backend endpoints currently referenced
- `/player-gamelog?player_id=<id>` (actively used)
- `/last-game?player_id=8471215` (defined but not used in UI)
- `/predictions-latest` is currently bypassed; `fetchPredictionsToday` returns local mock data.

## Implemented UI building blocks
- `PlayerCard` with fallback headshot image and team-name mapping.
- `PlayerSnapshot` that computes aggregate + per-game stats from game logs.
- `StatTable` generic table component for per-game rows.
- `Tabs` reusable tab switcher.
- `TeamCard` component exists, but no team route/page currently uses it.

## Important current limitations
- Dashboard content is still mostly static test content.
- No real Players list page yet (`/players` is placeholder).
- No team route/page wired even though team components exist.
- `TeamSnapshot.tsx` exists as an empty file.
- Some default Vite starter styling remains in `src/index.css`.

## In short
This is a working player-focused prototype: routing, data-fetching infrastructure, and the player game-log page are functional. The dashboard and broader navigation areas are scaffolded but not yet fully implemented.
