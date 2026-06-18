# Integration Guide

## Public entrypoint

External agents can import from the package entrypoint after building with `npm run cli` or `tsc -p tsconfig.node.json`.

```ts
import { bnbAgentStrategyTool, runCmcAgentHubSkill, runCmcSkill } from "bnb-track2-risk-skill";

const response = runCmcSkill(strategyInput);
const cmcResponse = runCmcAgentHubSkill(cmcAgentHubPayload);
const toolResponse = bnbAgentStrategyTool.execute(strategyInput);
```

## CMC Agent Hub adapter

The repository includes `src/integrations/cmcAgentHub.ts`, which maps a live-style CMC Agent Hub payload into the normalized strategy input. The example payload is in `examples/cmc-agent-hub-payload.json`.

The adapter accepts CMC-style fields for:

- `market.priceChange24hPct`
- `market.priceChange7dPct`
- `market.volumeChange24hPct`
- `market.liquidityUsd`
- `market.volatility7dPct`
- `market.fundingRatePct`
- `market.rsi14`
- `market.dataAgeMinutes`

Risk config can include `maxDataAgeMinutes`. If live data is older than that limit, the strategy returns `avoid` before any executor can open exposure.

Narrative features can come from CMC Agent Hub, news feeds, social scoring, or an agent-owned retrieval layer. The strategy only requires bounded scores from `0` to `1` plus evidence strings.

## BNB Agent SDK wrapper

The skill can be wrapped as a deterministic tool:

```ts
import { bnbAgentStrategyTool } from "bnb-track2-risk-skill";

const result = bnbAgentStrategyTool.execute(strategyInput);
```

The wrapper should pass only normalized input and should not expose wallet keys or signing methods to the skill.

The included wrapper declares:

- `custody: "none"`
- `trading: "analysis-only"`
- CMC Agent Hub compatible external input

## Trust Wallet execution boundary

This project returns execution guards, not transactions. A wallet-facing executor should verify:

- The decision is `buy` before opening any order.
- Market data freshness is still valid.
- The output score breakdown is consistent with the executor's own latest market snapshot.
- The token is still eligible.
- User approval is present.
- Max position size is not exceeded.

Hold and avoid decisions must remain analysis-only.

## Submission artifacts

- `submissions/skill-manifest.json`: compact review manifest.
- `examples/cmc-skill-response.json`: sample agent-readable response.
- `examples/cmc-agent-hub-payload.json`: sample live-style CMC Agent Hub payload.
- `docs/architecture.md`: architecture and custody-boundary diagram.
- `docs/strategy-spec.md`: detailed scoring and schema explanation.
- `submissions/demo-script.md`: 2-3 minute video script.
