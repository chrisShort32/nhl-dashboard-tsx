import { MatchupCard } from "./MatchupCard";
import type { MatchupInfo} from "@/features/types";

type SlateCardProps = {
    slate: MatchupInfo[]
}

export function SlateCard({
    slate
}: SlateCardProps) {

    return (
        <div className="rounded-lg border border-red-500 mt-4 p-4">
            <h1 className="font-bold ">Today's Slate</h1>
            <div className="grid grid-cols-2 mt-4 w-375">
                {slate.map((matchup) => (
                    <MatchupCard key={matchup.game_id} matchup_info={matchup} />
                ))}
            </div>
        </div>
    )

}