import {
  useMatchups,
  usePlayerInfo,
  useBetSummary,
} from "@/features/queries"
import { DataTable } from "@/components/ui/DataTable"
import { SlateCard } from "@/components/ui/SlateCard"
import { PlayerCard } from "@/features/player/components/PlayerCard"
import { BetSummary } from "@/features/betting/BetSummary"
import { AsyncSection } from "@/components/ui/AsyncSection"

export function DashboardPage() {
  const {
    data: playerInfo,
    isLoading: isLoadingInfo,
    isError: isErrorInfo,
  } = usePlayerInfo([
    8480069, 8481540, 8484984, 8480336, 8480018, 8473533, 8482702,
  ])

  const {
    data: betSummaryPlayer,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useBetSummary({
    pivot: "player",
    startDate: "2026-04-18",
    endDate: "2026-06-04",
  })

  const playerById = new Map(playerInfo?.map((p) => [p.id, p]))

  const playerBets = betSummaryPlayer?.flatMap((s) => {
    const player = playerById.get(Number(s.groupKey))
    return player ? [{ ...s, player }] : []
  })

  const {
    data: matchupInfo,
    isLoading: isLoadingMatchup,
    isError: isErrorMatchup,
  } = useMatchups()

  return (
    <div className="mx-auto max-w-8xl p-6">
      <h1 className="text-5xl font-bold text-center">NHL Dashboard</h1>
      
      <AsyncSection
        isLoading={isLoadingMatchup}
        isError={isErrorMatchup}
        data={matchupInfo}
        loadingFallback={<div>Loading Matchup...</div>}
        errorFallback={<div>Error Fetching Matchups</div>}
        emptyFallback={<div>No Matchups Found</div>}
      >
        {(matchupInfo) => (
          <div>
            <SlateCard slate={matchupInfo} />
          </div>
        )}
      </AsyncSection>
      <AsyncSection
        isLoading={isLoadingInfo}
        isError={isErrorInfo}
        data={playerBets}
        loadingFallback={<div>Loading Player Info...</div>}
        errorFallback={<div>Error Fetching Player Info</div>}
        emptyFallback={<div>No Player Info Found</div>}
      >
        {(playerBets) => (
        <div>
          <h1 className="text-3xl font-bold mt-10">Testing</h1>
          <div className="grid grid-cols-1 gap-5 mt-4 p-10 w-425">
            {playerBets.map((players) => (
              <div className="flex" key={players.groupKey}>
                <PlayerCard playerInfo={players.player}>
                  <BetSummary
                    totalBets={players.nBets}
                    hits={players.nHits}
                    hitRate={players.hitRate}
                    profit={players.totalProfit}
                  ></BetSummary>
                </PlayerCard>
              </div>
            ))}
          </div>
        </div>
        )}
      </AsyncSection>
      <AsyncSection
        isLoading={isLoadingSummary}
        isError={isErrorSummary}
        data={betSummaryPlayer}
        loadingFallback={<div>Loading Bet Results...</div>}
        errorFallback={<div>Error fetching Bet Results</div>}
        emptyFallback={<div>No Bet Results Found</div>}
      >
        {(betSummaryPlayer) => (
          <div>
            <DataTable
              link="/results"
              header="Bet Results By Player"
              data={betSummaryPlayer}
              columns={[
                { label: "Player", key: "groupLabel" },
                { label: "Total Bets", key: "nBets" },
                { label: "Hits", key: "nHits" },
                {
                  label: "Hit Rate",
                  key: "hitRate",
                  format: (value) => `${(Number(value) * 100).toFixed(1)}%`,
                },
                {
                  label: "Profit",
                  key: "totalProfit",
                  format: (value) => `$${Number(value).toFixed(2)}`,
                },
              ]}
              rowKey={(row) => String(row.groupKey)}
              rowClassName={(row) =>
                row.groupKey.toString() === "Total" ? "font-bold" : ""
              }
            />
          </div>
        )}
      </AsyncSection>
    </div>
  )
}
