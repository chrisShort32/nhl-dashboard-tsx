type PlayerSuggestedProps = {
    bet_type: string,
    side: string,
    threshold: number,
    bet_odds_decimal: number,
    bet_probability: number,
    bet_implied_probability: number,
    bet_edge: number

}
export function PlayerSuggested({ 
    bet_type, 
    side, 
    threshold, 
    bet_odds_decimal, 
    bet_implied_probability, 
    bet_probability, 
    bet_edge 
}: PlayerSuggestedProps) {
    threshold -=0.5
    return (
        <div className="p-2 ml-15 rounded-lg">
            <h2 className="text-lg font-bold">Suggested Bet</h2>
            <div className="space-y-1 text-sm">
                <p>Bet Type: {bet_type} ({side})</p>
                <p>Line: {threshold}</p>
                <p>Odds: {(bet_odds_decimal).toFixed(2)}</p>
                <p>Implied Probability: {(bet_implied_probability * 100).toFixed(2)}%</p>
                <p>Model Probabilty: {(bet_probability * 100).toFixed(2)}%</p>
                <p>Edge: {(bet_edge * 100).toFixed(2)}%</p>
            </div>
        </div>
    )
}