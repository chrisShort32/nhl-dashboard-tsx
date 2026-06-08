/************* 
  Player Types
**************/

// Player identity - for displaying player cards, rosters, etc.
export type PlayerInfo = {
  id: number
  fullName: string
  firstName?: string
  lastName?: string
  position?: string
  sweaterNumber?: number
  headshotUrl?: string
  teamName: string
  teamAbbreviation: string
  teamLogoLight?: string
  teamLogoDark?: string
}

// Game stats for a player
export type PlayerGamelog = {
  game: GameInfo
  team: TeamInfo
  opponent: TeamInfo
  player: PlayerInfo
  shotsOnGoal: number
  shotAttemptsTotal: number
  shotAttemptsBlocked: number
  shotAttemptsMissed: number
  ppShots: number
  ppShotsBlocked: number
  ppShotsMissed: number
  ppAttemptsTotal: number
  pkShots: number
  pkShotsBlocked: number
  pkShotsMissed: number
  pkAttemptsTotal: number
  blocks: number
  goals: number
  assists: number
  points: number
  plusMinus: number
  ppGoals: number
  hits: number
  hitsTaken: number
  pim: number
  toi: string
  shifts: number
  giveaways: number
  takeaways: number
  onPp: number
  onPk: number
  isHome?: boolean
}

/************* 
  Team Types
**************/

// Team information
export type TeamInfo = {
  id: number
  abbreviation: string
  fullName: string
  logoLight?: string
  logoDark?: string
  wins?: number
  losses?: number
  otl?: number
}

// Team level game logs
export type TeamGamelog = {
  team: TeamInfo
  opponent: TeamInfo
  game: GameInfo
  isHome: boolean
  shotsOnGoal: number
  shotAttemptsTotal: number
  shotAttemptsBlocked: number
  shotAttemptsMissed: number
  shotsAgainst: number
  shotAttemptsAgainst: number
  goals: number
  goalsAgainst: number
  blocks: number
  pim: number
  win?: boolean
  loss?: boolean
  otl?: boolean
}

/************* 
  Game Types
**************/

export type GameInfo = {
  id: number
  season: number
  gameDate: string
  homeTeam: TeamInfo
  awayTeam: TeamInfo
  startTime?: string
  venue?: string
  venueLocation?: string
  isPlayoffs?: boolean
}
/**************** 
  API Parameters
*****************/

// Gamelog base
export type GamelogParams = {
  startDate?: string
  endDate?: string
  season?: string
  playoffs?: string
}

export type PlayerGamelogParams = GamelogParams & {
  playerId: string
}

export type TeamGamelogParams = GamelogParams & {
  teamId: string
}

export type BetResultParams = {
  startDate?: string
  endDate?: string
  teamId?: string
  playerId?: string
  betType?: "parlay" | "value" | "single" | "under"
  side?: "over" | "under"
  threshold?: "2" | "3" | "4" | "5"
}

export type SummaryParams = {
  pivot: "threshold" | "side" | "bet_type" | "player" | "team"
  startDate?: string
  endDate?: string
  teamId?: string
  playerId?: string
  betType?: "parlay" | "value" | "single" | "under"
  side?: "over" | "under"
  threshold?: "2" | "3" | "4" | "5"
  limit?: string
  orderBy?: "asc" | "desc"
}

/************* 
  Bet Types
**************/
export type BetMetrics = {
  isHome: boolean
  betType: "under" | "single" | "value" | "parlay"
  side: "over" | "under"
  threshold: number
  betProbability?: number
  betP: number
  betImpliedProbability?: number
  betImp?: number
  betOddsDecimal?: number
  betOddsD: number
  betOddsAmerican?: number
  betOdds?: number
  betEdge: number
}

// bet results - for betting analytics views
export type BetResult = BetMetrics &{
  player: PlayerInfo
  team: TeamInfo
  opponent: TeamInfo
  betDate: string
  actualSog: number
  hit: number
  profit: number
}

export type SuggestedBet = BetMetrics &{
  player: PlayerInfo
  team: TeamInfo
  opponent: TeamInfo
}

export type BetResultSummary<T> = {
  groupKey: T // whatever we group by - bet type, team, player, etc
  groupLabel: string
  nBets: number
  nHits: number
  hitRate: number
  totalProfit: number
}

/************* 
  Unused??
**************/
export type FilterState = {
  dateRange: 0 | 6 | 30 | 90 | "playoffs" | "all"
  typeFilter: "over" | "single" | "value" | "parlay" | "under" | "all"
  thresholdFilter: 2 | 3 | 4 | 5 | 6 | "all" // 6 == 2 and 3 threshold combo
}

export type CalibrationResult = {
  bucketWidth: number
  bucketLowerBound: number
  totalBets: number
  totalHits: number
  hitRate: number
  profit: number
}
