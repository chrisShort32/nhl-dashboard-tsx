import type { BetResult } from "../types"

export function tabDateFilter(
  betResults: BetResult[],
  tabValue: string,
): BetResult[] {
  if (betResults.length === 0) return []
  const maxDate = betResults.reduce(
    (max, r) => (r.game_date > max ? r.game_date : max),
    "",
  )
  if (tabValue === "yesterday") {
    const filtered = betResults.filter((result) => result.game_date === maxDate)
    return filtered
  }

  if (tabValue === "lastWeek") {
    const date = new Date(maxDate)
    date.setDate(date.getDate() - 7)
    const fDate = date.toISOString().split("T")[0]
    const filtered = betResults.filter((result) => result.game_date >= fDate)

    return filtered
  }

  if (tabValue === "lastMonth") {
    const date = new Date(maxDate)
    date.setDate(date.getDate() - 30)
    const fDate = date.toISOString().split("T")[0]
    const filtered = betResults.filter((result) => result.game_date >= fDate)

    return filtered
  }

  if (tabValue === "playoffs") {
    const playoffStartDate = "2026-04-18"
    const filtered = betResults.filter(
      (result) => result.game_date >= playoffStartDate,
    )

    return filtered
  }

  if (tabValue === "regSeason") {
    const playoffStartDate = "2026-04-18"
    const filtered = betResults.filter(
      (result) => result.game_date < playoffStartDate,
    )
    return filtered
  }

  return betResults
}
