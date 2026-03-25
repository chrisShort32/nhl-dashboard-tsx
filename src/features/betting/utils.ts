import type { BetResultSummary, BetResult, FilterState, CalibrationResult } from "../types";

export function summarizeBetResults<T, K extends keyof BetResult = never>(
    betResults: BetResult[],
    pivotKey: keyof BetResult | ((result: BetResult) => string),
    options?: {
        includeTotals?: boolean
        totalsLabel?: T
        additionalFields?: K[]
    }
): (BetResultSummary<T> & Partial<Pick<BetResult, K>>)[] {
    const groups = new Map<T, BetResult[]>()
    const getKey = typeof pivotKey === 'function'
            ? pivotKey
            : (result: BetResult) => result[pivotKey]

    betResults.forEach((result) => {
        const pivotValue = getKey(result) as T

        if (!groups.has(pivotValue)) {
            groups.set(pivotValue,[result])
        }
        else {
            groups.get(pivotValue)?.push(result)
        }
    })

    const summary: (BetResultSummary<T> & Partial<Pick<BetResult, K>>)[] = []
    groups.forEach((value, key) => {
        const total_bets = value.length
        const hits = value.reduce((sum, result) => sum + (result.hit ? 1 : 0), 0)
        const hit_rate = hits/total_bets
        const odds_total = value.reduce((sum, result) => sum + result.bet_odds_d, 0)
        const average_odds = odds_total/total_bets
        const profit = value.reduce((sum, result) => sum + result.profit, 0)
        const summary_pivot = key
        const groupSummary: BetResultSummary<T> = {summary_pivot, total_bets, hits, hit_rate, average_odds, profit}
        const extra = {} as Pick<BetResult, K>
        options?.additionalFields?.forEach((field) => {
            extra[field] = value[0][field]
        }) 
        summary.push({ ...groupSummary, ...extra })

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
        summary.push({ summary_pivot, total_bets, hits, hit_rate, average_odds, profit } as BetResultSummary<T> & Partial<Pick<BetResult, K>>)
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

export function calibration(betResults: BetResult[], bucketWidth: number, maxLowerBound: number, bucketData: 'bet_p' | 'edge') : CalibrationResult[] {
    if (betResults.length === 0) return []
    const bucketMap = new Map<number, CalibrationResult>()
    

    betResults.forEach((result) => {
        
        const pivot = bucketData === 'bet_p' ? result.bet_p : result.bet_edge
        

        const bucketNumber = Math.floor(pivot / bucketWidth)
        let lowerBound = bucketNumber * bucketWidth
        if (lowerBound > maxLowerBound) {
            lowerBound = maxLowerBound
        }
        
        if (!bucketMap.has(lowerBound)) {
            bucketMap.set(lowerBound, {
                bucketWidth,
                bucketLowerBound: lowerBound,
                totalBets: 0,
                totalHits: 0,
                hitRate: 0,
                profit: 0,
            })
        }
            
        const bucket = bucketMap.get(lowerBound)! 
        
        bucket.totalBets += 1
        bucket.totalHits += result.hit
        bucket.profit += result.profit
    })

    const calibrationResults = new Array<CalibrationResult>()
    bucketMap.forEach((bucket)=> {
        bucket.hitRate = bucket.totalHits / bucket.totalBets
        calibrationResults.push(bucket)
    })
    
    calibrationResults.sort((a,b) => a.bucketLowerBound - b.bucketLowerBound)

    return calibrationResults  
}
