'use client'

import { motion } from 'framer-motion'

export type PeggyPosition =
  | 'idle'
  | 'entry-A'
  | 'entry-B'
  | 'inside-A'
  | 'inside-B'
  | 'crossing'
  | 'exit-A'
  | 'exit-B'
  | 'stuck'

interface CaveSceneProps {
  peggyPosition: PeggyPosition
  victorChallenge: 'A' | 'B' | null
  isCheating?: boolean
  doorActive?: boolean
}

const POSITIONS: Record<PeggyPosition, { cx: number; cy: number }> = {
  idle:     { cx: 280, cy: 340 },
  'entry-A':  { cx: 150, cy: 48 },
  'entry-B':  { cx: 410, cy: 48 },
  'inside-A': { cx: 150, cy: 200 },
  'inside-B': { cx: 410, cy: 200 },
  crossing:   { cx: 280, cy: 270 },
  'exit-A':   { cx: 150, cy: 48 },
  'exit-B':   { cx: 410, cy: 48 },
  stuck:      { cx: 280, cy: 270 },
}

const INSIDE_POSITIONS: PeggyPosition[] = ['inside-A', 'inside-B', 'crossing', 'stuck']

export default function CaveScene({
  peggyPosition,
  victorChallenge,
  isCheating = false,
  doorActive = false,
}: CaveSceneProps) {
  const pos = POSITIONS[peggyPosition]
  const isInsideCave = INSIDE_POSITIONS.includes(peggyPosition)
  const isVisible = peggyPosition !== 'idle'

  const peggyColor = isCheating ? '#EF4444' : '#A78BFA'
  const peggyStroke = isCheating ? '#EF4444' : '#A78BFA'

  return (
    <svg
      viewBox="0 0 560 380"
      width="560"
      height="380"
      className="w-full max-w-[560px] mx-auto"
      aria-label="Ali Baba Cave Diagram"
    >
      {/* Outside area — Tunnel A entrance gap */}
      <rect x="80" y="0" width="140" height="70" fill="transparent" />
      {/* Outside area — Tunnel B entrance gap */}
      <rect x="340" y="0" width="140" height="70" fill="transparent" />

      {/* Victor token */}
      <circle cx="280" cy="32" r="16" fill="#A8F072" fillOpacity="0.15" stroke="#A8F072" strokeWidth="1.5" />
      <text x="280" y="37" textAnchor="middle" fill="#A8F072" fontSize="13" fontFamily="monospace" fontWeight="700">V</text>

      {/* Victor speech bubble */}
      {victorChallenge && (
        <>
          <rect
            x="168"
            y="6"
            width="168"
            height="26"
            rx="4"
            fill="#0C1509"
            stroke="#A8F072"
            strokeWidth="1"
            opacity="0.95"
          />
          <text x="252" y="23" textAnchor="middle" fill="#A8F072" fontSize="11" fontFamily="monospace">
            {`Come out from ${victorChallenge}!`}
          </text>
        </>
      )}

      {/* Cave background */}
      <rect x="60" y="70" width="440" height="280" fill="#0C1509" rx="4" />

      {/* Tunnel A interior */}
      <rect x="90" y="70" width="120" height="240" fill="#111D0E" rx="2" />

      {/* Tunnel B interior */}
      <rect x="350" y="70" width="120" height="240" fill="#111D0E" rx="2" />

      {/* Middle wall (upper) */}
      <rect x="210" y="70" width="140" height="160" fill="#0A0A0A" />

      {/* Secret door passage (lower middle) */}
      <rect x="210" y="230" width="140" height="80" fill="#111D0E" />

      {/* Secret door line */}
      <line
        x1="230"
        y1="232"
        x2="330"
        y2="232"
        stroke={doorActive ? '#A8F072' : '#2A3D1F'}
        strokeWidth="1.5"
        strokeDasharray="6 3"
        opacity={doorActive ? 1 : 0.5}
      />

      {/* Tunnel labels */}
      <text x="150" y="58" textAnchor="middle" fill="#A8F072" fontSize="13" fontFamily="monospace">A</text>
      <text x="410" y="58" textAnchor="middle" fill="#A8F072" fontSize="13" fontFamily="monospace">B</text>

      {/* "STUCK!" label */}
      {peggyPosition === 'stuck' && (
        <text x="280" y="255" textAnchor="middle" fill="#EF4444" fontSize="12" fontFamily="monospace" fontWeight="700">
          STUCK!
        </text>
      )}

      {/* Peggy token */}
      {isVisible && (
        <motion.circle
          cx={pos.cx}
          cy={pos.cy}
          r={14}
          fill={peggyColor}
          fillOpacity={isInsideCave ? 0.45 : 0.85}
          stroke={peggyStroke}
          strokeWidth="1.5"
          strokeOpacity={isInsideCave ? 0.6 : 1}
          animate={{ cx: pos.cx, cy: pos.cy }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      )}
      {isVisible && (
        <motion.text
          x={pos.cx}
          y={pos.cy + 5}
          textAnchor="middle"
          fill={isInsideCave ? 'rgba(167,139,250,0.7)' : '#F0F0F0'}
          fontSize="11"
          fontFamily="monospace"
          fontWeight="700"
          animate={{ x: pos.cx, y: pos.cy + 5 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ pointerEvents: 'none' }}
        >
          P
        </motion.text>
      )}

      {/* Cave floor line */}
      <line x1="60" y1="350" x2="500" y2="350" stroke="#2A3D1F" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}
