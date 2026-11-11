import type { ProductId, ProductUrls } from "@centerfuse/config";

export type ProductLiveness = "reachable" | "unreachable" | "not_configured";

export interface DiscoveredProduct {
  id: Exclude<ProductId, "CENTERFUSE">;
  name: "BuyFuse" | "SellFuse";
  productType: "BUYER" | "SELLER";
  url: string | null;
  liveness: ProductLiveness;
}

export interface ProductDiscoveryPayload {
  schemaVersion: 1;
  products: DiscoveredProduct[];
}

type HealthFetcher = (input: URL, init: RequestInit) => Promise<Response>;

type SiblingProduct = Pick<DiscoveredProduct, "id" | "name" | "productType"> & {
  expectedService: string;
};

const HEALTH_TIMEOUT_MS = 1000;
const HEALTH_RESPONSE_LIMIT_BYTES = 1024;
const CACHE_TTL_MS = 10_000;

const SIBLING_PRODUCTS: readonly SiblingProduct[] = [
  {
    id: "BUYFUSE",
    name: "BuyFuse",
    productType: "BUYER",
    expectedService: "buyfuse",
  },
  {
    id: "SELLFUSE",
    name: "SellFuse",
    productType: "SELLER",
    expectedService: "sellfuse-web",
  },
];

export function createProductDiscovery(
  urls: ProductUrls,
  fetcher: HealthFetcher = (input, init) => fetch(input, init),
  now: () => number = Date.now,
): () => Promise<ProductDiscoveryPayload> {
  let cached: { expiresAt: number; payload: ProductDiscoveryPayload } | undefined;
  let pending: Promise<ProductDiscoveryPayload> | undefined;

  return () => {
    if (cached && cached.expiresAt > now()) return Promise.resolve(cached.payload);
    if (pending) return pending;

    pending = Promise.all(
      SIBLING_PRODUCTS.map(async ({ id, name, productType, expectedService }) => {
        const configuredUrl = urls[id];
        if (!configuredUrl) {
          return {
            id,
            name,
            productType,
            url: null,
            liveness: "not_configured" as const,
          };
        }

        const publicUrl = sanitizePublicUrl(configuredUrl);
        let liveness: ProductLiveness = "unreachable";
        try {
          const healthUrl = new URL("health", `${publicUrl}/`);
          const response = await fetcher(healthUrl, {
            credentials: "omit",
            headers: { accept: "application/json" },
            redirect: "error",
            signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
          });
          if (response.ok && (await matchesHealthIdentity(response, expectedService))) {
            liveness = "reachable";
          }
        } catch {
          liveness = "unreachable";
        }

        return {
          id,
          name,
          productType,
          url: publicUrl,
          liveness,
        };
      }),
    )
      .then((products) => {
        const payload: ProductDiscoveryPayload = { schemaVersion: 1, products };
        cached = { expiresAt: now() + CACHE_TTL_MS, payload };
        return payload;
      })
      .finally(() => {
        pending = undefined;
      });

    return pending;
  };
}

function sanitizePublicUrl(raw: string): string {
  const url = new URL(raw);
  url.username = "";
  url.password = "";
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/+$/, "");
}

async function matchesHealthIdentity(response: Response, expectedService: string): Promise<boolean> {
  const reader = response.body?.getReader();
  if (!reader) return false;

  const decoder = new TextDecoder();
  let content = "";
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > HEALTH_RESPONSE_LIMIT_BYTES) {
        void reader.cancel().catch(() => undefined);
        return false;
      }
      content += decoder.decode(value, { stream: true });
    }
    content += decoder.decode();
  } catch {
    return false;
  } finally {
    reader.releaseLock();
  }

  try {
    const body: unknown = JSON.parse(content);
    return (
      typeof body === "object" &&
      body !== null &&
      "status" in body &&
      body.status === "ok" &&
      "service" in body &&
      body.service === expectedService
    );
  } catch {
    return false;
  }
}
