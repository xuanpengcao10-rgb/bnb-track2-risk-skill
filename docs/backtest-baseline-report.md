# Backtest Baseline Report

## Purpose

This report shows why the skill is more than a token picker. The deterministic scenario replay compares the risk-gated strategy against a naive baseline that buys every setup with the same fixed allocation.

## Method

- Scenario set: the five deterministic examples in `src/data/scenarios.ts`.
- Risk-gated strategy: `runSimulation(sampleScenarios)` uses the strategy decision, returned position size, stops, holds, and avoids.
- Baseline: the naive buy-all strategy opens every scenario with a fixed `3%` allocation.
- Return source: each scenario's deterministic `nextMovePct`.
- Scope: this is a reproducible judging fixture, not a claim of live market performance.

## Results

| Metric | Risk-gated strategy | Naive buy-all baseline |
| --- | ---: | ---: |
| Estimated return | 0.21% | -0.15% |
| Return delta | +0.36% | 0.00% |
| Max drawdown | 0.00% | 0.57% |
| Losing setups avoided | 2 | 0 |
| Avoided loss | 0.57% | 0.00% |

## Interpretation

The baseline takes every attractive-looking opportunity, including the meme volatility spike and stale catalyst setup. The strategy blocks both losing setups through hard risk gates, so its return is higher and its drawdown is lower in the deterministic replay.

This matters for Track 2 because an agent strategy skill should be backtestable and risk-aware. The key behavior is not simply finding a `buy`; it is refusing trades when liquidity, volatility, stale data, drawdown, or eligibility constraints make the setup unsafe.

## Reproduce

Run:

```bash
npm run cli
```

The command prints the aggregate simulation summary, the baseline comparison, and the agent-readable responses for every deterministic scenario.
