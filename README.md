# Toppromoter

Toppromoter is a self-hostable affiliate-program platform originally built for
SaaS products. It contains an operator dashboard, a separate affiliate portal,
an embeddable referral script, API routes for tracking and payment events, and a
documentation site.

> **Status:** this repository is a legacy public-beta snapshot. Its product and
> integration flows require Supabase plus third-party configuration, and its
> dependency tree still contains known advisories. Treat it as restoration work,
> not a production-ready deployment, until the items in [Security status](#security-status)
> are resolved.

## Features present in the codebase

- Company, team, campaign, affiliate, referral, commission, and payout views
- Separate operator and affiliate authentication experiences
- Affiliate invitations and public campaign invitation pages
- Stripe checkout, customer portal, Connect, and webhook API routes
- Paddle credential verification and webhook handling
- Manual referral/conversion endpoints and an embeddable tracking script
- Supabase authentication, Postgres data access, and Storage-backed company logos
- Email templates and optional Brevo/MailerLite integrations
- Nextra documentation application

No claim is made here that the original hosted service, pricing, or external
integrations remain active.

## Repository layout

| Path | Purpose | Default port |
| --- | --- | --- |
| `apps/toppromoter` | Operator dashboard and API routes | `9000` |
| `apps/toppromoter-affiliate` | Affiliate sign-in, invitations, and dashboard | `9001` |
| `apps/docs` | Nextra documentation | `9002` |
| `packages/ui` | Shared Tailwind styles and React components | n/a |
| `packages/tailwind-config` | Shared Tailwind configuration | n/a |
| `packages/eslint-config-custom` | Shared lint configuration | n/a |
| `supabase` | Local configuration, migration, and seed data | Supabase defaults |

The monorepo uses Yarn 1 workspaces and Turborepo. Both applications use the
Next.js Pages Router and Supabase JS v1.

## Prerequisites

- Node.js 18 or 20 (the current legacy toolchain is not supported on newer Node majors)
- Yarn 1.22.22 through Corepack
- Optional: Supabase CLI and Docker for a complete local backend
- Provider-owned test accounts for Stripe, Paddle, email, or monitoring features

```bash
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn install --frozen-lockfile
cp .env.example .env.local
```

If Corepack is unavailable, use `npx --yes yarn@1.22.22` in place of `yarn`.

## Environment variables

The complete template is in `.env.example`. Variables prefixed with
`NEXT_PUBLIC_` are compiled into browser bundles and must never contain secrets.

Required for authenticated application flows:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_AFFILIATE_SITE_URL`
- `PAYMENT_INTEGRATION_DECRYPT_KEY` for encrypted Paddle credentials

Optional groups cover Supabase Storage, Stripe, email, Sentry, and server-side
LogSnag events. Use provider test credentials locally. Never commit `.env.local`.

Generate the payment-encryption key with:

```bash
openssl rand -hex 32
```

## Supabase setup

For local Supabase, start the services and apply the tracked migration/seed using
the Supabase CLI:

```bash
supabase start
supabase db reset
```

Copy the local API URL, anon key, and service-role key printed by the CLI into
`.env.local`. Review `supabase/migrations/20230329132406_schema.sql` before using
it with any non-local database.

## Run locally

Start all three applications and the shared UI watcher:

```bash
yarn dev
```

Then open:

- Operator app: <http://127.0.0.1:9000>
- Affiliate app: <http://127.0.0.1:9001>
- Documentation: <http://127.0.0.1:9002>

To run only one workspace:

```bash
yarn workspace toppromoter dev
yarn workspace toppromoter-affiliate dev
yarn workspace docs dev
```

The operator root redirects unauthenticated visitors to `/signup`; the affiliate
root renders its sign-in experience. Meaningful dashboard data requires Supabase.

## Build and lint

```bash
yarn lint
yarn build
```

The repository has no automated unit or end-to-end test suite. For changes,
document the routes and provider sandbox flows tested manually.

## Security status

- A committed token-shaped documentation sample was replaced with a placeholder.
- Password-recovery tokens remain in URL fragments and are removed from browser
  history after capture; they are no longer moved into query strings.
- The payment-credential API now requires a valid Supabase session and exposes
  encryption only. Paddle decryption happens inside the webhook server route.
- The optional LogSnag bearer token is server-only (`LOGSNAG_TOKEN`).
- Next.js was updated within major version 13 and `node-fetch` within major 2.
- The remaining legacy dependency advisories require coordinated framework and
  package removal/migration work. Do not expose this deployment publicly first.

See `SECURITY.md` for private reporting guidance.

## Contributing

See `CONTRIBUTING.md`. Keep changes small and preserve the separation between
browser-visible configuration and server-only credentials.

## License

This repository currently has no root license file. Until the owner selects and
adds a license, copyright law reserves all rights and the project should not be
described as open source.
