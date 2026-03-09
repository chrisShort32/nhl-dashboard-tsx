import { useQuery } from '@tanstack/react-query'
import { fetchBetResults, fetchSuggestedBets, fetchGameLatest, fetchPlayerGamelog } from './api'

// Query hook for the bet results for the last X games (default to 7)
export function useBetResults(startDate?: string, endDate?: string) {
    return useQuery({
        queryKey: ['bet-results', startDate, endDate],
        queryFn: () => fetchBetResults(startDate, endDate),
    })
}
// Query hook for today's suggested bet rows.
export function useSuggestedBets() {
    return useQuery({
        queryKey: ['suggested-bets', 'today'],
        queryFn: fetchSuggestedBets,
    })
}

// Query hook for the latest game stats rows.
export function useGameLatest() {
    return useQuery({
        queryKey: ['shots', 'latest'],
        queryFn: fetchGameLatest,
    })
}

export function useGamelog(playerId: string) {
    return useQuery({
        queryKey: ['player', 'gamelog', playerId],
        queryFn: () => fetchPlayerGamelog(playerId),
    })
}
