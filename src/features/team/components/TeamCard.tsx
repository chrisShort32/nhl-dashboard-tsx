import type { TeamInfo } from "@/features/types";
import { getTeamName } from "@/features/teamNames";
import { Link } from "react-router-dom";

type TeamCardProps = {
    team_info: TeamInfo
}

export function TeamCard({
    team_info
}: TeamCardProps) {

    const team_name = getTeamName(team_info.team_abbrev)
    const record = team_info.team_wins + " - " + team_info.team_losses + " - " + team_info.team_otl
    return (
        <Link to={`/team/${team_info.team_abbrev}`}>
            <div className="flex rounded-lg border w-75">
                <div className="pl-2 bg-black-300 flex">
                    <div className="flex">
                        <img
                            src={team_info.team_logo}
                            alt={`${team_name} logo`}
                            className="w-20 h-20 ml-3"
                        />
                    </div>
                    <div className="mt-3 pl-2">
                        <h2 className="text-lg font-bold">{team_name}</h2>
                        <p className="text-sm text-gray-300">{record}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}