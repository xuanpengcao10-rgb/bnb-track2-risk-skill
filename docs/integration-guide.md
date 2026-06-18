# Integration Guide

## Public entrypoint

External agents can import from the package entrypoint after building with `npm run cli` or `tsc -p tsconfig.node.json`.

```ts
import { runCmcSkill } from "bnb-track2-risk-skill";

const response = runCmcSkill(strategyInput);
```

## CMC Agent Hub adapter

The adapter expects normalized CMC-style market data rather than raw API responses. A live integration should map CMC fields into:

- `market.priceChange24hPct`
- `market.priceChange7dPct`
- `market.volumeChange24hPct`
- `market.liquidityUsd`
- `market.volatility7dPct`
- `market.fundingRatePct`
- `market.rsi14`

Narrative features can come from CMC Agent Hub, news feeds, social scoring, or an agent-owned retrieval layer. The strategy only requires bounded scores from `0` to `1` plus evidence strings.

## BNB Agent SDK wrapper

The skill can be wrapped as a deterministic tool:

```ts
const tool = {
  name: "risk_gated_narrative_alpha",
  description: "Pre-trade strategy gate for BNB ecosystem tokens.",
  execute: runCmcSkill,
};
```

The wrapper should pass only normalized input and should not expose wallet keys or signing methods to the skill.

## Trust Wallet execution boundary

This project returns execution guards, not transactions. A wallet-facing executor should verify:

- The decision is `buy` before opening any order.
- Market data freshness is still valid.
- The token is still eligible.
- User approval is present.
- Max position size is not exceeded.

Hold and avoid decisions must remain analysis-only.

## Submission artifacts

- `submissions/skill-manifest.json`: compact review manifest.
- `examples/cmc-skill-response.json`: sample agent-readable response.
- `docs/strategy-spec.md`: detailed scoring and schema explanation.
- `submissions/demo-script.md`: 2-3 minute video script.
