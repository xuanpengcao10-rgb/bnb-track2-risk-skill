# Judge Notes

## What to review first

1. Run `npm run verify` to check type safety, tests, CLI output, and production build.
2. Run `npm run dev` and open the browser demo.
3. Inspect `submissions/skill-manifest.json` for the CMC Skill-style contract.
4. Inspect `examples/cmc-skill-response.json` for the agent-readable response shape.

## Differentiation

This project is not a generic token predictor. It is a pre-trade risk gate for AI trading agents:

- It can reject attractive narratives when hard risk limits fail.
- It returns position sizing and invalidation before execution.
- It separates analysis from wallet signing and transaction execution.
- It can be wrapped by an agent without giving the strategy module custody privileges.

## Demo path

- Select the BNB scenario to show a controlled `buy`.
- Select the meme spike scenario to show risk gates overriding social hype.
- Select the ineligible token scenario to show competition/universe enforcement.
- Show the Agent-readable output panel to demonstrate downstream integration.

## Known constraints

- The sample data is deterministic for reproducible judging.
- Live CMC Agent Hub data can be mapped into the same `StrategyInput` shape.
- The skill does not execute trades and does not provide financial advice.
