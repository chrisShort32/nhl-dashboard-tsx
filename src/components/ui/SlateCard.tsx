import { MatchupCard } from "./MatchupCard"
import type { GameInfo } from "@/features/types"

type SlateCardProps = {
  slate: GameInfo[]
}

export function SlateCard({ slate }: SlateCardProps) {
  if (slate.length < 1) {
    return (
      <div>
        <h1 className="text-3xl font-bold mt-6">Today's Slate</h1>
        <h3 className="text-xl font-bold mt-6">No Games Today</h3>
      </div>
    )
  }
  return (
    <div>
      <h1 className="text-3xl font-bold mt-6">Today's Slate</h1>
      <div className="grid grid-cols-2 mt-4 w-340">
        {slate.map((matchup) => (
          <MatchupCard key={matchup.venue} gameInfo={matchup} />
        ))}
      </div>
    </div>
  )
}
