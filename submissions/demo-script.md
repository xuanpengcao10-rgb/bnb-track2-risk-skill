# Demo Script

## 0:00 - 0:20 Opening

This is Risk-Gated Narrative Alpha Skill, a BNB Hack Track 2 strategy skill for AI trading agents. The goal is not to predict every token move. The goal is to help an agent decide when to trade, how small to size, and when to refuse the setup.

## 0:20 - 0:55 Show the dashboard

Open the browser demo. The left side contains deterministic scenarios. The main panel shows the selected token, the skill decision, confidence, signal score, risk score, position size, stop loss, and backtest equity curve.

Select the BNB rotation scenario. Explain that the token passes all hard gates, so the skill allows controlled exposure and returns a `buy` decision.

## 0:55 - 1:35 Show risk gate behavior

Select the high-social meme spike. The narrative is attractive, but volatility, funding, and RSI indicate crowding risk. The skill returns `avoid`, proving that risk gates override hype.

Then select the ineligible token scenario. Even with positive narrative evidence, the skill blocks it because it is outside the eligible universe.

## 1:35 - 2:10 Show agent-readable JSON

Point to the simulation summary first. The equity curve shows cumulative return across the deterministic scenarios, while the capital-preserved metric shows avoided setups that later moved against risk-seeking buyers.

Then open the Agent-readable output panel. This is the payload an agent can consume directly: version, token, decision, confidence, max position, stop loss, evidence, invalidation, and risk gates.

This keeps UI presentation separate from agent execution.

## 2:10 - 2:40 Integration explanation

The demo data uses CMC-style fields so judges can run it without paid accounts. In a live deployment, `normalizeCmcAgentHubPayload` can populate the same schema from a CMC Agent Hub payload. The result can be called through `bnbAgentStrategyTool` and passed to a Trust Wallet-compatible executor, but this skill never holds keys or signs trades.

## 2:40 - 3:00 Close

The key idea is survivability for trading agents. The skill helps agents avoid disallowed tokens, crowded spikes, excessive volatility, and stale or invalidated theses before capital is put at risk.
