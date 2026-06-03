import { useBetResults} from '@/features/queries'
import { TeamCard } from '@/features/team/components/TeamCard'
import { TeamBets } from '@/features/team/components/TeamBets'
import { Tabs } from '@/components/ui/Tabs'
import { DataTable } from '@/components/ui/DataTable'
import { tabDateFilter } from '@/features/betting/utils'
import { useMemo, useState } from 'react'

export function TeamPage() {
const { data: betSummaryTeam, isLoading: isLoadingSummary, isError: isErrorSummary } = useBetSummary({
    pivot: 'team',
    startDate: '2026-04-18',
    endDate: '2026-05-29',

  })
   

    return (
        <div className="mx-auto max-w-8xl p-6">
            {teamData && teamData.length > 0 && (
          <div className="mt-6">      
              <DataTable
                link="/results"
                header="Bet Results By Team"
                data={teamData}
                columns= {[
                {label: 'Threshold', key: 'summary_pivot'},
                {label: 'Total Bets', key: 'total_bets'},
                {label: 'Hits', key: 'hits'},
                {label: 'Hit Rate', key: 'hit_rate', format: (value) => `${(value * 100).toFixed(1)}%`},
                {label: 'Avg Odds', key: 'average_odds', format: (value) => (value).toFixed(2)},
                {label: 'Profit', key: 'profit', format: (value) => `$${(value).toFixed(2)}`},

                ]}
                rowKey={(row) => String(row.summary_pivot)}
            />
          </div>
        )}
        </div>
    )
}