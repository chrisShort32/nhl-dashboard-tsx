import {
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts"
import type { TooltipContentProps } from "recharts"
import type { BetResultSummary } from "@/features/types"

export type ChartMetaData = {
    header: string
    xLabel: string
    yLabel: string
    xDataType: "currency" | "percentage" | "decimal"
    yDataType: "currency" | "percentage" | "decimal"
    yField: "totalProfit" | "hitRate"
    referenceLine: "diagonal" | "horizontal" | "none"
    showLine: boolean 
}

export type TooltipProps = {
    showHitRate: boolean
}
type ChartProps = {
    data: BetResultSummary<string>[]
    metaData: ChartMetaData
    tooltipProps?: TooltipProps
    
}



function formatByType(value: number, type: ChartMetaData["xDataType"]): string {
    switch (type) {
        case "currency": return `$${value.toFixed(2)}`
        case "percentage": return `${(value * 100).toFixed(1)}%`
        case "decimal": return `${Number(value).toFixed(2)}`
    }
}

export function AnalysisLineChart({
    data,
    metaData,
    tooltipProps,
}: ChartProps) {
    
    // Custom tool tip
    const CustomTooltip = ({ active, payload}: TooltipContentProps) => {
        const isVisible = active && payload && payload.length
            if (!isVisible) return null

        const point = payload[0].payload as BetResultSummary<string>
        const value = formatByType(point[metaData.yField], metaData.yDataType)
        return (
            <div 
                className="custom-tooltip"
                style={{ visibility: isVisible ? "visible" : "hidden" }}
            >
                {isVisible && (
                    <>
                        <p>{`${metaData.yLabel}: ${value}`}</p>
                        <p>{`Total Bets: ${point.nBets}`}</p>
                    </>
                )}
                {tooltipProps?.showHitRate && (
                    <>
                        <p>{`Hit Rate: ${(point.hitRate * 100).toFixed(2)}%`}</p>
                    </>
                )}
            </div>
        )
    }

    return (
        <div className="m-5">
            <h1 className="text-xl font-bold p-5 m-5">{metaData.header}</h1>
            <ResponsiveContainer width="90%" height={500}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="5 5" stroke="grey" />
                    <XAxis
                        dataKey="groupKey"
                        tickFormatter={(value) => formatByType(value, metaData.xDataType)}
                        tick={{ fontSize: 12, fill: "#ffffff" }}
                        label={{
                            value: metaData.xLabel,
                            position: "insideBottom",
                            offset: 0,
                            fill: "#ffffff", 
                        }}
                        height={60}
                        stroke="#ffffff"
                    />
                    <YAxis
                        domain={[
                            (dataMin: number) => metaData.yDataType === "percentage" ? 0 : Math.floor(Number(dataMin.toFixed(2))),
                            (dataMax: number) => metaData.yDataType === "percentage" ? 1 : Math.ceil(Number(dataMax.toFixed(2))),
                            
                        ]}
                        tickFormatter={(value) => formatByType(value, metaData.yDataType)}
                            
                        tick={{ fontSize: 12, fill: "#ffffff" }}
                        label={{
                            value: metaData.yLabel,
                            angle: -90,
                            position: "insideLeft",
                            fill: "#ffffff",
                        }}
                        stroke="#ffffff"
                    />
                    <Tooltip content={CustomTooltip} />
                    {metaData.referenceLine === "diagonal" && (
                        <Line
                            type="linear"
                            dataKey="groupKey"
                            stroke="gold"
                            dot={false}
                        />
                    )}
                    {metaData.referenceLine === "horizontal" && (
                        <ReferenceLine 
                            y={metaData.yDataType === "currency" ? 0 : 0.5 } // think about this more is it always 0.5 when not currency?
                            stroke="gold"
                        />
                    )}
                    <Line
                        type="linear"
                        dataKey={metaData.yField}
                        stroke={metaData.showLine ? "#6366f1" : "none"}
                        dot={(props) => {
                            const { cx, cy, payload } = props
                            // encode dots for sizing
                            const SCALE = 0.5
                            const r = Math.max(2, Math.sqrt(payload.nBets) * SCALE)
                            const value = 
                                metaData.yField === "totalProfit" ? payload.totalProfit : payload.hitRate
                            const redGreenValue = metaData.referenceLine === "diagonal"
                                ? payload.groupKey
                                : metaData.yDataType === "currency" ? 0 : 0.5
                            const color = value >= redGreenValue ? "#0ffa26" : "#ef4444"
                            return (
                                <circle cx={cx} cy={cy} r={r} strokeWidth={2} fill={color} />
                            )
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}