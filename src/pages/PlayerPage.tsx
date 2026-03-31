import { useParams } from 'react-router-dom'
import { useGamelog } from '@/features/queries'
import { PlayerSnapshot } from '@/features/player/components/PlayerSnapshot'
import { PlayerCard } from '@/features/player/components/PlayerCard'
import { DataTable } from '@/components/ui/DataTable'
import { Tabs } from '@/components/ui/Tabs'
import { useState } from 'react'

export function PlayerPage() {
    const { playerId } = useParams<{ playerId: string }>()
    const [activeView, setActiveView] = useState('season')
    const { data: gamelog, isLoading: isLoadingGamelog, isError: isErrorGamelog} = useGamelog(playerId || '')
    if (!playerId) {
        return <div>Player ID is Undefined</div>
    }
    
    
    if (isLoadingGamelog) {
      return <div>Loading Player Data...</div>
    }
  
    if (isErrorGamelog) {
      return <div>Error Loading PLayer Data</div>
    }
  
    if (!gamelog || gamelog.length === 0) {
      return <div>No Data Found</div>
    }

    let displayData = gamelog
    if (activeView === 'last5') {
      displayData = gamelog.slice(0,5)
    } else if (activeView === 'last10') {
      displayData = gamelog.slice(0,10)
    } else {
      displayData = gamelog
    }

    
    return (
      <div className="mx-auto max-w-8xl p-6">
        <h1 className="text-2xl font-semibold">NHL Dashboard</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Vite + React + TypeScript + Tailwind v4
        </p>
  
        {displayData && displayData.length > 0 && (
          <div className="flex mt-6">
              <PlayerCard 
                  player_id={displayData[0].player_id}
                  player_name={displayData[0].player_name}
                  headshot_url={displayData[0].headshot_url}
                  position={displayData[0].position}
                  sweater_number={displayData[0].sweater_number}
                  team={displayData[0].team}
                  team_logo={displayData[0].team_logo}
              >
                <PlayerSnapshot gamelog={displayData}/>
              </PlayerCard> 
                <div className='mt-25'>
                <Tabs
                  tabs={[
                    {label: 'Last 5', value: 'last5'},
                    {label: 'Last 10', value: 'last10'},
                    {label: 'Season', value: 'season'}
                  ]}
                  activeTab={activeView}
                  onChange={setActiveView}
                />
                </div>

          
          </div>

  
        )}
        
        {displayData && displayData.length > 0 && (
          <div className="mt-6">
              <DataTable
                  header="Player Stats -- Change this later"
                  data={displayData}
                  columns={[
                      {label: 'Date', key: 'game_date', className: 'font-bold'},
                      {label: 'Opponent', key: 'opponent'},
                      {label: 'G', key: 'goals'},
                      {label: 'A', key: 'assists'},
                      {label: 'PTS', key: 'points'},
                      {label: '+/-', key: 'plus_minus'},
                      {label: 'Shots', key: 'shots_on_goal'},
                      {label: 'Shots Blocked', key: 'shot_attempts_blocked'},
                      {label: 'Shots Missed', key: 'shot_attempts_missed'},
                      {label: 'Total Shot Att', key: 'shot_attempts_total'},
                      {label: 'TOI', key: 'toi'},
                      
                  ]}

                rowKey={(row) => String(row.game_id)}
              />
          </div>
        )}
      </div>
    )}