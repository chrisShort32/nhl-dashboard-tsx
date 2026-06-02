import { useSuggestedBets} from "@/features/queries"
import { PlayerCard } from '@/features/player/components/PlayerCard'
import { PlayerSuggested } from '@/features/player/components/PlayerSuggested'

export function SuggestedBetsPage() {
    const { data: suggestedBets, isLoading: isLoadingSuggested, isError: isErrorSuggested } = useSuggestedBets()
    return (
        <div className="mx-auto max-w-8xl p-6">
            {isLoadingSuggested ? (
            <div>Loading Suggested Bets...</div>
            ) : isErrorSuggested ? (
            <div>Error Loading Suggested Bets</div>
            ) : suggestedBets && suggestedBets.length > 0 ? (
                <div>
                <h1 className='text-3xl font-bold mt-10'>All Bets Today</h1>
                <div className="grid grid-cols-3 gap-5 mt-4 p-10 w-425">
                    {suggestedBets.map((players, index) => (
                        
                        <div className="flex" key={index}>
                            <PlayerCard
                                player_id={players.player.id}
                                player_name={players.player.full_name}
                                headshot_url={players.player.headshot_url}
                                position={players.player.position}
                                sweater_number={players.player.sweater_number}
                                team_abbreviation={players.team.team_abbreviation}
                                team_name={players.team.team_name}
                            >
                                <PlayerSuggested
                                    bet_type={players.bet_type}
                                    side={players.side}
                                    threshold={players.threshold}
                                    bet_odds_decimal={players.bet_odds_d}
                                    bet_implied_probability={players.bet_imp}
                                    bet_probability={players.bet_p}
                                    bet_edge={players.bet_edge}
                                >
                                </PlayerSuggested>
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