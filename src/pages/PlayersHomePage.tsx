import { useTopPlayers, useBetResults, usePlayerInfo } from '@/features/queries'
import { PlayerSnapshot } from '@/features/player/components/PlayerSnapshot'
import { PlayerBets } from '@/features/player/components/PlayerBets'
import { PlayerCard } from '@/features/player/components/PlayerCard'
import { Tabs } from '@/components/ui/Tabs'
import { summarizeBetResults, tabDateFilter } from '@/features/betting/utils'
import { useMemo, useState } from 'react'

export function PlayersHomePage() {
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    const { data: betResults, isLoading, isError } = useBetResults('2026-01-01', todayString)
    const { data: playerInfo, isLoading: isLoadingInfo, isError: isErrorInfo } = usePlayerInfo()
    const [activeView, setActiveView] = useState('playoffs')
    const filtered = betResults ? tabDateFilter(betResults, activeView) : []
    const { data: topPlayers, isLoading: isLoadingPlayers, isError: isErrorPlayers } = useTopPlayers(activeView)

    const sortedPlayers = useMemo(() => {
        if(!topPlayers) return []
        return [...topPlayers].sort((a,b) => {
            const totalA = a.reduce((sum, game) => sum + game.points, 0)
            const totalB = b.reduce((sum, game) => sum + game.points, 0)
            return totalB - totalA
        })
    }, [topPlayers])

    const playerBetResults = useMemo(() => {
        if(!filtered) return []
        const results =  summarizeBetResults(filtered, 'player_id')
        const sorted = results.sort((a,b) => b.profit - a.profit)
        return sorted
    }, [filtered])

    const winners = playerBetResults.slice(0,12)
    const losers = playerBetResults.slice(-12)
    losers.sort((a,b) => a.profit - b.profit)

    const playerById = new Map(playerInfo?.map(p => [p.player_id, p]))
    
    const winnersInfo = winners.map(winner => ({
        ...winner,
        player: playerById.get(winner.summary_pivot as string),
    }))

    const losersInfo = losers.map(loser => ({
        ...loser,
        player: playerById.get(loser.summary_pivot as string),
    }))
    
    return (
        <div className="mx-auto max-w-8xl p-6">
            <Tabs
            tabs={[
              {label: 'Regular Season', value: 'regSeason'},
              {label: 'Playoffs', value: 'playoffs'},
            ]}
            activeTab={activeView}
            onChange={setActiveView}
          />
            {isLoadingPlayers ? (
                <div>Loading Data...</div>
            ) : isErrorPlayers ? (
                <div>Error fetching Data</div>
            ) : topPlayers && topPlayers.length > 0 ? (
                <div>
                    <h1 className='text-3xl font-bold mt-10'>Top 12 - Points</h1>
                    <div className="grid grid-cols-3 gap-5 mt-4 p-10 w-425">
                        {sortedPlayers.map((games, index) => (
                            <div className="flex" key={index}>
                                <PlayerCard
                                    player_id={games[0].player_id}
                                    player_name={games[0].player_name}
                                    headshot_url={games[0].headshot_url}
                                    position={games[0].position}
                                    sweater_number={games[0].sweater_number}
                                    team={games[0].team}
                                >
                                    <PlayerSnapshot gamelog={games}/>
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
                                    <PlayerBets
                                        total_bets={players.total_bets}
                                        hits={players.hits}
                                        hit_rate={players.hit_rate}
                                        average_odds={players.average_odds}
                                        profit={players.profit}
                                    >

                                    </PlayerBets>
                                    
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
                                    <PlayerBets
                                        total_bets={players.total_bets}
                                        hits={players.hits}
                                        hit_rate={players.hit_rate}
                                        average_odds={players.average_odds}
                                        profit={players.profit}
                                    >

                                    </PlayerBets>
                                    
                                </PlayerCard>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>No Data Found</div>
            )}
        </div>  
    )
}