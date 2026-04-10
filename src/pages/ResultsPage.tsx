import { useState } from 'react'
import type { FilterState } from '@/features/types'
import { useBetResults } from '@/features/queries'
import { DataTable } from '@/components/ui/DataTable' 
import { applyFilters, calibration, computeCumulativeProfit, summarizeBetResults } from '@/features/betting/utils'
import { ResponsiveContainer, CartesianGrid, Line, LineChart, BarChart, Bar, Legend, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'
import { AnalysisChart } from '@/features/betting/components/AnalysisChart'

const DATE_RANGE_OPTIONS = [
    { label: 'Yesterday', value: 0 },
    { label: 'Last 7', value: 6 },
    { label: 'Last 30', value: 30},
    { label: 'Last 90', value: 90 },
    { label: 'All', value: 'all' }
]

const BET_TYPE_OPTIONS = [
    { label: 'Overs', value: 'over' },
    { label: 'Singles', value: 'single' },
    { label: 'Values', value: 'value' },
    { label: 'Parlays', value: 'parlay' },
    { label: 'Unders', value: 'under' },
    { label: 'All', value: 'all' }
]

const THRESHOLD_OPTIONS = [
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '2 and 3', value: 6},
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: 'All', value: 'all' }
]


export function ResultsPage() {
    const [filter, setFilter] = useState<FilterState>({dateRange: 'all', typeFilter: 'all', thresholdFilter: 'all'})
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    const {data: betResults, isLoading, isError} = useBetResults('01-01-2026', todayString)
    const filtered = betResults ? applyFilters(betResults, filter) : []
    
    // calibration data
    const CALIBRATION_MAX = 0.70 // max bet_p for buckets
    const CALIBRATION_BUCKET_WIDTH = 0.05
    const calibrationFilter = { ...filter, dateRange: 'all' as const }
    const calibrationData = betResults ? applyFilters(betResults, calibrationFilter) : []
    const calibrationBuckets = calibration(calibrationData, CALIBRATION_BUCKET_WIDTH, CALIBRATION_MAX, 'bet_p')
    
    // edge data
    const EDGE_MAX = 0.20 // max edge for buckets
    const EDGE_BUCKET_WIDTH = 0.025
    const edgeBuckets = calibration(calibrationData, EDGE_BUCKET_WIDTH, EDGE_MAX, 'edge')
    
    // data for the profit line graph
    const chartData = computeCumulativeProfit(filtered)
    const betSummaryThreshold = summarizeBetResults<number>(filtered, 'threshold', { includeTotals: true })
    const betSummaryBetType = summarizeBetResults<string>(filtered, 'bet_type', { includeTotals: true })
    
    // summary of bet types by threshold together
    const compoundSummary = summarizeBetResults<string, 'threshold' | 'bet_type'>(filtered, (r) => `${r.threshold}|${r.bet_type}`, { additionalFields: ['threshold', 'bet_type']})
    const chartsByThreshold = new Map<number, typeof compoundSummary>()
    compoundSummary.forEach((result) => {
        const threshold = result.threshold ?? 0

        if (!chartsByThreshold.has(threshold)) {
            chartsByThreshold.set(threshold,[result])
        }
        else {
            chartsByThreshold.get(threshold)?.push(result)
        }
    })
    const maxBets = Math.max(...compoundSummary.map(r => r.total_bets))

    return (
        <div className="mx-auto max-w-8xl p-6">
            <div className='grid grid-cols-3 mt-5 p-10 w-125 items-center'>
                <div className='w-25'>
                    <label>Time Period
                    <select
                     className='w-30 mt-2 bg-indigo-500' 
                     onChange={(e) => {
                        const raw = e.target.value
                        const parsed = raw === 'all' ? 'all' : Number(raw)
                        setFilter(prev => ({ ...prev, dateRange: parsed as FilterState['dateRange']}))}}
                     value={filter.dateRange}
                    >
                        {DATE_RANGE_OPTIONS.map((item) => (
                            <option key={item.label} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    </label>
                </div>
                <div className='w-25'>
                    <label>Bet Type
                    <select
                     className='w-30 mt-2 bg-indigo-500' 
                     onChange={(e) => {
                        setFilter(prev => ({ ...prev, typeFilter: e.target.value as FilterState['typeFilter']}))}}
                     value={filter.typeFilter}
                    >
                        {BET_TYPE_OPTIONS.map((item) => (
                            <option key={item.label} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    </label>
                </div>
                <div className='w-25'>
                    <label>Bet Line
                    <select
                     className='w-30 mt-2 bg-indigo-500' 
                     onChange={(e) => {
                        const raw = e.target.value
                        const parsed = raw === 'all' ? 'all' : Number(raw)
                        setFilter(prev => ({ ...prev, thresholdFilter: parsed as FilterState['thresholdFilter']}))}}
                     value={filter.thresholdFilter}
                    >
                        {THRESHOLD_OPTIONS.map((item) => (
                            <option key={item.label} value={item.value}>{item.label}</option>
                        ))}
                    </select>
                    </label>
                </div>

            </div>
            {isLoading ? (
                <div>Loading Data...</div>
            ) : isError ? (
                <div>Error fetching Data</div>
            ) : chartData ? (
                <div className='ml-5'>
                    <h1 className='text-3xl font-bold p-5 m-5'>Profit Over Time</h1>
                    <ResponsiveContainer width="90%" height={500}>
                        <LineChart data={chartData} title={"Profit Over Time"}>
                            <CartesianGrid strokeDasharray="5 5" />
                            <XAxis 
                                dataKey="game_date" 
                                tick={{ fontSize: 12, fill: '#ffffff' }}
                                label={{ value: 'Date', position: 'insideBottom', offset: 0, fill: '#ffffff' }}
                                height={60}
                                stroke='#ffffff'
                            />
                            <YAxis
                                domain={[
                                    (dataMin: number) => Math.min(-5, dataMin - 1),
                                    (dataMax: number) => Math.max(5, dataMax + 1)
                                ]} 
                                tickFormatter={(value) => `$${value.toFixed(0)}`}
                                tick={{ fontSize: 12, fill: '#ffffff' }}
                                label={{ value: 'Profit ($)', angle: -90, position: 'insideLeft', fill: '#ffffff' }}
                                stroke='#ffffff'
                            />
                            <Tooltip formatter={(value) => [value, "Cumulative Profit ($)"]} />

                            <Line 
                                type="monotone" 
                                dataKey="cum_profit" 
                                stroke="#6366f1" 
                                dot={(props) => {
                                    const { cx, cy, payload } = props
                                    const color = payload.cum_profit >= 0 ? '#0ffa26' : '#ef4444'
                                    return <circle cx={cx} cy={cy} r={6} strokeWidth={2} fill={color} />
                                }} />
                            <ReferenceLine y={0} stroke="gold" label={{fill: 'white', value: "Break Even"}}/>
                        </LineChart>
                    </ResponsiveContainer>
                    <DataTable
                    link="/results"
                    header="Bet Results By Threshold"
                    data={betSummaryThreshold}
                    columns= {[
                        {label: 'Threshold', key: 'summary_pivot'},
                        {label: 'Total Bets', key: 'total_bets'},
                        {label: 'Hits', key: 'hits'},
                        {label: 'Hit Rate', key: 'hit_rate', format: (value) => `${(value * 100).toFixed(1)}%`},
                        {label: 'Avg Odds', key: 'average_odds', format: (value) => (value).toFixed(2)},
                        {label: 'Profit', key: 'profit', format: (value) => `$${(value).toFixed(2)}`},
        
                    ]}
                    rowKey={(row) => String(row.summary_pivot)}
                    rowClassName={(row) => (row.summary_pivot.toString() === 'Total' ? 'font-bold' : '')}
                    />
                    <DataTable
                    link="/results"
                    header="Bet Results By Bet Type"
                    data={betSummaryBetType}
                    columns= {[
                        {label: 'Bet Type', key: 'summary_pivot'},
                        {label: 'Total Bets', key: 'total_bets'},
                        {label: 'Hits', key: 'hits'},
                        {label: 'Hit Rate', key: 'hit_rate', format: (value) => `${(value * 100).toFixed(1)}%`},
                        {label: 'Avg Odds', key: 'average_odds', format: (value) => (value).toFixed(2)},
                        {label: 'Profit', key: 'profit', format: (value) => `$${(value).toFixed(2)}`},
        
                    ]}
                    rowKey={(row) => String(row.summary_pivot)}
                    rowClassName={(row) => (row.summary_pivot === 'Total' ? 'font-bold' : '')}
                    />
                    <h1 className='text-3xl font-bold p-5 mt-10'>Breakdown By Threshold</h1>
                    <div className='grid grid-cols-2 gap-4 w-250'>
                        {[...chartsByThreshold.entries()].map(([threshold, data]) => {
                            const barData = data.map(row => ({
                                threshold: threshold,
                                bet_type: row.bet_type,
                                total_hits: row.hits,
                                total_misses: (row.total_bets - row.hits),
                                hit_rate: row.hit_rate
                            
                        }))
                        if (threshold === 2) console.log('barData for threshold 2:', JSON.stringify(barData))
                        
                        return (
                        <div key={threshold}>
                            <h2 className='text-xl font-bold m-5'>{`Bet Line Threshold ${threshold}`}</h2>
                            <ResponsiveContainer
                                height={400}
                                width={400}
                            >
                                <BarChart
                                    title={`Bet Line Threshold ${threshold}`}
                                    barCategoryGap="10%"
                                    barGap={4}
                                    data={barData}
                                    id="BarChart-Stacked"
                                    layout="horizontal"
                                    stackOffset='none'
                                >
                                    <CartesianGrid strokeDasharray={"3 3"} stroke='grey' />
                                    <XAxis 
                                        dataKey={"bet_type"} 
                                        label={{ value: 'Bet Type', position: 'insideBottom', offset: 10, fill: '#ffffff' }}
                                        tick={{ fontSize: 12, fill: '#ffffff' }}
                                        height={60}
                                        stroke='#ffffff'
                                    />
                                    
                                    <YAxis 
                                        domain={[0, maxBets + Math.ceil(maxBets * 0.15)]}
                                        tick={{ fontSize: 12, fill: '#ffffff' }}
                                        label={{ value: 'Total Bets', angle: -90, position: 'insideLeft', fill: '#ffffff' }}
                                        height={60}
                                        stroke='#ffffff'
                                    />
                                    <Tooltip />
                                    <Legend />
                                    <Bar 
                                        stackId='a'
                                        barSize={50}
                                        dataKey={"total_hits"}
                                        fill='#0ffa26'
                                        name="Hits"
                                    />
                                    <Bar 
                                        stackId='a'
                                        barSize={50}
                                        dataKey={"total_misses"}
                                        fill='#ef4444'
                                        name="Misses"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        )})}  
                    </div>
                    <div className='m-5'>
                        <h1 className='text-3xl font-bold p-5 m-5'>Model Calibration</h1>

                        <AnalysisChart 
                            data={calibrationBuckets}
                            maxBucket={CALIBRATION_MAX}
                            bucketWidth={CALIBRATION_BUCKET_WIDTH}
                            pivot='bet_p'
                            chartType='hitRate'
                        />
                        <AnalysisChart
                            data={calibrationBuckets}
                            maxBucket={CALIBRATION_MAX}
                            bucketWidth={CALIBRATION_BUCKET_WIDTH}
                            pivot='bet_p'
                            chartType='profit'
                        />

                        <h1 className='text-3xl font-bold p-5 m-5'>Edge Analysis</h1>
                        <AnalysisChart
                            data={edgeBuckets}
                            maxBucket={EDGE_MAX}
                            bucketWidth={EDGE_BUCKET_WIDTH}
                            pivot='bet_edge'
                            chartType='hitRate'
                        />
                        <AnalysisChart
                            data={edgeBuckets}
                            maxBucket={EDGE_MAX}
                            bucketWidth={EDGE_BUCKET_WIDTH}
                            pivot='bet_edge'
                            chartType='profit'
                        />
                    </div>
                </div>     
            ) : (
                <div>No Data Found</div>
            )}
        </div>
    )
}