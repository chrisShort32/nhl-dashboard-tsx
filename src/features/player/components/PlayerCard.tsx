import defaultHeadshot from '@/assets/default-skater.png'
import { getTeamLogo } from '@/features/teamLogos'
import { Link } from 'react-router-dom'

type PlayerCardProps = {
    player_id: string
    player_name: string
    headshot_url: string
    position: string
    sweater_number: number
    team_abbreviation: string
    team_name: string
    children?: React.ReactNode
    
}

export function PlayerCard({
    player_id,
    player_name,
    headshot_url,
    position,
    sweater_number,
    team_abbreviation,
    team_name,
    children,
}: PlayerCardProps) {
    return (
        <Link to={`/player/${player_id}`}>
            <div className="flex rounded-lg border w-3xl items-center hover:bg-gray-800">
                <div className="pl-6">
                    <div className="flex items-center">
                        <img
                            src={headshot_url || defaultHeadshot}
                            alt={player_name}
                            className="w-30 h-30"
                            onError={(e) => {
                                e.currentTarget.src = defaultHeadshot
                            }}
                        />
                        <div className="mt-4">
                            <p className="text-sm text-gray-300 mr-5"> #{sweater_number} • {position}</p>
                            <img
                                src={`${getTeamLogo(team_abbreviation, "dark")}`}
                                alt={team_name}
                                className="w-13 h-13 ml-3"

                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{player_name}</h2>
                        <span className="text-sm text-gray-300">{team_name} ({team_abbreviation})</span>
                    </div>
                </div>
                {children}
            </div>
        </Link>
    )
}