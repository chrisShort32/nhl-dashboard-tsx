import type { TeamInfo } from "@/features/types";
import { getTeamLogo } from "@/features/teamLogos";
import { Link } from "react-router-dom";

type TeamCardProps = {
    teamInfo: TeamInfo
    variant?: 'bet' | 'matchup'
    children?: React.ReactNode
}

export function TeamCard({
    teamInfo,
    variant = 'matchup',
    children,
}: TeamCardProps) {

    const teamLogo = getTeamLogo(teamInfo.abbreviation, "light") // light or dark for logo
    //const record = team_info.team_wins + " - " + team_info.team_losses + " - " + team_info.team_otl
    const base = "flex rounded-lg border items-center hover:bg-gray-800"
    const variants = {
        matchup: {container: "w-70 h-17 bg-gray-300", group: "flex", logo: "w-20 h-20", name: "font-bold mt-6"},
        bet: {container: "w-lg p-2", group: "flex-col mr-10", logo: "w-30 h-30", name: "font-bold text-lg"}
    }
    const v = variants[variant]

    return (
        <Link to={`/team/${teamInfo.id}`}>
            <div className={`${base} ${v.container}`}>
                <div className={v.group}>
                    <img
                        src={teamLogo}
                        alt={`${teamInfo.fullName} logo`}
                        className={v.logo}
                    />
                    <h2 className={v.name}>{teamInfo.fullName}</h2>
                </div>
                {children}
            </div>
        </Link>
    )
}