import React from 'react'

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  circleOneStroke?: string
  circleTwoStroke?: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 60,
  strokeWidth = 4,
  circleOneStroke = '#dcfce7',
  circleTwoStroke = 'url(#greenGradient)'
}) => {
  const center = size / 2
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <defs>
        <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
      </defs>
      <circle
        stroke={circleOneStroke}
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        stroke={circleTwoStroke}
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (progress / 100) * circumference}
        strokeLinecap="round"
      />
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size / 4}
        fontWeight="bold"
        fill="#15803d"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}
      >
        {`${Math.round(progress)}%`}
      </text>
    </svg>
  )
}

