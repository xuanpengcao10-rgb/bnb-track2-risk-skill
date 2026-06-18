# DoraHacks Submission Draft

## Project name

Risk-Gated Narrative Alpha Skill

## Track

BNB Hack Track 2: Strategy Skills

## Short description

A custody-free strategy skill for AI trading agents that turns CMC-style market, narrative, and risk signals into buy, hold, or avoid decisions with risk gates, sizing, invalidation, and agent-readable JSON.

## Long description

Risk-Gated Narrative Alpha Skill is built for AI trading agents that need more than a bullish or bearish label. The skill evaluates market momentum, volume, liquidity, volatility, funding, RSI, narrative strength, and portfolio drawdown constraints before returning a structured decision.

The core value is capital protection. If a token is outside the eligible universe, liquidity is too thin, volatility is too high, or drawdown budget is nearly consumed, the skill returns `avoid` even when the narrative looks attractive. For valid setups, it returns a max position size, stop loss, take profit guide, invalidation conditions, and execution guards.

The demo uses deterministic sample data so judges can run it without CMC, BNB, or Trust Wallet accounts. The schema is designed so a live CMC Agent Hub adapter can replace the sample data later, and the output can be wrapped by BNB Agent SDK or used by a Trust Wallet-compatible execution layer.

## Prize relevance

- Technical execution: tested TypeScript strategy engine, CLI demo, and interactive Vite demo.
- Originality: focuses on pre-trade risk gates and agent survivability rather than generic price prediction.
- Real-world relevance: addresses liquidity, drawdown, volatility, crowding, stale data, and custody boundaries.
- Demo quality: browser dashboard shows scenario selection, gates, sizing, thesis, simulation summary, and agent-readable JSON.

## Repository URL

To be filled after GitHub repository is created.

## Demo URL

To be filled after deployment or screen-recorded demo upload.

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
- `docs/strategy-spec.md`
- `docs/integration-guide.md`
- `submissions/demo-script.md`

## Tags

BNB Chain, AI Agent, Strategy Skill, Risk Management, CoinMarketCap, Trust Wallet, Trading Agent

## Disclaimer

This project is a strategy skill and demo. It does not provide financial advice, custody funds, sign transactions, or execute trades.
