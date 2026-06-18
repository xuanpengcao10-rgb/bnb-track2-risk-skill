# Submission Checklist

## Before GitHub push

- Confirm the commit author email matches the GitHub account if public attribution matters.
- Push the repository to a public GitHub repo.
- Keep the repo name short, for example `bnb-track2-risk-skill`.
- Confirm GitHub Actions `CI` passes.

## Demo deployment

- Enable GitHub Pages with GitHub Actions as the source.
- Run the `Deploy Demo` workflow.
- Copy the GitHub Pages URL into DoraHacks as the demo link.
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

Open the demo, switch all four scenarios, and confirm the Agent-readable output panel updates.
