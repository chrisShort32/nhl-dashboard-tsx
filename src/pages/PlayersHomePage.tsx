import { useTopPlayers } from '@/features/queries'
import { PlayerSnapshot } from '@/features/player/components/PlayerSnapshot'
import { PlayerCard } from '@/features/player/components/PlayerCard'
import type { PlayerGameLog } from '@/features/types'

export function PlayersHomePage() {
    const { data: topPlayers, isLoading: isLoadingPlayers, isError: isErrorPlayers} = useTopPlayers()
    if (!topPlayers) {
        return (
            <div>shits fucked</div>
        )
    }

    console.log(topPlayers[0])

    return (
        <div>
            {topPlayers.map(games => (
                <PlayerCard
                    key={games[0].player_id}
                    player_id={games[0].player_id}
                    player_name={games[0].player_name}
                    headshot_url={games[0].headshot_url}
                    position={games[0].position}
                    sweater_number={games[0].sweater_number}
                    team={games[0].team}
                    team_logo={games[0].team_logo}
                >
                    <PlayerSnapshot gamelog={games}/>
                </PlayerCard>
            ))}
        </div>
    )
}