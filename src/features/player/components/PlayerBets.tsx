type PlayerBetProps = {
    total_bets: number,
    hits: number,
    hit_rate: number,
    average_odds: number,
    profit: number
}
export function PlayerBets({ total_bets, hits, hit_rate, average_odds, profit }: PlayerBetProps) {

    return (
        <div className="p-4 ml-15 bg-black-300 rounded-lg">
            <h2 className="text-lg font-bold">Betting Performance</h2>
            <div className="space-y-1 text-sm">
                <p>Total Bets: {total_bets}</p>
                <p>Hits: {hits}</p>
                <p>Hit Rate: {(hit_rate * 100).toFixed(2)}%</p>
                <p>Avg Odds: {average_odds.toFixed(2)}</p>
                <p>Profit: ${profit.toFixed(2)}</p>
            </div>
        </div>
    )
}