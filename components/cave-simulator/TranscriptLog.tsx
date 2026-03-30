import { Round } from '@/lib/cave-sim'

interface TranscriptLogProps {
  rounds: Round[]
  title: string
}

export default function TranscriptLog({ rounds, title }: TranscriptLogProps) {
  return (
    <div className="glass rounded-lg p-4 flex-1 min-w-0">
      <h3 className="text-sm font-mono text-zk-green font-semibold mb-3 uppercase tracking-wider">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-zk-muted/50">
              <th className="text-left py-1 pr-3 text-zk-white/50">Round</th>
              <th className="text-left py-1 pr-3 text-zk-white/50">Entered</th>
              <th className="text-left py-1 pr-3 text-zk-white/50">Challenge</th>
              <th className="text-left py-1 pr-3 text-zk-white/50">Exited</th>
              <th className="text-left py-1 text-zk-white/50">Result</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((r) => (
              <tr key={r.round} className="border-b border-zk-muted/20">
                <td className="py-1 pr-3 text-zk-white/70">{r.round}</td>
                <td className="py-1 pr-3 text-zk-white/70">{r.entered}</td>
                <td className="py-1 pr-3 text-zk-white/70">{r.challenge}</td>
                <td className="py-1 pr-3 text-zk-white/70">{r.exited ?? '—'}</td>
                <td className={`py-1 font-semibold ${r.success ? 'text-zk-green' : 'text-red-400'}`}>
                  {r.success ? '✅' : '❌'}
                </td>
              </tr>
            ))}
            {rounds.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-zk-white/30 text-xs">
                  No rounds yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
