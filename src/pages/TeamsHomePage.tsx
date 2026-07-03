import { TeamCard } from "@/features/team/components/TeamCard"
import { useBetSummary, useTeamInfo } from "@/features/queries"
import { BetSummary } from "@/features/betting/BetSummary"
import { AsyncSection } from "@/components/ui/AsyncSection"

export function TeamsHomePage() {
  const {
    data: betSummaryTeam,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useBetSummary({
    pivot: "team",
    startDate: "2026-04-18",
    endDate: "2026-05-29",
  })

  const {
    data: teamInfo,
    isLoading: isLoadingInfo,
    isError: isErrorInfo,
  } = useTeamInfo()

  const teamById = new Map(teamInfo?.map((t) => [t.id, t]))

  const teamBets = betSummaryTeam?.flatMap((s) => {
    const team = teamById.get(Number(s.groupKey))
    return team ? [{ ...s, team }] : []
  })
  return (
    <div className="mx-auto p-6">
      <AsyncSection
        isLoading={isLoadingInfo}
        isError={isErrorInfo}
        data={teamBets}
        loadingFallback={<div>Loading Teams...</div>}
        errorFallback={<div>Error fetching Teams</div>}
        emptyFallback={<div>No Teams Found</div>}
      >

        {(teamBets) => (
          <div>
            <h1 className="text-3xl font-bold mt-10">Team Bets</h1>
            <div className="grid grid-cols-2 gap-5 mt-4 p-10 w-290">
              {teamBets.map((teams) => (
                <div className="flex" key={teams.groupKey}>
                  <TeamCard teamInfo={teams.team} variant={"bet"}>
                    <AsyncSection
                      isLoading={isLoadingSummary}
                      isError={isErrorSummary}
                      data={betSummaryTeam}
                    >
                    {(betSummaryTeam) => ( 
                      <BetSummary
                        summaryHorizon="Bet Summary"
                        totalBets={betSummaryTeam[0].nBets}
                        hits={betSummaryTeam[0].nHits}
                        hitRate={betSummaryTeam[0].hitRate}
                        profit={betSummaryTeam[0].totalProfit}
                      />
                    )}
                    </AsyncSection>
                  </TeamCard>
                </div>
              ))}
            </div>
          </div>
        )}
      </AsyncSection>
    </div>
  )
}
