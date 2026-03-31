import { 
    ResponsiveContainer, 
    CartesianGrid, 
    Line, 
    LineChart, 
    XAxis, 
    YAxis, 
    Tooltip,
    ReferenceLine
 } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import type { CalibrationResult } from '@/features/types'

type ChartProps = {
    chartType: 'profit' | 'hitRate'
    pivot: 'bet_p' | 'bet_edge'
    data: CalibrationResult[]
    maxBucket: number,
    bucketWidth: number
}


export function AnalysisChart({ chartType, pivot, data, maxBucket } : ChartProps) {
        
    const xLabel = pivot === 'bet_p' ? 'Bet Probability' : 'Bet Edge'
    const yLabel = chartType === 'profit' ? 'Profit' : 'Hit Rate'
    const header = `${xLabel} vs ${yLabel}`
    const diagRefLine = chartType === 'hitRate' && pivot === 'bet_p'
    
    const refLineY = chartType === 'hitRate' ? 0.5 : 0

    // custom tool tip
    const CustomTooltip = ({ active, payload }: TooltipContentProps) => {
        const isVisible = active && payload && payload.length
        if (!isVisible) return null
        
        const point = payload[0].payload as CalibrationResult
                const value = chartType === 'hitRate' ? 
                    `${(point.hitRate * 100).toFixed(2)}%` 
                    : `$${(point.profit).toFixed(2)}`
        return (
            <div className='custom-tooltip' style={{ visibility: isVisible ? 'visible' : 'hidden'}}>
                {isVisible &&
                    <>
                        <p>{`${yLabel}: ${value}`}</p>
                        <p>{`Total Bets: ${point.totalBets}`}</p>
                    </>
                }
            </div>  
        )
    }
  
    
    return (
        <div className='m-5'>
            <h1 className='text-xl font-bold p-5 m-5'>{header}</h1>
            <ResponsiveContainer width='90%' height={500}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray='5 5' stroke='grey'/>
                    <XAxis 
                        dataKey='bucketLowerBound'
                        tickFormatter={(value: number) => {
                            if (value >= maxBucket) return `${(maxBucket * 100).toFixed(1)}%+`
                            return `${(value * 100).toFixed(1)}%`
                        }}
                        tick={{ fontSize: 12, fill: '#ffffff' }}
                        label={{ value: xLabel, position: 'insideBottom', offset: 0, fill: '#ffffff' }}
                        height={60}
                        stroke='#ffffff'
                    />
                    <YAxis
                        domain={[
                        (dataMin: number) => Math.min(0, Number(dataMin.toFixed(2))),
                        (dataMax: number) => Math.max(1, Number(dataMax.toFixed(2)))
                        ]}
                        tickFormatter={(value: number) => {
                            if (chartType === 'profit') return `$${value.toFixed(0)}`
                            return `${(value * 100).toFixed(1)}%`
                        }} 
                        tick={{ fontSize: 12, fill: '#ffffff' }}
                        label={{ value: yLabel, angle: -90, position: 'insideLeft', fill: '#ffffff' }}
                        stroke='#ffffff'
                    />

                    <Tooltip content={CustomTooltip} />
                    {diagRefLine && (
                        <Line 
                            type='monotone'
                            dataKey='bucketLowerBound'
                            stroke='gold'
                            dot={false}
                        />
                    )}
                    {!diagRefLine && (
                        <ReferenceLine y={refLineY} stroke='gold' />
                    )}
                    
                    <Line 
                        type='monotone'
                        dataKey={chartType}
                        stroke='#6366f1'
                        dot={(props) => {
                                    const { cx, cy, payload } = props
                                    const value = chartType === 'hitRate' ? payload.hitRate : payload.profit
                                    const redGreenValue = diagRefLine ? payload.bucketLowerBound : refLineY
                                    const color =  value >= redGreenValue ? '#0ffa26' : '#ef4444'
                                    return <circle cx={cx} cy={cy} r={6} strokeWidth={2} fill={color} />
                                }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}