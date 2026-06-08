import defaultHeadshot from '@/assets/default-skater.png'
import { getTeamLogo } from '@/features/teamLogos'
import { Link } from 'react-router-dom'
import type { PlayerInfo, TeamInfo } from '@/features/types'

type PlayerCardProps = {
    playerInfo: PlayerInfo
    teamInfo?: TeamInfo
    children?: React.ReactNode
    
}

export function PlayerCard({
    playerInfo,
    teamInfo,
    children,
}: PlayerCardProps) {
    if (teamInfo) {
        playerInfo.teamAbbreviation = teamInfo.abbreviation
        playerInfo.teamName = teamInfo.fullName
    }
    return (
        <Link to={`/player/${playerInfo.id}`}>
            <div className="flex rounded-lg border w-3xl items-center hover:bg-gray-800">
                <div className="pl-6">
                    <div className="flex items-center">
                        <img
                            src={playerInfo.headshotUrl || defaultHeadshot}
                            alt={playerInfo.fullName}
                            className="w-30 h-30"
                            onError={(e) => {
                                e.currentTarget.src = defaultHeadshot
                            }}
                        />
                        <div className="mt-4">
                            <p className="text-sm text-gray-300 mr-5"> #{playerInfo.sweaterNumber} • {playerInfo.position}</p>
                            <img
                                src={`${getTeamLogo(playerInfo.teamAbbreviation, "dark")}`}
                                alt={playerInfo.teamName}
                                className="w-13 h-13 ml-3"

                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{playerInfo.fullName}</h2>
                        <span className="text-sm text-gray-300">{playerInfo.teamName} ({playerInfo.teamAbbreviation})</span>
                    </div>
                </div>
                {children}
            </div>
        </Link>
    )
}