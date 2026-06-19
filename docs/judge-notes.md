# Judge Notes

## What to review first

1. Run `npm run verify` to check type safety, tests, CLI output, and production build.
2. Run `npm run dev` and open the browser demo.
3. Inspect the browser demo Integration Proof section.
4. Inspect `submissions/judge-proof-pack.md` for the full evidence map.
5. Inspect `submissions/skill-manifest.json` for the CMC Skill-style contract.
6. Inspect `examples/cmc-skill-response.json` for the agent-readable response shape.
7. Inspect `examples/cmc-agent-hub-payload.json` and `src/integrations/cmcAgentHub.ts` for the live-style CMC adapter.
8. Inspect `src/integrations/bnbAgentTool.ts` for the BNB agent wrapper.
9. Inspect `docs/backtest-baseline-report.md` for the naive buy-all baseline comparison.

## Differentiation

This project is not a generic token predictor. It is a pre-trade risk gate for AI trading agents:

- It can reject attractive narratives when hard risk limits fail.
- It can reject attractive narratives when market data is stale.
- It returns position sizing and invalidation before execution.
- It exposes market, narrative, signal, and risk score breakdowns in the agent JSON.
- It exposes a deterministic scenario replay with an equity curve and capital-preservation rate.
- It includes a baseline report showing `0.21%` estimated return versus `-0.15%` for a naive buy-all baseline on the deterministic scenario set.
- It ships a dedicated Integration Proof section and `submissions/judge-proof-pack.md` so evidence is easy to review quickly.
- It separates analysis from wallet signing and transaction execution.
- It can be wrapped by an agent without giving the strategy module custody privileges.

## Why this can win Track 2

- **Strategy Skill fit:** the project exposes a reusable decision module with stable input and output contracts.
- **Technical execution:** the repository includes TypeScript strategy logic, tests, CMC adapter fixtures, CMC Skill-style manifest, BNB agent wrapper, CLI demo, and production Vite build.
- **Originality:** the core behavior is refusing unsafe trades, not predicting price direction.
- **Real-world relevance:** the skill handles stale data, liquidity, volatility, drawdown, token eligibility, custody boundaries, and execution guards.
- **Demo quality:** the browser demo makes the proof visible through scenario switching, baseline comparison, Integration Proof, and agent-readable JSON.

## Demo path

- Select the BNB scenario to show a controlled `buy`.
- Select the meme spike scenario to show risk gates overriding social hype.
- Select the stale catalyst scenario to show freshness blocking a strong narrative.
- Select the ineligible token scenario to show competition/universe enforcement.
- Point to the scenario replay curve and capital-preserved metric to show auditability.
- Point to the Judge proof section to show return delta, drawdown reduction, and avoided loss versus the baseline.
- Point to the Integration Proof section to show CMC payload, Strategy Skill output, BNB wrapper, and Trust Wallet boundary.
- Show the Agent/tool response panel to demonstrate downstream integration, execution guards, and audit metadata.

## Known constraints

- The sample data is deterministic for reproducible judging.
- Live CMC Agent Hub data can be mapped into the same `StrategyInput` shape through the included adapter.
- The skill does not execute trades and does not provide financial advice.
