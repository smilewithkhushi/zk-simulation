export type Tunnel = 'A' | 'B'

export interface Round {
  round: number
  entered: Tunnel
  challenge: Tunnel
  exited: Tunnel | null
  success: boolean
}

export function randomTunnel(): Tunnel {
  return Math.random() < 0.5 ? 'A' : 'B'
}

export function runHonestRound(roundNumber: number): Round {
  const entered = randomTunnel()
  const challenge = randomTunnel()
  return { round: roundNumber, entered, challenge, exited: challenge, success: true }
}

export function runCheatingRound(roundNumber: number): Round {
  const entered = randomTunnel()
  const challenge = randomTunnel()
  const success = entered === challenge
  return { round: roundNumber, entered, challenge, exited: success ? challenge : null, success }
}

export function soundnessProbability(rounds: number): number {
  if (rounds === 0) return 1
  return Math.pow(0.5, rounds)
}

export function generateFakeTranscript(rounds: number): Round[] {
  return Array.from({ length: rounds }, (_, i) => runHonestRound(i + 1))
}
