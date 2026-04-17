import { useSuggestedBets, useMatchups} from "@/features/queries";
import { DataTable } from '@/components/ui/DataTable'

export function SuggestedBetsPage() {
    const { data: suggestedBets, isLoading: isLoadingSuggested, isError: isErrorSuggested } = useSuggestedBets()
    const { data: matchupInfo } = useMatchups()
    const suggestedBetsDate = matchupInfo?.[0]?.start_time_UTC.slice(0,10) ?? ''
    
    return (
        <div className="mx-auto max-w-8xl p-6">
            {isLoadingSuggested ? (
            <div>Loading Suggested Bets...</div>
            ) : isErrorSuggested ? (
            <div>Error Loading Suggested Bets</div>
            ) : ((suggestedBets && suggestedBets.length > 0) && (matchupInfo && matchupInfo.length > 0) ? ( // lol quick and dirty solve for not displaying yesterdays suggested bets when there are no suggested bets for today.
            <div>
                <h1 className='text-3xl font-bold mt-10'>All Bets Today</h1>
                <DataTable
                link="/suggested"
                header={suggestedBetsDate}
                data={suggestedBets}
                columns= {[
                    {label: 'Player', key: 'player_name'},
                    {label: 'Pos', key: 'position'},
                    {label: 'Team', key: 'team'},
                    {label: 'Opp', key: 'opponent'},
                    {label: 'Bet Type', key: 'bet_type'},
                    {label: 'Bet Line', key: 'threshold'},
                    {label: 'Bet Odds', key: 'bet_odds_d',format: (value) => (value).toFixed(2)},
                    {label: 'Implied Prob', key: 'bet_imp', format: (value) => `${(value * 100).toFixed(1)}%`},
                    {label: 'Model Prob', key: 'bet_p', format: (value) => `${(value * 100).toFixed(1)}%`},
                    {label: 'Edge', key: 'bet_edge', format: (value) => `${(value * 100).toFixed(1)}%`},
                    {label: 'Avg SOG', key: 'plr_pre_avg_shots',format: (value) => (value).toFixed(2)},
                    {label: 'Avg ATT', key: 'plr_pre_avg_att',format: (value) => (value).toFixed(2)},
                    {label: 'SOG L5', key: 'plr_roll5_shots',format: (value) => (value).toFixed(2)},
                    {label: 'ATT L5', key: 'plr_roll5_att',format: (value) => (value).toFixed(2)},
                    {label: 'SOG L10', key: 'plr_roll10_shots',format: (value) => (value).toFixed(2)},
                    {label: 'ATT L10', key: 'plr_roll10_att',format: (value) => (value).toFixed(2)},
                    {label: '2+ L5', key: 'plr_roll5_over2_shots'},
                    {label: '3+ L5', key: 'plr_roll5_over3_shots'},
                    {label: '4+ L5', key: 'plr_roll5_over4_shots'},
                    {label: '2+ L10', key: 'plr_roll10_over2_shots'},
                    {label: '3+ L10', key: 'plr_roll10_over3_shots'},
                    {label: '4+ L10', key: 'plr_roll10_over4_shots'}
                ]}
                rowKey={(row) => row.bet_id}
                />
            </div>
            ) : (
            <div>
                <h1 className='text-3xl font-bold mt-10'>Top Bets Today</h1>
                <h3 className='text-xl font-bold mt-10'>No Bets Today</h3>
            </div>
        ))}
      </div>
    )
}