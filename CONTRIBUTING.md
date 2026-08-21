# Contributing to Toppromoter

Toppromoter is a legacy monorepo. Keep pull requests focused and avoid mixing a
security patch with a broad framework migration.

## Local workflow

```bash
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn install --frozen-lockfile
cp .env.example .env.local
yarn lint
yarn build
```

Use only accounts, databases, and provider sandboxes you control. Never include
credentials, access tokens, webhook payloads containing personal data, or real
customer records in commits, issues, screenshots, or pull requests.

For each pull request:

- Explain which workspace and user flow changed.
- Document any environment, database, or webhook migration.
- List the commands and manual routes tested.
- Add screenshots for visible changes without exposing production data.
- Preserve authorization checks around server-only keys and payment credentials.

Report security issues privately as described in `SECURITY.md`.
