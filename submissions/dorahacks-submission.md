# DoraHacks Submission Draft

## Project name

Risk-Gated Narrative Alpha Skill

## Track

BNB Hack Track 2: Strategy Skills

## Short description

A custody-free strategy skill for AI trading agents that turns CMC-style market, narrative, and risk signals into buy, hold, or avoid decisions with risk gates, sizing, invalidation, and agent-readable JSON.

## Long description

Risk-Gated Narrative Alpha Skill is built for AI trading agents that need more than a bullish or bearish label. The skill evaluates market momentum, volume, liquidity, volatility, funding, RSI, narrative strength, and portfolio drawdown constraints before returning a structured decision.

The core value is capital protection. If a token is outside the eligible universe, liquidity is too thin, volatility is too high, market data is stale, or drawdown budget is nearly consumed, the skill returns `avoid` even when the narrative looks attractive. For valid setups, it returns a score breakdown, max position size, stop loss, take profit guide, invalidation conditions, and execution guards.

The demo uses deterministic sample data so judges can run it without CMC, BNB, or Trust Wallet accounts. It also includes a backtestable baseline comparison: on the deterministic scenario set, the risk-gated strategy returns `0.21%` versus `-0.15%` for a naive buy-all baseline while reducing max drawdown from `0.57%` to `0.00%`. The repository includes a live-style CMC Agent Hub payload adapter and a BNB agent tool wrapper, so the same strategy core can be connected to agent infrastructure without changing the scoring logic.

## Prize relevance

- Technical execution: tested TypeScript strategy engine, CMC Agent Hub adapter, BNB agent tool wrapper, baseline comparison, CLI demo, and interactive Vite demo.
- Originality: focuses on pre-trade risk gates and agent survivability rather than generic price prediction.
- Real-world relevance: addresses liquidity, drawdown, volatility, crowding, stale data, and custody boundaries.
- Demo quality: browser dashboard shows scenario selection, gates, score breakdown, data freshness, sizing, thesis, equity curve, capital-preservation rate, baseline delta, and agent-readable JSON.

## Repository URL

Final repository URL to paste:

https://github.com/xuanpengcao10-rgb/bnb-track2-risk-skill

## Demo URL

Final demo page URL to paste after the latest GitHub Pages deployment finishes:

https://xuanpengcao10-rgb.github.io/bnb-track2-risk-skill/

## Setup commands

```bash
npm install
npm run verify
npm run cli
npm run dev
```

## Included review artifacts

- `submissions/skill-manifest.json`
- `examples/cmc-skill-response.json`
- `examples/cmc-agent-hub-payload.json`
- `docs/architecture.md`
- `docs/strategy-spec.md`
- `docs/backtest-baseline-report.md`
- `docs/integration-guide.md`
- `submissions/demo-script.md`

## Tags

BNB Chain, AI Agent, Strategy Skill, Risk Management, CoinMarketCap, Trust Wallet, Trading Agent

## Disclaimer

This project is a strategy skill and demo. It does not provide financial advice, custody funds, sign transactions, or execute trades.
