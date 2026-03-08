//import { useGamelog } from '@/features/queries'
import { PlayerCard } from '@/features/player/components/PlayerCard'
import { StatTable } from '@/features/stats/components/StatTable'
import { useParams } from 'react-router-dom'
import { useBetResults } from '@/features/queries'
import { summarizeBetResults } from '@/features/betting/utils'

// Landing page that wires shot-related query data to simple dashboard UI.
export function DashboardPage() {
  
  // Test data for PlayerCard
  const testPlayer = {
    player_id: '8478402',
    player_name: 'Connor McDavid',
    headshot_url: 'https://assets.nhle.com/mugs/nhl/20252026/EDM/8478402.png',
    position: 'C',
    sweater_number: 97,
    team: 'EDM',
    team_logo: 'https://assets.nhle.com/logos/nhl/svg/EDM_light.svg'
  }

  const { data: betResults, isLoading: isLoadingBetResults, isError: isErrorBetResults } = useBetResults()
  
  if (isLoadingBetResults) {
    return <div>Loading Bet Results...</div>
  }

  if (isErrorBetResults) {
    return <div>Error Loading Bet Results</div>
  }

  if (!betResults || betResults.length === 0) {
    return <div>No Bet Results Found</div>
  }

  const betSummaryThreshold = summarizeBetResults<number>(betResults, 'threshold')
  const betSummaryBetType = summarizeBetResults<string>(betResults, 'bet_type')

  return (
    <div className="mx-auto max-w-8xl p-6">
      <h1 className="text-2xl font-semibold ">NHL Dashboard</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Vite + React + TypeScript + Tailwind v4
      </p>

      <div className="mt-6">
        <PlayerCard {...testPlayer} />
      </div>
      {betResults && betResults.length > 0 && (
        <div className="mt-6">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Bet Type</th>
                <th>Total Bets</th>
                <th>Hits</th>
                <th>Hit Rate</th>
                <th>Average Odds</th>
                <th>Profit</th>
              </tr>
            </thead>

            <tbody>
              {betSummaryBetType.map((row) => (
                <tr key={row.summary_pivot}
                className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  <td>{row.summary_pivot}</td>
                  <td>{row.total_bets}</td>
                  <td>{row.hits}</td>
                  <td>{row.hit_rate.toFixed(2)}</td>
                  <td>{row.average_odds.toFixed(2)}</td>
                  <td>{row.profit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
                      
        </div>
      )}
    </div>
  )
}