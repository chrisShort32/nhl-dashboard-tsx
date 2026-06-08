import { TeamCard } from "@/features/team/components/TeamCard"
import type { GameInfo } from "@/features/types"

type MatchupCardProps = {
  gameInfo: GameInfo
}

export function MatchupCard({ gameInfo }: MatchupCardProps) {
  const home = gameInfo.homeTeam
  const away = gameInfo.awayTeam
  const game_utc = gameInfo.startTime as string
  const game_date = new Date(game_utc)
  const day = game_date.toLocaleDateString()
  const time = game_date.toLocaleTimeString()
  const header = day + " - " + time + " - " + gameInfo.venue
  return (
    <div className="rounded-lg border w-160 h-35 mt-4">
      <h2 className="font-bold text-center mt-2">{header}</h2>
      <div className="flex pl-4">
        <div className="pr-2">
          <p className="text-center">Home</p>
          <TeamCard teamInfo={home} />
        </div>
        <h2 className="text-lg font-bold mt-12 pr-2">VS</h2>
        <div>
          <p className="text-center">Away</p>
          <TeamCard teamInfo={away} />
        </div>
      </div>
    </div>
  )
}
