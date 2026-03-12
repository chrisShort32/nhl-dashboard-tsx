import { useBetResults, useSuggestedBets, useMatchups } from '@/features/queries'
import { summarizeBetResults, tabDateFilter } from '@/features/betting/utils'
import { Tabs } from '@/components/ui/Tabs'
import { useState } from 'react'
import { DataTable } from '@/components/ui/DataTable'
import { SlateCard } from '@/components/ui/SlateCard'

// Landing page that wires shot-related query data to simple dashboard UI.
export function DashboardPage() {
  const { data: betResults, isLoading: isLoadingBetResults, isError: isErrorBetResults } = useBetResults()
  const { data: suggestedBets, isLoading: isLoadingSuggested, isError: isErrorSuggested } = useSuggestedBets()
  const { data: matchupInfo, isLoading: isLoadingMatchup, isError: isErrorMatchup } = useMatchups()
  const [activeView, setActiveView] = useState('yesterday')
  
  const filtered = betResults ? tabDateFilter(betResults, activeView) : []
  const betSummaryThreshold = summarizeBetResults<number>(filtered, 'threshold', { includeTotals: true })
  const betSummaryBetType = summarizeBetResults<string>(filtered, 'bet_type', { includeTotals: true })
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
      <div>
        <h1 className='text-3xl font-bold mt-10'>Results Summaries</h1>
        <Tabs
            tabs={[
              {label: 'Yesterday', value: 'yesterday'},
              {label: 'Last Week', value: 'lastWeek'},
              {label: 'Last Month', value: 'lastMonth'}
            ]}
            activeTab={activeView}
            onChange={setActiveView}
          />
      </div>
      {isLoadingBetResults ? (
        <div>Loading Bet Results...</div>
      ) : isErrorBetResults ? (
        <div>No Bet Results Found</div>
      ) : betResults && betResults.length > 0 ? (
        <div>
          <DataTable
            link="/results"
            header="Bet Results By Threshold"
            data={betSummaryThreshold}
            columns= {[
              {label: 'Threshold', key: 'summary_pivot'},
              {label: 'Total Bets', key: 'total_bets'},
              {label: 'Hits', key: 'hits'},
              {label: 'Hit Rate', key: 'hit_rate', format: (value) => `${(value * 100).toFixed(1)}%`},
              {label: 'Avg Odds', key: 'average_odds', format: (value) => (value).toFixed(2)},
              {label: 'Profit', key: 'profit', format: (value) => `$${(value).toFixed(2)}`},

            ]}
            rowKey={(row) => String(row.summary_pivot)}
            rowClassName={(row) => (row.summary_pivot.toString() === 'Total' ? 'font-bold' : '')}
          />
          <DataTable
            link="/results"
            header="Bet Results By Bet Type"
            data={betSummaryBetType}
            columns= {[
              {label: 'Bet Type', key: 'summary_pivot'},
              {label: 'Total Bets', key: 'total_bets'},
              {label: 'Hits', key: 'hits'},
              {label: 'Hit Rate', key: 'hit_rate', format: (value) => `${(value * 100).toFixed(1)}%`},
              {label: 'Avg Odds', key: 'average_odds', format: (value) => (value).toFixed(2)},
              {label: 'Profit', key: 'profit', format: (value) => `$${(value).toFixed(2)}`},

            ]}
            rowKey={(row) => String(row.summary_pivot)}
            rowClassName={(row) => (row.summary_pivot === 'Total' ? 'font-bold' : '')}
          />

        </div>

      ) : (
        <div>No Bet Results Found</div>
      )}
      </div>
        {isLoadingSuggested ? (
          <div>Loading Suggested Bets...</div>
        ) : isErrorSuggested ? (
          <div>Error Loading Suggested Bets</div>
        ) : (suggestedBets && suggestedBets.length > 0  && matchupInfo ? (
          <div>
            <h1 className='text-3xl font-bold mt-10'>Top Bets Today</h1>
            <DataTable
              link="/suggested"
              header={matchupInfo[0].start_time_UTC.slice(0,10)}
              data={suggestedBets.slice(0,10)}
              columns= {[
                {label: 'Player', key: 'player_name'},
                {label: 'Pos', key: 'position'},
                {label: 'Team', key: 'team'},
                {label: 'Opp', key: 'opponent'},
                {label: 'Bet Type', key: 'bet_type'},
                {label: 'Bet Line', key: 'threshold'},
                {label: 'Bet Odds', key: 'bet_odds_d',format: (value) => (value).toFixed(2)},
                {label: 'Implied Prob', key: 'bet_imp', format: (value) => `${(value * 100).toFixed(1)}%`},
                {label: 'Model Prob', key: 'bet_p', format: (value) => `${(value * 100).toFixed(1)}%`},
                {label: 'Edge', key: 'bet_edge', format: (value) => `${(value * 100).toFixed(1)}%`},
                {label: 'Avg SOG', key: 'plr_pre_avg_shots',format: (value) => (value).toFixed(2)},
                {label: 'Avg ATT', key: 'plr_pre_avg_att',format: (value) => (value).toFixed(2)},
                {label: 'SOG L5', key: 'plr_roll5_shots',format: (value) => (value).toFixed(2)},
                {label: 'ATT L5', key: 'plr_roll5_att',format: (value) => (value).toFixed(2)},
                {label: 'SOG L10', key: 'plr_roll10_shots',format: (value) => (value).toFixed(2)},
                {label: 'ATT L10', key: 'plr_roll10_att',format: (value) => (value).toFixed(2)},
                {label: '2+ L5', key: 'plr_roll5_over2_shots'},
                {label: '3+ L5', key: 'plr_roll5_over3_shots'},
                {label: '4+ L5', key: 'plr_roll5_over4_shots'},
                {label: '2+ L10', key: 'plr_roll10_over2_shots'},
                {label: '3+ L10', key: 'plr_roll10_over3_shots'},
                {label: '4+ L10', key: 'plr_roll10_over4_shots'}
              ]}
              rowKey={(row) => row.bet_id}
            />
          </div>
        ) : (
          <div>No Suggested Bets Found</div>
      ))}
    </div>
  )
}
