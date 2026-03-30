'use client'

import { useState, useRef } from 'react'
import { Round, Tunnel, randomTunnel } from '@/lib/cave-sim'
import CaveScene, { PeggyPosition } from './CaveScene'
import NarrativePanel, { NarrativeLine } from './NarrativePanel'

const INTRO =
  'The Prover claims to know the magic word (cave password) that opens the secret door between tunnels A and B. ' +
  'The Verifier tests this by demanding the Prover exit from a random tunnel. ' +
  'An honest Prover can always comply — they can cross through the door if needed.'

let lineId = 0
function addLine(
  setter: React.Dispatch<React.SetStateAction<NarrativeLine[]>>,
  text: string,
  type: NarrativeLine['type'],
) {
  setter((prev) => [...prev, { id: lineId++, text, type }])
}

export default function ModeCompleteness() {
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
      const needsCross = entered !== challenge

      setNarrative([])
      setPeggyPos(`entry-${entered}` as PeggyPosition)
      setVictorChallenge(null)
      setDoorActive(false)
      setCurrentResult(null)

      addLine(setNarrative, `Round ${roundNumber} begins. Prover secretly walks into tunnel ${entered}.`, 'enter')

      setTimeout(() => {
        setPeggyPos(`inside-${entered}` as PeggyPosition)
      }, 300)

      setTimeout(() => {
        setVictorChallenge(challenge)
        addLine(setNarrative, `"Come out from tunnel ${challenge}!" — Verifier picks randomly.`, 'challenge')
      }, 700)

      setTimeout(() => {
        if (needsCross) {
          setPeggyPos('crossing')
          setDoorActive(true)
          addLine(
            setNarrative,
            `Prover entered ${entered} but must exit ${challenge}. They use the magic word to unlock the secret door and cross over!`,
            'action',
          )
        } else {
          addLine(
            setNarrative,
            `Prover already in tunnel ${entered} — same as challenged. No crossing needed.`,
            'action',
          )
        }
      }, 1400)

      setTimeout(() => {
        setPeggyPos(`exit-${challenge}` as PeggyPosition)
        setCurrentResult(true)
        setDoorActive(false)
        addLine(setNarrative, `Prover exits from tunnel ${challenge}. Verifier is convinced! ✓`, 'result-pass')
      }, 2100)

      setTimeout(() => {
        const round: Round = {
          round: roundNumber,
          entered,
          challenge,
          exited: challenge,
          success: true,
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

  const successCount = rounds.filter((r) => r.success).length
  const allDone = rounds.length >= 10

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
      {/* Left: simulation */}
      <div className="space-y-4">
        <div className="glass rounded-xl p-4 relative scanlines overflow-hidden">
          <CaveScene
            peggyPosition={peggyPos}
            victorChallenge={victorChallenge}
            doorActive={doorActive}
            isCheating={false}
          />
          {currentResult !== null && (
            <div className="absolute top-4 right-4 text-xs font-mono text-zk-green bg-zk-muted/80 px-2 py-1 rounded">
              Round passed!
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={handleNextRound}
            disabled={isRunning || allDone}
            className="px-4 py-2 text-sm font-mono bg-zk-green/10 border border-zk-green/30 text-zk-green rounded-lg hover:bg-zk-green/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next Round
          </button>
          <button
            onClick={handleRun10}
            disabled={isRunning || allDone}
            className="px-4 py-2 text-sm font-mono bg-zk-green/10 border border-zk-green/30 text-zk-green rounded-lg hover:bg-zk-green/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
            <span className="text-zk-green font-semibold">{successCount}</span>
            {' / '}
            <span>{rounds.length}</span>
            {' convinced'}
          </span>
        </div>

        {/* Success banner */}
        {allDone && (
          <div className="p-4 rounded-lg border border-zk-green/40 bg-zk-green/5 text-center">
            <p className="text-zk-green font-mono font-semibold text-sm">
              10/10 convinced! An honest prover always passes.
            </p>
            <p className="text-xs font-mono text-zk-white/40 mt-1">
              No matter which tunnel the Verifier picks, the Prover handles it.
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
                  className="text-xs font-mono px-2 py-1 rounded bg-zk-green/10 border border-zk-green/20 text-zk-green"
                >
                  R{r.round} ✓
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
        emptyText='Press "Next Round" to watch the protocol in action...'
      />
    </div>
  )
}
