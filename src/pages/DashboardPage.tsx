import { useBetResults, useSuggestedBets, useMatchups, usePlayerInfo, useBetSummary } from '@/features/queries'
import { tabDateFilter } from '@/features/betting/utils'
import { Tabs } from '@/components/ui/Tabs'
import { useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { SlateCard } from '@/components/ui/SlateCard'
import { PlayerCard } from '@/features/player/components/PlayerCard'
import { PlayerBets } from '@/features/player/components/PlayerBets'



export function DashboardPage() {

  const { 
    data: playerInfo, 
    isLoading: isLoadingInfo, 
    isError: isErrorInfo 
  } = usePlayerInfo([8480069, 8481540, 8484984, 8480336, 8480018, 8473533, 8482702])
  
  
  const { data: betSummaryPlayer, isLoading: isLoadingSummary, isError: isErrorSummary } = useBetSummary({
    pivot: 'player',
    startDate: '2026-04-18',
    endDate: '2026-05-29',

  })

  const playerById = new Map(playerInfo?.map(p => [p.id, p]))

  const playerBets = betSummaryPlayer?.flatMap(s => {          
    const player = playerById.get(s.group_key)
    return player ? [{ ...s, player}] : []
  })

  const { data: matchupInfo, isLoading: isLoadingMatchup, isError: isErrorMatchup } = useMatchups()

  return (
    <div className="mx-auto max-w-8xl p-6">
        <h1 className="text-5xl font-bold text-center">NHL Dashboard</h1>
      {isLoadingMatchup ? (
        <div>Loading Matchup...</div>
      ) : isErrorMatchup ? (
        <div>No Matchups Found</div>
      ) : matchupInfo ? (
        <div>
          <SlateCard
            slate={matchupInfo}
          />
        </div>
      ) : (
        <div>No Matchups Found</div>
      )}
      <div>
      </div>
        
        {isLoadingInfo ? (
            <div>Loading Data...</div>
        ) : isErrorInfo ? (
            <div>Error fetching Data</div>
        ) : playerBets && playerBets.length > 0 ? (
            <div>
                <h1 className='text-3xl font-bold mt-10'>Testing</h1>
                <div className="grid grid-cols-3 gap-5 mt-4 p-10 w-425">
                    {playerBets.map((players, index) => (
                        
                        <div className="flex" key={index}>
                            <PlayerCard
                                player_id={players.player.id}
                                player_name={players.player.full_name}
                                headshot_url={players.player.headshot_url}
                                position={players.player.position}
                                sweater_number={players.player.sweater_number}
                                team_abbreviation={players.player.team_abbreviation}
                                team_name={players.player.team_name}
                            >
                                <PlayerBets
                                    total_bets={players.n_bets}
                                    hits={players.n_hits}
                                    hit_rate={players.hit_rate}
                                    profit={players.total_profit}
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

        {isLoadingSummary ? (
        <div>Loading Bet Results...</div>
      ) : isErrorSummary ? (
        <div>No Bet Results Found</div>
      ) : betSummaryPlayer && betSummaryPlayer.length > 0 ? (
        <div>
          <DataTable
            link="/results"
            header="Bet Results By Player"
            data={betSummaryPlayer}
            columns= {[
              {label: 'Player', key: 'group_label'},
              {label: 'Total Bets', key: 'n_bets'},
              {label: 'Hits', key: 'n_hits'},
              {label: 'Hit Rate', key: 'hit_rate', format: (value) => `${(value * 100).toFixed(1)}%`},
              {label: 'Profit', key: 'total_profit', format: (value) => `$${(value).toFixed(2)}`},

            ]}
            rowKey={(row) => String(row.group_key)}
            rowClassName={(row) => (row.group_key.toString() === 'Total' ? 'font-bold' : '')}
          />
    </div>
      ) : (
        <div>No Bet Results Found</div>
      )}

  </div>
)}
