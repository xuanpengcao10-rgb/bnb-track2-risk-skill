# Judge Proof Pack

## Review links

- Repository: https://github.com/xuanpengcao10-rgb/bnb-track2-risk-skill
- Demo page: https://xuanpengcao10-rgb.github.io/bnb-track2-risk-skill/
- Demo video: upload `risk_gated_demo_user_voice.mp4` with the DoraHacks submission.

## Fast review path

1. Open the demo page and review the Judge proof section.
2. Check the Integration proof section for CMC, Strategy Skill, BNB agent wrapper, and Trust Wallet boundaries.
3. Switch the BNB, FLOKI, CAKE, LINK, and RANDOM scenarios.
4. Inspect the Agent/tool response panel for `output.executionGuards`, `audit.dataMode`, `audit.adapterReady`, and `audit.liveReady`.
5. Run `npm run verify` in the repository.

## Verification evidence

- Latest local verification target: `npm run verify`
- Expected verification summary after this proof pack: 30 tests passed across 7 test files.
- Type safety: `tsc --noEmit`
- Strategy demo: `npm run cli`
- Production demo build: `vite build`

## Integration proof

| Proof area | Evidence |
| --- | --- |
| CMC Agent Hub payload | `examples/cmc-agent-hub-payload.json`, `examples/cmc-data-quote-payload.json`, `src/integrations/cmcAgentHub.ts` |
| Strategy Skill manifest | `submissions/skill-manifest.json`, `src/integrations/cmcSkill.ts` |
| Agent-readable output | `examples/cmc-skill-response.json` |
| BNB agent wrapper | `src/integrations/bnbAgentTool.ts` |
| Trust Wallet boundary | `permissions.trading = analysis-only`, returned execution guards, no custody, no signing |
| Baseline report | `docs/backtest-baseline-report.md` |

## Baseline proof

The deterministic replay compares the risk-gated strategy against a naive buy-all baseline on the same five scenarios.

| Metric | Result |
| --- | ---: |
| Strategy return | 0.21% |
| Naive buy-all baseline return | -0.15% |
| Return delta | +0.36% |
| Baseline drawdown | 0.57% |
| Avoided loss | 0.57% avoided loss |
| Risk blocks | 3 |

## Why this can win Track 2

- It is a reusable Strategy Skill, not a generic token dashboard.
- It exposes a deterministic judging path and a live-compatible adapter path.
- It gives downstream agents structured decisions, sizing, invalidation, risk gates, execution guards, and audit metadata.
- It rejects attractive setups when volatility, stale data, eligibility, or custody boundaries make the trade unsafe.
- It keeps execution analysis-only, so Trust Wallet or another user-approved executor remains responsible for signing.

## Submission boundary

This project does not custody funds, sign transactions, execute trades, or provide financial advice. The demo uses deterministic scenarios for reproducible judging.
