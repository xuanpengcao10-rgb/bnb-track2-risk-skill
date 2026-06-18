# Judge Notes

## What to review first

1. Run `npm run verify` to check type safety, tests, CLI output, and production build.
2. Run `npm run dev` and open the browser demo.
3. Inspect `submissions/skill-manifest.json` for the CMC Skill-style contract.
4. Inspect `examples/cmc-skill-response.json` for the agent-readable response shape.
5. Inspect `examples/cmc-agent-hub-payload.json` and `src/integrations/cmcAgentHub.ts` for the live-style CMC adapter.
6. Inspect `src/integrations/bnbAgentTool.ts` for the BNB agent wrapper.

## Differentiation

This project is not a generic token predictor. It is a pre-trade risk gate for AI trading agents:

- It can reject attractive narratives when hard risk limits fail.
- It can reject attractive narratives when market data is stale.
- It returns position sizing and invalidation before execution.
- It exposes market, narrative, signal, and risk score breakdowns in the agent JSON.
- It exposes a deterministic backtest with an equity curve and capital-preservation rate.
- It separates analysis from wallet signing and transaction execution.
- It can be wrapped by an agent without giving the strategy module custody privileges.

## Demo path

- Select the BNB scenario to show a controlled `buy`.
- Select the meme spike scenario to show risk gates overriding social hype.
- Select the stale catalyst scenario to show freshness blocking a strong narrative.
- Select the ineligible token scenario to show competition/universe enforcement.
- Point to the equity curve and capital-preserved metric to show auditability.
- Show the Agent-readable output panel to demonstrate downstream integration and score transparency.

## Known constraints

- The sample data is deterministic for reproducible judging.
- Live CMC Agent Hub data can be mapped into the same `StrategyInput` shape through the included adapter.
- The skill does not execute trades and does not provide financial advice.
