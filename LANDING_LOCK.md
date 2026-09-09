# Landing page release lock

The English For All public landing page is approved and already in production.
Its implementation is sealed while development continues on the internal system.

## What enforces the seal

- `landing-lock.json` records the SHA-256 fingerprint of every protected file.
- `npm run verify:landing-lock` compares the working tree with that approved baseline.
- `npm run lint` runs the seal verification before ESLint.
- GitHub Actions verifies the seal independently on every pull request and push to `main`.
- `AGENTS.md` instructs coding agents to keep internal-system work isolated from the landing.

The seal covers the landing route, its sections and content, brand assets, global visual
contracts used by it, SEO files, security/cache configuration, and the UI primitives on
which it depends.

## Rule for internal-system development

Create new routes, components, styles, configuration, and assets for the internal system.
Do not edit a protected file to make internal functionality fit. If a shared component needs
different behavior, create an internal-specific composition or component.

Run this before and after implementation work:

```bash
npm run verify:landing-lock
```

## If the landing must change in the future

The project owner must explicitly authorize a landing-page change. Implement and validate
that change first, including visual and end-to-end regression checks. Updating the recorded
hashes is the final, deliberate act that establishes a new approved baseline; it must never
be used just to silence a failed verification.
