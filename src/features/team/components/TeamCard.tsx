import type { TeamInfo } from "@/features/types";
import { getTeamLogo } from "@/features/teamLogos";
import { Link } from "react-router-dom";

type TeamCardProps = {
    team_info: TeamInfo
    variant?: 'bet' | 'matchup'
    children?: React.ReactNode
}

export function TeamCard({
    team_info,
    variant = 'matchup',
    children,
}: TeamCardProps) {

    const teamLogo = getTeamLogo(team_info.abbreviation, "light") // light or dark for logo
    //const record = team_info.team_wins + " - " + team_info.team_losses + " - " + team_info.team_otl
    const base = "flex rounded-lg border bg-gray-300 items-center hover:bg-indigo-200"
    const variants = {
        matchup: {container: "w-70 h-17", group: "flex", logo: "w-20 h-20", name: "font-bold"},
        bet: {container: "w-125 p-2", group: "flex flex-col", logo: "w-30 h-30", name: "font-bold text-xl"}
    }
    const v = variants[variant]

    return (
        <Link to={`/team/${team_info.abbreviation}`}>
            <div className={`${base} ${v.container}`}>
                <div className={v.group}>
                <img
                    src={teamLogo}
                    alt={`${team_info.full_name} logo`}
                    className={v.logo}
                />
                <h2 className={v.name}>{team_info.full_name}</h2>
                </div>
                {children}
            </div>
        </Link>
    )
}