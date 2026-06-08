type BetSummaryProps = {
    summaryHorizon?: string,
    totalBets: number,
    hits: number,
    hitRate: number,
    profit: number
}
export function BetSummary({ summaryHorizon, totalBets, hits, hitRate, profit }: BetSummaryProps) {
    if (!summaryHorizon) summaryHorizon = 'Betting Performance'
    return (
        <div className="p-2 ml-10 rounded-lg">
            <h2 className="text-lg font-bold">{summaryHorizon}</h2>
            <div className="space-y-1 text-sm">
                <p>Total Bets: {totalBets}</p>
                <p>Hits: {hits}</p>
                <p>Hit Rate: {(hitRate * 100).toFixed(2)}%</p>
                <p>Profit: ${profit.toFixed(2)}</p>
            </div>
        </div>
    )
}