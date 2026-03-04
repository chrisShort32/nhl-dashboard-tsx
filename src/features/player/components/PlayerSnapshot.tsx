import { calculatePlayerStats } from "@/features/stats/utils";
import type { PlayerGameLog } from "@/features/types";

type PlayerSnapShotProps = {
    gamelog: PlayerGameLog[]
}

export function PlayerSnapshot({ gamelog }: PlayerSnapShotProps) {
    const snapshot = calculatePlayerStats(gamelog)

    return (
        <div className="p-4 ml-15 bg-black-300 rounded-lg">
            <h2 className="text-lg font-bold">{snapshot.snapshotHorizon}</h2>
            <div className="space-y-1 text-sm">
                <p>Goals: {snapshot.goalsTotal} ({snapshot.goalsPerGame.toFixed(2)} p/g)</p>
                <p>Assists: {snapshot.assistsTotal} ({snapshot.assistsPerGame.toFixed(2)} p/g)</p>
                <p>Points: {snapshot.pointsTotal} ({snapshot.pointsPerGame.toFixed(2)} p/g)</p>
                <p>SOG: {snapshot.shotsTotal} ({snapshot.shotsPerGame.toFixed(2)} p/g)</p>
                <p>SATT: {snapshot.shotAttemptsTotal} ({snapshot.shotAttemptsPerGame.toFixed(2)} p/g)</p>
            </div>
        </div>
    )
}