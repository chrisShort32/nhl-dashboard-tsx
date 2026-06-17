import { useQuery } from "@tanstack/react-query"
import type {
  SummaryParams,
  BetResultParams,
  PlayerGamelogParams,
  TeamGamelogParams,
  CumulativeProfitParams,
} from "@/features/types"
import {
  fetchBetResults,
  fetchSuggestedBets,
  fetchMatchups,
  fetchPlayerGamelog,
  fetchTopPlayers,
  fetchPlayerInfo,
  fetchResultSummary,
  fetchTeamInfo,
  fetchTeamGamelogs,
  fetchCumulativeProfit,
} from "./api"

// Query hook for the bet results for the last X games (default to 7)
export function useBetResults(params: BetResultParams) {
  return useQuery({
    queryKey: ["results", params],
    queryFn: () => fetchBetResults(params),
  })
}

// Query hook for bet summarries
export function useBetSummary(params: SummaryParams) {
  return useQuery({
    queryKey: ["summary", params],
    queryFn: () => fetchResultSummary(params),
  })
}

// Query hook for today's suggested bet rows.
export function useSuggestedBets() {
  return useQuery({
    queryKey: ["suggested", "today"],
    queryFn: fetchSuggestedBets,
  })
}

// Query hook for todays (games if any).
export function useMatchups() {
  return useQuery({
    queryKey: ["matchups", "today"],
    queryFn: fetchMatchups,
  })
}

// Query hook for player information
export function usePlayerInfo(players: number[]) {
  return useQuery({
    queryKey: ["player", "playerInfo", players],
    queryFn: () => fetchPlayerInfo(players),
  })
}

// Query hook for team information
export function useTeamInfo() {
  return useQuery({
    queryKey: ["team", "teamInfo"],
    queryFn: fetchTeamInfo,
  })
}

// Query hook for player gamelogs
export function useGamelog(params: PlayerGamelogParams) {
  return useQuery({
    queryKey: ["player", "gamelog", params],
    queryFn: () => fetchPlayerGamelog(params),
  })
}

export function useTeamGamelog(params: TeamGamelogParams) {
  return useQuery({
    queryKey: ["team", "gamelog", params],
    queryFn: () => fetchTeamGamelogs(params),
  })
}

export function useCumulativeProfit(params: CumulativeProfitParams) {
  return useQuery({
    queryKey: ["date", params],
    queryFn: () => fetchCumulativeProfit(params)
  })
}

//********************************** */
// Need to redo the following hooks:
//********************************** */

export function useTopPlayers(filter: "regSeason" | "playoffs") {
  return useQuery({
    queryKey: ["player", "gamelog"],
    queryFn: () => fetchTopPlayers(filter),
  })
}
