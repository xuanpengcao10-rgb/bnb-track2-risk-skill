# Demo Video Script

Final video length: 3:03.

Recommended video file:

`/Users/caoxuanpeng/Documents/邮件内容用户分层/outputs/demo_voiceover_20260619/integration_rerecord/risk_gated_demo_user_voice_integration.mp4`

Record the latest local demo or use the deployed GitHub Pages demo after redeploy.

## 0:00 - 0:14 Opening

Action: show the first screen.

Say:

```text
Hi, this is Risk-Gated Narrative Alpha Skill, a Track 2 Strategy Skill for the BNB Hack.

The idea is simple: an AI trading agent should not only know when to buy. It should also know when not to trade.
```

## 0:14 - 0:38 Explain The Skill

Action: keep the first screen visible. Point to Data mode, Adapter-ready, Custody, and the BNB decision card.

Say:

```text
This skill takes CMC-style market data, narrative signals, and portfolio risk limits, then returns a structured buy, hold, or avoid decision.

The demo data is deterministic, so judges can reproduce the same result without paid API keys or wallet setup.

The adapter path is ready, but this demo is analysis-only. It never stores keys, never signs transactions, and never executes trades.
```

## 0:38 - 1:00 Show Judge Proof

Action: scroll to the Judge proof section.

Say:

```text
Here is the judge proof section.

The deterministic replay compares this risk-gated strategy against a naive buy-all baseline.

On this scenario set, the strategy has a positive return delta, lower drawdown, and avoided loss from blocked setups.

This is the main point of the project: risk gates are measurable, not just UI copy.
```

## 1:00 - 1:25 Show Integration Proof

Action: scroll to the Integration Proof section.

Say:

```text
This is the Integration Proof section.

It shows the live-compatible path without changing the strategy core.

The skill can receive a CMC Agent Hub payload, return a Strategy Skill output, and expose a BNB agent wrapper.

The Trust Wallet boundary stays clear. The skill only returns analysis and execution guards. It does not custody funds or sign transactions.
```

## 1:25 - 1:45 Show BNB Buy

Action: select or stay on `BNB rotation with improving market breadth`.

Say:

```text
First, I select the BNB rotation scenario.

BNB passes the hard risk gates. Liquidity is sufficient, volatility is inside the limit, the market snapshot is fresh, and the token is eligible.

So the skill returns BUY, but with controlled position sizing, stop loss, take profit, and execution guards.
```

## 1:45 - 2:10 Show Risk Blocks

Action: select `High-social meme spike rejected by risk gate`, then select `Strong catalyst rejected because CMC data is stale`.

Say:

```text
Now I select the high-social meme spike scenario.

The narrative looks attractive, but volatility and RSI show crowding risk. The skill returns AVOID. Risk gates override hype.

Next, I select the stale catalyst scenario.

The catalyst is strong, but the market data is too old. The strategy blocks the trade because an agent should not open exposure from stale data.
```

## 2:10 - 2:25 Show Eligible Universe Block

Action: select `Outside eligible universe despite attractive narrative`.

Say:

```text
Now I select the outside eligible universe scenario.

Even when the narrative is positive, the skill blocks the setup because the token is outside the allowed universe.

This separates alpha quality from execution permission.
```

## 2:25 - 2:45 Show Agent Response

Action: scroll to `Agent/tool response`.

Say:

```text
This is the payload a downstream agent can consume directly.

It includes the skill name, version, decision, confidence, score breakdown, risk gates, execution guards, take profit, cooldown, and audit metadata.

The audit section shows deterministic demo mode, adapter-ready status, live-ready status, and warnings.
```

## 2:45 - 3:03 Close

Action: keep Agent/tool response or Simulation summary visible.

Say:

```text
In a live deployment, the same strategy can receive a fresh CMC Agent Hub payload through the normalizer, and it can be wrapped by the BNB agent tool.

The value of this project is survivability for trading agents: avoid disallowed tokens, crowded spikes, stale data, excessive volatility, and invalidated trade theses before capital is put at risk.

Thank you.
```

## Must Say

- `Track 2 Strategy Skill`
- `deterministic demo`
- `CMC Agent Hub payload`
- `adapter-ready`
- `analysis-only`
- `no custody, no signing`
- `risk gates override hype`
- `Integration Proof`

## Do Not Say

- Do not say this is a live trading bot.
- Do not say it uses real-time data in the demo.
- Do not say it can execute trades by itself.
- Do not say it guarantees profit.

## Recording Checklist

- Confirm microphone is on before recording.
- Use the latest local page or the deployed GitHub Pages demo after redeploy.
- Keep browser translation off.
- Use this scenario order: BNB, FLOKI, CAKE, RANDOM.
- Show `Judge proof`: `+0.36%` return delta, `0.57%` baseline drawdown, and `0.57%` avoided loss.
- Show `Integration Proof`: CMC Agent Hub payload, Strategy Skill output, BNB agent wrapper, and Trust Wallet boundary.
- Show `Agent/tool response`: `output.executionGuards`, `audit.dataMode`, `audit.adapterReady`, and `audit.liveReady`.
