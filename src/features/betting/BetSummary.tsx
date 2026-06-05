type BetSummaryProps = {
    summary_horizon?: string,
    total_bets: number,
    hits: number,
    hit_rate: number,
    profit: number
}
export function BetSummary({ summary_horizon, total_bets, hits, hit_rate, profit }: BetSummaryProps) {
    if (!summary_horizon) summary_horizon = 'Betting Performance'
    return (
        <div className="p-2 ml-10 rounded-lg">
            <h2 className="text-lg font-bold">{summary_horizon}</h2>
            <div className="space-y-1 text-sm">
                <p>Total Bets: {total_bets}</p>
                <p>Hits: {hits}</p>
                <p>Hit Rate: {(hit_rate * 100).toFixed(2)}%</p>
                <p>Profit: ${profit.toFixed(2)}</p>
            </div>
        </div>
    )
}