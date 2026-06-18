# Security Policy

This project is an analysis-only strategy skill. It must not custody assets, store private keys, request seed phrases, sign transactions, or execute trades directly.

## Execution boundary

- `runCmcSkill(input)` returns a decision payload and execution guards only.
- Wallet approval and transaction signing must happen outside this repository.
- Any executor must re-check token eligibility, data freshness, and max position size before submitting an order.
- `hold` and `avoid` decisions must not open new positions.

## Demo data

The included scenarios are deterministic examples for hackathon review. They are not financial advice and should not be treated as live market signals.

## Reporting issues

For hackathon review, open a GitHub issue with reproduction steps, input payload, expected behavior, and observed behavior.
