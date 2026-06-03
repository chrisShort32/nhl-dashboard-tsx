import { TeamCard } from '@/features/team/components/TeamCard'
import { TeamBets } from '@/features/team/components/TeamBets'
import { useBetSummary } from '@/features/queries'

export function TeamsHomePage(){
    const { data: betSummaryTeam, isLoading: isLoadingSummary, isError: isErrorSummary } = useBetSummary({
    pivot: 'team',
    startDate: '2026-04-18',
    endDate: '2026-05-29',

  })
    
    return (
        <div className="mx-auto max-w-8xl p-6">
                   {isLoadingSummary ? (
                   <div>Loading Team Bet Results...</div>
                   ) : isErrorSummary ? (
                   <div>Error Loading Suggested Bets</div>
                   ) : betSummaryTeam && betSummaryTeam.length > 0 ? (
                       <div>
                       <h1 className='text-3xl font-bold mt-10'>All Bets Today</h1>
                       <div className="grid grid-cols-3 gap-5 mt-4 p-10 w-425">
                           {betSummaryTeam.map((teams, index) => (
                               
                               <div className="flex" key={index}>
                                   <TeamCard
                                       player_id={players.player.id}
                                       player_name={players.player.full_name}
                                       headshot_url={players.player.headshot_url}
                                       position={players.player.position}
                                       sweater_number={players.player.sweater_number}
                                       team_abbreviation={players.team.abbreviation}
                                       team_name={players.team.full_name}
                                   >
                                       <TeamBets
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
                       <h1 className='text-3xl font-bold mt-10'>Bet Results By Team</h1>
                       <h3 className='text-xl font-bold mt-10'>No shits fucked</h3>
                   </div>   
               )}
       
               </div> 
       
             
           )
       
       }