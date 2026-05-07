import React from 'react'

interface DonutData {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutData[]
  centerLabel: string
  centerValue: string
}

export function DonutChart({ data, centerLabel, centerValue }: DonutChartProps) {
  if (data.length === 0) return (
    <div className="flex flex-col items-center justify-center size-48 mx-auto bg-gray-50/50 rounded-full border border-dashed border-gray-100">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center px-4">No data</span>
    </div>
  )
  const total = data.reduce((acc, d) => acc + d.value, 0)
  let cumulativeValue = 0

  return (
    <div className="relative size-48 mx-auto">
      <svg viewBox="0 0 36 36" className="size-full -rotate-90">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F4F6" strokeWidth="3.5" />
        {data.map((d, i) => {
          const dashArray = (d.value / total) * 100
          const dashOffset = 100 - cumulativeValue
          cumulativeValue += dashArray
          return (
            <circle
              key={i}
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke={d.color}
              strokeWidth="3.5"
              strokeDasharray={`${dashArray} ${100 - dashArray}`}
              strokeDashoffset={dashOffset}
              className="transition-all duration-500 ease-in-out"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900 leading-none">{centerValue}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{centerLabel}</span>
      </div>
    </div>
  )
}

interface BarData {
  label: string
  value: number
}

interface SimpleBarChartProps {
  data: BarData[]
  color?: string
}

export function SimpleBarChart({ data, color = '#1B4332' }: SimpleBarChartProps) {
  if (data.length === 0) return (
    <div className="flex flex-col items-center justify-center h-40 w-full bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
      <div className="size-1 bg-gray-200 rounded-full w-24 mb-2" />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No history found</span>
    </div>
  )
  const max = Math.max(...data.map(d => d.value))
  
  return (
    <div className="flex items-end justify-between h-40 gap-2 px-2">
      {data.map((d, i) => {
        const height = (d.value / max) * 100
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="w-full relative">
               <div 
                style={{ height: `${height}%` }}
                className="w-full rounded-t-lg bg-brand/10 group-hover:bg-brand/20 transition-all flex items-end justify-center overflow-hidden"
              >
                <div 
                  style={{ height: `${height > 20 ? 40 : height}%` }}
                  className="w-full bg-brand transition-all"
                />
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}
