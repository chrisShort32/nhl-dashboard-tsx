import { useBetSummary, useTeamGamelog } from "@/features/queries"
import { TeamCard } from "@/features/team/components/TeamCard"
import { Tabs } from "@/components/ui/Tabs"
import { DataTable } from "@/components/ui/DataTable"
import { tabDateFilter } from "@/features/betting/utils"
import { useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { BetSummary } from "@/features/betting/BetSummary"
import { AsyncSection } from "@/components/ui/AsyncSection"

export function TeamPage() {
  const { teamId } = useParams<{ teamId: string }>()

  const {
    data: betSummaryTeam,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useBetSummary({
    pivot: "team",
    startDate: "2026-04-18",
    endDate: "2026-06-06",
    teamId: teamId,
  })
  const {
    data: gamelog,
    isLoading: isLoadingGamelog,
    isError: isErrorGamelog,
  } = useTeamGamelog({
    teamId: teamId ? teamId : "1",
    season: "20252026"
  })
  return (
    <div className="mx-auto p-6">
      <AsyncSection
        isLoading={isLoadingGamelog}
        isError={isErrorGamelog}
        data={gamelog}
        loadingFallback={<div>Loading Team Gamelogs...</div>}
        errorFallback={<div>Error fetching Team Gamelogs</div>}
        emptyFallback={<div>No Gamelogs Found</div>}
      >

        {(gamelog) => (
          <div className="mt-6">
            <TeamCard teamInfo={gamelog[0].team} variant="bet">
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
            <DataTable
              header="Gamelogs"
              data={gamelog}
              columns={[
                {
                  label: "Game Date",
                  accessor: (row) => row.game.gameDate,
                  key: "game_date",
                  className: "font-bold",
                },
                {
                  label: "Opponent",
                  accessor: (row) => row.opponent.abbreviation,
                  key: "opponent_abbrev",
                },
                { label: "G", key: "goals" },
                { label: "GA", key: "goalsAgainst" },
                {
                  label: "W/L",
                  key: "win",
                  format: (value) =>
                    value === true ? (value = "W") : (value = "L"),
                },
                { label: "Shots", key: "shotsOnGoal" },
                { label: "Shots Blocked", key: "shotAttemptsBlocked" },
                { label: "Shots Missed", key: "shotAttemptsMissed" },
                { label: "TSA", key: "shotAttemptsTotal" },
                { label: "Shots Against", key: "shotsAgainst" },
                { label: "TSAA", key: "shotAttemptsAgainst" },
                { label: "Blocks", key: "blocks" },
                { label: "pim", key: "pim" },
              ]}
              rowKey={(row) => String(row.game.gameDate)}
            />
          </div>
        )}
      </AsyncSection>
    </div>
  )
}
