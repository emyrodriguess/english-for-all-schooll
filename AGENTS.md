<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## English For All design system

- Before creating or changing product UI, inspect `app/styleguide/`, `components/ui/`, and the tokens in `app/globals.css`.
- Reuse the active components in `components/ui/`; do not copy components from `internal/design-system/` back into product code.
- Use semantic tokens and the documented component variants instead of raw color values or one-off visual styles.
- Treat `http://localhost:3000/styleguide` as the visual reference during local development and verify relevant UI changes against it.
- Keep the style guide local-only. Its layout must call `notFound()` whenever `NODE_ENV` is not `development`, and `app/styleguide/` must remain excluded in `.vercelignore`.

## Landing page is release-locked

The public landing page is approved, launched, and immutable by default.

- Never edit, move, rename, delete, regenerate, format, or "clean up" any file listed in `landing-lock.json` unless the user explicitly asks for a landing-page change.
- Never update `landing-lock.json` or weaken/bypass `scripts/verify-landing-lock.mjs` merely to make the verification pass.
- Build the internal system in new, internal-specific routes, components, styles, configuration, and assets. Do not reuse a filename or location owned by the locked landing when a separate internal-system file can be created.
- `app/globals.css`, `app/layout.tsx`, the four locked `components/ui` primitives, and `lib/utils.ts` are shared contracts already used by the landing. For the internal system, extend behavior in separate files instead of modifying these contracts.
- Dependency or framework configuration changes are not automatically safe: if they are genuinely required for the internal system, keep them minimal and run the complete landing regression suite before handing off.
- Run `npm run verify:landing-lock` before and after implementation work. A failure is a stop signal: revert the unintended protected-file change; do not refresh the hashes.
- A future landing change requires explicit, landing-specific user authorization. Only then may the seal be deliberately updated, after visual and automated regression validation.

## Internal system

Before changing the internal backoffice, read:

- `docs/internal-system/PRD.md`
- `docs/internal-system/DECISIONS.md`

These documents are the product source of truth. Do not silently decide unspecified business rules involving contracts, billing, cancellations, scheduling, or historical records.

### Supabase and data

- Use Supabase Auth. Never store password hashes in public application tables.
- Store application user metadata in `public.profiles`, linked to `auth.users.id`.
- Repository migrations under `supabase/migrations/` are the schema source of truth.
- Inspect the target database before changes and never apply an unreviewed migration directly to production.
- Enable RLS on every private table and scope policies to active internal profiles.
- Contracts and payment receipts belong in private Storage buckets and must be accessed with authenticated, short-lived URLs.
- Store money as PostgreSQL `numeric`, never floating point.
- Store instants as `timestamptz`; business dates use `date`. The operational timezone is `America/Sao_Paulo`.
- Protect financial, cancellation, and scheduling invariants with database constraints and transactional functions when applicable.
- Normal product flows never hard-delete historical business records.
- Index foreign keys and columns used by RLS and common filters.

### Internal architecture

- Keep internal routes and components separate from landing-owned files.
- Organize domain code by students, contracts, finance, schedule, classes, planner, imports, and integrations.
- External messaging must flow through an outbox and provider adapter; financial rules must not depend on a provider SDK.
- Completed functionality uses real persistence and explicitly handles loading, empty, success, and error states.

### Required validation

Before delivery, run:

- `npm run verify:landing-lock`
- `npm run lint`
- `npm run typecheck`
- relevant automated tests
- Supabase security and performance advisors after database DDL changes
