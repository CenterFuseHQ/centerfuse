import { describe, expect, it, vi } from "vitest";
import { resolveProductUrls } from "@centerfuse/config";
import { createProductDiscovery } from "./discovery.js";

describe("CenterFuse product discovery", () => {
  it("checks the expected service identities and keeps public links credential-free", async () => {
    const fetcher = vi.fn(async (input: URL, _options: RequestInit) => {
      const service = input.hostname.startsWith("buy") ? "buyfuse" : "sellfuse-web";
      return new Response(JSON.stringify({ status: "ok", service }), { status: 200 });
    });
    const urls = resolveProductUrls({
      BUYFUSE_URL: "https://buyer:secret@buy.example.test/workspace?token=hidden#section",
      SELLFUSE_URL: "https://sell.example.test/app/",
    });

    const payload = await createProductDiscovery(urls, fetcher)();

    expect(payload).toEqual({
      schemaVersion: 1,
      products: [
        {
          id: "BUYFUSE",
          name: "BuyFuse",
          productType: "BUYER",
          url: "https://buy.example.test/workspace",
          liveness: "reachable",
        },
        {
          id: "SELLFUSE",
          name: "SellFuse",
          productType: "SELLER",
          url: "https://sell.example.test/app",
          liveness: "reachable",
        },
      ],
    });
    expect(fetcher.mock.calls.map(([url]) => url.href)).toEqual([
      "https://buy.example.test/workspace/health",
      "https://sell.example.test/app/health",
    ]);
    expect(fetcher.mock.calls.every(([, options]) => options?.redirect === "error")).toBe(true);
    expect(fetcher.mock.calls.every(([, options]) => options?.credentials === "omit")).toBe(true);
  });

  it("marks absent product URLs as not configured without making requests", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const payload = await createProductDiscovery(resolveProductUrls({ VERCEL: "1" }), fetcher)();

    expect(fetcher).not.toHaveBeenCalled();
    expect(payload.products.map(({ liveness, url }) => [liveness, url])).toEqual([
      ["not_configured", null],
      ["not_configured", null],
    ]);
  });

  it("does not report a wrong or malformed health response as reachable", async () => {
    const fetcher = vi.fn(async (input: URL) =>
      input.hostname.startsWith("buy")
        ? new Response(JSON.stringify({ status: "ok", service: "another-service" }), { status: 200 })
        : new Response("not-json", { status: 200 }),
    );
    const urls = resolveProductUrls({
      BUYFUSE_URL: "https://buy.example.test",
      SELLFUSE_URL: "https://sell.example.test",
    });

    const payload = await createProductDiscovery(urls, fetcher)();

    expect(payload.products.map(({ liveness }) => liveness)).toEqual([
      "unreachable",
      "unreachable",
    ]);
  });

  it("coalesces concurrent discovery calls and reuses a short-lived result", async () => {
    let now = 1000;
    const fetcher = vi.fn(async (input: URL) =>
      new Response(JSON.stringify({ status: "ok", service: input.hostname.startsWith("buy") ? "buyfuse" : "sellfuse-web" }), { status: 200 }),
    );
    const discover = createProductDiscovery(
      resolveProductUrls({ BUYFUSE_URL: "https://buy.example.test", SELLFUSE_URL: "https://sell.example.test" }),
      fetcher,
      () => now,
    );

    const [first, concurrent] = await Promise.all([discover(), discover()]);
    expect(concurrent).toEqual(first);
    expect(fetcher).toHaveBeenCalledTimes(2);

    await discover();
    expect(fetcher).toHaveBeenCalledTimes(2);

    now += 10_001;
    await discover();
    expect(fetcher).toHaveBeenCalledTimes(4);
  });
});
