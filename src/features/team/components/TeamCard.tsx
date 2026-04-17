import type { TeamInfo } from "@/features/types";
import { getTeamName } from "@/features/teamNames";
import { getTeamLogo } from "@/features/teamLogos";
import { Link } from "react-router-dom";

type TeamCardProps = {
    team_info: TeamInfo
}

export function TeamCard({
    team_info
}: TeamCardProps) {

    const team_name = getTeamName(team_info.team_abbrev)
    const teamLogo = getTeamLogo(team_info.team_abbrev, "light") // light or dark for logo
    const record = team_info.team_wins + " - " + team_info.team_losses + " - " + team_info.team_otl
    return (
        <Link to={`/team/${team_info.team_abbrev}`}>
            <div className="flex rounded-lg border w-70 h-17 bg-gray-300 items-center hover:bg-indigo-200">
                <img
                    src={teamLogo}
                    alt={`${team_name} logo`}
                    className="w-20 h-20"
                />
                <div>
                    <h2 className="font-bold">{team_name}</h2>
                    <p className="text-sm">{record}</p>
                </div>
            
            </div>
        </Link>
    )
}