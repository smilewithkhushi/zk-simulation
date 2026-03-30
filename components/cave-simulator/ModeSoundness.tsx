'use client'

import { useState, useRef } from 'react'
import { Round, Tunnel, randomTunnel, soundnessProbability } from '@/lib/cave-sim'
import CaveScene, { PeggyPosition } from './CaveScene'
import ProbabilityBar from './ProbabilityBar'
import NarrativePanel, { NarrativeLine } from './NarrativePanel'

const INTRO =
  'Now the Prover does NOT know the magic word. They are a cheater trying to bluff their way through. ' +
  'Without the magic word they cannot open the secret door to cross tunnels. ' +
  'Each round they have a 50/50 chance of guessing right. Over many rounds, the Verifier will almost certainly catch them.'

let lineId = 0
function addLine(
  setter: React.Dispatch<React.SetStateAction<NarrativeLine[]>>,
  text: string,
  type: NarrativeLine['type'],
) {
  setter((prev) => [...prev, { id: lineId++, text, type }])
}

export default function ModeSoundness() {
  const [rounds, setRounds] = useState<Round[]>([])
  const [peggyPos, setPeggyPos] = useState<PeggyPosition>('idle')
  const [victorChallenge, setVictorChallenge] = useState<Tunnel | null>(null)
  const [doorActive, setDoorActive] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [currentResult, setCurrentResult] = useState<boolean | null>(null)
  const [narrative, setNarrative] = useState<NarrativeLine[]>([])
  const runningRef = useRef(false)

  function runRound(roundNumber: number): Promise<void> {
    return new Promise((resolve) => {
      const entered = randomTunnel()
      const challenge = randomTunnel()
      const success = entered === challenge

      setNarrative([])
      setPeggyPos(`entry-${entered}` as PeggyPosition)
      setVictorChallenge(null)
      setDoorActive(false)
      setCurrentResult(null)

      addLine(
        setNarrative,
        `Round ${roundNumber}: Cheating Prover (no magic word) walks into tunnel ${entered} — guessing randomly.`,
        'enter',
      )

      setTimeout(() => {
        setPeggyPos(`inside-${entered}` as PeggyPosition)
      }, 300)

      setTimeout(() => {
        setVictorChallenge(challenge)
        addLine(setNarrative, `"Come out from tunnel ${challenge}!" — Verifier demands.`, 'challenge')
      }, 700)

      setTimeout(() => {
        if (success) {
          addLine(
            setNarrative,
            `Prover is already in tunnel ${entered}. Same tunnel — got lucky this time!`,
            'action',
          )
        } else {
          setPeggyPos('crossing')
          addLine(
            setNarrative,
            `Prover is in tunnel ${entered} but needs to exit ${challenge}. They have no magic word — can't cross!`,
            'action',
          )
        }
      }, 1400)

      setTimeout(() => {
        if (success) {
          setPeggyPos(`exit-${challenge}` as PeggyPosition)
          setCurrentResult(true)
          addLine(setNarrative, `Prover exits tunnel ${entered}. Escaped by sheer luck (50% chance). `, 'result-pass')
        } else {
          setPeggyPos('stuck')
          setCurrentResult(false)
          addLine(setNarrative, `Prover is stuck inside. Caught! The lie is exposed. ✗`, 'result-fail')
        }
        setDoorActive(false)
      }, 2100)

      setTimeout(() => {
        const round: Round = {
          round: roundNumber,
          entered,
          challenge,
          exited: success ? challenge : null,
          success,
        }
        setRounds((prev) => [...prev, round])
        setVictorChallenge(null)
        setCurrentResult(null)
        setPeggyPos('idle')
        resolve()
      }, 2800)
    })
  }

  async function handleNextRound() {
    if (isRunning || rounds.length >= 10) return
    setIsRunning(true)
    runningRef.current = true
    await runRound(rounds.length + 1)
    setIsRunning(false)
    runningRef.current = false
  }

  async function handleRun10() {
    if (isRunning || rounds.length >= 10) return
    setIsRunning(true)
    runningRef.current = true
    const startRound = rounds.length + 1
    for (let i = startRound; i <= 10; i++) {
      if (!runningRef.current) break
      await runRound(i)
      await new Promise((res) => setTimeout(res, 400))
    }
    setIsRunning(false)
    runningRef.current = false
  }

  function handleReset() {
    runningRef.current = false
    setIsRunning(false)
    setRounds([])
    setPeggyPos('idle')
    setVictorChallenge(null)
    setDoorActive(false)
    setCurrentResult(null)
    setNarrative([])
  }

  const allDone = rounds.length >= 10
  const cheatProb = soundnessProbability(rounds.length)
  const caughtCount = rounds.filter((r) => !r.success).length

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
      {/* Left: simulation */}
      <div className="space-y-4">
        {/* Cheating mode badge */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 uppercase tracking-wider">
            Cheating Mode
          </span>
          <span className="text-xs font-mono text-zk-white/40">
            Prover does NOT know the magic word
          </span>
        </div>

        <div className="glass rounded-xl p-4 relative scanlines overflow-hidden">
          <CaveScene
            peggyPosition={peggyPos}
            victorChallenge={victorChallenge}
            doorActive={doorActive}
            isCheating={true}
          />
          {currentResult !== null && (
            <div
              className={`absolute top-4 right-4 text-xs font-mono px-2 py-1 rounded ${
                currentResult
                  ? 'text-zk-green bg-zk-muted/80'
                  : 'text-red-400 bg-red-950/80'
              }`}
            >
              {currentResult ? 'Got lucky!' : 'Caught!'}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={handleNextRound}
            disabled={isRunning || allDone}
            className="px-4 py-2 text-sm font-mono bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next Round
          </button>
          <button
            onClick={handleRun10}
            disabled={isRunning || allDone}
            className="px-4 py-2 text-sm font-mono bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Run 10 Rounds
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-mono bg-zk-white/5 border border-zk-white/10 text-zk-white/60 rounded-lg hover:bg-zk-white/10 transition-colors"
          >
            Reset
          </button>

          <span className="ml-auto text-sm font-mono text-zk-white/60">
            <span className="text-red-400 font-semibold">{caughtCount}</span>
            {' caught / '}
            <span>{rounds.length}</span>
            {' rounds'}
          </span>
        </div>

        {/* Probability bar */}
        <ProbabilityBar rounds={rounds.length} />

        {/* After 10 rounds message */}
        {allDone && (
          <div className="p-4 rounded-lg border border-red-500/40 bg-red-950/20 text-center">
            <p className="text-red-400 font-mono text-sm">
              Only {(cheatProb * 100).toFixed(2)}% chance a cheater fooled you this many rounds.
            </p>
            <p className="text-xs font-mono text-zk-white/40 mt-1">
              With enough rounds, an honest Verifier will always catch a liar.
            </p>
          </div>
        )}

        {/* Round history */}
        {rounds.length > 0 && (
          <div className="glass rounded-lg p-4">
            <p className="text-xs font-mono text-zk-white/40 mb-3 uppercase tracking-wider">Round History</p>
            <div className="flex flex-wrap gap-2">
              {rounds.map((r) => (
                <span
                  key={r.round}
                  className={`text-xs font-mono px-2 py-1 rounded border ${
                    r.success
                      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  R{r.round} {r.success ? 'lucky' : 'caught'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: narrative */}
      <NarrativePanel
        lines={narrative}
        intro={INTRO}
        emptyText='Press "Next Round" to see the cheater try their luck...'
      />
    </div>
  )
}
