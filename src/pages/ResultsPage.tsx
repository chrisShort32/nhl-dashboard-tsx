import { useState } from 'react'
import type { FilterState } from '@/features/types'
import { useBetResults } from '@/features/queries'
import { applyFilters, computeCumulativeProfit } from '@/features/betting/utils'
import { ResponsiveContainer, CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'

const DATE_RANGE_OPTIONS = [
    { label: 'Yesterday', value: 0 },
    { label: 'Last 7', value: 7 },
    { label: 'Last 30', value: 30 },
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
    { label: '4', value: 4 },
    { label: '5', value: 5 },
    { label: 'All', value: 'all' }
]

export function ResultsPage(){
    const [filter, setFilter] = useState<FilterState>({dateRange: 0, typeFilter: 'all', thresholdFilter: 'all'})
    const today = new Date()
    const todayString = today.toISOString().split('T')[0]
    const {data: betResults, isLoading, isError} = useBetResults('01-01-2026', todayString)
    const filtered = betResults ? applyFilters(betResults, filter) : []
    const chartData = computeCumulativeProfit(filtered)
    
    
    return (
        <div>
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
                <div>Loading Chart Data...</div>
            ) : isError ? (
                <div>Error fetching Chart Data</div>
            ) : chartData ? (
                <div className='ml-5'>
                    <h1 className='text-3xl font-bold p-5 m-5'>Profit Over Time</h1>
                    <ResponsiveContainer width="90%" height={500}>
                        <LineChart data={chartData} title={"Profit Over Time"}>
                            <CartesianGrid strokeDasharray="5 5" />
                            <XAxis 
                                dataKey="game_date" 
                                tick={{ fontSize: 12, fill: '#ffffff' }}
                                label={{ value: 'Date', position: 'insideBottom', offset: -5, fill: '#ffffff' }}
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
                </div>
            ) : (
                <div>No Data Found</div>
            )}
        </div>
    )
}