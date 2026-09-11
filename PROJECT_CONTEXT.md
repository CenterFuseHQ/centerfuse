# Project Context

- **Project:** CenterFuse
- **Owner:** Nader Abdelshahid
- **Canonical repository:** `nnabdelshahid/CenterFuse`
- **Visibility:** Private
- **Purpose:** Parent control surface and shared entry point for the independently deployed Fuse products.
- **Verified implementation:** The server renders the CenterFuse home and state views, publishes a web manifest and liveness endpoint, and resolves configured links to the sibling products.
- **Control boundaries:** CenterFuse owns umbrella navigation and product discovery. It does not own buyer workspaces or seller operations, and it must not silently cross authentication, data, or deployment boundaries.
- **Product separation:** BuyFuse and SellFuse are separate applications and repositories. Their links are configured through `BUYFUSE_URL` and `SELLFUSE_URL`; shared contracts must stay explicit.
- **Security/privacy:** Keep the repository private. Never commit credentials or expose private product data from public or unauthenticated endpoints.
- **Cost principle:** Prefer software Nader can own and self-host when practical, especially before adopting costly managed services.

The running code, tests, and explicit configuration are authoritative when older documentation disagrees.
