import { useParams } from 'react-router-dom'
import { useGamelog, useBetResults, usePlayerInfo, useBetSummary } from '@/features/queries'
import { PlayerSnapshot } from '@/features/player/components/PlayerSnapshot'
import { PlayerCard } from '@/features/player/components/PlayerCard'
import { DataTable } from '@/components/ui/DataTable'
import { Tabs } from '@/components/ui/Tabs'
import { useState } from 'react'
import { BetSummary } from '@/features/betting/BetSummary'


export function PlayerPage() {
    const { playerId } = useParams<{ playerId: string }>()

    const { data: gamelog, isLoading: isLoadingGamelog, isError: isErrorGamelog } = useGamelog({
      playerId: playerId ? playerId : '1',
      season: '20252026',
      playoffs: 'true'
    })

    const { data: playerInfo, isLoading: isLoadingInfo, isError: isErrorInfo 
    } = usePlayerInfo([playerId ? Number(playerId) : 1])
    
    const { data: betResults, isLoading, isError } = useBetResults({
        playerId: playerId,
        startDate: '2026-04-18',
        endDate: '2026-06-04',
      })

    const { data: betSummaryPlayer, isLoading: isLoadingSummary, isError: isErrorSummary } = useBetSummary({
      pivot: 'player',
      startDate: '2026-04-18',
      endDate: '2026-06-04',
      playerId: playerId,
    })

    return (
      <div className="mx-auto max-w-8xl p-6">  
        {isLoadingInfo ? (
                <div>Loading Player Info...</div>
              ) : isErrorInfo ? (
                <div>No Player Found</div>
              ) : playerInfo && gamelog && betSummaryPlayer? (
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
                    <PlayerSnapshot
                      gamelog={gamelog}
                      playoffs={true}
                    >
                    </PlayerSnapshot>

                    <BetSummary
                        summary_horizon='Bet Results (Playoffs)'
                        total_bets={betSummaryPlayer[0].n_bets}
                        hits={betSummaryPlayer[0].n_hits}
                        hit_rate={betSummaryPlayer[0].hit_rate}
                        profit={betSummaryPlayer[0].total_profit}
                    >

                    </BetSummary>
                  </PlayerCard> 
                </div>
              ) : (
                <div>No Player Found</div>
              )}
        {isLoadingGamelog ? (
          <div>Loading Gamelogs...</div>
        ) : isErrorGamelog ? (
          <div>No Gamelogs Found</div>
        ) : gamelog ? (
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
        ) : (
          <div>No Gamelogs Found</div>
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