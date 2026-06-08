import type { BetMetrics } from "@/features/types"

type PlayerSuggestedProps = {
  suggestedBet: BetMetrics
}
export function PlayerSuggested({ suggestedBet }: PlayerSuggestedProps) {
  return (
    <div className="p-2 ml-15 rounded-lg">
      <h2 className="text-lg font-bold">Suggested Bet</h2>
      <div className="space-y-1 text-sm">
        <p>
          Bet Type: {suggestedBet.betType} ({suggestedBet.side})
        </p>
        <p>
          Line: {suggestedBet.threshold - 0.5} | Odds:{" "}
          {suggestedBet.betOddsD.toFixed(2)}
        </p>
        <p>
          Model Probabilty: {(suggestedBet.betP * 100).toFixed(2)}%
        </p>
        <p>Edge: {(suggestedBet.betEdge * 100).toFixed(2)}%</p>
      </div>
    </div>
  )
}
