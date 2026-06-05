import type { BetResult, FilterState, CalibrationResult } from "../types";

export function applyFilters(betResults: BetResult[], filterState: FilterState) : BetResult[] {
    if (betResults.length === 0) return []
    
    // date filter
    const maxDate = betResults.reduce((max, r) => r.game_date > max ? r.game_date : max, '')
    const dateRange = new Date(maxDate)
    const dateFilter = filterState.dateRange
    if (dateFilter !== 'all' && dateFilter !== 'playoffs') {
        dateRange.setDate(dateRange.getDate() - dateFilter)
    }
    const playoffStartDate = new Date('2026-04-18')
    const thresholdFilter = filterState.thresholdFilter
    const typeFilter = filterState.typeFilter
    const filtered = betResults.filter((result) => 
        ((dateFilter === 'all' ? true :  dateFilter === 'playoffs' ? result.game_date >= (playoffStartDate.toISOString().split('T')[0]) : result.game_date >= (dateRange.toISOString().split('T')[0]))) &&
        ((thresholdFilter === 'all' ? true : thresholdFilter === 6 ? result.threshold <= 3 : result.threshold === thresholdFilter)) &&
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

    if (tabValue === 'playoffs') {
        const playoffStartDate = "2026-04-18"
        const filtered = betResults.filter((result) => result.game_date >= playoffStartDate)

        return filtered;
    }

    if (tabValue === 'regSeason') {
        const playoffStartDate = "2026-04-18"
        const filtered = betResults.filter((result) => result.game_date < playoffStartDate)
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
