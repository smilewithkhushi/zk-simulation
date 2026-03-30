'use client'

import { useState } from 'react'
import ModeCompleteness from './ModeCompleteness'
import ModeSoundness from './ModeSoundness'
import ModeZeroKnowledge from './ModeZeroKnowledge'

type TabId = 'completeness' | 'soundness' | 'zero-knowledge'

interface Tab {
  id: TabId
  label: string
  subtitle: string
}

const TABS: Tab[] = [
  {
    id: 'completeness',
    label: 'Completeness',
    subtitle: 'Honest provers always pass',
  },
  {
    id: 'soundness',
    label: 'Soundness',
    subtitle: 'Cheaters get caught',
  },
  {
    id: 'zero-knowledge',
    label: 'Zero-Knowledge',
    subtitle: 'Nothing is revealed',
  },
]

export default function CaveSimulator() {
  const [activeTab, setActiveTab] = useState<TabId>('completeness')

  return (
    <div className="min-h-screen bg-zk-black text-zk-white font-display">
      {/* Header */}
      <div className="border-b border-zk-muted/30 bg-zk-charcoal/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Title row */}
          <div className="py-4 flex items-baseline gap-3">
            <h1 className="text-lg font-mono font-bold text-zk-green text-glow tracking-widest uppercase">
              ZK CAVE SIMULATOR
            </h1>
            <span className="text-xs font-mono text-zk-white/40">
              Ali Baba Cave · Interactive Demo
            </span>
          </div>

          {/* Tab bar */}
          <div className="flex gap-0">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col px-5 py-3 text-left transition-colors border-b-2 ${
                    isActive
                      ? 'border-zk-green text-zk-green bg-zk-green/5'
                      : 'border-transparent text-zk-white/50 hover:text-zk-white/80 hover:border-zk-muted'
                  }`}
                >
                  <span className="text-sm font-mono font-semibold">{tab.label}</span>
                  <span className="text-xs font-mono opacity-60 hidden sm:block">{tab.subtitle}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'completeness' && <ModeCompleteness />}
        {activeTab === 'soundness' && <ModeSoundness />}
        {activeTab === 'zero-knowledge' && <ModeZeroKnowledge />}
      </div>
    </div>
  )
}
