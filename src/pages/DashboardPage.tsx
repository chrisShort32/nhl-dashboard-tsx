//import { useGamelog } from '@/features/queries'
import { PlayerCard } from '@/features/player/components/PlayerCard'
//import { StatTable } from '@/features/stats/components/StatTable'

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
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold ">NHL Dashboard</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Vite + React + TypeScript + Tailwind v4
      </p>

      <div className="mt-6">
        <PlayerCard {...testPlayer} />
      </div>
    </div>
  )
}
