# NHL Analytics Dashboard

The React/TypeScript frontend for an NHL player shot-on-goal (SOG) prop betting analytics platform. This app consumes a separate [Flask API](#related-repositories) that serves model predictions and bet results, and presents them through interactive dashboards — today's suggested bets, historical bet results, player/team breakdowns, and model calibration analysis.

---

## Tech Stack

React · TypeScript · Vite · Tailwind CSS · TanStack Query · Recharts · React Router

---

## Features

### Today's Slate
Displays the current day's NHL matchups with team records, logos, venue, and game time. Each matchup links to a detailed team page.

### Suggested Bets
Surfaces model-generated SOG prop picks for the day's slate, including predicted probability, implied odds, decimal odds, edge, and rolling player averages at multiple horizons (5-game, 10-game, season).

### Bet Results
Fetches the last 30 days of bet outcomes on load and filters entirely client-side. Includes:

- **Tab-based quick filters** — Yesterday, Last Week, Last Month, All Time
- **Dropdown filters** — Date range, bet type (over/single/value/parlay/under), and SOG threshold (2/3/4/5)
- **Summary tables** — Aggregated by bet type, threshold, player, or team with hit rate, average odds, and profit
- **Cumulative profit chart** — Daily P&L over the filtered window

### Calibration Analysis
Bucket-based calibration views comparing predicted probability (or edge) against actual hit rate and profit. Supports configurable bucket widths and max-bucket capping. The diagonal reference line on the probability vs. hit-rate chart shows perfect calibration at a glance.

### Player Pages
Linked from any player reference in the app. Displays a player card (headshot, number, position, team logo) alongside a stat snapshot (goals, assists, points, SOG, shot attempts — totals and per-game) computed from the player's game log.

### Team Pages
Linked from matchup cards and team references. Shows team record and logo with a roster-level view.

---

## Architecture

```
┌─────────────────────────────────────┐
│         React Frontend (this repo)  │
│  Vite · TypeScript · Tailwind CSS   │
│  TanStack Query · React Router      │
│                                     │
│  Client-side filtering, aggregation,│
│  and calibration analysis           │
└──────────────┬──────────────────────┘
               │ HTTP / REST
┌──────────────▼──────────────────────┐
│     Flask API  (separate repo)      │
│  Serves parquet data, slate info,   │
│  and ML-generated bet suggestions   │
├─────────────────────────────────────┤
│     ML Pipeline  (separate repo)    │
│  LightGBM · scikit-learn            │
│  Isotonic calibration · Feature eng │
└─────────────────────────────────────┘
```

### Key Design Decisions

- **Client-side filtering:** Bet results are fetched once (30-day window) and filtered in the browser via pure utility functions, keeping API calls minimal and avoiding redundant network requests.
- **`maxDate`-anchored date logic:** All date-relative filters anchor to the most recent `game_date` in the dataset rather than the system clock, ensuring consistent behavior regardless of when the data was last refreshed.
- **Generic `DataTable<T>`:** A single reusable table component that accepts typed column definitions with optional formatters, row-level class names, and optional header links.
- **`summarizeBetResults` pivot utility:** A generic grouping function that accepts either a key name or a custom key-extraction function, supports an optional totals row, and can carry additional fields from the first row of each group.
- **Feature-based folder structure:** Components, utils, and types are co-located by domain (`slate/`, `player/`, `results/`, `analysis/`) rather than by file type, keeping related code together as the app grows.

---

## Project Structure

```
├── src/
│   ├── features/
│   │   ├── types.ts                # Shared TypeScript types
│   │   ├── teamNames.ts            # Team abbreviation → full name mapping
│   │   ├── slate/
│   │   │   └── components/
│   │   │       ├── SlateCard.tsx        # Today's matchup grid
│   │   │       └── MatchupCard.tsx      # Individual matchup display
│   │   ├── team/
│   │   │   └── components/
│   │   │       └── TeamCard.tsx         # Team logo, name, record
│   │   ├── player/
│   │   │   └── components/
│   │   │       ├── PlayerCard.tsx       # Player identity card
│   │   │       └── PlayerSnapshot.tsx   # Stat summary widget
│   │   ├── stats/
│   │   │   └── utils.ts                # calculatePlayerStats()
│   │   ├── results/
│   │   │   └── utils.ts                # Filter, summarize, calibration, cumulative profit
│   │   └── analysis/
│   │       └── components/
│   │           └── AnalysisChart.tsx    # Recharts calibration charts
│   ├── components/
│   │   ├── DataTable.tsx            # Generic typed table
│   │   └── Tabs.tsx                 # Tab navigation
│   └── assets/
│       └── default-skater.png       # Fallback headshot
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- The Flask API running locally or on a remote host (see [Related Repositories](#related-repositories))

### Install & Run
```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` by default. Make sure the Flask API is running so the frontend can fetch data.

---

## How the Backend Works

This frontend consumes a Flask API that serves data produced by a LightGBM ML pipeline. The pipeline predicts the probability a player records ≥ N shots on goal (N = 2, 3, 4, 5) for each game, using rolling player averages, team shot metrics, opponent defensive stats, and power-play usage as features. Calibrated probabilities are compared against implied odds to surface positive-edge bets. The backtest shows ~57% hit rate and positive ROI on the `p_ge2` and `p_ge3` markets.

For full details, see the backend and ML pipeline repos.

---

## Related Repositories

| Repo | Description |
|------|-------------|
| **NHL API / Backend** | Flask API serving parquet data, slate info, and ML-generated suggestions |
| **NHL ML Pipeline** | LightGBM training, feature engineering, isotonic calibration, and slate injection |

> Replace the repo names above with links once they're public.

---

## Status

**Phase 1** — Complete. Working frontend with slate view, bet results with tab/filter system, player and team pages, and calibration charts.

**Phase 2** — In progress. Building out the Results page with dropdown filter shell (`FilterState`), ROI summary tables, player performance breakdowns, and a dedicated calibration view.

---

## License

This project is for portfolio and educational purposes.
