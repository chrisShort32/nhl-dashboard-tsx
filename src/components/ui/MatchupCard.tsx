import { TeamCard } from "@/features/team/components/TeamCard";
import type { MatchupInfo } from "@/features/types";

type MatchupCardProps = {
    matchup_info: MatchupInfo
}

export function MatchupCard({
    matchup_info
}: MatchupCardProps) {
    
    const home = matchup_info.home
    const away = matchup_info.away
    const game_utc = matchup_info.start_time_UTC
    const game_date = new Date(game_utc)
    const day = game_date.toLocaleDateString()
    const time = game_date.toLocaleTimeString()
    const header = day + " - " + time + " - " + matchup_info.venue
    return (
        <div className="rounded-lg border w-175 h-45 mt-4 items-center">
            <h2 className="text-lg font-bold text-center mt-2">{header}</h2>
            <div className="flex pl-4">
                <div className="pr-5">
                    <p className="text-center">Home</p>
                    <TeamCard 
                        team_info={home}
                    />
                </div>
                <h2 className="text-lg font-bold mt-12 pr-5">VS</h2>
                <div>
                    <p className="text-center">Away</p>
                    <TeamCard 
                        team_info={away}
                    />
                </div>
            </div>
        </div>
    )
}