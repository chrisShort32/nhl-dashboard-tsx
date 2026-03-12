# Phase 1 Specs

## Summary
Phase 1 is the core dashboard + betting snapshot experience, backed by live API queries. The dashboard now renders matchup context, bet-results summaries, and a top-10 suggested-bets table. Player detail is also live via `/player/:playerId`, while results/suggested detail pages are still placeholders.

## Routes (Current)
- `/` — redirects to `/dashboard`
- `/dashboard` — home page with matchup card, bet-results summaries, and suggested bets table
- `/player/:playerId` — player game-log detail page with aggregates + per-game table
- `/players` — placeholder
- `/results` — placeholder
- `/suggested` — placeholder (note: route is `/suggested`, not `/suggestions`)

## Dashboard Page Layout (Implemented)

### Matchup Context
- Single matchup card from `GET /today-matchups`
- Shows home/away, venue, start time, record summary (from `MatchupInfo`)

### Bet Results Summary
- Two pivot tables rendered via `DataTable`
- Tabs control date filter applied client-side:
  - **Yesterday** (default)
  - **Last Week**
  - **Last Month**
- Table 1: Bet results by threshold
- Table 2: Bet results by bet type
- Columns: total bets, hits, hit rate, average odds, profit

### Suggested Bets Snapshot
- Table shows top 10 rows returned by `GET /suggested-bets`
- Header uses `Top Bets Today (YYYY-MM-DD)`
- If no rows, shows "No Suggested Bets Found"
- Columns include:
  - player, position, team, opponent
  - bet type, threshold, odds, implied/model probability, edge
  - pre-game averages and rolling shot/attempt stats (L5/L10)
  - over-2/3/4 shot counts for L5/L10

## API Contracts (Current)

### Shared Types
```typescript
// Core identifiers - used everywhere, always fetch these
export type PlayerGameIdentifiers = {
  season: string
  game_id: string
  game_date: string
  player_id: string
  team_id: string
}
```

### Matchups
- **Endpoint:** `GET /today-matchups` → `MatchupInfo`
```typescript
export type TeamInfo = {
  team_abbrev: string
  team_logo: string
  team_wins: number
  team_losses: number
  team_otl: number
}

export type MatchupInfo = {
  game_id: number
  home: TeamInfo
  away: TeamInfo
  venue: string
  start_time_UTC: string
}
```

### Bet Results
- **Endpoint:** `GET /bet-results?start_date=...&end_date=...` → `BetResult[]`
```typescript
export type BetResult = PlayerGameIdentifiers & {
  player_name: string
  position: string
  team: string
  opponent: string
  is_home: boolean
  game_outcome: 'W' | 'L' | 'OTL'
  team_goals: number
  team_goals_against: number
  toi: string
  pim: number
  actual_sog: number
  shot_attempts_total: number
  bet_type: 'under' | 'single' | 'value' | 'parlay'
  threshold: number
  bet_p: number
  bet_imp: number
  bet_odds_d: number
  bet_edge: number
  hit: number
  profit: number
}
```

### Suggested Bets
- **Endpoint:** `GET /suggested-bets` → `SuggestedBet[]` (empty array if no games)
```typescript
export type SuggestedBet = PlayerGameIdentifiers & {
  bet_id: string
  player_name: string
  position: string
  team: string
  opponent: string
  is_home: boolean
  bet_type: 'under' | 'single' | 'value' | 'parlay'
  threshold: number
  bet_p: number
  bet_imp: number
  bet_odds_d: number
  bet_edge: number
  plr_pre_avg_shots: number
  plr_pre_avg_att: number
  plr_roll5_shots: number
  plr_roll5_att: number
  plr_roll10_shots: number
  plr_roll10_att: number
  plr_roll5_over2_shots: number
  plr_roll5_over3_shots: number
  plr_roll5_over4_shots: number
  plr_roll10_over2_shots: number
  plr_roll10_over3_shots: number
  plr_roll10_over4_shots: number
}
```

### Player Game Log
- **Endpoint:** `GET /player-gamelog?player_id=...` → `PlayerGameLog[]`
- Used by `/player/:playerId` for per-game rows + aggregate snapshot

## Deferred / Not Yet Implemented
- `/players` list UI (currently placeholder)
- `/results` and `/suggested` detail pages (currently placeholder)
- Team routes and team detail pages (components exist but are not wired)
- Historical suggested bets with rolling stats recalculation
- Custom deep-dive analysis endpoints
