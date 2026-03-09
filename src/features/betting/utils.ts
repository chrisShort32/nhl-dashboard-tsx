import type { BetResultSummary, BetResult } from "../types";

export function summarizeBetResults<T>(betResults: BetResult[], pivotKey: keyof BetResult): BetResultSummary<T>[] {
    const groups = new Map<T, BetResult[]>()
    betResults.forEach((result) => {
        const pivotValue = result[pivotKey] as T

        if (!groups.has(pivotValue)) {
            groups.set(pivotValue,[result])
        }
        else {
            groups.get(pivotValue)?.push(result)
        }
    })

    const summary: BetResultSummary<T>[] = []
    groups.forEach((value, key) => {
        const total_bets = value.length
        const hits = value.reduce((sum, result) => sum + (result.hit ? 1 : 0), 0)
        const hit_rate = hits/total_bets
        const odds_total = value.reduce((sum, result) => sum + result.bet_odds_d, 0)
        const average_odds = odds_total/total_bets
        const profit = value.reduce((sum, result) => sum + result.profit, 0)
        const summary_pivot = key
        const groupSummary: BetResultSummary<T> = {summary_pivot, total_bets, hits, hit_rate, average_odds, profit}
        summary.push(groupSummary)

    })

    return summary

}

export function tabDateFilter(betResults: BetResult[], tabValue: string) : BetResult[] {
    
    if (tabValue === 'yesterday') {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 2)
        const formatted = yesterday.toISOString().split('T')[0]
        const filtered = betResults.filter((result) => result.game_date === formatted)
        return filtered
    }
    
    if (tabValue === 'lastWeek') {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 8)
        const formatted = startDate.toISOString().split('T')[0]
        const filtered = betResults.filter((result) => result.game_date >= formatted)

        return filtered
    }

    if (tabValue === 'lastMonth') {
        const startDate = new Date()

        startDate.setDate(startDate.getDate() - 30)
        const formatted = startDate.toISOString().split('T')[0]
        const filtered = betResults.filter((result) => result.game_date >= formatted)

        return filtered
    }

    return betResults
}