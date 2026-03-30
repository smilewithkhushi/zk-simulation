'use client'

import { motion } from 'framer-motion'
import { soundnessProbability } from '@/lib/cave-sim'

interface ProbabilityBarProps {
  rounds: number
}

export default function ProbabilityBar({ rounds }: ProbabilityBarProps) {
  const prob = soundnessProbability(rounds)
  const probPercent = prob * 100
  const barWidth = probPercent

  // Color transitions from yellow at high probability to red as it shrinks
  const barColor = probPercent > 50 ? '#EAB308' : '#EF4444'

  return (
    <div className="mt-4 p-4 glass rounded-lg">
      <p className="text-xs font-mono text-zk-white/60 mb-2 uppercase tracking-wider">
        Probability of Undetected Cheating
      </p>
      <p className="text-sm font-mono text-zk-green mb-3">
        (0.5)^{rounds} = {probPercent.toFixed(4)}%
      </p>
      <div className="w-full h-3 bg-zk-muted/40 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: barColor }}
          animate={{ width: `${barWidth}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      {rounds >= 10 && (
        <p className="text-xs font-mono text-red-400 mt-2 text-center">
          Essentially zero
        </p>
      )}
    </div>
  )
}
