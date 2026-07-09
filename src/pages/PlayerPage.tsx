import { useParams } from "react-router-dom"
import {
  useGamelog,
  useBetResults,
  usePlayerInfo,
  useBetSummary,
} from "@/features/queries"
import { PlayerSnapshot } from "@/features/player/components/PlayerSnapshot"
import { PlayerCard } from "@/features/player/components/PlayerCard"
import { DataTable } from "@/components/ui/DataTable"
import { BetSummary } from "@/features/betting/BetSummary"
import { AsyncSection } from "@/components/ui/AsyncSection"
import { Tabs } from "@/components/ui/Tabs"
import { useState } from "react"

type GamelogView = "regSeason" | "playoffs" | "full"

export function PlayerPage() {
  const { playerId } = useParams<{ playerId: string }>()
  if (!playerId) return <div>No player ID</div>
  
  const [activeView, setActiveView] = useState<GamelogView>("regSeason")
  
  const {
    data: playerInfo,
    isLoading: isLoadingInfo,
    isError: isErrorInfo,
  } = usePlayerInfo([Number(playerId)])
  
  // Gamelogs for regular season, playoffs and all
  const {
    data: gamelogReg,
    isLoading: isLoadingGamelogReg,
    isError: isErrorGamelogReg,
  } = useGamelog({
    playerId: playerId,
    season: "20252026",
    playoffs: "false",
  })
  const {
    data: gamelogPlayoffs,
    isLoading: isLoadingGamelogPlayoffs,
    isError: isErrorGamelogPlayoffs,
  } = useGamelog({
    playerId: playerId,
    season: "20252026",
    playoffs: "true",
  })
  const {
    data: gamelog,
    isLoading: isLoadingGamelog,
    isError: isErrorGamelog,
  } = useGamelog({
    playerId: playerId,
    season: "20252026"
  })

  // Bet results for regular season, playoffs and all
  const {
    data: betResults,
    isLoading: isLoadingResults,
    isError: isErrorResults,
  } = useBetResults({
    playerId: playerId,
  })
  const {
    data: betResultsReg,
    isLoading: isLoadingResultsReg,
    isError: isErrorResultsReg,
  } = useBetResults({
    playerId: playerId,
    playoffs: "false"
  })
  const {
    data: betResultsPlayoffs,
    isLoading: isLoadingResultsPlayoffs,
    isError: isErrorResultsPlayoffs,
  } = useBetResults({
    playerId: playerId,
    playoffs: "true"
  })

  // Bet summaries for regular season, playoffs and all
  const {
    data: betSummaryPlayer,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
  } = useBetSummary({
    pivot: "player",
    playerId: playerId,
  })
  const {
    data: betSummaryPlayerReg,
    isLoading: isLoadingSummaryReg,
    isError: isErrorSummaryReg,
  } = useBetSummary({
    pivot: "player",
    playerId: playerId,
    playoffs: "false"
  })
  const {
    data: betSummaryPlayerPlayoffs,
    isLoading: isLoadingSummaryPlayoffs,
    isError: isErrorSummaryPlayoffs,
  } = useBetSummary({
    pivot: "player",
    playerId: playerId,
    playoffs: "true"
  })

  const gamelogsByView = {
    regSeason: { data: gamelogReg, isLoading: isLoadingGamelogReg, isError: isErrorGamelogReg },
    playoffs: { data: gamelogPlayoffs, isLoading: isLoadingGamelogPlayoffs, isError: isErrorGamelogPlayoffs },
    full: { data: gamelog, isLoading: isLoadingGamelog, isError: isErrorGamelog },
  }

  const betSummariesByView = {
    regSeason: { data: betSummaryPlayerReg, isLoading: isLoadingSummaryReg, isError: isErrorSummaryReg },
    playoffs: { data: betSummaryPlayerPlayoffs, isLoading: isLoadingSummaryPlayoffs, isError: isErrorSummaryPlayoffs },
    full: { data: betSummaryPlayer, isLoading: isLoadingSummary, isError: isErrorSummary },
  }

    const betResultsByView = {
    regSeason: { data: betResultsReg, isLoading: isLoadingResultsReg, isError: isErrorResultsReg },
    playoffs: { data: betResultsPlayoffs, isLoading: isLoadingResultsPlayoffs, isError: isErrorResultsPlayoffs },
    full: { data: betResults, isLoading: isLoadingResults, isError: isErrorResults },
  }


  const activeGamelog = gamelogsByView[activeView]
  const activeSummary = betSummariesByView[activeView]
  const activeResults = betResultsByView[activeView]

  if (!playerId) return <div>No Player ID</div>


  return (
    <div className="mx-auto p-6">
      <AsyncSection
        isLoading={isLoadingInfo}
        isError={isErrorInfo}
        data={playerInfo}
        loadingFallback={<div>Loading Player Info...</div>}
        errorFallback={<div>Error fetching Player Info</div>}
        emptyFallback={<div>No Player Found</div>}
      >

        {(playerInfo) => (
          <PlayerCard playerInfo={playerInfo[0]}>
            <AsyncSection
              isLoading={activeGamelog.isLoading}
              isError={activeGamelog.isError}
              data={activeGamelog.data}
              loadingFallback={<div>Loading Gamelog...</div>}
              errorFallback={<div>Error fetching Gamelog</div>}
              emptyFallback={<div className="p-4">No Gamelog Found</div>}
            >
              {(gamelog) => (
                <PlayerSnapshot gamelog={gamelog}></PlayerSnapshot>
              )}
            </AsyncSection>
            <AsyncSection
              isLoading={activeSummary.isLoading}
              isError={activeSummary.isError}
              data={activeSummary.data}
              loadingFallback={<div>Loading Bet summary...</div>}
              errorFallback={<div>Error fetching summary</div>}
              emptyFallback={<div className="p-4">No Bet summary Found</div>}
            >
              {(betSummaryPlayer) => (
                <BetSummary
                  summaryHorizon="Bet Results"
                  totalBets={betSummaryPlayer[0].nBets}
                  hits={betSummaryPlayer[0].nHits}
                  hitRate={betSummaryPlayer[0].hitRate}
                  profit={betSummaryPlayer[0].totalProfit}
                />
              )}
            </AsyncSection>
          </PlayerCard>
        )}
      </AsyncSection>
        <div className="p-5">
          <Tabs
            tabs={[
            {label: 'Regular Season', value: 'regSeason'},
            {label: 'Playoffs', value: 'playoffs'},
            {label: 'Full', value: 'full'},
            ]}
            activeTab={activeView}
            onChange={setActiveView}
          />
        </div>

      <AsyncSection
        isLoading={activeGamelog.isLoading}
        isError={activeGamelog.isError}
        data={activeGamelog.data}
        loadingFallback={<div>Loading Gamelogs...</div>}
        errorFallback={<div>Error fetching Gamelogs</div>}
        emptyFallback={<div className="p-4">No Gamelogs Found</div>}
      >
        {(gamelog) => (
          <div className="mt-6">
            <DataTable
              header="Gamelogs"
              data={gamelog}
              columns={[
                {
                  label: "Game Date",
                  accessor: (row) => row.game.gameDate,
                  key: "gameDate",
                  className: "font-bold",
                },
                {
                  label: "Opponent",
                  accessor: (row) => row.opponent.abbreviation,
                  key: "opponentAbbrev",
                },
                { label: "G", key: "goals" },
                { label: "A", key: "assists" },
                { label: "PTS", key: "points" },
                { label: "+/-", key: "plusMinus" },
                { label: "Shots", key: "shotsOnGoal" },
                { label: "Shots Blocked", key: "shotAttemptsBlocked" },
                { label: "Shots Missed", key: "shotAttemptsMissed" },
                { label: "Total Shot Att", key: "shotAttemptsTotal" },
                {
                  label: "TOI",
                  key: "toi",
                  format: (value) =>
                    `${Math.floor(Number(value) / 60)}:${String(Number(value) % 60).padStart(2, "0")}`,
                },
              ]}
              rowKey={(row) => String(row.game.id)}
            />
        </div>
        )}
      </AsyncSection>
      <AsyncSection
        isLoading={activeResults.isLoading}
        isError={activeResults.isError}
        data={activeResults.data}
        loadingFallback={<div>Loading Bet Results...</div>}
        errorFallback={<div>Error fetching Bet Results</div>}
        emptyFallback={<div className="p-4">No Bet Results Found</div>}
      >
        {(betResults) => (
          <div className="mt-6">
            <DataTable
              header="Bet Results"
              data={betResults}
              columns={[
                { label: "Game Date", key: "betDate", className: "font-bold" },
                { label: "Opp", key: "oppAbbrev" },
                { label: "Home?", key: "isHome" },
                { label: "Bet Type", key: "betType" },
                { label: "Side", key: "side" },
                { label: "Line", key: "threshold" },
                {
                  label: "Odds (Amer)",
                  key: "betOddsAmerican",
                  format: (value) => `${Number(value).toFixed(0)}`,
                },
                {
                  label: "Odds (Dec)",
                  key: "betOddsDecimal",
                  format: (value) => `${Number(value).toFixed(2)}`,
                },
                {
                  label: "Model Prob",
                  key: "betProbability",
                  format: (value) => `${(Number(value) * 100).toFixed(2)}%`,
                },
                {
                  label: "Implied Prob",
                  key: "betImpliedProbability",
                  format: (value) => `${(Number(value) * 100).toFixed(2)}%`,
                },
                {
                  label: "Edge",
                  key: "betEdge",
                  format: (value) => `${(Number(value) * 100).toFixed(2)}%`,
                },
                { label: "Actual SOG", key: "actualSog" },
                { label: "Hit?", key: "hit" },
                {
                  label: "Profit",
                  key: "profit",
                  format: (value) => `$${Number(value).toFixed(2)}`,
                },
              ]}
              rowKey={(row) => String(row.betDate)}
            />
        </div>
        )}
      </AsyncSection>
    </div>
  )
}
