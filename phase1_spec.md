# Phase 1 Specs

## Summary
Phase 1 builds the core dashboard experience for the NHL analytics app. It gives the user a daily command center that surfaces recent bet results (with summary analytics) and today's model-suggested bets, replacing the current workflow of manually filtering CSVs in Numbers/Excel. The dashboard home page provides at-a-glance summaries, with dedicated detail pages for deeper exploration of results and suggestions.

## Routes
- `/dashboard` — the 'home' page where the at-a-glance summaries live **(Phase 1a)**
- `/results` — in-depth and more customizable betting and prediction results **(Phase 1b)**
- `/suggestions` — in-depth and more customizable suggested bets for today's games **(Phase 1c)**

## Dashboard Page Layout

### Top Section: Bet Results Summary
- Contains 2 pivot tables summarizing betting results
- The dashboard hits the results API endpoint and stores the last 30 days of data by default
- Tabs control the date range of data displayed:
    - **Yesterday** (default)
    - **Last Week**
    - **Last Month**
- Pivot table 1:
    - Rows: bet type (under, single, value, parlay)
    - Columns: number of bets, hit %, profit
- Pivot table 2:
    - Rows: threshold / betting line (2, 3, 4, 5)
    - Columns: number of bets, hit %, profit
- Link/button at the bottom navigating to `/results` detail page

### Bottom Section: Today's Suggested Bets Snapshot
- Table showing the top 10 suggested bets by highest bet edge
- If no games are scheduled today, display "No games scheduled" message
- Table header: "Today's Suggested Bets — <date>"
- Table columns: player name, team, opponent, threshold, bet odds, bet probability, bet implied probability, bet edge, shots per game, shots per game last 5, line hit last 5
- Link/button at the bottom navigating to `/suggestions` detail page

## API Contracts

### Shared Types
```typescript
// Core identifiers — used across all feature types
export type PlayerGameIdentifiers = {
    season: string
    game_id: string
    game_date: string
    player_id: string
    team_id: string
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
    ishome: boolean
    game_outcome: 'W' | 'L' | 'OTL'
    team_score: number
    opponent_score: number
    toi: number               // seconds
    pim: number
    actual_sog: number
    shot_attempts: number
    bet_type: 'under' | 'single' | 'value' | 'parlay'
    threshold: number          // +/- 0.5 for over/under
    bet_probability: number
    bet_implied_odds: number
    bet_odds: number
    bet_edge: number
    bet_outcome: number
    bet_profit: number
}
```

### Suggestions
- **Endpoint:** `GET /suggested-bets` → `SuggestedBet[]` (empty array if no games)

```typescript
export type SuggestedBet = PlayerGameIdentifiers & {
    player_name: string
    position: string
    team: string
    opponent: string
    ishome: boolean
    bet_type: 'under' | 'single' | 'value' | 'parlay'
    threshold: number          // +/- 0.5 for over/under
    bet_probability: number
    bet_implied_odds: number
    bet_odds: number
    bet_edge: number
    shots_per_game: number
    shot_attempts_per_game: number
    spg_last5: number
    sapg_last5: number
    spg_last10: number
    sapg_last10: number
    line_hit_last5: number
    line_hit_last10: number
}
```

## Deferred
- `/players` — player list and player detail pages (Phase 2)
- Team routes and team detail pages
- Historical suggested bets with rolling stats recalculation
- Custom deep-dive analysis endpoints
