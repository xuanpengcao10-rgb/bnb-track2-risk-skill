# Final Submit Copy

## Project name

Risk-Gated Narrative Alpha Skill

## Track

BNB Hack Track 2: Strategy Skills

## Short description

A custody-free Strategy Skill for AI trading agents that turns CMC-style market, narrative, and risk signals into buy, hold, or avoid decisions with hard risk gates, position sizing, invalidation, and agent-readable JSON.

## Long description

Risk-Gated Narrative Alpha Skill helps AI trading agents decide when not to trade. The skill evaluates market momentum, volume, liquidity, volatility, funding, RSI, narrative strength, token eligibility, data freshness, and portfolio drawdown constraints before returning a structured decision.

The core value is capital protection. If a token is outside the eligible universe, liquidity is too thin, volatility is too high, market data is stale, or drawdown budget is nearly consumed, the skill returns `avoid` even when the narrative looks attractive. For valid setups, it returns confidence, score breakdowns, max position size, stop loss, take profit guide, invalidation conditions, risk gates, execution guards, and audit metadata.

The demo uses deterministic sample data so judges can reproduce the same result without paid API keys, wallet setup, or live trading permissions. The repository also includes a live-compatible CMC Agent Hub payload adapter, a CMC Skill-style manifest, a BNB agent tool wrapper, and a baseline report comparing the risk-gated strategy against a naive buy-all baseline.

On the deterministic scenario set, the risk-gated strategy returns `0.21%` versus `-0.15%` for the naive buy-all baseline, with a `+0.36%` return delta and `0.57%` avoided loss from blocked setups.

## Repository URL

https://github.com/xuanpengcao10-rgb/bnb-track2-risk-skill

## Demo URL

https://xuanpengcao10-rgb.github.io/bnb-track2-risk-skill/

## Demo video

Upload:

`risk_gated_demo_user_voice.mp4`

Use the MP4 version for DoraHacks. The MOV file is only a backup.

## Tags

BNB Chain, AI Agent, Strategy Skill, Risk Management, CoinMarketCap, Trust Wallet, Trading Agent

## Review path for judges

1. Open the demo page and review the Judge proof section.
2. Review the Integration Proof section for CMC payload, Strategy Skill output, BNB agent wrapper, and Trust Wallet boundary.
3. Switch all five scenarios to see controlled buy, hold, and avoid decisions.
4. Inspect the Agent/tool response JSON.
5. Run `npm run verify` or inspect `submissions/judge-proof-pack.md`.

## Disclaimer

This project is a Strategy Skill and deterministic demo. It does not provide financial advice, custody funds, sign transactions, or execute trades.
