import { api } from "@/lib/api"
import type {
  SuggestedBet,
  BetResult,
  GameInfo,
  PlayerInfo,
  BetResultSummary,
  SummaryParams,
  BetResultParams,
  PlayerGamelog,
  PlayerGamelogParams,
  TeamInfo,
  TeamGamelog,
  TeamGamelogParams,
  CumulativeProfit,
  GamelogParams,
  CumulativeProfitParams,
} from "./types"

// Fetches the latest game row for a single player from the backend.
export async function fetchMatchups(): Promise<GameInfo[]> {
  return api.get<GameInfo[]>("/games/today")
}

// Fetches the full gamelog for a single player from the backend.
export async function fetchPlayerGamelog(
  params: PlayerGamelogParams,
): Promise<PlayerGamelog[]> {
  const qs = new URLSearchParams()

  if (params.startDate) qs.set("start_date", params.startDate)
  if (params.endDate) qs.set("end_date", params.endDate)
  if (params.season) qs.set("season", params.season)
  if (params.playoffs) qs.set("playoffs", params.playoffs)

  return api.get<PlayerGamelog[]>(`/players/${params.playerId}/gamelogs?${qs}`)
}

// Fetches bet results for the given date range (default is all)
// Note that the endpoint supports filtering on threshold, side, bet_type, player_id, team_id, in addition to date
// Will update accordingly soon
export async function fetchBetResults(
  params: BetResultParams,
): Promise<BetResult[]> {
  const qs = new URLSearchParams()

  if (params.startDate) qs.set("start_date", params.startDate)
  if (params.endDate) qs.set("end_date", params.endDate)
  if (params.teamId) qs.set("team_id", params.teamId)
  if (params.playerId) qs.set("player_id", params.playerId)
  if (params.betType) qs.set("bet_type", params.betType)
  if (params.side) qs.set("side", params.side)
  if (params.threshold) qs.set("threshold", params.threshold)

  return api.get<BetResult[]>(`/bets/results/?${qs}`)
}

// Fetches bet result summarries based on a pivot of threshold, side, bet_type, player_id, or team_id over a given date range
// Can be further filtered by any of the above pivots
export async function fetchResultSummary(
  params: SummaryParams,
): Promise<BetResultSummary<string>[]> {
  const qs = new URLSearchParams({ group_by: params.pivot })

  if (params.startDate) qs.set("start_date", params.startDate)
  if (params.endDate) qs.set("end_date", params.endDate)
  if (params.playoffs) qs.set("playoffs", params.playoffs)
  if (params.season) qs.set("season", params.season)
  if (params.teamId) qs.set("team_id", params.teamId)
  if (params.playerId) qs.set("player_id", params.playerId)
  if (params.betType) qs.set("bet_type", params.betType)
  if (params.side) qs.set("side", params.side)
  if (params.threshold) qs.set("threshold", params.threshold)
  if (params.limit) qs.set("limit", params.limit)
  if (params.orderBy) qs.set("order_by", params.orderBy)
  if (params.bucketWidth) qs.set("bucket_width", params.bucketWidth)

  return api.get<BetResultSummary<string>[]>(`/bets/results/summary?${qs}`)
}

// Fetches suggested bets for todays games
export async function fetchSuggestedBets(): Promise<SuggestedBet[]> {
  return api.get<SuggestedBet[]>("/bets/suggested")
}

// Fetches player info for all players with a betting history
export async function fetchPlayerInfo(
  players: number[],
): Promise<PlayerInfo[]> {
  return api.post<PlayerInfo[]>("/players", players)
}

// Fetches team information for all teams in the league
export async function fetchTeamInfo(): Promise<TeamInfo[]> {
  return api.get<TeamInfo[]>("/teams/info")
}

// Fetches team gamelogs for the specified team
export async function fetchTeamGamelogs(
  params: TeamGamelogParams,
): Promise<TeamGamelog[]> {
  return api.get<TeamGamelog[]>(`/teams/${params.teamId}/gamelogs`)
}

export async function fetchCumulativeProfit(
  params: CumulativeProfitParams
): Promise<CumulativeProfit[]> {
  const qs = new URLSearchParams()

  if (params.startDate) qs.set("start_date", params.startDate)
  if (params.endDate) qs.set("end_date", params.endDate)
  if (params.playoffs) qs.set("playoffs", params.playoffs)
  if (params.season) qs.set("season", params.season)

  return api.get<CumulativeProfit[]>(`/bets/results/timeseries?${qs}`)  
}

//********************************** */
// Need to redo the following fetches:
//********************************** */

// Fetches the full gamelogs of the top 10 players
export async function fetchTopPlayers(
  filter: "regSeason" | "playoffs",
): Promise<PlayerGamelog[][]> {
  return api.get<PlayerGamelog[][]>(`/top-players?filter=${filter}`)
}
