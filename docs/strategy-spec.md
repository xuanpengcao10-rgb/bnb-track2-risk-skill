# Strategy Skill Specification

## Skill name

Risk-Gated Narrative Alpha Skill

## Purpose

The skill helps an AI trading agent decide whether a token setup is actionable under explicit risk constraints. It is designed to be called before trade execution, not after a trade is already opened.

The main output is a stable JSON object that downstream agents can consume without reading UI copy.

The CMC Skill-style adapter lives in `src/integrations/cmcSkill.ts` and exposes both `cmcSkillManifest` and `runCmcSkill(input)`. Live-style payload mapping lives in `src/integrations/cmcAgentHub.ts`, and the BNB agent wrapper lives in `src/integrations/bnbAgentTool.ts`.

## Input schema

```ts
interface StrategyInput {
  token: {
    symbol: string;
    name: string;
    chain: string;
    eligible: boolean;
  };
  market: {
    priceChange24hPct: number;
    priceChange7dPct: number;
    volumeChange24hPct: number;
    liquidityUsd: number;
    volatility7dPct: number;
    fundingRatePct: number;
    rsi14: number;
    dataAgeMinutes?: number;
  };
  narrative: {
    newsScore: number;
    socialScore: number;
    kolScore: number;
    catalystScore: number;
    evidence: string[];
  };
  risk: {
    maxDrawdownPct: number;
    currentDrawdownPct: number;
    minLiquidityUsd: number;
    maxVolatilityPct: number;
    maxDataAgeMinutes?: number;
    riskProfile: "conservative" | "balanced" | "aggressive";
  };
}
```

## Decision logic

The skill uses two layers:

1. **Signal scoring** combines market participation and narrative quality.
2. **Risk gates** can block a trade even when the signal score is high.

Hard risk gates:

- Token must be in the eligible universe.
- Liquidity must be above the configured floor.
- Seven-day volatility must stay below the configured ceiling.
- Current drawdown must stay within the configured drawdown budget.
- Market data age must stay within the configured freshness window when supplied.

Soft risk gate:

- RSI above the overheated threshold reduces confidence and flags crowding risk.

## Output schema

```ts
interface AgentReadableOutput {
  version: "1.0";
  token: string;
  decision: "buy" | "hold" | "avoid";
  confidence: number;
  maxPositionPct: number;
  stopLossPct: number;
  scoreBreakdown: {
    market: number;
    narrative: number;
    signal: number;
    risk: number;
  };
  invalidation: string[];
  evidence: string[];
  riskGates: Array<{
    id: string;
    passed: boolean;
    severity: "info" | "warning" | "critical";
  }>;
}
```

The CMC adapter wraps this output with execution guards, take-profit, cooldown, and audit metadata for agent review.

## Position sizing

Position size is reduced by:

- Remaining drawdown budget
- Current volatility
- Conservative risk profile
- Hold decisions

Avoid decisions always return `maxPositionPct: 0`.

## Integration plan

### CoinMarketCap Agent Hub

The demo uses deterministic CMC-style data. The included `normalizeCmcAgentHubPayload(payload)` adapter maps live-style CMC Agent Hub data into `StrategyInput.market` and `StrategyInput.narrative` without changing the strategy function.

### BNB Agent SDK

The exported `evaluateStrategy(input)` function can be wrapped as a BNB Agent SDK tool. The returned `agentOutput` is intentionally compact and versioned.

For an integration surface closer to a skill registry, use `runCmcSkill(input)` from `src/index.ts`. For an agent tool surface, use `bnbAgentStrategyTool.execute(input)`.

### Trust Wallet Agent Kit

The skill is custody-free. It returns execution constraints such as max position, stop loss, stale-data checks, and wallet approval requirements. Any transaction must be routed through a user-approved wallet or executor outside this skill.

## Why this matters for trading agents

Many trading demos optimize for picking winners. This skill optimizes for survivability:

- It blocks trades outside the allowed universe.
- It refuses crowded social spikes when volatility is already extreme.
- It rejects otherwise attractive setups when market data is stale.
- It returns invalidation rules before execution.
- It keeps the execution layer separate from the analysis layer.

This makes it useful as a pre-trade guardrail for agents competing under drawdown and trade-count constraints.

## Deterministic scenario replay evidence

`runSimulation(sampleScenarios)` returns deterministic rows, an aggregate summary, an equity curve, and a baseline comparison. The curve starts at `0%`, adds each scenario outcome, tracks drawdown from peak return, and exposes `capitalPreservedPct` so judges can see when avoided trades protected capital.

The baseline comparison models a naive buy-all strategy that allocates `3%` to every deterministic scenario. On the current sample set, the risk-gated strategy returns `0.21%` versus `-0.15%` for the baseline, lowers max drawdown from `0.57%` to `0.00%`, and avoids two losing setups. The full report is in `docs/backtest-baseline-report.md`.
