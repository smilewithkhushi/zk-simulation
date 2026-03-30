# ZK Cave Simulator

An interactive simulation of the **Ali Baba Zero-Knowledge Proof** cave problem — a classic thought experiment used to explain zero-knowledge proofs intuitively.

## What is this?

Zero-knowledge proofs (ZKPs) allow one party (the **Prover**) to convince another (the **Verifier**) that they know a secret, without revealing the secret itself. The Ali Baba cave is the canonical analogy:

- A cave has two paths (A and B) connected by a magic door that only opens with a secret password.
- The Prover claims to know the password.
- The Verifier challenges the Prover to exit from a randomly chosen side.
- If the Prover truly knows the secret, they always succeed. A cheater succeeds only 50% of the time per round.

This simulator lets you explore the three core properties of ZKPs:

| Mode | Description |
|------|-------------|
| **Completeness** | An honest Prover who knows the secret always passes |
| **Soundness** | A cheating Prover who doesn't know the secret gets caught over repeated rounds |
| **Zero-Knowledge** | The Verifier learns nothing about the secret from the interaction |

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Tailwind CSS](https://tailwindcss.com/) — styling
- TypeScript

## Getting Started

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/                    # Next.js App Router pages
components/
  cave-simulator/       # All simulator UI components
    CaveSimulator.tsx   # Root simulator component
    CaveScene.tsx       # Animated cave visualization
    ModeCompleteness.tsx
    ModeSoundness.tsx
    ModeZeroKnowledge.tsx
    NarrativePanel.tsx
    ProbabilityBar.tsx
    TranscriptLog.tsx
lib/                    # Shared utilities
```
