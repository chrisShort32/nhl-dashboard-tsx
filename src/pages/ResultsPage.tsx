import { useState } from "react"
import type { FilterState } from "@/features/types"
import { useBetResults, useBetSummary, useCumulativeProfit } from "@/features/queries"
import { DataTable } from "@/components/ui/DataTable"
import { AnalysisLineChart } from "@/features/betting/components/AnalysisLineChart"
import { AsyncSection } from "@/components/ui/AsyncSection"
import type { ChartMetaData, TooltipProps } from "@/features/betting/components/AnalysisLineChart"
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


const DATE_RANGE_OPTIONS = [
  { label: "Regular Season", value: "reg"},
  { label: "Playoffs", value: "playoffs" },
  { label: "All", value: "all" },
]

const BET_TYPE_OPTIONS = [
  { label: "Singles", value: "single" },
  { label: "Values", value: "value" },
  { label: "Parlays", value: "parlay" },
  { label: "Unders", value: "under" },
  { label: "All", value: "all" },
]

const THRESHOLD_OPTIONS = [
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5"},
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

function filterToParams(filter: FilterState) {
  return {
    playoffs:
      filter.dateRange === "all" ? undefined
      : filter.dateRange === "playoffs" ? "true"
      : "false",
    betType: filter.typeFilter === "all" ? undefined : filter.typeFilter,
    threshold: filter.thresholdFilter === "all" ? undefined : filter.thresholdFilter,
  }
}

export function ResultsPage() {
  const [filter, setFilter] = useState<FilterState>({dateRange: "all", typeFilter: "all", thresholdFilter: "all"})
  const params = filterToParams(filter)
  const {
    data: thresholdSummary,
    isLoading: isLoadingThreshold,
    isError: isErrorThreshold,
  } = useBetSummary({
    pivot: "threshold",
    ...params
  })

  const {
    data: betTypeSummary,
    isLoading: isLoadingBetType,
    isError: isErrorBetType,
  } = useBetSummary({
    pivot: "bet_type",
    ...params
  })

  const {
    data: betDateSummary,
    isLoading: isLoadingBetDate,
    isError: isErrorBetDate,
  } = useBetSummary({
    pivot: "bet_date",
    ...params
  })

  const {
    data: cumulativeProfit,
    isLoading: isLoadingProfit,
    isError: isErrorProfit,
  } = useCumulativeProfit({
    ...params
  })

  const {
    data: edgeBuckets,
    isLoading: isLoadingEdge,
    isError: isErrorEdge,
  } = useBetSummary({
    pivot: "edge",
    startDate: BET_DATA_DATES.startDate,
    endDate: BET_DATA_DATES.endDate,
    bucketWidth: "0.05"
  })

  const edgeMetaData: ChartMetaData = {
    header: "Edge vs Profit",
    xLabel: "Edge (Model Probability - Implied Probability)",
    yLabel: "Profit",
    xDataType: "percentage",
    yDataType: "currency",
    yField: "totalProfit",
    referenceLine: "horizontal",
    showLine: true
  }

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

  const tooltip: TooltipProps = {
    showHitRate: true
  }
  const betProbProfMetaData: ChartMetaData = {
    header: "Model Probability vs Profit",
    xLabel: "Model Probability",
    yLabel: "Profit",
    xDataType: "percentage",
    yDataType: "currency",
    yField: "totalProfit",
    referenceLine: "diagonal",
    showLine: true,
    
  }

  return (
    <div className="mx-auto max-w-8xl p-6">
      <div className="grid grid-cols-3 mt-5 p-10 w-125 items-center">
        <div className="w-25">
          <label>
            Time Period
            <select
              className="w-30 mt-2 bg-indigo-500"
              onChange={(e) => {
                const selection = e.target.value
                setFilter((prev) => ({
                  ...prev,
                  dateRange: selection as FilterState["dateRange"],
                }))
              }}
              value={filter.dateRange}
            >
              {DATE_RANGE_OPTIONS.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="w-25">
          <label>
            Bet Type
            <select
              className="w-30 mt-2 bg-indigo-500"
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  typeFilter: e.target.value as FilterState["typeFilter"],
                }))
              }}
              value={filter.typeFilter}
            >
              {BET_TYPE_OPTIONS.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="w-25">
          <label>
            Bet Line
            <select
              className="w-30 mt-2 bg-indigo-500"
              onChange={(e) => {
                const raw = e.target.value
                const parsed = raw === "all" ? "all" : Number(raw)
                setFilter((prev) => ({
                  ...prev,
                  thresholdFilter: parsed as FilterState["thresholdFilter"],
                }))
              }}
              value={filter.thresholdFilter}
            >
              {THRESHOLD_OPTIONS.map((item) => (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <AsyncSection
        isLoading={isLoadingProfit}
        isError={isErrorProfit}
        data={cumulativeProfit}
        loadingFallback={<div>Loading Cumulative Profit Chart...</div>}
        errorFallback={<div>Error fetching Cumulative Profit Chart</div>}
        emptyFallback={<div className="p-4">No Cumulative Profit Found</div>}
      >
        {(cumulativeProfit) => (
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
          )}
        </AsyncSection>
        <AsyncSection
          isLoading={isLoadingThreshold}
          isError={isErrorThreshold}
          data={thresholdSummary}
          loadingFallback={<div>Loading Threshold Summary...</div>}
          errorFallback={<div>Error fetching Threshold Summary</div>}
          emptyFallback={<div className="p-4">No Threshold Data Found</div>}
        >
          {(thresholdSummary) => (
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
          )}
        </AsyncSection>
        <AsyncSection
          isLoading={isLoadingBetType}
          isError={isErrorBetType}
          data={betTypeSummary}
          loadingFallback={<div>Loading Bet Type Summary...</div>}
          errorFallback={<div>Error fetching Bet Type Summary</div>}
          emptyFallback={<div className="p-4">No Bet Type Data Found</div>}
        >
          {(betTypeSummary) => (
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
          )}
        </AsyncSection>
        <AsyncSection
          isLoading={isLoadingBetDate}
          isError={isErrorBetDate}
          data={betDateSummary}
          loadingFallback={<div>Loading Bet Date Summary...</div>}
          errorFallback={<div>Error fetching Bet Date Summary</div>}
          emptyFallback={<div className="p-4">No Bet Date Data Found</div>}
        >
          {(betDateSummary) => (
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
          )}
        </AsyncSection>
        <AsyncSection
          isLoading={isLoadingBetP}
          isError={isErrorBetP}
          data={betProbBuckets}
          loadingFallback={<div>Loading Bet Probability Chart...</div>}
          errorFallback={<div>Error fetching Bet Probability Chart</div>}
          emptyFallback={<div className="p-4">No Bet Probability Data Found</div>}
        >
          {(betProbBuckets) => (
            <div>
              <div>
                <AnalysisLineChart
                  metaData={betProbMetaData}
                  data={betProbBuckets}
                />
              </div>
              <div>
                <AnalysisLineChart
                  metaData={betProbProfMetaData}
                  data={betProbBuckets}
                />
              </div>
            </div>
          )}
        </AsyncSection>
        <AsyncSection
          isLoading={isLoadingOdds}
          isError={isErrorOdds}
          data={oddsBuckets}
          loadingFallback={<div>Loading Bet Odds Chart...</div>}
          errorFallback={<div>Error fetching Bet Odds Chart</div>}
          emptyFallback={<div className="p-4">No Bet Odds Data Found</div>}
        >
          {(oddsBuckets) => (
            <div>
              <AnalysisLineChart
                metaData={oddsMetaData}
                data={oddsBuckets}
                tooltipProps={tooltip}
              />
            </div>
          )}
        </AsyncSection>
        <AsyncSection
          isLoading={isLoadingEdge}
          isError={isErrorEdge}
          data={edgeBuckets}
          loadingFallback={<div>Loading Bet Edge Chart...</div>}
          errorFallback={<div>Error fetching Bet Edge Chart</div>}
          emptyFallback={<div className="p-4">No Bet Edge Data Found</div>}
        >
          {(edgeBuckets) => (
            <div>
              <AnalysisLineChart
                metaData={edgeMetaData}
                data={edgeBuckets}
                tooltipProps={tooltip}
              />
            </div>
          )}
        </AsyncSection>
    </div>
  )
}
