import { TeamCard } from '@/features/team/components/TeamCard'
import { useBetSummary, useTeamInfo } from '@/features/queries'
import { BetSummary } from '@/features/betting/BetSummary'

export function TeamsHomePage(){
    const { data: betSummaryTeam, isLoading: isLoadingSummary, isError: isErrorSummary } = useBetSummary({
    pivot: 'team',
    startDate: '2026-04-18',
    endDate: '2026-05-29',

  })

  const {data: teamInfo, isLoading: isLoadingInfo, isError: isErrorInfo } = useTeamInfo()

  const teamById = new Map(teamInfo?.map(t => [t.id, t]))

  const teamBets = betSummaryTeam?.flatMap(s => {          
    const team = teamById.get(Number(s.group_key))
    return team ? [{ ...s, team}] : []
  })
    console.log(betSummaryTeam)
    return (
        <div className="mx-auto max-w-8xl p-6">
            {isLoadingSummary ? (
            <div>Loading Team Bet Results...</div>
            ) : isErrorSummary ? (
            <div>Error Loading Suggested Bets</div>
            ) : teamBets && teamBets.length > 0 ? (
                <div>
                <h1 className='text-3xl font-bold mt-10'>Team Bets</h1>
                <div className="grid grid-cols-2 gap-5 mt-4 p-10 w-290">
                    {teamBets.map((teams) => (
                        
                        <div className="flex" key={teams.group_key}>
                            <TeamCard
                                team_info={teams.team}
                                variant={"bet"}
                            >
                                <BetSummary
                                    summary_horizon='Bet Results (Playoffs)'
                                    total_bets={teams.n_bets}
                                    hits={teams.n_hits}
                                    hit_rate={teams.hit_rate}
                                    profit={teams.total_profit}
                                >
                                </BetSummary>
                            </TeamCard>
                        </div>
                    ))}
                </div>
                </div>
            ) : (
            <div>
                <h1 className='text-3xl font-bold mt-10'>Bet Results By Team</h1>
                <h3 className='text-xl font-bold mt-10'>shits fucked</h3>
            </div>   
        )}

        </div> 

        
    )

}