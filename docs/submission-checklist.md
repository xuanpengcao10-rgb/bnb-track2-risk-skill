# Submission Checklist

## Before GitHub push

- Confirm the commit author email matches the GitHub account if public attribution matters.
- Push the repository to a public GitHub repo.
- Keep the repo name short, for example `bnb-track2-risk-skill`.
- Confirm GitHub Actions `CI` passes.

Final repository URL to paste: `https://github.com/xuanpengcao10-rgb/bnb-track2-risk-skill`

If local Git credentials are missing, use `docs/github-push-guide.md`.

## Demo deployment

- Enable GitHub Pages with GitHub Actions as the source.
- Run the `Deploy Demo` workflow.
- Copy the GitHub Pages URL into DoraHacks as the demo link.
- Final demo page URL to paste after the latest deployment finishes: `https://xuanpengcao10-rgb.github.io/bnb-track2-risk-skill/`
- If Pages is not available, record the local demo at `http://127.0.0.1:5173/` and upload the video.

## DoraHacks fields

- Project name: `Risk-Gated Narrative Alpha Skill`
- Track: `BNB Hack Track 2: Strategy Skills`
- Short description: use `submissions/dorahacks-submission.md`.
- Paste-ready final copy: use `submissions/final-submit-copy.md`.
- Evidence pack for judges: include or reference `submissions/judge-proof-pack.md`.
- Repository URL: paste the public GitHub repo URL.
- Demo URL: paste GitHub Pages or video URL.
- Tags: BNB Chain, AI Agent, Strategy Skill, Risk Management, CoinMarketCap, Trust Wallet, Trading Agent.

## Final smoke test

```bash
npm ci
npm run verify
npm run dev
```

Open the demo, switch all five scenarios, and confirm the Agent/tool response panel, score breakdown, scenario replay curve, Judge proof baseline comparison, Integration Proof section, and simulation summary update.

## Demo video recording

- Start with `npm run verify` or show the successful terminal output if recording locally.
- Show the GitHub Pages demo URL.
- Select the BNB scenario and explain the controlled `buy`.
- Select the meme spike, stale catalyst, and ineligible token scenarios to show hard risk blocks.
- Show the deterministic scenario replay curve and capital-preserved metric.
- Show the Judge proof section: `+0.36%` return delta, `0.57%` baseline drawdown, and `0.57%` avoided loss.
- Show the Agent/tool response panel, including `output.executionGuards`, `audit.dataMode`, `audit.adapterReady`, and `audit.liveReady`.
- Mention `examples/cmc-agent-hub-payload.json`, `examples/cmc-data-quote-payload.json`, and `bnbAgentStrategyTool` as the live-compatible adapter and agent wrapper.
- Say clearly: "The demo data is deterministic for judging; live deployment refreshes the CMC payload before execution."
