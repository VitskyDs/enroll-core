# enroll-core — Claude instructions

## Project overview

`@vitskyds/enroll-core` is the shared application-code package for the Enroll loyalty platform — the Supabase client factory, shared domain types, `AuthContext`, and the i18n setup that both `enroll-consumer` and `enroll-admin` depend on, published to GitHub Packages. Part of a four-repo platform; see "Related repos" below.

This repo lives as a sibling folder inside a shared `enroll-repos/` parent alongside the other Enroll repos and the shared backlog. If you only have this one repo checked out standalone, `../backlog` won't resolve — get the sibling layout set up first.

## Related repos

| Repo | Purpose |
|---|---|
| `enroll-core` (this repo) | Shared app code — Supabase client factory, domain types, AuthContext, i18n setup |
| `enroll-consumer` | Consumer app |
| `enroll-admin` | Admin app (business owner dashboard) |
| `enroll-ui` | Design system — `@vitskyds/enroll-ui`, GitHub Packages |
| `enroll-backlog` | Shared task tracker + docs (Backlog.md) for all of the above |

## Docs

The backlog lives in the sibling `enroll-backlog` repo, at `../backlog`. Read `../backlog/docs/doc-12` (master PRD) first for platform context. `../backlog/docs/doc-7` (developer guide) documents this package's exports and update workflow in more depth than this file does.

## Key file locations

- `src/index.ts` — public exports
- `src/supabase.ts` — `createSupabaseClient(url, anonKey)` factory (not a singleton — this package is built by `tsup`, not Vite, so it can't read `import.meta.env` itself; consuming apps pass their own env vars in)
- `src/auth-context.tsx` — `AuthProvider`/`useAuth` (session/user state, business context, `isOwner` resolution, `brandColor` lookup); `AuthProvider` takes a `supabase` client as a required prop
- `src/i18n/` — i18next instance with `en`/`he` resources, `LANG_STORAGE_KEY`, `Lang` type
- `src/types.ts` — shared domain types (`Business`, `LoyaltyProgram`, `Customer`, `Product`, `Reward`, etc.)

## Important constraint

This is a pure-extraction package with an explicit no-behavior-change requirement from how it was created (TASK-114.1) — treat changes here as affecting **both** consuming apps simultaneously. Don't add app-specific logic (e.g. tenant routing, admin-only fields) here; that belongs in the consuming repo. No eslint config exists yet — run `tsc --noEmit` before pushing as the minimum bar.

## Publishing

1. Make changes (`npm run build` / `npm run typecheck` to verify locally), bump the version in `package.json` (patch for fixes, minor for new exports)
2. Commit and push to `main`
3. GitHub Actions publishes to GitHub Packages (skips if that version is already published)
4. Downstream repos (`enroll-consumer`, `enroll-admin`) install the new version explicitly

## Git workflow

- Create a branch per task: `task/<id>-<slug>`
- Commit and push freely on task branches
- **Pushing to `main` requires the user's explicit go-ahead in that turn** — this is standing authorization once given, but ask again if it's been a while
- Never open a PR unless asked

## Task workflow

- Use the backlog MCP tools to manage tasks — the backlog is shared across all Enroll repos (`enroll-backlog`), not specific to this one
- When filing or editing tasks that reference source files, name which repo the file lives in (e.g. `enroll-core/src/auth-context.tsx`)

## Node

Node is at `~/.nvm/versions/node/v24.14.0/bin` — always prepend to PATH in Bash calls.
