# @vitskyds/enroll-core

Shared Supabase client, types, auth context, and i18n setup for the Enroll platform. Consumed by the `enroll-consumer` and `enroll-admin` apps.

## Install

```
npm install @vitskyds/enroll-core
```

Requires a GitHub Packages auth token (`NODE_AUTH_TOKEN`) and an `.npmrc` scoping `@vitskyds` to `https://npm.pkg.github.com`.

## Exports

- `createSupabaseClient(url, anonKey)` — Supabase client factory. Pass in the consuming app's own env vars.
- `AuthProvider` / `useAuth` — session, business, and owner-context provider. `AuthProvider` takes a `supabase` client as a prop.
- `i18n`, `LANG_STORAGE_KEY`, `Lang` — a ready-to-use i18next instance with `en`/`he` resources, wired for `react-i18next`.
- Shared domain types: `Business`, `LoyaltyProgram`, `Customer`, `Product`, `Reward`, `Offer`, `Referral`, `PointTransaction`, `Notification`, `Order`, and related sub-types.

## Development

```
npm install
npm run build      # tsup build to dist/
npm run typecheck
```

Publishing to GitHub Packages happens automatically on push to `main` via `.github/workflows/publish.yml`, skipping if the current `package.json` version is already published.
