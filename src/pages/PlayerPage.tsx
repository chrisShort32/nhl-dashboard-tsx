import { useParams } from 'react-router-dom'
import { useGamelog, useBetResults, usePlayerInfo, useBetSummary } from '@/features/queries'
import { PlayerSnapshot } from '@/features/player/components/PlayerSnapshot'
import { PlayerCard } from '@/features/player/components/PlayerCard'
import { DataTable } from '@/components/ui/DataTable'
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
                    playerInfo={playerInfo[0]}
                  >
                    <PlayerSnapshot
                      gamelog={gamelog}
                      playoffs={true}
                    >
                    </PlayerSnapshot>

                    <BetSummary
                        summaryHorizon='Bet Results (Playoffs)'
                        totalBets={betSummaryPlayer[0].nBets}
                        hits={betSummaryPlayer[0].nHits}
                        hitRate={betSummaryPlayer[0].hitRate}
                        profit={betSummaryPlayer[0].totalProfit}
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
                      {label: 'Game Date', accessor: (row) => row.game.gameDate, key: 'gameDate', className: 'font-bold'},
                      {label: 'Opponent', accessor: (row) => row.opponent.abbreviation, key: 'opponentAbbrev'},
                      {label: 'G', key: 'goals'},
                      {label: 'A', key: 'assists'},
                      {label: 'PTS', key: 'points'},
                      {label: '+/-', key: 'plusMinus'},
                      {label: 'Shots', key: 'shotsOnGoal'},
                      {label: 'Shots Blocked', key: 'shotAttemptsBlocked'},
                      {label: 'Shots Missed', key: 'shotAttemptsMissed'},
                      {label: 'Total Shot Att', key: 'shotAttemptsTotal'},
                      {label: 'TOI', key: 'toi', format: (value) => `${Math.floor(Number(value) / 60)}:${String(Number(value) % 60).padStart(2,'0')}`},
                      
                  ]}

                rowKey={(row) => String(row.game.id)}
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
                          {label: 'Game Date', key: 'betDate', className: 'font-bold'},
                          {label: 'Opp', key: 'oppAbbrev'},
                          {label: 'Home?', key: 'isHome'},
                          {label: 'Bet Type', key: 'betType'},
                          {label: 'Side', key: 'side'},
                          {label: 'Line', key: 'threshold'},
                          {label: 'Odds (Amer)', key: 'betOddsAmerican', format: (value) => `${Number(value).toFixed(0)}`},
                          {label: 'Odds (Dec)', key: 'betOddsDecimal', format: (value) => `${Number(value).toFixed(2)}`},
                          {label: 'Model Prob', key: 'betProbability', format: (value) => `${(Number(value)* 100).toFixed(2)}%`},
                          {label: 'Implied Prob', key: 'betImpliedProbability', format: (value) => `${(Number(value) * 100).toFixed(2)}%`},
                          {label: 'Edge', key: 'betEdge', format: (value) => `${(Number(value) * 100).toFixed(2)}%`},
                          {label: 'Actual SOG', key: 'actualSog'},
                          {label: 'Hit?', key: 'hit'},
                          {label: 'Profit', key: 'profit', format: (value) => `$${Number(value).toFixed(2)}`},
                          
                      ]}

                    rowKey={(row) => String(row.betDate)}
                  />
                </div>
              ) : (
                <div>No Results Found</div>
              )}
      </div>
    )}