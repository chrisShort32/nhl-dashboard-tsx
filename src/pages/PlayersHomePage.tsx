import { useAllPlayers, useBetSummary, usePlayerInfo } from "@/features/queries"
import { PlayerSnapshot } from "@/features/player/components/PlayerSnapshot"
import { BetSummary } from "@/features/betting/BetSummary"
import { PlayerCard } from "@/features/player/components/PlayerCard"
import { SearchComboBox } from "@/components/ui/SearchComboBox"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

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
        {allPlayers && (
          <SearchComboBox
            items={allPlayers}
            getKey={(p) => p.id}
            getLabel={(p) => p.fullName}
            onSelect={(p) => navigate(`/player/${p.id}`)}
            placeholder=" Search Players"
          />
        )}
      </div>
      
      {isLoadingSummaryTop ? (
        <div>Loading Data...</div>
      ) : isErrorSummaryTop ? (
        <div>Error fetching Data</div>
      ) : topProfit ? (
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
      ) : (
        <div>No Data Found</div>
      )}

      {isLoadingSummaryBottom ? (
        <div>Loading Data...</div>
      ) : isErrorSummaryBottom ? (
        <div>Error fetching Data</div>
      ) : bottomProfit ? (
        <div>
          <h1 className="text-3xl font-bold mt-10">
            Bottom 12 - Profit (FADE)
          </h1>
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
      ) : (
        <div>No Data Found</div>
      )}
      {/* {isLoadingSummary ? (
                <div>Loading Data...</div>
            ) : isErrorSummary ? (
                <div>Error fetching Data</div>
            ) : betSummaryPlayer && betSummaryPlayer.length > 0 ? (
                <div>
                    <h1 className='text-3xl font-bold mt-10'>Top 12 - Betting (Playoffs)</h1>
                    <div className="grid grid-cols-1 gap-5 mt-4 p-10 w-425">
                        {betSummaryPlayer.map((player) => (
                            <div className="flex" key={player.group_key}>
                                <PlayerCard
                                    player_id={games[0].player_id}
                                    player_name={games[0].player_name}
                                    headshot_url={games[0].headshot_url}
                                    position={games[0].position}
                                    sweater_number={games[0].sweater_number}
                                    team={games[0].team}
                                >
                                    <PlayerSnapshot 
                                        gamelog={games}
                                    />
                                </PlayerCard>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>No Data Found</div>
            )}
            <Tabs
                tabs={[
                {label: 'Regular Season', value: 'regSeason'},
                {label: 'Playoffs', value: 'playoffs'},
                ]}
                activeTab={activeView}
                onChange={setActiveView}
          />
            {isLoading || isLoadingInfo ? (
                <div>Loading Data...</div>
            ) : isError || isErrorInfo ? (
                <div>Error fetching Data</div>
            ) : winnersInfo && winnersInfo.length > 0 ? (
                <div>
                    <h1 className='text-3xl font-bold mt-10'>Top 12 - Profit (SLAM)</h1>
                    <div className="grid grid-cols-3 gap-5 mt-4 p-10 w-425">
                        {winnersInfo.map((players, index) => (
                            <div className="flex" key={index}>
                                <PlayerCard
                                    player_id={players.player?.player_id as string}
                                    player_name={players.player?.player_name as string}
                                    headshot_url={players.player?.headshot_url as string}
                                    position={players.player?.position as string}
                                    sweater_number={players.player?.sweater_number as number}
                                    team={players.player?.team as string}
                                >
                                    <BetSummary
                                        total_bets={players.total_bets}
                                        hits={players.hits}
                                        hit_rate={players.hit_rate}
                                        
                                        profit={players.profit}
                                    >

                                    </BetSummary>
                                    
                                </PlayerCard>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>No Data Found</div>
            )}

            {isLoading || isLoadingInfo ? (
                <div>Loading Data...</div>
            ) : isError || isErrorInfo ? (
                <div>Error fetching Data</div>
            ) : losersInfo && losersInfo.length > 0 ? (
                <div>
                    <h1 className='text-3xl font-bold mt-10'>Bottom 12 - Profit (FADE)</h1>
                    <div className="grid grid-cols-3 gap-5 mt-4 p-10 w-425">
                        {losersInfo.map((players, index) => (
                            <div className="flex" key={index}>
                                <PlayerCard
                                    player_id={players.player?.player_id as string}
                                    player_name={players.player?.player_name as string}
                                    headshot_url={players.player?.headshot_url as string}
                                    position={players.player?.position as string}
                                    sweater_number={players.player?.sweater_number as number}
                                    team={players.player?.team as string}
                                >
                                    <BetSummary
                                        total_bets={players.total_bets}
                                        hits={players.hits}
                                        hit_rate={players.hit_rate}
                                        profit={players.profit}
                                    >

                                    </BetSummary>
                                    
                                </PlayerCard>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>No Data Found</div>
            )} */}
    </div>
  )
}
