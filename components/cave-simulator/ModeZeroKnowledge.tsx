'use client'

import { useState, useEffect, useRef } from 'react'
import { Round, runHonestRound, generateFakeTranscript } from '@/lib/cave-sim'
import CaveScene, { PeggyPosition } from './CaveScene'
import TranscriptLog from './TranscriptLog'

type Phase = 'idle' | 'running' | 'reveal'

const INTRO =
  'Zero-Knowledge means: the Prover convinces the Verifier they know the magic word — without revealing the word itself, or even which tunnel they used. ' +
  'After watching 20 rounds, you\'ll see that the transcript looks identical to one that anyone could fake — proving nothing secret was leaked.'

const EXPLAIN_STEPS = [
  {
    label: 'Prover runs 20 rounds',
    detail: 'Each round: enter a tunnel, get challenged, exit correctly.',
  },
  {
    label: 'We record the transcript',
    detail: 'Which tunnel entered, which challenged, which exited. No magic word appears.',
  },
  {
    label: 'A fake transcript is generated',
    detail: 'Randomly produced, with no knowledge of the magic word at all.',
  },
  {
    label: 'Compare both transcripts',
    detail: 'They look statistically identical — proving no secret was leaked.',
  },
]

export default function ModeZeroKnowledge() {
  const [rounds, setRounds] = useState<Round[]>([])
  const [fakeTranscript, setFakeTranscript] = useState<Round[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const [currentRound, setCurrentRound] = useState(0)
  const [peggyPos, setPeggyPos] = useState<PeggyPosition>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const roundsRef = useRef<Round[]>([])

  // which step is currently active (for the explain panel)
  const activeStep =
    phase === 'idle' ? -1
    : phase === 'running' ? (currentRound === 0 ? 0 : 1)
    : 3 // reveal

  function startDemo() {
    setRounds([])
    setFakeTranscript([])
    setCurrentRound(0)
    setPhase('running')
    roundsRef.current = []

    let count = 0
    intervalRef.current = setInterval(() => {
      count++
      const round = runHonestRound(count)
      roundsRef.current = [...roundsRef.current, round]
      setRounds([...roundsRef.current])
      setCurrentRound(count)

      const entryPos: PeggyPosition = round.entered === 'A' ? 'entry-A' : 'entry-B'
      const exitPos: PeggyPosition = round.exited === 'A' ? 'exit-A' : 'exit-B'
      setPeggyPos(entryPos)
      setTimeout(() => setPeggyPos(exitPos), 150)

      if (count >= 20) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        const fake = generateFakeTranscript(20)
        setFakeTranscript(fake)
        setPhase('reveal')
        setPeggyPos('idle')
      }
    }, 300)
  }

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRounds([])
    setFakeTranscript([])
    setPhase('idle')
    setCurrentRound(0)
    setPeggyPos('idle')
    roundsRef.current = []
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
      {/* Left: simulation */}
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={startDemo}
            disabled={phase === 'running'}
            className="px-4 py-2 text-sm font-mono bg-zk-green/10 border border-zk-green/30 text-zk-green rounded-lg hover:bg-zk-green/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {phase === 'idle' ? 'Start Demo' : phase === 'running' ? 'Running...' : 'Run Again'}
          </button>
          {phase !== 'idle' && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-mono bg-zk-white/5 border border-zk-white/10 text-zk-white/60 rounded-lg hover:bg-zk-white/10 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Running phase */}
        {phase === 'running' && (
          <div className="space-y-3">
            <div className="glass rounded-xl p-4 relative scanlines overflow-hidden">
              <CaveScene
                peggyPosition={peggyPos}
                victorChallenge={null}
                isCheating={false}
              />
            </div>
            <div className="text-center font-mono text-sm text-zk-white/60">
              Recording round{' '}
              <span className="text-zk-green font-semibold">{currentRound}</span>
              {' / 20 '}
              <span className="text-zk-white/30">— no magic word recorded...</span>
            </div>
          </div>
        )}

        {/* Reveal phase: side-by-side transcripts */}
        {phase === 'reveal' && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-mono text-zk-white/50 uppercase tracking-wider mb-3">
                Can you tell which is real?
              </p>
              <div className="flex flex-col lg:flex-row gap-4">
                <TranscriptLog rounds={rounds} title="Real Transcript" />
                <TranscriptLog rounds={fakeTranscript} title="Fake Transcript (no magic word)" />
              </div>
            </div>

            <div className="glass rounded-lg p-4 border border-zk-green/20">
              <p className="text-sm font-mono text-zk-white/80 leading-relaxed mb-2">
                They look identical. The{' '}
                <span className="text-zk-green font-semibold">magic word never appears</span>{' '}
                in either transcript — only tunnel choices.
              </p>
              <p className="text-xs font-mono text-zk-white/40 leading-relaxed">
                The Verifier is convinced the Prover knows the word, but learns nothing about the word itself.
                That&apos;s zero-knowledge.
              </p>
            </div>
          </div>
        )}

        {/* Idle state */}
        {phase === 'idle' && (
          <div className="glass rounded-xl p-4 opacity-40">
            <CaveScene peggyPosition="idle" victorChallenge={null} isCheating={false} />
          </div>
        )}
      </div>

      {/* Right: explanation steps */}
      <div className="flex flex-col gap-4">
        {/* Intro */}
        <div className="glass rounded-xl p-4 border border-zk-green/10">
          <p className="text-xs font-mono text-zk-white/60 leading-relaxed">{INTRO}</p>
        </div>

        {/* Step walkthrough */}
        <div className="glass rounded-xl p-4 flex-1">
          <p className="text-xs font-mono text-zk-white/30 uppercase tracking-wider mb-4">
            How this works
          </p>
          <div className="space-y-4">
            {EXPLAIN_STEPS.map((step, i) => {
              const isActive = activeStep === i
              const isDone = activeStep > i
              return (
                <div
                  key={i}
                  className={`flex gap-3 transition-all ${
                    activeStep === -1
                      ? 'opacity-30'
                      : isDone
                      ? 'opacity-60'
                      : isActive
                      ? 'opacity-100'
                      : 'opacity-25'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold ${
                      isDone
                        ? 'bg-zk-green/20 text-zk-green border border-zk-green/40'
                        : isActive
                        ? 'bg-zk-green text-zk-black'
                        : 'bg-zk-white/5 text-zk-white/20 border border-zk-white/10'
                    }`}
                  >
                    {isDone ? '✓' : i + 1}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-mono ${
                        isActive ? 'text-zk-white' : isDone ? 'text-zk-white/50' : 'text-zk-white/20'
                      }`}
                    >
                      {step.label}
                    </p>
                    {(isActive || isDone) && (
                      <p className="text-xs font-mono text-zk-white/40 mt-0.5">{step.detail}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Key insight box — only shown after reveal */}
        {phase === 'reveal' && (
          <div className="glass rounded-xl p-4 border border-zk-green/30 bg-zk-green/5">
            <p className="text-xs font-mono text-zk-green font-semibold mb-2">Key Insight</p>
            <p className="text-xs font-mono text-zk-white/60 leading-relaxed">
              If anyone could fake a convincing transcript without the secret, then watching the real
              transcript teaches the Verifier nothing — except that the Prover can do it live.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
