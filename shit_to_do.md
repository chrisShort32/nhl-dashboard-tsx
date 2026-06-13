# Shit to do

> Updated Sun Jun 7, 2026. ⚠️ = known blocker — causes undefined data on the frontend until fixed.

## ✅ Done this session
- [x] Team gamelogs endpoint — schema / service / router (built + reviewed)
- [x] `types.ts` overhaul — clarity renames, camelCase (FE) ↔ snake_case (BE) via `to_camel`, ORM → schema → wire boundary sorted
- [x] Bet types — shared `BetMetrics`, flattened into `BetResult` / `SuggestedBet` via intersection
- [x] `package.json` — removed junk deps (`-`, `rechart`, `@types/react-router-dom`)
- [x] Tooling — Prettier + `eslint-config-prettier`, `.prettierrc.json`, format/lint scripts, eslint flat-config wired

## 🔜 Outstanding from this session (start here)

**Backend**
- [ ] ⚠️ Rename metric fields in `SuggestedBetRead` (+ bet-result schema) to match the TS: `bet_p`→`bet_probability`, `bet_imp`→`bet_implied_probability`, `bet_odds_d`→`bet_odds_decimal`, `bet_odds`→`bet_odds_american`. Until done, `BetMetrics` fields are `undefined` on the FE. (Watch the ORM column names — rename columns too, or bridge with a validation alias.)
- [ ] Fix `get_suggested_bets` return type → `Sequence[Bet]`; grep other services for the same lying return type
- [ ] `PlayerBase` doesn't send `teamName`/`teamAbbreviation`, but TS `PlayerInfo` marks them required → add to the schema OR make them optional in TS; audit all read schemas against their TS counterparts
- [ ] Team gamelogs endpoint cleanup: drop the unused `.join(TeamGamelog.team)`; consider `/teams/{team_id}/gamelogs` (path param); decide 404 vs `[]` for an unknown team; `contains_eager(game)` to reuse the filter join

**Frontend**
- [ ] Apply DataTable updates: `Column<T>` + `accessor` + `renderCell` helper (renders nested rows); column-fit via `whitespace-nowrap` + `overflow-x-auto` wrapper + `min-w-full`
- [ ] Wire team gamelogs end-to-end: fetch on Team Page (react-query) → render through accessor columns

**Verify / hygiene**
- [ ] `npm run format` (commit on its own), `npm run lint`, `npm run build` (`tsc -b`) — confirm the type work compiles clean
- [ ] Add `.vscode/settings.json` (format-on-save)
- [ ] Commit today's work as logical units (deps / types / table / tooling separately, not one blob)

## Cleanup / Tech Debt
- [ ] Make return-type annotations honest across ALL services + routers (`Sequence[<ORM>]`, not schema types); keep `response_model` as the Pydantic schema; run the type checker after _(team service done; suggested-bets pending)_

---

## Feature backlog

**Teams Home Page**
- [x] Team gamelogs endpoint
- [ ] Search functionality?
- [ ] Tabs/dropdowns controlling game/date ranges on cards + which team cards show
- [ ] Make team card match player card — need snapshots

**Team Page**
- [x] Team gamelogs endpoint
- [ ] ?? Decide what I actually want here
- [ ] Team snapshots — needs endpoint??
- [ ] Make team card match player card — need snapshots
- [ ] Top players for the team — by profit and/or statistically

**Players Home Page**
- [ ] Search functionality
- [ ] Tabs/dropdowns controlling game/date ranges + which player cards show
- [ ] Add snapshots to player cards

**Player Page**
- [ ] Fix table so it doesn't squish cols _(solution determined: nowrap + overflow-x-auto + min-w-full — ships with the DataTable update above)_
- [ ] Tabs/dropdowns for date ranges, playoffs, etc.
- [ ] Gamelogs: more cols? advanced-stats toggle? totals row at bottom
- [ ] Bet results: more cols (which?), totals row at bottom

**Suggested Bets Page**
- [ ] Anything else needed here?
- [ ] Ability to see avoids?
- [ ] Tabs/dropdowns to filter

**Results Page**
- [ ] Customizable results (date range, playoffs, thresholds): profit charts, edge analysis, bet-p analysis

**Dashboard Page (home)**
- [ ] Better way to display matchups (currently tied to start time + game date — sketchy)
- [ ] What to show — bet results summary (obvious), profit chart?
- [ ] Search bar?
