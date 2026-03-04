import type {PlayerGameLog} from '@/features/types'

export type StatSnapshot = {
    snapshotHorizon: string
    goalsTotal: number
    goalsPerGame: number
    assistsTotal: number
    assistsPerGame: number
    pointsTotal: number
    pointsPerGame: number
    shotsTotal: number
    shotsPerGame: number
    shotAttemptsTotal: number
    shotAttemptsPerGame: number
}

export function calculatePlayerStats(gamelog: PlayerGameLog[]): StatSnapshot {
    // Calculate totals and avgs
    const goalsTotal = gamelog.reduce((sum, game) => sum + game.goals, 0)
    const assistsTotal = gamelog.reduce((sum, game) => sum + game.assists, 0)
    const pointsTotal = gamelog.reduce((sum, game) => sum + game.points, 0)
    const shotsTotal = gamelog.reduce((sum, game) => sum + game.shots_on_goal, 0)
    const shotAttemptsTotal = gamelog.reduce((sum, game) => sum + game.shot_attempts_total, 0)

    const games = gamelog.length
    const gpg = goalsTotal / games
    const apg = assistsTotal / games
    const ppg = pointsTotal / games
    const spg = shotsTotal / games
    const sapg = shotAttemptsTotal / games

    const snapshotHorizon = games <= 10
        ? `Last ${games} Games`
        : 'Season Snapshot'
    
    return {
        snapshotHorizon,
        goalsTotal,
        goalsPerGame: gpg,
        assistsTotal,
        assistsPerGame: apg,
        pointsTotal,
        pointsPerGame: ppg,
        shotsTotal,
        shotsPerGame: spg,
        shotAttemptsTotal,
        shotAttemptsPerGame: sapg
    }
}
