import type { BetResultSummary, BetResult, FilterState } from "../types";

export function summarizeBetResults<T>(
    betResults: BetResult[],
    pivotKey: keyof BetResult,
    options?: {
        includeTotals?: boolean
        totalsLabel?: T
    }
): BetResultSummary<T>[] {
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

    // Sort by summary_pivot to keep table output stable.
    summary.sort((a, b) => {
        const av = a.summary_pivot
        const bv = b.summary_pivot
        if (typeof av === 'number' && typeof bv === 'number') {
            return av - bv
        }
        return String(av).localeCompare(String(bv))
    })

    if (options?.includeTotals) {
        const total_bets = betResults.length
        const hits = betResults.reduce((sum, result) => sum + (result.hit ? 1 : 0), 0)
        const hit_rate = total_bets > 0 ? hits / total_bets : 0
        const odds_total = betResults.reduce((sum, result) => sum + result.bet_odds_d, 0)
        const average_odds = total_bets > 0 ? odds_total / total_bets : 0
        const profit = betResults.reduce((sum, result) => sum + result.profit, 0)
        const summary_pivot = (options.totalsLabel ?? ('Total' as T))
        summary.push({ summary_pivot, total_bets, hits, hit_rate, average_odds, profit })
    }

    return summary

}

export function applyFilters(betResults: BetResult[], filterState: FilterState) : BetResult[] {
    if (betResults.length === 0) return []
    
    // date filter
    const maxDate = betResults.reduce((max, r) => r.game_date > max ? r.game_date : max, '')
    const dateRange = new Date(maxDate)
    const dateFilter = filterState.dateRange
    if (dateFilter !== 'all') {
        dateRange.setDate(dateRange.getDate() - dateFilter)
    }
    const thresholdFilter = filterState.thresholdFilter
    const typeFilter = filterState.typeFilter
    const filtered = betResults.filter((result) => 
        (dateFilter !== 'all' ? result.game_date >= (dateRange.toISOString().split('T')[0]) : true) &&
        (thresholdFilter !== 'all' ? result.threshold === (thresholdFilter) : true) &&
        ((typeFilter === 'all' ? true : typeFilter === 'over' ? result.bet_type !== 'under' : result.bet_type === typeFilter)))
    return filtered
}

export function computeCumulativeProfit(betResults: BetResult[]) : { game_date: string, cum_profit: number }[] {
    
    if (betResults.length === 0) return []
    
    const dailyTotalMap = new Map<string, number>()
    
    betResults.forEach((results) => {
        const current = dailyTotalMap.get(results.game_date) ?? 0
        dailyTotalMap.set(results.game_date, current + results.profit)
    })

    const sortedDates = Array.from(dailyTotalMap.keys()).sort()
    let cum_profit = 0

    const dateProfit = sortedDates.map((date) => {
        cum_profit += dailyTotalMap.get(date) ?? 0
        const formatted = Number(cum_profit.toFixed(2))
        return { game_date: date, cum_profit: formatted }
    })
    
    return dateProfit
}

export function tabDateFilter(betResults: BetResult[], tabValue: string) : BetResult[] {
    
    if (betResults.length === 0) return []
    const maxDate = betResults.reduce((max, r) => r.game_date > max ? r.game_date : max, '')
    if (tabValue === 'yesterday') {
        
        const filtered = betResults.filter((result) => result.game_date === maxDate)
        return filtered
    }
    
    if (tabValue === 'lastWeek') {
        const date = new Date(maxDate)
        date.setDate(date.getDate() - 7)
        const fDate = date.toISOString().split('T')[0]
        const filtered = betResults.filter((result) => result.game_date >= (fDate))

        return filtered
    }

    if (tabValue === 'lastMonth') {
        const date = new Date(maxDate)
        date.setDate(date.getDate() - 30)
        const fDate = date.toISOString().split('T')[0]
        const filtered = betResults.filter((result) => result.game_date >= (fDate))

        return filtered
    }

    return betResults
}
