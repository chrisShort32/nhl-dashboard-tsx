import { useQuery } from '@tanstack/react-query'
import type { SummaryParams } from '@/features/types'
import { 
    fetchBetResults, 
    fetchSuggestedBets, 
    fetchMatchups, 
    fetchPlayerGamelog, 
    fetchTopPlayers, 
    fetchPlayerInfo, 
    fetchResultSummary, 
    fetchTeamInfo 
} from './api'

// Query hook for bet summarries
export function useBetSummary(params: SummaryParams) {
    return useQuery({
        queryKey: ['summary', params],
        queryFn: () => fetchResultSummary(params)
    })
}

// Query hook for today's suggested bet rows.
export function useSuggestedBets() {
    return useQuery({
        queryKey: ['suggested', 'today'],
        queryFn: fetchSuggestedBets,
    })
}

// Query hook for todays (games if any).
export function useMatchups() {
    return useQuery({
        queryKey: ['matchups', 'today'],
        queryFn: fetchMatchups,
    })
}

// Query hook for player information
export function usePlayerInfo(players: number[]) {
    return useQuery({
        queryKey: ['player', 'playerInfo', players],
        queryFn: () => fetchPlayerInfo(players),
    })
}

// Query hook for team information
export function useTeamInfo() {
    return useQuery({
        queryKey: ['team', 'teamInfo'],
        queryFn: fetchTeamInfo,
    })
}

//********************************** */
// Need to redo the following hooks:
//********************************** */

// Query hook for the bet results for the last X games (default to 7)
export function useBetResults(startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: ['bet-results', startDate, endDate],
        queryFn: () => fetchBetResults(startDate, endDate),
    })
}

export function useGamelog(playerId: string) {
    return useQuery({
        queryKey: ['player', 'gamelog', playerId],
        queryFn: () => fetchPlayerGamelog(playerId),
    })
}

export function useTopPlayers(filter: 'regSeason' | 'playoffs') {
    return useQuery({
        queryKey: ['player', 'gamelog'],
        queryFn: () => fetchTopPlayers(filter),
    })
}
