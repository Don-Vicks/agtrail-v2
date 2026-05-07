import React from 'react'

interface DataPoint {
  label: string
  value: number
}

interface SimpleAreaChartProps {
  data: DataPoint[]
  height?: number
  color?: string
}

export function SimpleAreaChart({ 
  data, 
  height = 160, 
  color = '#1B4332' 
}: SimpleAreaChartProps) {
  if (data.length === 0) return null

  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  const range = max - min || 1
  
  const width = 1000 // Internal coordinate system
  const step = width / (data.length - 1)
  
  // Create path points
  const points = data.map((d, i) => {
    const x = i * step
    const y = height - ((d.value - min) / range) * (height - 20) - 10
    return `${x},${y}`
  })
  
  const pathData = `M${points.join(' L')}`
  const areaData = `${pathData} L${width},${height} L0,${height} Z`

  return (
    <div className="w-full">
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area */}
        <path d={areaData} fill="url(#areaGradient)" />
        
        {/* Line */}
        <path 
          d={pathData} 
          fill="none" 
          stroke={color} 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* X-Axis labels (approximate) */}
        <g>
          {data.filter((_, i) => i % Math.ceil(data.length / 10) === 0).map((d, i) => (
            <text
              key={i}
              x={(data.indexOf(d) * step)}
              y={height + 15}
              textAnchor="middle"
              className="text-[12px] fill-gray-400 font-bold uppercase tracking-widest"
              style={{ fontSize: '12px' }}
            >
              {d.label}
            </text>
          ))}
        </g>
      </svg>
    </div>
  )
}
