'use client'

export type NarrativeType = 'enter' | 'challenge' | 'action' | 'result-pass' | 'result-fail' | 'info'

export interface NarrativeLine {
  id: number
  text: string
  type: NarrativeType
}

interface NarrativePanelProps {
  lines: NarrativeLine[]
  intro: string
  emptyText?: string
}

const TYPE_STYLES: Record<NarrativeType, string> = {
  enter:       'text-purple-300 border-l-2 border-purple-500/50 pl-3',
  challenge:   'text-zk-green border-l-2 border-zk-green/50 pl-3',
  action:      'text-yellow-300 border-l-2 border-yellow-500/50 pl-3',
  'result-pass': 'text-zk-green font-semibold border-l-2 border-zk-green pl-3',
  'result-fail': 'text-red-400 font-semibold border-l-2 border-red-500 pl-3',
  info:        'text-zk-white/50 border-l-2 border-zk-white/20 pl-3',
}

const TYPE_LABELS: Record<NarrativeType, string> = {
  enter:       'Prover',
  challenge:   'Verifier',
  action:      'Prover',
  'result-pass': 'Result',
  'result-fail': 'Result',
  info:        'Note',
}

export default function NarrativePanel({ lines, intro, emptyText }: NarrativePanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Intro explanation */}
      <div className="glass rounded-xl p-4 border border-zk-green/10">
        <p className="text-xs font-mono text-zk-white/60 leading-relaxed">{intro}</p>
      </div>

      {/* Live narrative log */}
      <div className="glass rounded-xl p-4 flex-1 min-h-[200px]">
        <p className="text-xs font-mono text-zk-white/30 uppercase tracking-wider mb-3">
          What&apos;s happening
        </p>

        {lines.length === 0 ? (
          <p className="text-xs font-mono text-zk-white/20 italic">
            {emptyText ?? 'Press "Next Round" to start...'}
          </p>
        ) : (
          <div className="space-y-2">
            {lines.map((line, i) => (
              <div
                key={line.id}
                className={`text-xs font-mono leading-relaxed transition-all ${TYPE_STYLES[line.type]} ${
                  i === lines.length - 1 ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <span className="opacity-50 mr-1">[{TYPE_LABELS[line.type]}]</span>
                {line.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
