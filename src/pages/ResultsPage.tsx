import { useState } from "react"
import type { FilterState } from "@/features/types"
import { useBetResults, useBetSummary, useCumulativeProfit } from "@/features/queries"
import { DataTable } from "@/components/ui/DataTable"
import {
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  BarChart,
  Bar,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts"
import { AnalysisLineChart } from "@/features/betting/components/AnalysisLineChart"
import type { ChartMetaData } from "@/features/betting/components/AnalysisLineChart"

const DATE_RANGE_OPTIONS = [
  { label: "Yesterday", value: 0 },
  { label: "Last 7", value: 6 },
  { label: "Last 30", value: 30 },
  { label: "Last 90", value: 90 },
  { label: "Playoffs", value: "playoffs" },
  { label: "All", value: "all" },
]

const BET_TYPE_OPTIONS = [
  { label: "Overs", value: "over" },
  { label: "Singles", value: "single" },
  { label: "Values", value: "value" },
  { label: "Parlays", value: "parlay" },
  { label: "Unders", value: "under" },
  { label: "All", value: "all" },
]

const THRESHOLD_OPTIONS = [
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "2 and 3", value: 6 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "All", value: "all" },
]

const PLAYOFF_DATES = {
  startDate: "2026-04-18",
  endDate: "2026-06-11",
}

const BET_DATA_DATES = {
  startDate: "2026-01-01",
  endDate: "2026-06-11",
}

export function ResultsPage() {
  //const [filter, setFilter] = useState<FilterState>({dateRange: 'all', typeFilter: 'all', thresholdFilter: 'all'})
  //const today = new Date()
  //const todayString = today.toISOString().split('T')[0]
  const {
    data: thresholdSummary,
    isLoading: isLoadingThreshold,
    isError: isErrorThreshold,
  } = useBetSummary({
    pivot: "threshold",
    startDate: "2026-04-18",
    endDate: "2026-05-29",
  })

  const {
    data: betTypeSummary,
    isLoading: isLoadingBetType,
    isError: isErrorBetType,
  } = useBetSummary({
    pivot: "bet_type",
    startDate: "2026-04-18",
    endDate: "2026-05-29",
  })

  const {
    data: betDateSummary,
    isLoading: isLoadingBetDate,
    isError: isErrorBetDate,
  } = useBetSummary({
    pivot: "bet_date",
    startDate: "2026-04-18",
    endDate: "2026-05-29",
  })

  const {
    data: cumulativeProfit,
    isLoading: isLoadingProfit,
    isError: isErrorProfit,
  } = useCumulativeProfit(
    PLAYOFF_DATES.startDate,
    PLAYOFF_DATES.endDate
  )

  const {
    data: edgeBuckets,
    isLoading: isLoadingEdge,
    isError: isErrorEdge,
  } = useBetSummary({
    pivot: "edge",
    startDate: PLAYOFF_DATES.startDate,
    endDate: PLAYOFF_DATES.endDate,
    bucketWidth: "0.05"
  })

  const {
    data: oddsBuckets,
    isLoading: isLoadingOdds,
    isError: isErrorOdds,
  } = useBetSummary({
    pivot: "odds",
    startDate: BET_DATA_DATES.startDate,
    endDate: BET_DATA_DATES.endDate,
    bucketWidth: "0.1"
  })
  
  const oddsMetaData: ChartMetaData = {
    header: "Odds vs Profit",
    xLabel: "Odds (Decimal)",
    yLabel: "Profit",
    xDataType: "decimal",
    yDataType: "currency",
    yField: "totalProfit",
    referenceLine: "horizontal",
    showLine: true
  }

  const {
    data: betProbBuckets,
    isLoading: isLoadingBetP,
    isError: isErrorBetP,
  } = useBetSummary({
    pivot: "bet_probability",
    startDate: BET_DATA_DATES.startDate,
    endDate: BET_DATA_DATES.endDate,
    bucketWidth: "0.025"
  })
    const betProbMetaData: ChartMetaData = {
    header: "Model Probability vs Hit Rate",
    xLabel: "Model Probability",
    yLabel: "Hit Rate",
    xDataType: "percentage",
    yDataType: "percentage",
    yField: "hitRate",
    referenceLine: "diagonal",
    showLine: false
  }

    const betProbProfMetaData: ChartMetaData = {
    header: "Model Probability vs Profit",
    xLabel: "Model Probability",
    yLabel: "Profit",
    xDataType: "percentage",
    yDataType: "currency",
    yField: "totalProfit",
    referenceLine: "diagonal",
    showLine: true
  }


  return (
    <div className="mx-auto max-w-8xl p-6">
      
      {isLoadingProfit? (
        <div>Loading Cumulative Profit...</div>
      ) : isErrorProfit ? (
        <div>Error fetching profit data</div>
      ) : cumulativeProfit && cumulativeProfit.length > 0? (
        <div className="ml-5">
          <h1 className="text-3xl font-bold p-5 m-5">Profit Over Time</h1>
          <ResponsiveContainer width="90%" height={500}>
            <LineChart data={cumulativeProfit} title={"Profit Over Time"}>
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis
                dataKey="betDate"
                tick={{ fontSize: 12, fill: "#ffffff" }}
                label={{
                  value: "Date",
                  position: "insideBottom",
                  offset: 0,
                  fill: "#ffffff",
                }}
                height={60}
                stroke="#ffffff"
              />
              <YAxis
                domain={[
                  (dataMin: number) => Math.min(-5, dataMin - 1),
                  (dataMax: number) => Math.max(5, dataMax + 1),
                ]}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                tick={{ fontSize: 12, fill: "#ffffff" }}
                label={{
                  value: "Profit ($)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#ffffff",
                }}
                stroke="#ffffff"
              />
              <Tooltip
                formatter={(value) => [`$${(Number(value).toFixed(2))}`, "Cumulative Profit"]}
              />

              <Line
                type="monotone"
                dataKey="cumulativeProfit"
                stroke="#6366f1"
                dot={(props) => {
                  const { cx, cy, payload } = props
                  const color = payload.cumulativeProfit >= 0 ? "#0ffa26" : "#ef4444"
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      strokeWidth={2}
                      fill={color}
                    />
                  )
                }}
              />
              <ReferenceLine
                y={0}
                stroke="gold"
                label={{ fill: "white", value: "Break Even" }}
              />
            </LineChart>
          </ResponsiveContainer>
          </div>
        ) : (
            <div>Summary not found</div>
      )}
      {isLoadingThreshold ? (
              <div>Loading Summary...</div>
            ) : isErrorThreshold ? (
              <div>Error fetching summary</div>
            ) : thresholdSummary && thresholdSummary.length > 0 ? (
              <div>
                <DataTable
                  link="/results"
                  header="Bet Results By Threshold"
                  data={thresholdSummary}
                  columns={[
                    { label: "Threshold", key: "groupLabel" },
                    { label: "Total Bets", key: "nBets" },
                    { label: "Hits", key: "nHits" },
                    {
                      label: "Hit Rate",
                      key: "hitRate",
                      format: (value) => `${(Number(value) * 100).toFixed(1)}%`,
                    },
                    {
                      label: "Profit",
                      key: "totalProfit",
                      format: (value) => `$${Number(value).toFixed(2)}`,
                    },
                  ]}
                  rowKey={(row) => String(row.groupKey)}
                  rowClassName={(row) =>
                    row.groupKey.toString() === "Total" ? "font-bold" : ""
                  }
                />
              </div>
            ) : (
              <div>Summary not found</div>
            )}
            {isLoadingBetType ? (
              <div>Loading Summary...</div>
            ) : isErrorBetType ? (
              <div>Error fetching summary</div>
            ) : betTypeSummary && betTypeSummary.length > 0 ? (
              <div>
                <DataTable
                  link="/results"
                  header="Bet Results By Bet Type"
                  data={betTypeSummary}
                  columns={[
                    { label: "Threshold", key: "groupLabel" },
                    { label: "Total Bets", key: "nBets" },
                    { label: "Hits", key: "nHits" },
                    {
                      label: "Hit Rate",
                      key: "hitRate",
                      format: (value) => `${(Number(value) * 100).toFixed(1)}%`,
                    },
                    {
                      label: "Profit",
                      key: "totalProfit",
                      format: (value) => `$${Number(value).toFixed(2)}`,
                    },
                  ]}
                  rowKey={(row) => String(row.groupKey)}
                  rowClassName={(row) =>
                    row.groupKey.toString() === "Total" ? "font-bold" : ""
                  }
                />
              </div>
            ) : (
              <div>Summary not found</div>
            )}
            {isLoadingBetDate ? (
              <div>Loading Summary...</div>
            ) : isErrorBetDate ? (
              <div>Error fetching summary</div>
            ) : betDateSummary && betDateSummary.length > 0 ? (
              <div>
                <DataTable
                  link="/results"
                  header="Bet Results By Date"
                  data={betDateSummary}
                  columns={[
                    { label: "Date", key: "groupLabel" },
                    { label: "Total Bets", key: "nBets" },
                    { label: "Hits", key: "nHits" },
                    {
                      label: "Hit Rate",
                      key: "hitRate",
                      format: (value) => `${(Number(value) * 100).toFixed(1)}%`,
                    },
                    {
                      label: "Profit",
                      key: "totalProfit",
                      format: (value) => `$${Number(value).toFixed(2)}`,
                    },
                  ]}
                  rowKey={(row) => String(row.groupKey)}
                  rowClassName={(row) =>
                    row.groupKey.toString() === "Total" ? "font-bold" : ""
                  }
                />
              </div>
            ) : (
              <div>Summary not found</div>
            )}
            {isLoadingBetP ? (
              <div>Loading Bet Probability Chart...</div>
            ) : isErrorBetP ? (
              <div>Error fetching Bet Probability data</div>
            ) : betProbBuckets && betProbBuckets.length > 0 ? (
              <div>
                <AnalysisLineChart
                  metaData={betProbMetaData}
                  data={betProbBuckets}
                  
                />
              </div>
            ) : (
              <div>Bet Probability data not found</div>
            )}
            {isLoadingBetP ? (
              <div>Loading Bet Probability Chart...</div>
            ) : isErrorBetP ? (
              <div>Error fetching Bet Probability data</div>
            ) : betProbBuckets && betProbBuckets.length > 0 ? (
              <div>
                <AnalysisLineChart
                  metaData={betProbProfMetaData}
                  data={betProbBuckets}
                  
                />
              </div>
            ) : (
              <div>Bet Probability data not found</div>
            )}
            {isLoadingOdds ? (
              <div>Loading Odds Chart...</div>
            ) : isErrorOdds ? (
              <div>Error fetching Odds data</div>
            ) : oddsBuckets && oddsBuckets.length > 0 ? (
              <div>
                <AnalysisLineChart
                  metaData={oddsMetaData}
                  data={oddsBuckets}
                  
                />
              </div>
            ) : (
              <div>Odds data not found</div>
            )}
    </div>
  )
}
