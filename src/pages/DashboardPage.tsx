import { useBetResults, useSuggestedBets, useMatchups, usePlayerInfo } from '@/features/queries'
import { summarizeBetResults, tabDateFilter } from '@/features/betting/utils'
import { Tabs } from '@/components/ui/Tabs'
import { useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { SlateCard } from '@/components/ui/SlateCard'
import { PlayerCard } from '@/features/player/components/PlayerCard'


export function DashboardPage() {

  const { data: playerInfo, isLoading: isLoadingInfo, isError: isErrorInfo } = usePlayerInfo(
    [8480069, 8481540, 8484984, 8480336, 8480018, 8473533, 8482702]
    )
  return (
    <div className="mx-auto max-w-8xl p-6">
        {isLoadingInfo ? (
            <div>Loading Data...</div>
        ) : isErrorInfo ? (
            <div>Error fetching Data</div>
        ) : playerInfo && playerInfo.length > 0 ? (
            <div>
                <h1 className='text-3xl font-bold mt-10'>Testing</h1>
                <div className="grid grid-cols-3 gap-5 mt-4 p-10 w-425">
                    {playerInfo.map((players, index) => (
                        <div className="flex" key={index}>
                            <PlayerCard
                                player_id={players.player_id}
                                player_name={players.full_name}
                                headshot_url={players.headshot_url}
                                position={players.position}
                                sweater_number={players.sweater_number}
                                team_abbreviation={players.team_abbreviation}
                                team_name={players.team_name}
                            >
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
