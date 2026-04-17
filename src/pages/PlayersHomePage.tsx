import { useTopPlayers } from '@/features/queries'
import { PlayerSnapshot } from '@/features/player/components/PlayerSnapshot'
import { PlayerCard } from '@/features/player/components/PlayerCard'
import type { PlayerGameLog } from '@/features/types'

export function PlayersHomePage() {
    const { data: topPlayers, isLoading: isLoadingPlayers, isError: isErrorPlayers} = useTopPlayers()
    if (!topPlayers) {
        return (
            <div>No Data</div>
        )
    }

    const sortedPlayers = [...topPlayers].sort((a,b) => {
        const totalA = a.reduce((sum, game) => sum + game.points, 0)
        const totalB = b.reduce((sum, game) => sum + game.points, 0)
        return totalB - totalA
    })

    return (
        <div className="grid grid-cols-2 gap-4 mt-4 w-340">
            {sortedPlayers.map((games, index) => (
                <div className="flex" key={index}>
                    <h2 className="text-3xl mt-10 p-4">{index + 1}</h2>
                    <PlayerCard
                        player_id={games[0].player_id}
                        player_name={games[0].player_name}
                        headshot_url={games[0].headshot_url}
                        position={games[0].position}
                        sweater_number={games[0].sweater_number}
                        team={games[0].team}
                    >
                        <PlayerSnapshot gamelog={games}/>
                    </PlayerCard>
                </div>
            ))}
        </div>
    )
}