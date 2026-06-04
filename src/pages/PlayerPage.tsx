import { useParams } from 'react-router-dom'
import { useGamelog, useBetResults, usePlayerInfo } from '@/features/queries'
import { PlayerSnapshot } from '@/features/player/components/PlayerSnapshot'
import { PlayerCard } from '@/features/player/components/PlayerCard'
import { DataTable } from '@/components/ui/DataTable'
import { Tabs } from '@/components/ui/Tabs'
import { useState } from 'react'


export function PlayerPage() {
    const { playerId } = useParams<{ playerId: string }>()
    //const [activeView, setActiveView] = useState('season')
    //const today = new Date()
    //const todayString = today.toISOString().split('T')[0]
    const { 
      data: gamelog, isLoading: isLoadingGamelog, isError: isErrorGamelog } = useGamelog({
      playerId: playerId ? playerId : '1',
      season: '20252026',
      playoffs: 'true'
    })

    
    const { 
      data: playerInfo, 
      isLoading: isLoadingInfo, 
      isError: isErrorInfo 
    } = usePlayerInfo([playerId ? Number(playerId) : 1])
    
    const { data: betResults, isLoading, isError } = useBetResults({
        playerId: playerId,
        startDate: '2026-04-18',
        endDate: '2026-05-29',
    
      })

    

    /* if (!playerId) {
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
    } */
    

    return (
      <div className="mx-auto max-w-8xl p-6">  
        {isLoadingInfo ? (
                <div>Loading Player Info...</div>
              ) : isErrorInfo ? (
                <div>No Player Found</div>
              ) : playerInfo ? (
                <div>
                  <PlayerCard 
                    player_id={playerInfo[0].id}
                    player_name={playerInfo[0].full_name}
                    headshot_url={playerInfo[0].headshot_url}
                    position={playerInfo[0].position}
                    sweater_number={playerInfo[0].sweater_number}
                    team_abbreviation={playerInfo[0].team_abbreviation}
                    team_name={playerInfo[0].team_name}
                  >
                  </PlayerCard> 
                </div>
              ) : (
                <div>No Player Found</div>
              )}
        {gamelog && gamelog.length > 0 && (
          <div className="mt-6">
              <DataTable
                  header="Gamelogs"
                  data={gamelog}
                  columns={[
                      {label: 'Date', key: 'game_date', className: 'font-bold'},
                      {label: 'Opponent', key: 'opponent_abbrev'},
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
        
        {isLoading ? (
                <div>Loading Bet Results...</div>
              ) : isError ? (
                <div>No Results Found</div>
              ) : betResults ? (
                <div className="mt-6">
                  <DataTable
                      header="Bet Results"
                      data={betResults}
                      columns={[
                          {label: 'Date', key: 'bet_date', className: 'font-bold'},
                          {label: 'Opponent', key: 'opp_abbrev'},
                          {label: 'Home?', key: 'is_home'},
                          {label: 'Bet Type', key: 'bet_type'},
                          {label: 'Side', key: 'side'},
                          {label: 'Line', key: 'threshold'},
                          {label: 'Odds (American)', key: 'bet_odds_american', format: (value) => `${value.toFixed(0)}`},
                          {label: 'Odds (Decimal)', key: 'bet_odds_decimal', format: (value) => `${value.toFixed(2)}`},
                          {label: 'Model Probability', key: 'bet_probability', format: (value) => `${(value * 100).toFixed(2)}%`},
                          {label: 'Implied Probability', key: 'bet_implied_probability', format: (value) => `${(value * 100).toFixed(2)}%`},
                          {label: 'Edge', key: 'bet_edge', format: (value) => `${(value * 100).toFixed(2)}%`},
                          {label: 'Actual SOG', key: 'actual_sog'},
                          {label: 'Hit?', key: 'hit'},
                          {label: 'Profit', key: 'profit', format: (value) => `$${value.toFixed(2)}`},
                          
                      ]}

                    rowKey={(row) => String(row.bet_date)}
                  />
                </div>
              ) : (
                <div>No Results Found</div>
              )}
              <div>
              </div>
                
        
        {/* {displayData && displayData.length > 0 && (
          <div className="flex mt-6">
              <PlayerCard 
                  player_id={displayData[0].player_id}
                  player_name={displayData[0].full_name}
                  headshot_url={displayData[0].headshot_url}
                  position={displayData[0].position}
                  sweater_number={displayData[0].sweater_number}
                  team_abbreviation={displayData[0].team_abbreviation}
                  team_name={displayData[0].team_name}
              >
                <PlayerSnapshot gamelog={displayData}/>
              </PlayerCard> 
                <div className='mt-30 p-5'>
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
                  header="Game Logs"
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
        )} */}
      
      </div>
    )}