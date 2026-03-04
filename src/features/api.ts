import { api } from '@/lib/api'
import type { PredictRow, GameRow, PlayerGameLog } from './types'

// Temporary local fallback data while the predictions endpoint is in flux.
const MOCK: PredictRow[] = [
    {
        gameId: '2025020699',
        gameDate: '2026-1-10',
        playerId: '8470613',
        playerName: 'Brent Burns',
        team: 'COL',
        opponent: 'CBJ',
        pGe2: 0.4383561644,
        pGe3: 0.2595419847,
        pGe4: 0.079667097,
        pGe5: 0.0297890103,

    },
]

export async function fetchPredictionsToday(): Promise<PredictRow[]> {
    //return api.get<PredictRow[]>('/predictions-latest')

    try {
        return MOCK
        //return await api.get<PredictRow[]>('/predictions-latest')
    } catch {
        // fallback till api is implemented
        return MOCK
    }
}

// Fetches the latest game row for a single player from the backend.
export async function fetchGameLatest(): Promise<GameRow[]> {
    return api.get<GameRow[]>('/last-game?player_id=8471215')
}

export async function fetchPlayerGamelog(playerId: string): Promise<PlayerGameLog[]> {
    return api.get<PlayerGameLog[]>(`/player-gamelog?player_id=${playerId}`)
}
