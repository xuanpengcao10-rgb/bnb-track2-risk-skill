# GitHub Push Guide

The GitHub repository has been created:

https://github.com/xuanpengcao10-rgb/bnb-track2-risk-skill

The local repository already has `origin` configured:

```bash
git remote -v
```

## Current blocker

The local Git client does not yet have GitHub credentials. The attempted HTTPS push returned:

```text
fatal: could not read Username for 'https://github.com': Device not configured
```

SSH also is not configured for this account:

```text
git@github.com: Permission denied (publickey).
```

## Fastest push once credentials are available

```bash
git push -u origin codex/bnb-track2-risk-skill:main
```

This keeps the local Codex branch name and publishes it to the remote `main` branch so CI and Pages workflows run.

## Credential options

### Option A: GitHub CLI

Install GitHub CLI, authenticate in the browser, then push:

```bash
gh auth login
git push -u origin codex/bnb-track2-risk-skill:main
```

### Option B: Personal access token

Use a GitHub fine-grained token with access to this repository and Content read/write permission, then push with HTTPS.

### Option C: SSH key

Add this machine's SSH public key to GitHub, switch the remote, then push:

```bash
git remote set-url origin git@github.com:xuanpengcao10-rgb/bnb-track2-risk-skill.git
git push -u origin codex/bnb-track2-risk-skill:main
```

## After push

1. Confirm the `CI` workflow passes.
2. Enable GitHub Pages with GitHub Actions as the source if it is not already enabled.
3. Run the `Deploy Demo` workflow.
4. Use this demo URL in DoraHacks:

```text
https://xuanpengcao10-rgb.github.io/bnb-track2-risk-skill/
```
