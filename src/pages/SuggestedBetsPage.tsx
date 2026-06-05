import { useSuggestedBets, useBetSummary } from "@/features/queries"
import { PlayerCard } from '@/features/player/components/PlayerCard'
import { PlayerSuggested } from '@/features/player/components/PlayerSuggested'
import { BetSummary } from '@/features/betting/BetSummary'

export function SuggestedBetsPage() {
    const { data: suggestedBets, isLoading: isLoadingSuggested, isError: isErrorSuggested } = useSuggestedBets()
    const { data: betSummaryPlayer, isLoading: isLoadingSummary, isError: isErrorSummary } = useBetSummary({
          pivot: 'player',
          startDate: '2026-04-18',
          endDate: '2026-06-04',
        })

    const playerById = new Map(suggestedBets?.map(p => [p.player.id, p]))

    const playerBets = betSummaryPlayer?.flatMap(s => {          
        const player = playerById.get(s.group_key)
        return player ? [{ ...s, player}] : []
    })

    console.log(playerBets)
    return (
        <div className="mx-auto max-w-8xl p-6">
            {isLoadingSuggested ? (
            <div>Loading Suggested Bets...</div>
            ) : isErrorSuggested ? (
            <div>Error Loading Suggested Bets</div>
            ) : playerBets && playerBets.length > 0 ? (
                <div>
                <h1 className='text-3xl font-bold mt-10'>All Bets Today</h1>
                <div className="grid grid-cols-1 gap-5 mt-4 p-10 w-425">
                    {playerBets.map((players) => (
                        
                        <div className="flex" key={players.group_key}>
                            <PlayerCard
                                player_id={players.player.player.id}
                                player_name={players.player.player.full_name}
                                headshot_url={players.player.player.headshot_url}
                                position={players.player.player.position}
                                sweater_number={players.player.player.sweater_number}
                                team_abbreviation={players.player.team.abbreviation}
                                team_name={players.player.team.full_name}
                            >
                                <PlayerSuggested
                                    bet_type={players.player.bet_type}
                                    side={players.player.side}
                                    threshold={players.player.threshold}
                                    bet_odds_decimal={players.player.bet_odds_d}
                                    bet_implied_probability={players.player.bet_imp}
                                    bet_probability={players.player.bet_p}
                                    bet_edge={players.player.bet_edge}
                                >
                                </PlayerSuggested>

                                <BetSummary
                                    summary_horizon='Bet Results (Playoffs)'
                                    total_bets={players.n_bets}
                                    hits={players.n_hits}
                                    hit_rate={players.hit_rate}
                                    profit={players.total_profit}
                                >
                                </BetSummary>

                                
                            </PlayerCard>
                        </div>
                    ))}
                </div>
                </div>
            ) : (
            <div>
                <h1 className='text-3xl font-bold mt-10'>Top Bets Today</h1>
                <h3 className='text-xl font-bold mt-10'>No Bets Today</h3>
            </div>   
        )}

        </div> 

      
    )

}