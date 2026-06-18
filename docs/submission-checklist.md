# Submission Checklist

## Before GitHub push

- Confirm the commit author email matches the GitHub account if public attribution matters.
- Push the repository to a public GitHub repo.
- Keep the repo name short, for example `bnb-track2-risk-skill`.
- Confirm GitHub Actions `CI` passes.

Current repository target: `https://github.com/xuanpengcao10-rgb/bnb-track2-risk-skill`

If local Git credentials are missing, use `docs/github-push-guide.md`.

## Demo deployment

- Enable GitHub Pages with GitHub Actions as the source.
- Run the `Deploy Demo` workflow.
- Copy the GitHub Pages URL into DoraHacks as the demo link.
- Live GitHub Pages URL: `https://xuanpengcao10-rgb.github.io/bnb-track2-risk-skill/`
- If Pages is not available, record the local demo at `http://127.0.0.1:5173/` and upload the video.

## DoraHacks fields

- Project name: `Risk-Gated Narrative Alpha Skill`
- Track: `BNB Hack Track 2: Strategy Skills`
- Short description: use `submissions/dorahacks-submission.md`.
- Repository URL: paste the public GitHub repo URL.
- Demo URL: paste GitHub Pages or video URL.
- Tags: BNB Chain, AI Agent, Strategy Skill, Risk Management, CoinMarketCap, Trust Wallet, Trading Agent.

## Final smoke test

```bash
npm ci
npm run verify
npm run dev
```

Open the demo, switch all five scenarios, and confirm the Agent-readable output panel, score breakdown, equity curve, and simulation summary update.

## Demo video recording

- Show the GitHub Pages demo URL.
- Select the BNB scenario and explain the controlled `buy`.
- Select the meme spike, stale catalyst, and ineligible token scenarios to show hard risk blocks.
- Show the backtest equity curve and capital-preserved metric.
- Show the Agent-readable output panel.
- Mention `examples/cmc-agent-hub-payload.json` and `bnbAgentStrategyTool` as the live adapter and agent wrapper.
