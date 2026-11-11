# CenterFuse product discovery API v1

`GET /api/v1/products` returns the public directory for the independently deployed BuyFuse and SellFuse web applications.

```json
{
  "schemaVersion": 1,
  "products": [
    {
      "id": "BUYFUSE",
      "name": "BuyFuse",
      "productType": "BUYER",
      "url": "https://buyfuse.example",
      "liveness": "reachable"
    },
    {
      "id": "SELLFUSE",
      "name": "SellFuse",
      "productType": "SELLER",
      "url": "https://sellfuse.example",
      "liveness": "unreachable"
    }
  ]
}
```

The contract is public product metadata. It does not expose accounts, listings, tenant identifiers, authentication tokens, provider configuration, or database state. `liveness` is only a bounded HTTP check: `reachable` means the configured URL returned HTTP success and the expected service identity from `/health`; it does not claim that login, AI, marketplace, payment, or user-data operations are available. `unreachable` includes timeouts and invalid health responses. `not_configured` means the product URL is absent in the current deployment.

CenterFuse reads `BUYFUSE_URL` and `SELLFUSE_URL` from its existing deployment configuration. Health checks run in parallel, use a one-second timeout, reject redirects, read at most 1 KiB, and cache the result in-process for ten seconds. The response is publicly cacheable for ten seconds and allows cross-origin reads because it contains only public metadata. No credentials are sent to either sibling service.

BuyFuse owns its own identity and buyer workspace. SellFuse owns its own identity and seller workflow. This directory only helps clients discover the correct independent application; product API requests continue to use each product's own authorization boundary.
