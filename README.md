# CenterFuse

CenterFuse is the umbrella platform and product ecosystem for two focused sibling products:

```text
CenterFuse
├── SellFuse — seller and reseller platform
└── BuyFuse  — buyer platform
```

The products share a visible ecosystem, but their source code is maintained in independent repositories:

- [CenterFuseHQ/centerfuse](https://github.com/CenterFuseHQ/centerfuse)
- [CenterFuseHQ/sellfuse](https://github.com/CenterFuseHQ/sellfuse)
- [CenterFuseHQ/buyfuse](https://github.com/CenterFuseHQ/buyfuse)

This repository contains only the CenterFuse parent site, its small local design/configuration packages, and the single additive migration that records cross-product database ownership. It does not contain the SellFuse or BuyFuse application source trees.

## Local development

Requirements: Node.js 20.9+ and npm 10+.

```bash
npm ci
copy .env.example .env
npm run dev
```

CenterFuse listens on `http://localhost:3000` by default. `SELLFUSE_URL` and `BUYFUSE_URL` configure links to the separately deployed sibling products.

The unauthenticated `GET /health` endpoint reports parent-site liveness without exposing product data.

## Build and tests

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Database ownership

`packages/database/migrations` is the sole owner of the current additive cross-product PostgreSQL foundation migration. The migration creates explicit `centerfuse`, `sellfuse`, and `buyfuse` schemas and must be applied once by the platform migration process. The applications currently use in-memory development adapters; repository separation does not apply or alter a database schema.
