import { api } from '@/lib/api'
import type { 
    PlayerGameLog, 
    SuggestedBet, 
    BetResult, 
    MatchupInfo, 
    PlayerIdentity, 
    BetResultSummary, 
    SummaryParams, 
    BetResultParams,
    GamelogParams,
    TeamInfo

} from './types'

// Fetches the latest game row for a single player from the backend.
export async function fetchMatchups(): Promise<MatchupInfo[]> {
    return api.get<MatchupInfo[]>('/games/today')
}

// Fetches the full gamelog for a single player from the backend.
export async function fetchPlayerGamelog(params: GamelogParams): Promise<PlayerGameLog[]> {
    const qs = new URLSearchParams()

    if (params.startDate) qs.set('start_date', params.startDate)
    if (params.endDate) qs.set('end_date', params.endDate)
    if (params.season) qs.set('season', params.season)
    if (params.playoffs) qs.set('playoffs', params.playoffs)
    
    return api.get<PlayerGameLog[]>(`/players/${params.playerId}/gamelogs?${qs}`)
}

// Fetches the full gamelogs of the top 10 players
export async function fetchTopPlayers(filter: 'regSeason' | 'playoffs'): Promise<PlayerGameLog[][]> {
    return api.get<PlayerGameLog[][]>(`/top-players?filter=${filter}`)
}

// Fetches bet results for the given date range (default is all)
// Note that the endpoint supports filtering on threshold, side, bet_type, player_id, team_id, in addition to date
// Will update accordingly soon
export async function fetchBetResults(params : BetResultParams): Promise<BetResult[]> {
    const qs = new URLSearchParams()

    if (params.startDate) qs.set('start_date', params.startDate)
    if (params.endDate) qs.set('end_date', params.endDate)
    if (params.teamId) qs.set('team_id', params.teamId)
    if (params.playerId) qs.set('player_id', params.playerId)
    if (params.betType) qs.set('bet_type', params.betType)
    if (params.side) qs.set('side', params.side)
    if (params.threshold) qs.set('threshold', params.threshold)

    return api.get<BetResult[]>(`/bets/results/?${qs}`)
}

// Fetches bet result summarries based on a pivot of threshold, side, bet_type, player_id, or team_id over a given date range
// Can be further filtered by any of the above pivots
export async function fetchResultSummary(params: SummaryParams): Promise<BetResultSummary<string>[]> {
    const qs = new URLSearchParams({ group_by: params.pivot})

    if (params.startDate) qs.set('start_date', params.startDate)
    if (params.endDate) qs.set('end_date', params.endDate)
    if (params.teamId) qs.set('team_id', params.teamId)
    if (params.playerId) qs.set('player_id', params.playerId)
    if (params.betType) qs.set('bet_type', params.betType)
    if (params.side) qs.set('side', params.side)
    if (params.threshold) qs.set('threshold', params.threshold)
    if (params.limit) qs.set('limit', params.limit)
    if (params.orderBy) qs.set('order_by', params.orderBy)

    return api.get<BetResultSummary<string>[]>(`/bets/results/summary?${qs}`)

}

// Fetches suggested bets for todays games
export async function fetchSuggestedBets(): Promise<SuggestedBet[]> {
    return api.get<SuggestedBet[]>('/bets/suggested')
}

// Fetches player info for all players with a betting history
export async function fetchPlayerInfo(players: number[]): Promise<PlayerIdentity[]> {
    return api.post<PlayerIdentity[]>('/players', players)
}

// Fetches team information for all teams in the league
export async function fetchTeamInfo(): Promise<TeamInfo[]> {
    return api.get<TeamInfo[]>('/teams/info')
}