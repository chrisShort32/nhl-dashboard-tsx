import type { TeamInfo } from "@/features/types";
import { getTeamLogo } from "@/features/teamLogos";
import { Link } from "react-router-dom";

type TeamCardProps = {
    team_info: TeamInfo
    children?: React.ReactNode
}

export function TeamCard({
    team_info,
    children
}: TeamCardProps) {

    const teamLogo = getTeamLogo(team_info.abbreviation, "light") // light or dark for logo
    //const record = team_info.team_wins + " - " + team_info.team_losses + " - " + team_info.team_otl
    return (
        <Link to={`/team/${team_info.abbreviation}`}>
            <div className="flex rounded-lg border w-70 h-17 bg-gray-300 items-center hover:bg-indigo-200">
                <img
                    src={teamLogo}
                    alt={`${team_info.full_name} logo`}
                    className="w-20 h-20"
                />
                <div>
                    <h2 className="font-bold">{team_info.full_name}</h2>
                </div>
                {children}
            </div>
        </Link>
    )
}