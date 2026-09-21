# Demo Video Script

Target length: 2-3 minutes.

## Opening

Show the first screen and say:

> Hi, this is Risk-Gated Narrative Alpha Skill, a Track 2 Strategy Skill for the BNB Hack. It helps an AI trading agent decide when to buy, hold, or avoid, with hard risk gates before any execution path.

## Explain the contract

Point to the data mode, adapter status, custody boundary, and decision card:

> The skill combines CMC-style market data, narrative signals, and portfolio risk limits. This demo is deterministic so judges can reproduce it without paid API keys or wallet setup. The adapter path is ready, but the skill is analysis-only: no custody, no signing, and no direct trade execution.

## Judge proof

Scroll to Judge proof:

> The replay compares the risk-gated strategy with a naive buy-all baseline. The strategy returns 0.21 percent versus minus 0.15 percent for the baseline, a 0.36 point delta, while avoiding 0.57 percent of baseline loss. These are deterministic replay metrics, not a promise of future returns.

## Integration proof

Scroll to Integration Proof:

> This section shows the live-compatible path: a CMC Agent Hub payload enters the normalizer, the Strategy Skill returns structured output, and the BNB agent wrapper exposes the same contract. Trust Wallet remains outside the skill as the user-approved signing boundary.

## Scenario tour

Select the BNB rotation scenario:

> BNB passes all six gates, so the skill returns a controlled buy with position sizing, stop loss, take profit, invalidation, and execution guards.

Select the meme spike and stale catalyst scenarios:

> The meme setup has attractive social momentum, but volatility and RSI show crowding risk. Risk gates override hype and return avoid. The catalyst setup has strong narrative quality, but stale market data blocks a new position until a fresh payload arrives.

Select the conflicted LINK scenario and the ineligible RANDOM scenario:

> LINK is hold: monitor without opening fresh exposure. RANDOM is avoid because it is outside the eligible universe, even though its narrative looks attractive.

## Agent response and close

Show Agent/tool response:

> This is the payload a downstream agent can consume directly: decision, confidence, score breakdown, risk gates, execution guards, take profit, cooldown, and audit metadata. In live deployment, the same core can receive a fresh CMC payload through the adapter and be wrapped by the BNB agent tool. The value is survivability: reject stale data, crowded spikes, excessive volatility, invalid tokens, and invalidated theses before capital is put at risk.

### Recording checklist

- Say: `Track 2 Strategy Skill`, `deterministic demo`, `CMC Agent Hub payload`, `adapter-ready`, `analysis-only`, and `no custody, no signing`.
- Show the Judge proof and Integration Proof sections.
- Switch BNB, FLOKI, CAKE, LINK, and RANDOM.
- Show `output.executionGuards`, `audit.dataMode`, `audit.adapterReady`, and `audit.liveReady`.
- Do not describe the demo as live trading or guaranteed profit.
