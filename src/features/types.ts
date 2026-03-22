// Core identifiers - used everywhere, always fetch these
export type PlayerGameIdentifiers = {
  season: string
  game_id: string
  game_date: string
  player_id: string
  team_id: string
}

// Player identity - for displaying player cards, rosters, etc.
export type PlayerIdentity = {
  player_name: string
  first_name: string
  last_name: string
  position: string
  sweater_number: number
  headshot_url: string
  team: string
  team_logo: string
}

// Basic box score stats - most common display needs
export type PlayerBoxScore = {
  shots_on_goal: number
  blocked_shots: number
  goals: number
  assists: number
  points: number
  plus_minus: number
  power_play_goals: number
  hits: number
  hits_taken: number
  pim: number
  toi: string
  shifts: number
  giveaways: number
  takeaways: number
  on_pp: number
  on_pk: number;  
}

// Advanced shot metrics - for detailed analytics views
export type PlayerShotMetrics = {
  shot_attempts_total: number
  shot_attempts_blocked: number
  shot_attempts_missed: number
  pp_shots: number
  pp_shots_blocked: number
  pp_shots_missed: number
  pp_attempts_total: number
  pk_shots: number
  pk_shots_blocked: number
  pk_shots_missed: number
  pk_attempts_total: number
}

// Game context - for game summaries, matchup info
export type GameContext = {
  opponent_id: string
  opponent: string
  opponent_logo: string
  is_home: boolean
  team_shots: number
  team_goals: number
  team_shots_against: number
  team_goals_against: number
  team_win: boolean
  team_otl: boolean
  team_loss: boolean
  opponent_win: boolean
  opponent_otl: boolean
  opponent_loss: boolean
  venue_location: string
  venue: string
  start_time_UTC: string
}

// Composed for full game log
export type PlayerGameLog = PlayerGameIdentifiers &
                            PlayerIdentity &
                            PlayerBoxScore &
                            PlayerShotMetrics &
                            GameContext

// bet results - for betting analytics views
export type BetResult =  PlayerGameIdentifiers &{
  player_name: string
  position: string
  team: string
  opponent: string
  is_home: boolean
  game_outcome: 'W' | 'L' | 'OTL'
  team_goals: number
  team_goals_against: number
  toi: string
  pim: number
  actual_sog: number
  shot_attempts_total: number
  bet_type: 'under' | 'single' | 'value' | 'parlay'
  threshold: number 
  bet_p: number
  bet_imp: number
  bet_odds_d: number
  bet_edge: number
  hit: number
  profit: number
}

export type SuggestedBet = PlayerGameIdentifiers & {
  bet_id: string
  player_name: string
  position: string
  team: string
  opponent: string
  is_home: boolean
  bet_type: 'under' | 'single' | 'value' | 'parlay'
  threshold: number
  bet_p: number
  bet_imp: number
  bet_odds_d: number
  bet_edge: number
  plr_pre_avg_shots: number
  plr_pre_avg_att: number
  plr_roll5_shots: number
  plr_roll5_att: number
  plr_roll10_shots: number
  plr_roll10_att: number
  plr_roll5_over2_shots: number
  plr_roll5_over3_shots: number
  plr_roll5_over4_shots: number
  plr_roll10_over2_shots: number
  plr_roll10_over3_shots: number
  plr_roll10_over4_shots: number
}

export type BetResultSummary<T> = {
  summary_pivot: T // whatever we group by - bet type, team, player, etc
  total_bets: number
  hits: number
  hit_rate: number
  average_odds: number
  profit: number
}

export type TeamInfo = {
  team_abbrev: string
  team_logo: string
  team_wins: number
  team_losses: number
  team_otl: number
}

export type MatchupInfo = {
  game_id: number
  home: TeamInfo
  away: TeamInfo
  venue: string
  start_time_UTC: string

}

export type FilterState = {
  dateRange: 0 | 7 | 30 | 90 | 'all'
  typeFilter: 'over' | 'single' | 'value' | 'parlay' | 'under' | 'all'
  thresholdFilter: 2 | 3 | 4 | 5 | 'all'
}
                      
