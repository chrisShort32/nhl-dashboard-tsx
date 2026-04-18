import { api } from '@/lib/api'
import type { PlayerGameLog, SuggestedBet, BetResult, MatchupInfo, PlayerIdentity } from './types'

// Fetches the latest game row for a single player from the backend.
export async function fetchMatchups(): Promise<MatchupInfo[]> {
    return api.get<MatchupInfo[]>('/today-matchups')
}

// Fetches the full gamelog for a single player from the backend.
export async function fetchPlayerGamelog(playerId: string): Promise<PlayerGameLog[]> {
    return api.get<PlayerGameLog[]>(`/player-gamelog?player_id=${playerId}`)
}

// Fetches the full gamelogs of the top 10 players
export async function fetchTopPlayers(): Promise<PlayerGameLog[][]> {
    return api.get<PlayerGameLog[][]>(`/top-players`)
}

// Fetches bet results for the last X games (default to 7)
export async function fetchBetResults(startDate?: string, endDate?: string): Promise<BetResult[]> {
    let url = '/bet-results?'
    if (startDate) url += `start_date=${startDate}&`
    if (endDate) url += `end_date=${endDate}`
    return api.get<BetResult[]>(url)
}

// Fetches suggested bets for todays games
export async function fetchSuggestedBets(): Promise<SuggestedBet[]> {
    return api.get<SuggestedBet[]>('/suggested-bets')
}

// Fetches player info for all players with a betting history
export async function fetchPlayerInfo(): Promise<PlayerIdentity[]> {
    return api.get<PlayerIdentity[]>('/player-info')
}