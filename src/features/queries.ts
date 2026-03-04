import { useQuery } from '@tanstack/react-query'
import { fetchPredictionsToday, fetchGameLatest, fetchPlayerGamelog } from './api'

// Query hook for today's prediction rows.
export function usePredictionsToday() {
    return useQuery({
        queryKey: ['predictions', 'today'],
        queryFn: fetchPredictionsToday,
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
