import { useBetSummary, usePlayerInfo } from "@/features/queries"
import { BetSummary } from "@/features/betting/BetSummary"
import { PlayerCard } from "@/features/player/components/PlayerCard"
import { SearchComboBox } from "@/components/ui/SearchComboBox"
import { AsyncSection } from "@/components/ui/AsyncSection"
import { useNavigate } from "react-router-dom"


export function PlayersHomePage() {  
  const {
    data: allPlayers,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = usePlayerInfo([])

  const navigate = useNavigate()

  const {
    data: betSummaryPlayerTop,
    isLoading: isLoadingSummaryTop,
    isError: isErrorSummaryTop,
  } = useBetSummary({
    pivot: "player",
    startDate: "2026-04-18",
    endDate: "2026-06-04",
    limit: "12",
    orderBy: "desc",
  })

  const {
    data: betSummaryPlayerBottom,
    isLoading: isLoadingSummaryBottom,
    isError: isErrorSummaryBottom,
  } = useBetSummary({
    pivot: "player",
    startDate: "2026-04-18",
    endDate: "2026-06-04",
    limit: "12",
    orderBy: "asc",
  })

  const idsTop = betSummaryPlayerTop?.map((s) => Number(s.groupKey)) ?? []
  const idsBottom = betSummaryPlayerBottom?.map((s) => Number(s.groupKey)) ?? []
  const ids = idsBottom.concat(idsTop)
  const players = usePlayerInfo(ids)

  const playerById = new Map(players.data?.map((p) => [Number(p.id), p]))

  const topProfit = betSummaryPlayerTop?.flatMap((s) => {
    const player = playerById.get(Number(s.groupKey))
    return player ? [{ ...s, player }] : []
  })

  const bottomProfit = betSummaryPlayerBottom?.flatMap((s) => {
    const player = playerById.get(Number(s.groupKey))
    return player ? [{ ...s, player }] : []
  })

  return (
    <div className="mx-auto p-6">
      <div>
        <AsyncSection
          isLoading={isLoadingAll}
          isError={isErrorAll}
          data={allPlayers}
          loadingFallback={<div>Loading All Players...</div>}
          errorFallback={<div>Error fetching Players</div>}
          emptyFallback={<div>No Players Found</div>}
        >
          {(allPlayers) => (
            <SearchComboBox
              items={allPlayers}
              getKey={(p) => p.id}
              getLabel={(p) => p.fullName}
              onSelect={(p) => navigate(`/player/${p.id}`)}
              placeholder=" Search Players"
            />
        )}
        </AsyncSection>
      </div>
      <AsyncSection
        isLoading={isLoadingSummaryTop}
        isError={isErrorSummaryTop}
        data={topProfit}
        loadingFallback={<div>Loading Top Performers...</div>}
        errorFallback={<div>Error fetching Top Performers</div>}
        emptyFallback={<div>No Players Found</div>}
      >
        {(topProfit) => (
          <div>
          <h1 className="text-3xl font-bold mt-10">Top 12 - Profit (SLAM)</h1>
          <div className="grid grid-cols-2 gap-5 mt-4 p-10 w-425">
            {topProfit?.map((players) => (
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
        isLoading={isLoadingSummaryBottom}
        isError={isErrorSummaryBottom}
        data={bottomProfit}
        loadingFallback={<div>Loading Bottom Performers...</div>}
        errorFallback={<div>Error fetching Bottom Performers</div>}
        emptyFallback={<div>No Players Found</div>}
      >
        {(bottomProfit) => (
          <div>
          <h1 className="text-3xl font-bold mt-10">Bottom 12 - Profit (FADE)</h1>
          <div className="grid grid-cols-2 gap-5 mt-4 p-10 w-425">
            {bottomProfit?.map((players) => (
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
    </div>
  )
}
