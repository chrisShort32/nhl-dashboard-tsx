import { MatchupCard } from "./MatchupCard";
import type { MatchupInfo} from "@/features/types";

type SlateCardProps = {
    slate: MatchupInfo[]
}

export function SlateCard({
    slate
}: SlateCardProps) {

    return (
        <div>
            <h1 className="text-3xl font-bold mt-6">Today's Slate</h1>
            <div className="grid grid-cols-2 mt-4 w-340">
                {slate.map((matchup) => (
                    <MatchupCard key={matchup.game_id} matchup_info={matchup} />
                ))}
            </div>
        </div>
    )

}