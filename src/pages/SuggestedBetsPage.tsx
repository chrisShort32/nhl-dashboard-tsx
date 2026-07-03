import { useSuggestedBets, useBetSummary } from "@/features/queries"
import { PlayerCard } from "@/features/player/components/PlayerCard"
import { PlayerSuggested } from "@/features/player/components/PlayerSuggested"
import { BetSummary } from "@/features/betting/BetSummary"
import { AsyncSection } from "@/components/ui/AsyncSection"
import type { SuggestedBet } from "@/features/types"

export function SuggestedBetsPage() {
  const {
    data: suggestedBets,
    isLoading: isLoadingSuggested,
    isError: isErrorSuggested,
  } = useSuggestedBets()

  const {
    data: betSummaryPlayer,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useBetSummary({
    pivot: "player",
  })
  
  const playerById = new Map(suggestedBets?.map((p) => [p.player.id, p]))


  const playerBets = betSummaryPlayer?.flatMap((s) => {
    const player = playerById.get(Number(s.groupKey))
    return player ? [{ ...s, player }] : []
  })

  return (
    <div className="mx-auto max-w-8xl p-6">
      <AsyncSection
        isLoading={isLoadingSuggested}
        isError={isErrorSuggested}
        data={playerBets}
        loadingFallback={<div>Loading Player Info...</div>}
        errorFallback={<div>Error fetching Player Info</div>}
        emptyFallback={
          <div>
            <h1 className="text-3xl font-bold mt-10">Top Bets Today</h1>
            <h3 className="text-xl font-bold mt-10">No Bets Today</h3>
          </div>
        }
      >
        {(playerBets) => (
          <div>
            <h1 className="text-3xl font-bold mt-10">All Bets Today</h1>
            <div className="grid grid-cols-1 gap-5 mt-4 p-10 w-425">
              {playerBets.map((players) => (
                <div className="flex" key={players.groupKey}>
                  <PlayerCard
                    playerInfo={players.player.player}
                    teamInfo={players.player.team}
                  >
                    <PlayerSuggested
                      suggestedBet={players.player}
                    />
                    <BetSummary
                      summaryHorizon="Betting Summary"
                      totalBets={players.nBets}
                      hits={players.nHits}
                      hitRate={players.hitRate}
                      profit={players.totalProfit}
                    />
                  </PlayerCard>
                </div>
              ))}
            </div>
          </div>
        )}
      </AsyncSection>
    </div>
  )
}
