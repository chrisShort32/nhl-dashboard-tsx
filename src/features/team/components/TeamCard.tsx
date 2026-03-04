import { getTeamName } from "@/features/teamNames";
import { Link } from "react-router-dom";

type TeamCardProps = {
    team: string
    team_logo: string
    children?: React.ReactNode
}

export function TeamCard({
    team,
    team_logo,
    children,
}: TeamCardProps) {
    return (
        <Link to={`/team/${team}`}>
            <div className="flex rounded-lg border w-125">
                <div className="pl-6 bg-black-300">
                    <div className="flex items-center">
                        <img
                            src={team_logo}
                            alt={`${getTeamName(team)} logo`}
                            className="w-13 h-13 ml-3"
                        />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">{getTeamName(team)}</h2>
                        <span className="text-sm text-gray-300">{team}</span>
                    </div>
                </div>
                {children}
            </div>
        </Link>
    )
}